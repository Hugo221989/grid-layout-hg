import { ChangeDetectionStrategy, Component, ContentChildren, ElementRef, EventEmitter, Input, NgZone, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { coerceNumberProperty } from './coercion/number-property';
import { KtdGridItemComponent } from './grid-item/grid-item.component';
import { combineLatest, merge, NEVER, Observable, of } from 'rxjs';
import { exhaustMap, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { ktdGridItemDragging, ktdGridItemResizing } from './utils/grid.utils';
import { compact } from './utils/react-grid-layout.utils';
import { GRID_ITEM_GET_RENDER_DATA_TOKEN } from './grid.definitions';
import { ktdMouseOrTouchEnd, ktdPointerClientX, ktdPointerClientY } from './utils/pointer.utils';
import { KtdGridService } from './grid.service';
import { getMutableClientRect } from './utils/client-rect';
import { ktdGetScrollTotalRelativeDifference$, ktdScrollIfNearElementClientRect$ } from './utils/scroll';
import { coerceBooleanProperty } from './coercion/boolean-property';
function getDragResizeEventData(gridItem, layout) {
    return {
        layout,
        layoutItem: layout.find((item) => item.id === gridItem.id),
        gridItemRef: gridItem
    };
}
function layoutToRenderItems(config, width, height) {
    const { cols, rowHeight, layout } = config;
    const renderItems = {};
    for (const item of layout) {
        renderItems[item.id] = {
            id: item.id,
            top: item.y === 0 ? 0 : item.y * rowHeight,
            left: item.x * (width / cols),
            width: item.w * (width / cols),
            height: item.h * rowHeight
        };
    }
    return renderItems;
}
function getGridHeight(layout, rowHeight) {
    return layout.reduce((acc, cur) => Math.max(acc, (cur.y + cur.h) * rowHeight), 0);
}
// tslint:disable-next-line
export function parseRenderItemToPixels(renderItem) {
    return {
        id: renderItem.id,
        top: `${renderItem.top}px`,
        left: `${renderItem.left}px`,
        width: `${renderItem.width}px`,
        height: `${renderItem.height}px`
    };
}
// tslint:disable-next-line:ktd-prefix-code
export function __gridItemGetRenderDataFactoryFunc(gridCmp) {
    // tslint:disable-next-line:only-arrow-functions
    return function (id) {
        return parseRenderItemToPixels(gridCmp.getItemRenderData(id));
    };
}
export function ktdGridItemGetRenderDataFactoryFunc(gridCmp) {
    // Workaround explained: https://github.com/ng-packagr/ng-packagr/issues/696#issuecomment-387114613
    const resultFunc = __gridItemGetRenderDataFactoryFunc(gridCmp);
    return resultFunc;
}
export class KtdGridComponent {
    constructor(gridService, elementRef, renderer, ngZone) {
        this.gridService = gridService;
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.ngZone = ngZone;
        /** Emits when layout change */
        this.layoutUpdated = new EventEmitter();
        /** Emits when drag starts */
        this.dragStarted = new EventEmitter();
        /** Emits when resize starts */
        this.resizeStarted = new EventEmitter();
        /** Emits when drag ends */
        this.dragEnded = new EventEmitter();
        /** Emits when resize ends */
        this.resizeEnded = new EventEmitter();
        /**
         * Parent element that contains the scroll. If an string is provided it would search that element by id on the dom.
         * If no data provided or null autoscroll is not performed.
         */
        this.scrollableParent = null;
        this._compactOnPropsChange = true;
        this._preventCollision = false;
        this._scrollSpeed = 2;
        this._compactType = 'vertical';
        this._rowHeight = 100;
        this._cols = 6;
    }
    /** Whether or not to update the internal layout when some dependent property change. */
    get compactOnPropsChange() { return this._compactOnPropsChange; }
    set compactOnPropsChange(value) {
        this._compactOnPropsChange = coerceBooleanProperty(value);
    }
    /** If true, grid items won't change position when being dragged over. Handy when using no compaction */
    get preventCollision() { return this._preventCollision; }
    set preventCollision(value) {
        this._preventCollision = coerceBooleanProperty(value);
    }
    /** Number of CSS pixels that would be scrolled on each 'tick' when auto scroll is performed. */
    get scrollSpeed() { return this._scrollSpeed; }
    set scrollSpeed(value) {
        this._scrollSpeed = coerceNumberProperty(value, 2);
    }
    /** Type of compaction that will be applied to the layout (vertical, horizontal or free). Defaults to 'vertical' */
    get compactType() {
        return this._compactType;
    }
    set compactType(val) {
        this._compactType = val;
    }
    /** Row height in css pixels */
    get rowHeight() { return this._rowHeight; }
    set rowHeight(val) {
        this._rowHeight = Math.max(1, Math.round(coerceNumberProperty(val)));
    }
    /** Number of columns  */
    get cols() { return this._cols; }
    set cols(val) {
        this._cols = Math.max(1, Math.round(coerceNumberProperty(val)));
    }
    /** Layout of the grid. Array of all the grid items with its 'id' and position on the grid. */
    get layout() { return this._layout; }
    set layout(layout) {
        /**
         * Enhancement:
         * Only set layout if it's reference has changed and use a boolean to track whenever recalculate the layout on ngOnChanges.
         *
         * Why:
         * The normal use of this lib is having the variable layout in the outer component or in a store, assigning it whenever it changes and
         * binded in the component with it's input [layout]. In this scenario, we would always calculate one unnecessary change on the layout when
         * it is re-binded on the input.
         */
        this._layout = layout;
    }
    get config() {
        return {
            cols: this.cols,
            rowHeight: this.rowHeight,
            layout: this.layout,
            preventCollision: this.preventCollision,
        };
    }
    ngOnChanges(changes) {
        let needsCompactLayout = false;
        let needsRecalculateRenderData = false;
        // TODO: Does fist change need to be compacted by default?
        // Compact layout whenever some dependent prop changes.
        if (changes.compactType || changes.cols || changes.layout) {
            needsCompactLayout = true;
        }
        // Check if wee need to recalculate rendering data.
        if (needsCompactLayout || changes.rowHeight) {
            needsRecalculateRenderData = true;
        }
        // Only compact layout if lib user has provided it. Lib users that want to save/store always the same layout  as it is represented (compacted)
        // can use KtdCompactGrid utility and pre-compact the layout. This is the recommended behaviour for always having a the same layout on this component
        // and the ones that uses it.
        if (needsCompactLayout && this.compactOnPropsChange) {
            this.compactLayout();
        }
        if (needsRecalculateRenderData) {
            this.calculateRenderData();
        }
    }
    ngAfterContentInit() {
        this.initSubscriptions();
    }
    ngAfterContentChecked() {
        this.render();
    }
    resize() {
        this.calculateRenderData();
        this.render();
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    compactLayout() {
        this.layout = compact(this.layout, this.compactType, this.cols);
    }
    getItemsRenderData() {
        return Object.assign({}, this._gridItemsRenderData);
    }
    getItemRenderData(itemId) {
        return this._gridItemsRenderData[itemId];
    }
    calculateRenderData() {
        const clientRect = this.elementRef.nativeElement.getBoundingClientRect();
        this._gridItemsRenderData = layoutToRenderItems(this.config, clientRect.width, clientRect.height);
        this._height = getGridHeight(this.layout, this.rowHeight);
    }
    render() {
        this.renderer.setStyle(this.elementRef.nativeElement, 'height', `${this._height}px`);
        this.updateGridItemsStyles();
    }
    updateGridItemsStyles() {
        this._gridItems.forEach(item => {
            const gridItemRenderData = this._gridItemsRenderData[item.id];
            if (gridItemRenderData == null) {
                console.error(`Couldn\'t find the specified grid item for the id: ${item.id}`);
            }
            else {
                item.setStyles(parseRenderItemToPixels(gridItemRenderData));
            }
        });
    }
    initSubscriptions() {
        this.subscriptions = [
            this._gridItems.changes.pipe(startWith(this._gridItems), switchMap((gridItems) => {
                return merge(...gridItems.map((gridItem) => gridItem.dragStart$.pipe(map((event) => ({ event, gridItem, type: 'drag' })))), ...gridItems.map((gridItem) => gridItem.resizeStart$.pipe(map((event) => ({ event, gridItem, type: 'resize' }))))).pipe(exhaustMap(({ event, gridItem, type }) => {
                    // Emit drag or resize start events. Ensure that is start event is inside the zone.
                    this.ngZone.run(() => (type === 'drag' ? this.dragStarted : this.resizeStarted).emit(getDragResizeEventData(gridItem, this.layout)));
                    // Get the correct newStateFunc depending on if we are dragging or resizing
                    const calcNewStateFunc = type === 'drag' ? ktdGridItemDragging : ktdGridItemResizing;
                    // Perform drag sequence
                    return this.performDragSequence$(gridItem, event, (gridItemId, config, compactionType, draggingData) => calcNewStateFunc(gridItemId, config, compactionType, draggingData)).pipe(map((layout) => ({ layout, gridItem, type })));
                }));
            })).subscribe(({ layout, gridItem, type }) => {
                this.layout = layout;
                // Calculate new rendering data given the new layout.
                this.calculateRenderData();
                // Emit drag or resize end events.
                (type === 'drag' ? this.dragEnded : this.resizeEnded).emit(getDragResizeEventData(gridItem, layout));
                // Notify that the layout has been updated.
                this.layoutUpdated.emit(layout);
            })
        ];
    }
    /**
     * Perform a general grid drag action, from start to end. A general grid drag action basically includes creating the placeholder element and adding
     * some class animations. calcNewStateFunc needs to be provided in order to calculate the new state of the layout.
     * @param gridItem that is been dragged
     * @param pointerDownEvent event (mousedown or touchdown) where the user initiated the drag
     * @param calcNewStateFunc function that return the new layout state and the drag element position
     */
    performDragSequence$(gridItem, pointerDownEvent, calcNewStateFunc) {
        return new Observable((observer) => {
            // Retrieve grid (parent) and gridItem (draggedElem) client rects.
            const gridElemClientRect = getMutableClientRect(this.elementRef.nativeElement);
            const dragElemClientRect = getMutableClientRect(gridItem.elementRef.nativeElement);
            const scrollableParent = typeof this.scrollableParent === 'string' ? document.getElementById(this.scrollableParent) : this.scrollableParent;
            this.renderer.addClass(gridItem.elementRef.nativeElement, 'no-transitions');
            this.renderer.addClass(gridItem.elementRef.nativeElement, 'ktd-grid-item-dragging');
            // Create placeholder element. This element would represent the position where the dragged/resized element would be if the action ends
            const placeholderElement = this.renderer.createElement('div');
            placeholderElement.style.width = `${dragElemClientRect.width}px`;
            placeholderElement.style.height = `${dragElemClientRect.height}px`;
            placeholderElement.style.transform = `translateX(${dragElemClientRect.left - gridElemClientRect.left}px) translateY(${dragElemClientRect.top - gridElemClientRect.top}px)`;
            this.renderer.addClass(placeholderElement, 'ktd-grid-item-placeholder');
            this.renderer.appendChild(this.elementRef.nativeElement, placeholderElement);
            let newLayout;
            // TODO (enhancement): consider move this 'side effect' observable inside the main drag loop.
            //  - Pros are that we would not repeat subscriptions and takeUntil would shut down observables at the same time.
            //  - Cons are that moving this functionality as a side effect inside the main drag loop would be confusing.
            const scrollSubscription = this.ngZone.runOutsideAngular(() => (!scrollableParent ? NEVER : this.gridService.mouseOrTouchMove$(document).pipe(map((event) => ({
                pointerX: ktdPointerClientX(event),
                pointerY: ktdPointerClientY(event)
            })), ktdScrollIfNearElementClientRect$(scrollableParent, { scrollStep: this.scrollSpeed }))).pipe(takeUntil(ktdMouseOrTouchEnd(document))).subscribe());
            /**
             * Main subscription, it listens for 'pointer move' and 'scroll' events and recalculates the layout on each emission
             */
            const subscription = this.ngZone.runOutsideAngular(() => merge(combineLatest([
                this.gridService.mouseOrTouchMove$(document),
                ...(!scrollableParent ? [of({ top: 0, left: 0 })] : [
                    ktdGetScrollTotalRelativeDifference$(scrollableParent).pipe(startWith({ top: 0, left: 0 }) // Force first emission to allow CombineLatest to emit even no scroll event has occurred
                    )
                ])
            ])).pipe(takeUntil(ktdMouseOrTouchEnd(document))).subscribe(([pointerDragEvent, scrollDifference]) => {
                pointerDragEvent.preventDefault();
                /**
                 * Set the new layout to be the layout in which the calcNewStateFunc would be executed.
                 * NOTE: using the mutated layout is the way to go by 'react-grid-layout' utils. If we don't use the previous layout,
                 * some utilities from 'react-grid-layout' would not work as expected.
                 */
                const currentLayout = newLayout || this.layout;
                const { layout, draggedItemPos } = calcNewStateFunc(gridItem.id, {
                    layout: currentLayout,
                    rowHeight: this.rowHeight,
                    cols: this.cols,
                    preventCollision: this.preventCollision
                }, this.compactType, {
                    pointerDownEvent,
                    pointerDragEvent,
                    gridElemClientRect,
                    dragElemClientRect,
                    scrollDifference
                });
                newLayout = layout;
                this._height = getGridHeight(newLayout, this.rowHeight);
                this._gridItemsRenderData = layoutToRenderItems({
                    cols: this.cols,
                    rowHeight: this.rowHeight,
                    layout: newLayout,
                    preventCollision: this.preventCollision,
                }, gridElemClientRect.width, gridElemClientRect.height);
                const placeholderStyles = parseRenderItemToPixels(this._gridItemsRenderData[gridItem.id]);
                // Put the real final position to the placeholder element
                placeholderElement.style.width = placeholderStyles.width;
                placeholderElement.style.height = placeholderStyles.height;
                placeholderElement.style.transform = `translateX(${placeholderStyles.left}) translateY(${placeholderStyles.top})`;
                // modify the position of the dragged item to be the once we want (for example the mouse position or whatever)
                this._gridItemsRenderData[gridItem.id] = Object.assign(Object.assign({}, draggedItemPos), { id: this._gridItemsRenderData[gridItem.id].id });
                this.render();
            }, (error) => observer.error(error), () => {
                this.ngZone.run(() => {
                    // Remove drag classes
                    this.renderer.removeClass(gridItem.elementRef.nativeElement, 'no-transitions');
                    this.renderer.removeClass(gridItem.elementRef.nativeElement, 'ktd-grid-item-dragging');
                    // Remove placeholder element from the dom
                    // NOTE: If we don't put the removeChild inside the zone it would not work... This may be a bug from angular or maybe is the intended behaviour, although strange.
                    // It should work since AFAIK this action should not be done in a CD cycle.
                    this.renderer.removeChild(this.elementRef.nativeElement, placeholderElement);
                    if (newLayout) {
                        // Prune react-grid-layout compact extra properties.
                        observer.next(newLayout.map(item => ({
                            id: item.id,
                            x: item.x,
                            y: item.y,
                            w: item.w,
                            h: item.h
                        })));
                    }
                    else {
                        // TODO: Need we really to emit if there is no layout change but drag started and ended?
                        observer.next(this.layout);
                    }
                    observer.complete();
                });
            }));
            return () => {
                scrollSubscription.unsubscribe();
                subscription.unsubscribe();
            };
        });
    }
}
KtdGridComponent.decorators = [
    { type: Component, args: [{
                selector: 'ktd-grid',
                template: "<ng-content></ng-content>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [
                    {
                        provide: GRID_ITEM_GET_RENDER_DATA_TOKEN,
                        useFactory: ktdGridItemGetRenderDataFactoryFunc,
                        deps: [KtdGridComponent]
                    }
                ],
                styles: ["ktd-grid{display:block;position:relative;width:100%}ktd-grid ktd-grid-item.ktd-grid-item-dragging{z-index:1000}ktd-grid ktd-grid-item.no-transitions{transition:none!important}ktd-grid .ktd-grid-item-placeholder{background-color:#8b0000;opacity:.6;position:absolute;transition:all .15s ease;transition-property:transform;z-index:0}"]
            },] }
];
KtdGridComponent.ctorParameters = () => [
    { type: KtdGridService },
    { type: ElementRef },
    { type: Renderer2 },
    { type: NgZone }
];
KtdGridComponent.propDecorators = {
    _gridItems: [{ type: ContentChildren, args: [KtdGridItemComponent, { descendants: true },] }],
    layoutUpdated: [{ type: Output }],
    dragStarted: [{ type: Output }],
    resizeStarted: [{ type: Output }],
    dragEnded: [{ type: Output }],
    resizeEnded: [{ type: Output }],
    scrollableParent: [{ type: Input }],
    compactOnPropsChange: [{ type: Input }],
    preventCollision: [{ type: Input }],
    scrollSpeed: [{ type: Input }],
    compactType: [{ type: Input }],
    rowHeight: [{ type: Input }],
    cols: [{ type: Input }],
    layout: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1ncmlkLWxheW91dC1odWdvL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9ncmlkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ29DLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUN4SCxNQUFNLEVBQWEsU0FBUyxFQUFpQixpQkFBaUIsRUFDNUUsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLG9CQUFvQixFQUFlLE1BQU0sNEJBQTRCLENBQUM7QUFDL0UsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDdkUsT0FBTyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBWSxFQUFFLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQzNGLE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDOUUsT0FBTyxFQUFFLE9BQU8sRUFBZSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3ZFLE9BQU8sRUFDSCwrQkFBK0IsRUFFbEMsTUFBTSxvQkFBb0IsQ0FBQztBQUM1QixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsaUJBQWlCLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUVqRyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDaEQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDM0QsT0FBTyxFQUFFLG9DQUFvQyxFQUFFLGlDQUFpQyxFQUFFLE1B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QUUsVUFBVTtnQkFDcEIsdUNBQW9DO2dCQUVwQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLFNBQVMsRUFBRTtvQkFDUDt3QkFDSSxPQUFPLEVBQUUsK0JBQStCO3dCQUN4QyxVQUFVLEVBQUUsbUNBQW1DO3dCQUMvQyxJQUFJLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztxQkFDM0I7aUJBQ0o7O2FBQ0o7OztZQXBGUSxjQUFjO1lBZnlFLFVBQVU7WUFDeEUsU0FBUztZQURzRixNQUFNOzs7eUJBc0dsSSxlQUFlLFNBQUMsb0JBQW9CLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDOzRCQUd6RCxNQUFNOzBCQUdOLE1BQU07NEJBR04sTUFBTTt3QkFHTixNQUFNOzBCQUdOLE1BQU07K0JBTU4sS0FBSzttQ0FHTCxLQUFLOytCQVVMLEtBQUs7MEJBVUwsS0FBSzswQkFVTCxLQUFLO3dCQVlMLEtBQUs7bUJBVUwsS0FBSztxQkFVTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBBZnRlckNvbnRlbnRDaGVja2VkLCBBZnRlckNvbnRlbnRJbml0LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBDb250ZW50Q2hpbGRyZW4sIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE5nWm9uZSwgT25DaGFuZ2VzLFxuICAgIE9uRGVzdHJveSwgT3V0cHV0LCBRdWVyeUxpc3QsIFJlbmRlcmVyMiwgU2ltcGxlQ2hhbmdlcywgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBjb2VyY2VOdW1iZXJQcm9wZXJ0eSwgTnVtYmVySW5wdXQgfSBmcm9tICcuL2NvZXJjaW9uL251bWJlci1wcm9wZXJ0eSc7XG5pbXBvcnQgeyBLdGRHcmlkSXRlbUNvbXBvbmVudCB9IGZyb20gJy4vZ3JpZC1pdGVtL2dyaWQtaXRlbS5jb21wb25lbnQnO1xuaW1wb3J0IHsgY29tYmluZUxhdGVzdCwgbWVyZ2UsIE5FVkVSLCBPYnNlcnZhYmxlLCBPYnNlcnZlciwgb2YsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZXhoYXVzdE1hcCwgbWFwLCBzdGFydFdpdGgsIHN3aXRjaE1hcCwgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsga3RkR3JpZEl0ZW1EcmFnZ2luZywga3RkR3JpZEl0ZW1SZXNpemluZyB9IGZyb20gJy4vdXRpbHMvZ3JpZC51dGlscyc7XG5pbXBvcnQgeyBjb21wYWN0LCBDb21wYWN0VHlwZSB9IGZyb20gJy4vdXRpbHMvcmVhY3QtZ3JpZC1sYXlvdXQudXRpbHMnO1xuaW1wb3J0IHtcbiAgICBHUklEX0lURU1fR0VUX1JFTkRFUl9EQVRBX1RPS0VOLCBLdGREcmFnZ2luZ0RhdGEsIEt0ZEdyaWRDZmcsIEt0ZEdyaWRDb21wYWN0VHlwZSwgS3RkR3JpZEl0ZW1SZWN0LCBLdGRHcmlkSXRlbVJlbmRlckRhdGEsIEt0ZEdyaWRMYXlvdXQsXG4gICAgS3RkR3JpZExheW91dEl0ZW1cbn0gZnJvbSAnLi9ncmlkLmRlZmluaXRpb25zJztcbmltcG9ydCB7IGt0ZE1vdXNlT3JUb3VjaEVuZCwga3RkUG9pbnRlckNsaWVudFgsIGt0ZFBvaW50ZXJDbGllbnRZIH0gZnJvbSAnLi91dGlscy9wb2ludGVyLnV0aWxzJztcbmltcG9ydCB7IEt0ZERpY3Rpb25hcnkgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBLdGRHcmlkU2VydmljZSB9IGZyb20gJy4vZ3JpZC5zZXJ2aWNlJztcbmltcG9ydCB7IGdldE11dGFibGVDbGllbnRSZWN0IH0gZnJvbSAnLi91dGlscy9jbGllbnQtcmVjdCc7XG5pbXBvcnQgeyBrdGRHZXRTY3JvbGxUb3RhbFJlbGF0aXZlRGlmZmVyZW5jZSQsIGt0ZFNjcm9sbElmTmVhckVsZW1lbnRDbGllbnRSZWN0JCB9IGZyb20gJy4vdXRpbHMvc2Nyb2xsJztcbmltcG9ydCB7IEJvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5IH0gZnJvbSAnLi9jb2VyY2lvbi9ib29sZWFuLXByb3BlcnR5JztcblxuaW50ZXJmYWNlIEt0ZERyYWdSZXNpemVFdmVudCB7XG4gICAgbGF5b3V0OiBLdGRHcmlkTGF5b3V0O1xuICAgIGxheW91dEl0ZW06IEt0ZEdyaWRMYXlvdXRJdGVtO1xuICAgIGdyaWRJdGVtUmVmOiBLdGRHcmlkSXRlbUNvbXBvbmVudDtcbn1cblxuZXhwb3J0IHR5cGUgS3RkRHJhZ1N0YXJ0ID0gS3RkRHJhZ1Jlc2l6ZUV2ZW50O1xuZXhwb3J0IHR5cGUgS3RkUmVzaXplU3RhcnQgPSBLdGREcmFnUmVzaXplRXZlbnQ7XG5leHBvcnQgdHlwZSBLdGREcmFnRW5kID0gS3RkRHJhZ1Jlc2l6ZUV2ZW50O1xuZXhwb3J0IHR5cGUgS3RkUmVzaXplRW5kID0gS3RkRHJhZ1Jlc2l6ZUV2ZW50O1xuXG5mdW5jdGlvbiBnZXREcmFnUmVzaXplRXZlbnREYXRhKGdyaWRJdGVtOiBLdGRHcmlkSXRlbUNvbXBvbmVudCwgbGF5b3V0OiBLdGRHcmlkTGF5b3V0KTogS3RkRHJhZ1Jlc2l6ZUV2ZW50IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBsYXlvdXQsXG4gICAgICAgIGxheW91dEl0ZW06IGxheW91dC5maW5kKChpdGVtKSA9PiBpdGVtLmlkID09PSBncmlkSXRlbS5pZCkhLFxuICAgICAgICBncmlkSXRlbVJlZjogZ3JpZEl0ZW1cbiAgICB9O1xufVxuXG5cbmZ1bmN0aW9uIGxheW91dFRvUmVuZGVySXRlbXMoY29uZmlnOiBLdGRHcmlkQ2ZnLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcik6IEt0ZERpY3Rpb25hcnk8S3RkR3JpZEl0ZW1SZW5kZXJEYXRhPG51bWJlcj4+IHtcbiAgICBjb25zdCB7Y29scywgcm93SGVpZ2h0LCBsYXlvdXR9ID0gY29uZmlnO1xuXG4gICAgY29uc3QgcmVuZGVySXRlbXM6IEt0ZERpY3Rpb25hcnk8S3RkR3JpZEl0ZW1SZW5kZXJEYXRhPG51bWJlcj4+ID0ge307XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGxheW91dCkge1xuICAgICAgICByZW5kZXJJdGVtc1tpdGVtLmlkXSA9IHtcbiAgICAgICAgICAgIGlkOiBpdGVtLmlkLFxuICAgICAgICAgICAgdG9wOiBpdGVtLnkgPT09IDAgPyAwIDogaXRlbS55ICogcm93SGVpZ2h0LFxuICAgICAgICAgICAgbGVmdDogaXRlbS54ICogKHdpZHRoIC8gY29scyksXG4gICAgICAgICAgICB3aWR0aDogaXRlbS53ICogKHdpZHRoIC8gY29scyksXG4gICAgICAgICAgICBoZWlnaHQ6IGl0ZW0uaCAqIHJvd0hlaWdodFxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gcmVuZGVySXRlbXM7XG59XG5cbmZ1bmN0aW9uIGdldEdyaWRIZWlnaHQobGF5b3V0OiBLdGRHcmlkTGF5b3V0LCByb3dIZWlnaHQ6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIGxheW91dC5yZWR1Y2UoKGFjYywgY3VyKSA9PiBNYXRoLm1heChhY2MsIChjdXIueSArIGN1ci5oKSAqIHJvd0hlaWdodCksIDApO1xufVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVJlbmRlckl0ZW1Ub1BpeGVscyhyZW5kZXJJdGVtOiBLdGRHcmlkSXRlbVJlbmRlckRhdGE8bnVtYmVyPik6IEt0ZEdyaWRJdGVtUmVuZGVyRGF0YTxzdHJpbmc+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBpZDogcmVuZGVySXRlbS5pZCxcbiAgICAgICAgdG9wOiBgJHtyZW5kZXJJdGVtLnRvcH1weGAsXG4gICAgICAgIGxlZnQ6IGAke3JlbmRlckl0ZW0ubGVmdH1weGAsXG4gICAgICAgIHdpZHRoOiBgJHtyZW5kZXJJdGVtLndpZHRofXB4YCxcbiAgICAgICAgaGVpZ2h0OiBgJHtyZW5kZXJJdGVtLmhlaWdodH1weGBcbiAgICB9O1xufVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6a3RkLXByZWZpeC1jb2RlXG5leHBvcnQgZnVuY3Rpb24gX19ncmlkSXRlbUdldFJlbmRlckRhdGFGYWN0b3J5RnVuYyhncmlkQ21wOiBLdGRHcmlkQ29tcG9uZW50KSB7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm9ubHktYXJyb3ctZnVuY3Rpb25zXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGlkOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlUmVuZGVySXRlbVRvUGl4ZWxzKGdyaWRDbXAuZ2V0SXRlbVJlbmRlckRhdGEoaWQpKTtcbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24ga3RkR3JpZEl0ZW1HZXRSZW5kZXJEYXRhRmFjdG9yeUZ1bmMoZ3JpZENtcDogS3RkR3JpZENvbXBvbmVudCkge1xuICAgIC8vIFdvcmthcm91bmQgZXhwbGFpbmVkOiBodHRwczovL2dpdGh1Yi5jb20vbmctcGFja2Fnci9uZy1wYWNrYWdyL2lzc3Vlcy82OTYjaXNzdWVjb21tZW50LTM4NzExNDYxM1xuICAgIGNvbnN0IHJlc3VsdEZ1bmMgPSBfX2dyaWRJdGVtR2V0UmVuZGVyRGF0YUZhY3RvcnlGdW5jKGdyaWRDbXApO1xuICAgIHJldHVybiByZXN1bHRGdW5jO1xufVxuXG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAna3RkLWdyaWQnLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9ncmlkLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9ncmlkLmNvbXBvbmVudC5zY3NzJ10sXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgcHJvdmlkZTogR1JJRF9JVEVNX0dFVF9SRU5ERVJfREFUQV9UT0tFTixcbiAgICAgICAgICAgIHVzZUZhY3Rvcnk6IGt0ZEdyaWRJdGVtR2V0UmVuZGVyRGF0YUZhY3RvcnlGdW5jLFxuICAgICAgICAgICAgZGVwczogW0t0ZEdyaWRDb21wb25lbnRdXG4gICAgICAgIH1cbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIEt0ZEdyaWRDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMsIEFmdGVyQ29udGVudEluaXQsIEFmdGVyQ29udGVudENoZWNrZWQsIE9uRGVzdHJveSB7XG4gICAgLyoqIFF1ZXJ5IGxpc3Qgb2YgZ3JpZCBpdGVtcyB0aGF0IGFyZSBiZWluZyByZW5kZXJlZC4gKi9cbiAgICBAQ29udGVudENoaWxkcmVuKEt0ZEdyaWRJdGVtQ29tcG9uZW50LCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfZ3JpZEl0ZW1zOiBRdWVyeUxpc3Q8S3RkR3JpZEl0ZW1Db21wb25lbnQ+O1xuXG4gICAgLyoqIEVtaXRzIHdoZW4gbGF5b3V0IGNoYW5nZSAqL1xuICAgIEBPdXRwdXQoKSBsYXlvdXRVcGRhdGVkOiBFdmVudEVtaXR0ZXI8S3RkR3JpZExheW91dD4gPSBuZXcgRXZlbnRFbWl0dGVyPEt0ZEdyaWRMYXlvdXQ+KCk7XG5cbiAgICAvKiogRW1pdHMgd2hlbiBkcmFnIHN0YXJ0cyAqL1xuICAgIEBPdXRwdXQoKSBkcmFnU3RhcnRlZDogRXZlbnRFbWl0dGVyPEt0ZERyYWdTdGFydD4gPSBuZXcgRXZlbnRFbWl0dGVyPEt0ZERyYWdTdGFydD4oKTtcblxuICAgIC8qKiBFbWl0cyB3aGVuIHJlc2l6ZSBzdGFydHMgKi9cbiAgICBAT3V0cHV0KCkgcmVzaXplU3RhcnRlZDogRXZlbnRFbWl0dGVyPEt0ZFJlc2l6ZVN0YXJ0PiA9IG5ldyBFdmVudEVtaXR0ZXI8S3RkUmVzaXplU3RhcnQ+KCk7XG5cbiAgICAvKiogRW1pdHMgd2hlbiBkcmFnIGVuZHMgKi9cbiAgICBAT3V0cHV0KCkgZHJhZ0VuZGVkOiBFdmVudEVtaXR0ZXI8S3RkRHJhZ0VuZD4gPSBuZXcgRXZlbnRFbWl0dGVyPEt0ZERyYWdFbmQ+KCk7XG5cbiAgICAvKiogRW1pdHMgd2hlbiByZXNpemUgZW5kcyAqL1xuICAgIEBPdXRwdXQoKSByZXNpemVFbmRlZDogRXZlbnRFbWl0dGVyPEt0ZFJlc2l6ZUVuZD4gPSBuZXcgRXZlbnRFbWl0dGVyPEt0ZFJlc2l6ZUVuZD4oKTtcblxuICAgIC8qKlxuICAgICAqIFBhcmVudCBlbGVtZW50IHRoYXQgY29udGFpbnMgdGhlIHNjcm9sbC4gSWYgYW4gc3RyaW5nIGlzIHByb3ZpZGVkIGl0IHdvdWxkIHNlYXJjaCB0aGF0IGVsZW1lbnQgYnkgaWQgb24gdGhlIGRvbS5cbiAgICAgKiBJZiBubyBkYXRhIHByb3ZpZGVkIG9yIG51bGwgYXV0b3Njcm9sbCBpcyBub3QgcGVyZm9ybWVkLlxuICAgICAqL1xuICAgIEBJbnB1dCgpIHNjcm9sbGFibGVQYXJlbnQ6IEhUTUxFbGVtZW50IHwgRG9jdW1lbnQgfCBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAgIC8qKiBXaGV0aGVyIG9yIG5vdCB0byB1cGRhdGUgdGhlIGludGVybmFsIGxheW91dCB3aGVuIHNvbWUgZGVwZW5kZW50IHByb3BlcnR5IGNoYW5nZS4gKi9cbiAgICBASW5wdXQoKVxuICAgIGdldCBjb21wYWN0T25Qcm9wc0NoYW5nZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2NvbXBhY3RPblByb3BzQ2hhbmdlOyB9XG5cbiAgICBzZXQgY29tcGFjdE9uUHJvcHNDaGFuZ2UodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fY29tcGFjdE9uUHJvcHNDaGFuZ2UgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2NvbXBhY3RPblByb3BzQ2hhbmdlOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIC8qKiBJZiB0cnVlLCBncmlkIGl0ZW1zIHdvbid0IGNoYW5nZSBwb3NpdGlvbiB3aGVuIGJlaW5nIGRyYWdnZWQgb3Zlci4gSGFuZHkgd2hlbiB1c2luZyBubyBjb21wYWN0aW9uICovXG4gICAgQElucHV0KClcbiAgICBnZXQgcHJldmVudENvbGxpc2lvbigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3ByZXZlbnRDb2xsaXNpb247IH1cblxuICAgIHNldCBwcmV2ZW50Q29sbGlzaW9uKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX3ByZXZlbnRDb2xsaXNpb24gPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3ByZXZlbnRDb2xsaXNpb246IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIC8qKiBOdW1iZXIgb2YgQ1NTIHBpeGVscyB0aGF0IHdvdWxkIGJlIHNjcm9sbGVkIG9uIGVhY2ggJ3RpY2snIHdoZW4gYXV0byBzY3JvbGwgaXMgcGVyZm9ybWVkLiAqL1xuICAgIEBJbnB1dCgpXG4gICAgZ2V0IHNjcm9sbFNwZWVkKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9zY3JvbGxTcGVlZDsgfVxuXG4gICAgc2V0IHNjcm9sbFNwZWVkKHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fc2Nyb2xsU3BlZWQgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSwgMik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfc2Nyb2xsU3BlZWQ6IG51bWJlciA9IDI7XG5cbiAgICAvKiogVHlwZSBvZiBjb21wYWN0aW9uIHRoYXQgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBsYXlvdXQgKHZlcnRpY2FsLCBob3Jpem9udGFsIG9yIGZyZWUpLiBEZWZhdWx0cyB0byAndmVydGljYWwnICovXG4gICAgQElucHV0KClcbiAgICBnZXQgY29tcGFjdFR5cGUoKTogS3RkR3JpZENvbXBhY3RUeXBlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBhY3RUeXBlO1xuICAgIH1cblxuICAgIHNldCBjb21wYWN0VHlwZSh2YWw6IEt0ZEdyaWRDb21wYWN0VHlwZSkge1xuICAgICAgICB0aGlzLl9jb21wYWN0VHlwZSA9IHZhbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9jb21wYWN0VHlwZTogS3RkR3JpZENvbXBhY3RUeXBlID0gJ3ZlcnRpY2FsJztcblxuICAgIC8qKiBSb3cgaGVpZ2h0IGluIGNzcyBwaXhlbHMgKi9cbiAgICBASW5wdXQoKVxuICAgIGdldCByb3dIZWlnaHQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3Jvd0hlaWdodDsgfVxuXG4gICAgc2V0IHJvd0hlaWdodCh2YWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9yb3dIZWlnaHQgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGNvZXJjZU51bWJlclByb3BlcnR5KHZhbCkpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9yb3dIZWlnaHQ6IG51bWJlciA9IDEwMDtcblxuICAgIC8qKiBOdW1iZXIgb2YgY29sdW1ucyAgKi9cbiAgICBASW5wdXQoKVxuICAgIGdldCBjb2xzKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9jb2xzOyB9XG5cbiAgICBzZXQgY29scyh2YWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9jb2xzID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZChjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWwpKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfY29sczogbnVtYmVyID0gNjtcblxuICAgIC8qKiBMYXlvdXQgb2YgdGhlIGdyaWQuIEFycmF5IG9mIGFsbCB0aGUgZ3JpZCBpdGVtcyB3aXRoIGl0cyAnaWQnIGFuZCBwb3NpdGlvbiBvbiB0aGUgZ3JpZC4gKi9cbiAgICBASW5wdXQoKVxuICAgIGdldCBsYXlvdXQoKTogS3RkR3JpZExheW91dCB7IHJldHVybiB0aGlzLl9sYXlvdXQ7IH1cblxuICAgIHNldCBsYXlvdXQobGF5b3V0OiBLdGRHcmlkTGF5b3V0KSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFbmhhbmNlbWVudDpcbiAgICAgICAgICogT25seSBzZXQgbGF5b3V0IGlmIGl0J3MgcmVmZXJlbmNlIGhhcyBjaGFuZ2VkIGFuZCB1c2UgYSBib29sZWFuIHRvIHRyYWNrIHdoZW5ldmVyIHJlY2FsY3VsYXRlIHRoZSBsYXlvdXQgb24gbmdPbkNoYW5nZXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIFdoeTpcbiAgICAgICAgICogVGhlIG5vcm1hbCB1c2Ugb2YgdGhpcyBsaWIgaXMgaGF2aW5nIHRoZSB2YXJpYWJsZSBsYXlvdXQgaW4gdGhlIG91dGVyIGNvbXBvbmVudCBvciBpbiBhIHN0b3JlLCBhc3NpZ25pbmcgaXQgd2hlbmV2ZXIgaXQgY2hhbmdlcyBhbmRcbiAgICAgICAgICogYmluZGVkIGluIHRoZSBjb21wb25lbnQgd2l0aCBpdCdzIGlucHV0IFtsYXlvdXRdLiBJbiB0aGlzIHNjZW5hcmlvLCB3ZSB3b3VsZCBhbHdheXMgY2FsY3VsYXRlIG9uZSB1bm5lY2Vzc2FyeSBjaGFuZ2Ugb24gdGhlIGxheW91dCB3aGVuXG4gICAgICAgICAqIGl0IGlzIHJlLWJpbmRlZCBvbiB0aGUgaW5wdXQuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9sYXlvdXQgPSBsYXlvdXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfbGF5b3V0OiBLdGRHcmlkTGF5b3V0O1xuXG4gICAgZ2V0IGNvbmZpZygpOiBLdGRHcmlkQ2ZnIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbHM6IHRoaXMuY29scyxcbiAgICAgICAgICAgIHJvd0hlaWdodDogdGhpcy5yb3dIZWlnaHQsXG4gICAgICAgICAgICBsYXlvdXQ6IHRoaXMubGF5b3V0LFxuICAgICAgICAgICAgcHJldmVudENvbGxpc2lvbjogdGhpcy5wcmV2ZW50Q29sbGlzaW9uLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKiBUb3RhbCBoZWlnaHQgb2YgdGhlIGdyaWQgKi9cbiAgICBwcml2YXRlIF9oZWlnaHQ6IG51bWJlcjtcbiAgICBwcml2YXRlIF9ncmlkSXRlbXNSZW5kZXJEYXRhOiBLdGREaWN0aW9uYXJ5PEt0ZEdyaWRJdGVtUmVuZGVyRGF0YTxudW1iZXI+PjtcbiAgICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBncmlkU2VydmljZTogS3RkR3JpZFNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgICAgICAgICAgICBwcml2YXRlIG5nWm9uZTogTmdab25lKSB7XG5cbiAgICB9XG5cbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgICAgIGxldCBuZWVkc0NvbXBhY3RMYXlvdXQgPSBmYWxzZTtcbiAgICAgICAgbGV0IG5lZWRzUmVjYWxjdWxhdGVSZW5kZXJEYXRhID0gZmFsc2U7XG5cbiAgICAgICAgLy8gVE9ETzogRG9lcyBmaXN0IGNoYW5nZSBuZWVkIHRvIGJlIGNvbXBhY3RlZCBieSBkZWZhdWx0P1xuICAgICAgICAvLyBDb21wYWN0IGxheW91dCB3aGVuZXZlciBzb21lIGRlcGVuZGVudCBwcm9wIGNoYW5nZXMuXG4gICAgICAgIGlmIChjaGFuZ2VzLmNvbXBhY3RUeXBlIHx8IGNoYW5nZXMuY29scyB8fCBjaGFuZ2VzLmxheW91dCkge1xuICAgICAgICAgICAgbmVlZHNDb21wYWN0TGF5b3V0ID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGlmIHdlZSBuZWVkIHRvIHJlY2FsY3VsYXRlIHJlbmRlcmluZyBkYXRhLlxuICAgICAgICBpZiAobmVlZHNDb21wYWN0TGF5b3V0IHx8IGNoYW5nZXMucm93SGVpZ2h0KSB7XG4gICAgICAgICAgICBuZWVkc1JlY2FsY3VsYXRlUmVuZGVyRGF0YSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPbmx5IGNvbXBhY3QgbGF5b3V0IGlmIGxpYiB1c2VyIGhhcyBwcm92aWRlZCBpdC4gTGliIHVzZXJzIHRoYXQgd2FudCB0byBzYXZlL3N0b3JlIGFsd2F5cyB0aGUgc2FtZSBsYXlvdXQgIGFzIGl0IGlzIHJlcHJlc2VudGVkIChjb21wYWN0ZWQpXG4gICAgICAgIC8vIGNhbiB1c2UgS3RkQ29tcGFjdEdyaWQgdXRpbGl0eSBhbmQgcHJlLWNvbXBhY3QgdGhlIGxheW91dC4gVGhpcyBpcyB0aGUgcmVjb21tZW5kZWQgYmVoYXZpb3VyIGZvciBhbHdheXMgaGF2aW5nIGEgdGhlIHNhbWUgbGF5b3V0IG9uIHRoaXMgY29tcG9uZW50XG4gICAgICAgIC8vIGFuZCB0aGUgb25lcyB0aGF0IHVzZXMgaXQuXG4gICAgICAgIGlmIChuZWVkc0NvbXBhY3RMYXlvdXQgJiYgdGhpcy5jb21wYWN0T25Qcm9wc0NoYW5nZSkge1xuICAgICAgICAgICAgdGhpcy5jb21wYWN0TGF5b3V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmVlZHNSZWNhbGN1bGF0ZVJlbmRlckRhdGEpIHtcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlUmVuZGVyRGF0YSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLmluaXRTdWJzY3JpcHRpb25zKCk7XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cblxuICAgIHJlc2l6ZSgpIHtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVSZW5kZXJEYXRhKCk7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gICAgfVxuXG4gICAgY29tcGFjdExheW91dCgpIHtcbiAgICAgICAgdGhpcy5sYXlvdXQgPSBjb21wYWN0KHRoaXMubGF5b3V0LCB0aGlzLmNvbXBhY3RUeXBlLCB0aGlzLmNvbHMpO1xuICAgIH1cblxuICAgIGdldEl0ZW1zUmVuZGVyRGF0YSgpOiBLdGREaWN0aW9uYXJ5PEt0ZEdyaWRJdGVtUmVuZGVyRGF0YTxudW1iZXI+PiB7XG4gICAgICAgIHJldHVybiB7Li4udGhpcy5fZ3JpZEl0ZW1zUmVuZGVyRGF0YX07XG4gICAgfVxuXG4gICAgZ2V0SXRlbVJlbmRlckRhdGEoaXRlbUlkOiBzdHJpbmcpOiBLdGRHcmlkSXRlbVJlbmRlckRhdGE8bnVtYmVyPiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ncmlkSXRlbXNSZW5kZXJEYXRhW2l0ZW1JZF07XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlUmVuZGVyRGF0YSgpIHtcbiAgICAgICAgY29uc3QgY2xpZW50UmVjdCA9ICh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHRoaXMuX2dyaWRJdGVtc1JlbmRlckRhdGEgPSBsYXlvdXRUb1JlbmRlckl0ZW1zKHRoaXMuY29uZmlnLCBjbGllbnRSZWN0LndpZHRoLCBjbGllbnRSZWN0LmhlaWdodCk7XG4gICAgICAgIHRoaXMuX2hlaWdodCA9IGdldEdyaWRIZWlnaHQodGhpcy5sYXlvdXQsIHRoaXMucm93SGVpZ2h0KTtcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdoZWlnaHQnLCBgJHt0aGlzLl9oZWlnaHR9cHhgKTtcbiAgICAgICAgdGhpcy51cGRhdGVHcmlkSXRlbXNTdHlsZXMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUdyaWRJdGVtc1N0eWxlcygpIHtcbiAgICAgICAgdGhpcy5fZ3JpZEl0ZW1zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICBjb25zdCBncmlkSXRlbVJlbmRlckRhdGE6IEt0ZEdyaWRJdGVtUmVuZGVyRGF0YTxudW1iZXI+IHwgdW5kZWZpbmVkID0gdGhpcy5fZ3JpZEl0ZW1zUmVuZGVyRGF0YVtpdGVtLmlkXTtcbiAgICAgICAgICAgIGlmIChncmlkSXRlbVJlbmRlckRhdGEgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYENvdWxkblxcJ3QgZmluZCB0aGUgc3BlY2lmaWVkIGdyaWQgaXRlbSBmb3IgdGhlIGlkOiAke2l0ZW0uaWR9YCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGl0ZW0uc2V0U3R5bGVzKHBhcnNlUmVuZGVySXRlbVRvUGl4ZWxzKGdyaWRJdGVtUmVuZGVyRGF0YSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRTdWJzY3JpcHRpb25zKCkge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBbXG4gICAgICAgICAgICB0aGlzLl9ncmlkSXRlbXMuY2hhbmdlcy5waXBlKFxuICAgICAgICAgICAgICAgIHN0YXJ0V2l0aCh0aGlzLl9ncmlkSXRlbXMpLFxuICAgICAgICAgICAgICAgIHN3aXRjaE1hcCgoZ3JpZEl0ZW1zOiBRdWVyeUxpc3Q8S3RkR3JpZEl0ZW1Db21wb25lbnQ+KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtZXJnZShcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLmdyaWRJdGVtcy5tYXAoKGdyaWRJdGVtKSA9PiBncmlkSXRlbS5kcmFnU3RhcnQkLnBpcGUobWFwKChldmVudCkgPT4gKHtldmVudCwgZ3JpZEl0ZW0sIHR5cGU6ICdkcmFnJ30pKSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uZ3JpZEl0ZW1zLm1hcCgoZ3JpZEl0ZW0pID0+IGdyaWRJdGVtLnJlc2l6ZVN0YXJ0JC5waXBlKG1hcCgoZXZlbnQpID0+ICh7ZXZlbnQsIGdyaWRJdGVtLCB0eXBlOiAncmVzaXplJ30pKSkpLFxuICAgICAgICAgICAgICAgICAgICApLnBpcGUoZXhoYXVzdE1hcCgoe2V2ZW50LCBncmlkSXRlbSwgdHlwZX0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVtaXQgZHJhZyBvciByZXNpemUgc3RhcnQgZXZlbnRzLiBFbnN1cmUgdGhhdCBpcyBzdGFydCBldmVudCBpcyBpbnNpZGUgdGhlIHpvbmUuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4gKHR5cGUgPT09ICdkcmFnJyA/IHRoaXMuZHJhZ1N0YXJ0ZWQgOiB0aGlzLnJlc2l6ZVN0YXJ0ZWQpLmVtaXQoZ2V0RHJhZ1Jlc2l6ZUV2ZW50RGF0YShncmlkSXRlbSwgdGhpcy5sYXlvdXQpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGNvcnJlY3QgbmV3U3RhdGVGdW5jIGRlcGVuZGluZyBvbiBpZiB3ZSBhcmUgZHJhZ2dpbmcgb3IgcmVzaXppbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhbGNOZXdTdGF0ZUZ1bmMgPSB0eXBlID09PSAnZHJhZycgPyBrdGRHcmlkSXRlbURyYWdnaW5nIDoga3RkR3JpZEl0ZW1SZXNpemluZztcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUGVyZm9ybSBkcmFnIHNlcXVlbmNlXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wZXJmb3JtRHJhZ1NlcXVlbmNlJChncmlkSXRlbSwgZXZlbnQsIChncmlkSXRlbUlkLCBjb25maWcsIGNvbXBhY3Rpb25UeXBlLCBkcmFnZ2luZ0RhdGEpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsY05ld1N0YXRlRnVuYyhncmlkSXRlbUlkLCBjb25maWcsIGNvbXBhY3Rpb25UeXBlLCBkcmFnZ2luZ0RhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICApLnBpcGUobWFwKChsYXlvdXQpID0+ICh7bGF5b3V0LCBncmlkSXRlbSwgdHlwZX0pKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApLnN1YnNjcmliZSgoe2xheW91dCwgZ3JpZEl0ZW0sIHR5cGV9KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXlvdXQgPSBsYXlvdXQ7XG4gICAgICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIG5ldyByZW5kZXJpbmcgZGF0YSBnaXZlbiB0aGUgbmV3IGxheW91dC5cbiAgICAgICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVJlbmRlckRhdGEoKTtcbiAgICAgICAgICAgICAgICAvLyBFbWl0IGRyYWcgb3IgcmVzaXplIGVuZCBldmVudHMuXG4gICAgICAgICAgICAgICAgKHR5cGUgPT09ICdkcmFnJyA/IHRoaXMuZHJhZ0VuZGVkIDogdGhpcy5yZXNpemVFbmRlZCkuZW1pdChnZXREcmFnUmVzaXplRXZlbnREYXRhKGdyaWRJdGVtLCBsYXlvdXQpKTtcbiAgICAgICAgICAgICAgICAvLyBOb3RpZnkgdGhhdCB0aGUgbGF5b3V0IGhhcyBiZWVuIHVwZGF0ZWQuXG4gICAgICAgICAgICAgICAgdGhpcy5sYXlvdXRVcGRhdGVkLmVtaXQobGF5b3V0KTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtIGEgZ2VuZXJhbCBncmlkIGRyYWcgYWN0aW9uLCBmcm9tIHN0YXJ0IHRvIGVuZC4gQSBnZW5lcmFsIGdyaWQgZHJhZyBhY3Rpb24gYmFzaWNhbGx5IGluY2x1ZGVzIGNyZWF0aW5nIHRoZSBwbGFjZWhvbGRlciBlbGVtZW50IGFuZCBhZGRpbmdcbiAgICAgKiBzb21lIGNsYXNzIGFuaW1hdGlvbnMuIGNhbGNOZXdTdGF0ZUZ1bmMgbmVlZHMgdG8gYmUgcHJvdmlkZWQgaW4gb3JkZXIgdG8gY2FsY3VsYXRlIHRoZSBuZXcgc3RhdGUgb2YgdGhlIGxheW91dC5cbiAgICAgKiBAcGFyYW0gZ3JpZEl0ZW0gdGhhdCBpcyBiZWVuIGRyYWdnZWRcbiAgICAgKiBAcGFyYW0gcG9pbnRlckRvd25FdmVudCBldmVudCAobW91c2Vkb3duIG9yIHRvdWNoZG93bikgd2hlcmUgdGhlIHVzZXIgaW5pdGlhdGVkIHRoZSBkcmFnXG4gICAgICogQHBhcmFtIGNhbGNOZXdTdGF0ZUZ1bmMgZnVuY3Rpb24gdGhhdCByZXR1cm4gdGhlIG5ldyBsYXlvdXQgc3RhdGUgYW5kIHRoZSBkcmFnIGVsZW1lbnQgcG9zaXRpb25cbiAgICAgKi9cbiAgICBwcml2YXRlIHBlcmZvcm1EcmFnU2VxdWVuY2UkKGdyaWRJdGVtOiBLdGRHcmlkSXRlbUNvbXBvbmVudCwgcG9pbnRlckRvd25FdmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxjTmV3U3RhdGVGdW5jOiAoZ3JpZEl0ZW1JZDogc3RyaW5nLCBjb25maWc6IEt0ZEdyaWRDZmcsIGNvbXBhY3Rpb25UeXBlOiBDb21wYWN0VHlwZSwgZHJhZ2dpbmdEYXRhOiBLdGREcmFnZ2luZ0RhdGEpID0+IHsgbGF5b3V0OiBLdGRHcmlkTGF5b3V0SXRlbVtdOyBkcmFnZ2VkSXRlbVBvczogS3RkR3JpZEl0ZW1SZWN0IH0pOiBPYnNlcnZhYmxlPEt0ZEdyaWRMYXlvdXQ+IHtcblxuICAgICAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8S3RkR3JpZExheW91dD4oKG9ic2VydmVyOiBPYnNlcnZlcjxLdGRHcmlkTGF5b3V0PikgPT4ge1xuICAgICAgICAgICAgLy8gUmV0cmlldmUgZ3JpZCAocGFyZW50KSBhbmQgZ3JpZEl0ZW0gKGRyYWdnZWRFbGVtKSBjbGllbnQgcmVjdHMuXG4gICAgICAgICAgICBjb25zdCBncmlkRWxlbUNsaWVudFJlY3Q6IENsaWVudFJlY3QgPSBnZXRNdXRhYmxlQ2xpZW50UmVjdCh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudCk7XG4gICAgICAgICAgICBjb25zdCBkcmFnRWxlbUNsaWVudFJlY3Q6IENsaWVudFJlY3QgPSBnZXRNdXRhYmxlQ2xpZW50UmVjdChncmlkSXRlbS5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpO1xuXG4gICAgICAgICAgICBjb25zdCBzY3JvbGxhYmxlUGFyZW50ID0gdHlwZW9mIHRoaXMuc2Nyb2xsYWJsZVBhcmVudCA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnNjcm9sbGFibGVQYXJlbnQpIDogdGhpcy5zY3JvbGxhYmxlUGFyZW50O1xuXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKGdyaWRJdGVtLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ25vLXRyYW5zaXRpb25zJyk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKGdyaWRJdGVtLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2t0ZC1ncmlkLWl0ZW0tZHJhZ2dpbmcnKTtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIHBsYWNlaG9sZGVyIGVsZW1lbnQuIFRoaXMgZWxlbWVudCB3b3VsZCByZXByZXNlbnQgdGhlIHBvc2l0aW9uIHdoZXJlIHRoZSBkcmFnZ2VkL3Jlc2l6ZWQgZWxlbWVudCB3b3VsZCBiZSBpZiB0aGUgYWN0aW9uIGVuZHNcbiAgICAgICAgICAgIGNvbnN0IHBsYWNlaG9sZGVyRWxlbWVudDogSFRNTERpdkVsZW1lbnQgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgcGxhY2Vob2xkZXJFbGVtZW50LnN0eWxlLndpZHRoID0gYCR7ZHJhZ0VsZW1DbGllbnRSZWN0LndpZHRofXB4YDtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHtkcmFnRWxlbUNsaWVudFJlY3QuaGVpZ2h0fXB4YDtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke2RyYWdFbGVtQ2xpZW50UmVjdC5sZWZ0IC0gZ3JpZEVsZW1DbGllbnRSZWN0LmxlZnR9cHgpIHRyYW5zbGF0ZVkoJHtkcmFnRWxlbUNsaWVudFJlY3QudG9wIC0gZ3JpZEVsZW1DbGllbnRSZWN0LnRvcH1weClgO1xuXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHBsYWNlaG9sZGVyRWxlbWVudCwgJ2t0ZC1ncmlkLWl0ZW0tcGxhY2Vob2xkZXInKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHBsYWNlaG9sZGVyRWxlbWVudCk7XG5cbiAgICAgICAgICAgIGxldCBuZXdMYXlvdXQ6IEt0ZEdyaWRMYXlvdXRJdGVtW107XG5cbiAgICAgICAgICAgIC8vIFRPRE8gKGVuaGFuY2VtZW50KTogY29uc2lkZXIgbW92ZSB0aGlzICdzaWRlIGVmZmVjdCcgb2JzZXJ2YWJsZSBpbnNpZGUgdGhlIG1haW4gZHJhZyBsb29wLlxuICAgICAgICAgICAgLy8gIC0gUHJvcyBhcmUgdGhhdCB3ZSB3b3VsZCBub3QgcmVwZWF0IHN1YnNjcmlwdGlvbnMgYW5kIHRha2VVbnRpbCB3b3VsZCBzaHV0IGRvd24gb2JzZXJ2YWJsZXMgYXQgdGhlIHNhbWUgdGltZS5cbiAgICAgICAgICAgIC8vICAtIENvbnMgYXJlIHRoYXQgbW92aW5nIHRoaXMgZnVuY3Rpb25hbGl0eSBhcyBhIHNpZGUgZWZmZWN0IGluc2lkZSB0aGUgbWFpbiBkcmFnIGxvb3Agd291bGQgYmUgY29uZnVzaW5nLlxuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsU3Vic2NyaXB0aW9uID0gdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT5cbiAgICAgICAgICAgICAgICAoIXNjcm9sbGFibGVQYXJlbnQgPyBORVZFUiA6IHRoaXMuZ3JpZFNlcnZpY2UubW91c2VPclRvdWNoTW92ZSQoZG9jdW1lbnQpLnBpcGUoXG4gICAgICAgICAgICAgICAgICAgIG1hcCgoZXZlbnQpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludGVyWDoga3RkUG9pbnRlckNsaWVudFgoZXZlbnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRlclk6IGt0ZFBvaW50ZXJDbGllbnRZKGV2ZW50KVxuICAgICAgICAgICAgICAgICAgICB9KSksXG4gICAgICAgICAgICAgICAgICAgIGt0ZFNjcm9sbElmTmVhckVsZW1lbnRDbGllbnRSZWN0JChzY3JvbGxhYmxlUGFyZW50LCB7c2Nyb2xsU3RlcDogdGhpcy5zY3JvbGxTcGVlZH0pXG4gICAgICAgICAgICAgICAgKSkucGlwZShcbiAgICAgICAgICAgICAgICAgICAgdGFrZVVudGlsKGt0ZE1vdXNlT3JUb3VjaEVuZChkb2N1bWVudCkpXG4gICAgICAgICAgICAgICAgKS5zdWJzY3JpYmUoKSk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTWFpbiBzdWJzY3JpcHRpb24sIGl0IGxpc3RlbnMgZm9yICdwb2ludGVyIG1vdmUnIGFuZCAnc2Nyb2xsJyBldmVudHMgYW5kIHJlY2FsY3VsYXRlcyB0aGUgbGF5b3V0IG9uIGVhY2ggZW1pc3Npb25cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT5cbiAgICAgICAgICAgICAgICBtZXJnZShcbiAgICAgICAgICAgICAgICAgICAgY29tYmluZUxhdGVzdChbXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdyaWRTZXJ2aWNlLm1vdXNlT3JUb3VjaE1vdmUkKGRvY3VtZW50KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLighc2Nyb2xsYWJsZVBhcmVudCA/IFtvZih7dG9wOiAwLCBsZWZ0OiAwfSldIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGt0ZEdldFNjcm9sbFRvdGFsUmVsYXRpdmVEaWZmZXJlbmNlJChzY3JvbGxhYmxlUGFyZW50KS5waXBlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFdpdGgoe3RvcDogMCwgbGVmdDogMH0pIC8vIEZvcmNlIGZpcnN0IGVtaXNzaW9uIHRvIGFsbG93IENvbWJpbmVMYXRlc3QgdG8gZW1pdCBldmVuIG5vIHNjcm9sbCBldmVudCBoYXMgb2NjdXJyZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgICkucGlwZShcbiAgICAgICAgICAgICAgICAgICAgdGFrZVVudGlsKGt0ZE1vdXNlT3JUb3VjaEVuZChkb2N1bWVudCkpLFxuICAgICAgICAgICAgICAgICkuc3Vic2NyaWJlKChbcG9pbnRlckRyYWdFdmVudCwgc2Nyb2xsRGlmZmVyZW5jZV06IFtNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCwgeyB0b3A6IG51bWJlciwgbGVmdDogbnVtYmVyIH1dKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludGVyRHJhZ0V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgICAgICogU2V0IHRoZSBuZXcgbGF5b3V0IHRvIGJlIHRoZSBsYXlvdXQgaW4gd2hpY2ggdGhlIGNhbGNOZXdTdGF0ZUZ1bmMgd291bGQgYmUgZXhlY3V0ZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBOT1RFOiB1c2luZyB0aGUgbXV0YXRlZCBsYXlvdXQgaXMgdGhlIHdheSB0byBnbyBieSAncmVhY3QtZ3JpZC1sYXlvdXQnIHV0aWxzLiBJZiB3ZSBkb24ndCB1c2UgdGhlIHByZXZpb3VzIGxheW91dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIHNvbWUgdXRpbGl0aWVzIGZyb20gJ3JlYWN0LWdyaWQtbGF5b3V0JyB3b3VsZCBub3Qgd29yayBhcyBleHBlY3RlZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudExheW91dDogS3RkR3JpZExheW91dCA9IG5ld0xheW91dCB8fCB0aGlzLmxheW91dDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qge2xheW91dCwgZHJhZ2dlZEl0ZW1Qb3N9ID0gY2FsY05ld1N0YXRlRnVuYyhncmlkSXRlbS5pZCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxheW91dDogY3VycmVudExheW91dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dIZWlnaHQ6IHRoaXMucm93SGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHM6IHRoaXMuY29scyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2ZW50Q29sbGlzaW9uOiB0aGlzLnByZXZlbnRDb2xsaXNpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMuY29tcGFjdFR5cGUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludGVyRG93bkV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50ZXJEcmFnRXZlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZEVsZW1DbGllbnRSZWN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRyYWdFbGVtQ2xpZW50UmVjdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxEaWZmZXJlbmNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0xheW91dCA9IGxheW91dDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faGVpZ2h0ID0gZ2V0R3JpZEhlaWdodChuZXdMYXlvdXQsIHRoaXMucm93SGVpZ2h0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ3JpZEl0ZW1zUmVuZGVyRGF0YSA9IGxheW91dFRvUmVuZGVySXRlbXMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHM6IHRoaXMuY29scyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dIZWlnaHQ6IHRoaXMucm93SGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxheW91dDogbmV3TGF5b3V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZlbnRDb2xsaXNpb246IHRoaXMucHJldmVudENvbGxpc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGdyaWRFbGVtQ2xpZW50UmVjdC53aWR0aCwgZ3JpZEVsZW1DbGllbnRSZWN0LmhlaWdodCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBsYWNlaG9sZGVyU3R5bGVzID0gcGFyc2VSZW5kZXJJdGVtVG9QaXhlbHModGhpcy5fZ3JpZEl0ZW1zUmVuZGVyRGF0YVtncmlkSXRlbS5pZF0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBQdXQgdGhlIHJlYWwgZmluYWwgcG9zaXRpb24gdG8gdGhlIHBsYWNlaG9sZGVyIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyRWxlbWVudC5zdHlsZS53aWR0aCA9IHBsYWNlaG9sZGVyU3R5bGVzLndpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJFbGVtZW50LnN0eWxlLmhlaWdodCA9IHBsYWNlaG9sZGVyU3R5bGVzLmhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke3BsYWNlaG9sZGVyU3R5bGVzLmxlZnR9KSB0cmFuc2xhdGVZKCR7cGxhY2Vob2xkZXJTdHlsZXMudG9wfSlgO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtb2RpZnkgdGhlIHBvc2l0aW9uIG9mIHRoZSBkcmFnZ2VkIGl0ZW0gdG8gYmUgdGhlIG9uY2Ugd2Ugd2FudCAoZm9yIGV4YW1wbGUgdGhlIG1vdXNlIHBvc2l0aW9uIG9yIHdoYXRldmVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ3JpZEl0ZW1zUmVuZGVyRGF0YVtncmlkSXRlbS5pZF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uZHJhZ2dlZEl0ZW1Qb3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHRoaXMuX2dyaWRJdGVtc1JlbmRlckRhdGFbZ3JpZEl0ZW0uaWRdLmlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAoZXJyb3IpID0+IG9ic2VydmVyLmVycm9yKGVycm9yKSxcbiAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgZHJhZyBjbGFzc2VzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyhncmlkSXRlbS5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICduby10cmFuc2l0aW9ucycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3MoZ3JpZEl0ZW0uZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAna3RkLWdyaWQtaXRlbS1kcmFnZ2luZycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHBsYWNlaG9sZGVyIGVsZW1lbnQgZnJvbSB0aGUgZG9tXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTk9URTogSWYgd2UgZG9uJ3QgcHV0IHRoZSByZW1vdmVDaGlsZCBpbnNpZGUgdGhlIHpvbmUgaXQgd291bGQgbm90IHdvcmsuLi4gVGhpcyBtYXkgYmUgYSBidWcgZnJvbSBhbmd1bGFyIG9yIG1heWJlIGlzIHRoZSBpbnRlbmRlZCBiZWhhdmlvdXIsIGFsdGhvdWdoIHN0cmFuZ2UuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSXQgc2hvdWxkIHdvcmsgc2luY2UgQUZBSUsgdGhpcyBhY3Rpb24gc2hvdWxkIG5vdCBiZSBkb25lIGluIGEgQ0QgY3ljbGUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgcGxhY2Vob2xkZXJFbGVtZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXdMYXlvdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUHJ1bmUgcmVhY3QtZ3JpZC1sYXlvdXQgY29tcGFjdCBleHRyYSBwcm9wZXJ0aWVzLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KG5ld0xheW91dC5tYXAoaXRlbSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGl0ZW0uaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBpdGVtLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBpdGVtLnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3OiBpdGVtLncsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoOiBpdGVtLmhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpIGFzIEt0ZEdyaWRMYXlvdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IE5lZWQgd2UgcmVhbGx5IHRvIGVtaXQgaWYgdGhlcmUgaXMgbm8gbGF5b3V0IGNoYW5nZSBidXQgZHJhZyBzdGFydGVkIGFuZCBlbmRlZD9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh0aGlzLmxheW91dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcblxuXG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNjcm9sbFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfY29sczogTnVtYmVySW5wdXQ7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gICAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3Jvd0hlaWdodDogTnVtYmVySW5wdXQ7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gICAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3Njcm9sbFNwZWVkOiBOdW1iZXJJbnB1dDtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfY29tcGFjdE9uUHJvcHNDaGFuZ2U6IEJvb2xlYW5JbnB1dDtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcHJldmVudENvbGxpc2lvbjogQm9vbGVhbklucHV0O1xufVxuXG4iXX0=