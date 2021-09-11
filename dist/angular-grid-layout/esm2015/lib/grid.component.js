import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { coerceNumberProperty } from './coercion/number-property';
import { KtdGridItemComponent } from './grid-item/grid-item.component';
import { combineLatest, merge, NEVER, Observable, of } from 'rxjs';
import { exhaustMap, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { ktdGridItemDragging, ktdGridItemResizing } from './utils/grid.utils';
import { compact } from './utils/react-grid-layout.utils';
import { GRID_ITEM_GET_RENDER_DATA_TOKEN } from './grid.definitions';
import { ktdMouseOrTouchEnd, ktdPointerClientX, ktdPointerClientY } from './utils/pointer.utils';
import { getMutableClientRect } from './utils/client-rect';
import { ktdGetScrollTotalRelativeDifference$, ktdScrollIfNearElementClientRect$ } from './utils/scroll';
import { coerceBooleanProperty } from './coercion/boolean-property';
import * as i0 from "@angular/core";
import * as i1 from "./grid.service";
const _c0 = ["*"];
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
KtdGridComponent.ɵfac = function KtdGridComponent_Factory(t) { return new (t || KtdGridComponent)(i0.ɵɵdirectiveInject(i1.KtdGridService), i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.NgZone)); };
KtdGridComponent.ɵcmp = i0.ɵɵdefineComponent({ type: KtdGridComponent, selectors: [["ktd-grid"]], contentQueries: function KtdGridComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
        i0.ɵɵcontentQuery(dirIndex, KtdGridItemComponent, true);
    } if (rf & 2) {
        let _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx._gridItems = _t);
    } }, inputs: { scrollableParent: "scrollableParent", compactOnPropsChange: "compactOnPropsChange", preventCollision: "preventCollision", scrollSpeed: "scrollSpeed", compactType: "compactType", rowHeight: "rowHeight", cols: "cols", layout: "layout" }, outputs: { layoutUpdated: "layoutUpdated", dragStarted: "dragStarted", resizeStarted: "resizeStarted", dragEnded: "dragEnded", resizeEnded: "resizeEnded" }, features: [i0.ɵɵProvidersFeature([
            {
                provide: GRID_ITEM_GET_RENDER_DATA_TOKEN,
                useFactory: ktdGridItemGetRenderDataFactoryFunc,
                deps: [KtdGridComponent]
            }
        ]), i0.ɵɵNgOnChangesFeature], ngContentSelectors: _c0, decls: 1, vars: 0, template: function KtdGridComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵprojectionDef();
        i0.ɵɵprojection(0);
    } }, styles: ["ktd-grid{display:block;position:relative;width:100%}ktd-grid ktd-grid-item.ktd-grid-item-dragging{z-index:1000}ktd-grid ktd-grid-item.no-transitions{transition:none!important}ktd-grid .ktd-grid-item-placeholder{background-color:#8b0000;opacity:.6;position:absolute;transition:all .15s ease;transition-property:transform;z-index:0}"], encapsulation: 2, changeDetection: 0 });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(KtdGridComponent, [{
        type: Component,
        args: [{
                selector: 'ktd-grid',
                templateUrl: './grid.component.html',
                styleUrls: ['./grid.component.scss'],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [
                    {
                        provide: GRID_ITEM_GET_RENDER_DATA_TOKEN,
                        useFactory: ktdGridItemGetRenderDataFactoryFunc,
                        deps: [KtdGridComponent]
                    }
                ]
            }]
    }], function () { return [{ type: i1.KtdGridService }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.NgZone }]; }, { _gridItems: [{
            type: ContentChildren,
            args: [KtdGridItemComponent, { descendants: true }]
        }], layoutUpdated: [{
            type: Output
        }], dragStarted: [{
            type: Output
        }], resizeStarted: [{
            type: Output
        }], dragEnded: [{
            type: Output
        }], resizeEnded: [{
            type: Output
        }], scrollableParent: [{
            type: Input
        }], compactOnPropsChange: [{
            type: Input
        }], preventCollision: [{
            type: Input
        }], scrollSpeed: [{
            type: Input
        }], compactType: [{
            type: Input
        }], rowHeight: [{
            type: Input
        }], cols: [{
            type: Input
        }], layout: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1ncmlkLWxheW91dC9zcmMvIiwic291cmNlcyI6WyJsaWIvZ3JpZC5jb21wb25lbnQudHMiLCJsaWIvZ3JpZC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ29DLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQWMsWUFBWSxFQUFFLEtBQUssRUFDaEgsTUFBTSxFQUF1QyxpQkFBaUIsRUFDNUUsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLG9CQUFvQixFQUFlLE1BQU0sNEJBQTRCLENBQUM7QUFDL0UsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDdkUsT0FBTyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBWSxFQUFFLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQzNGLE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDOUUsT0FBTyxFQUFFLE9BQU8sRUFBZSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3ZFLE9BQU8sRUFDSCwrQkFBK0IsRUFFbEMsTUFBTSxvQkFBb0IsQ0FBQztBQUM1QixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsaUJBQWlCLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUdqRyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsb0NBQW9DLEVBQUUsaUNBQWlDLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RyxPQUFPLEVBQWdCLHFCQUFxQixFQUFFLE1BQU0sNkJB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Z0JBQ3hDLFVBQVUsRUFBRSxtQ0FBbUM7Z0JBQy9DLElBQUksRUFBRSxDQUFDLGdCQUFnQixDQUFDO2FBQzNCO1NBQ0o7O1FDbkdMLGtCQUF5Qjs7a0REcUdaLGdCQUFnQjtjQWQ1QixTQUFTO2VBQUM7Z0JBQ1AsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLFdBQVcsRUFBRSx1QkFBdUI7Z0JBQ3BDLFNBQVMsRUFBRSxDQUFDLHVCQUF1QixDQUFDO2dCQUNwQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLFNBQVMsRUFBRTtvQkFDUDt3QkFDSSxPQUFPLEVBQUUsK0JBQStCO3dCQUN4QyxVQUFVLEVBQUUsbUNBQW1DO3dCQUMvQyxJQUFJLEVBQUUsa0JBQWtCO3FCQUMzQjtpQkFDSjthQUNKO3VJQUcrRCxVQUFVO2tCQUFyRSxlQUFlO21CQUFDLG9CQUFvQixFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQztZQUdoRCxhQUFhO2tCQUF0QixNQUFNO1lBR0csV0FBVztrQkFBcEIsTUFBTTtZQUdHLGFBQWE7a0JBQXRCLE1BQU07WUFHRyxTQUFTO2tCQUFsQixNQUFNO1lBR0csV0FBVztrQkFBcEIsTUFBTTtZQU1FLGdCQUFnQjtrQkFBeEIsS0FBSztZQUlGLG9CQUFvQjtrQkFEdkIsS0FBSztZQVdGLGdCQUFnQjtrQkFEbkIsS0FBSztZQVdGLFdBQVc7a0JBRGQsS0FBSztZQVdGLFdBQVc7a0JBRGQsS0FBSztZQWFGLFNBQVM7a0JBRFosS0FBSztZQVdGLElBQUk7a0JBRFAsS0FBSztZQVdGLE1BQU07a0JBRFQsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgQWZ0ZXJDb250ZW50SW5pdCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgQ29udGVudENoaWxkcmVuLCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIElucHV0LCBOZ1pvbmUsIE9uQ2hhbmdlcyxcbiAgICBPbkRlc3Ryb3ksIE91dHB1dCwgUXVlcnlMaXN0LCBSZW5kZXJlcjIsIFNpbXBsZUNoYW5nZXMsIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgY29lcmNlTnVtYmVyUHJvcGVydHksIE51bWJlcklucHV0IH0gZnJvbSAnLi9jb2VyY2lvbi9udW1iZXItcHJvcGVydHknO1xuaW1wb3J0IHsgS3RkR3JpZEl0ZW1Db21wb25lbnQgfSBmcm9tICcuL2dyaWQtaXRlbS9ncmlkLWl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7IGNvbWJpbmVMYXRlc3QsIG1lcmdlLCBORVZFUiwgT2JzZXJ2YWJsZSwgT2JzZXJ2ZXIsIG9mLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGV4aGF1c3RNYXAsIG1hcCwgc3RhcnRXaXRoLCBzd2l0Y2hNYXAsIHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGt0ZEdyaWRJdGVtRHJhZ2dpbmcsIGt0ZEdyaWRJdGVtUmVzaXppbmcgfSBmcm9tICcuL3V0aWxzL2dyaWQudXRpbHMnO1xuaW1wb3J0IHsgY29tcGFjdCwgQ29tcGFjdFR5cGUgfSBmcm9tICcuL3V0aWxzL3JlYWN0LWdyaWQtbGF5b3V0LnV0aWxzJztcbmltcG9ydCB7XG4gICAgR1JJRF9JVEVNX0dFVF9SRU5ERVJfREFUQV9UT0tFTiwgS3RkRHJhZ2dpbmdEYXRhLCBLdGRHcmlkQ2ZnLCBLdGRHcmlkQ29tcGFjdFR5cGUsIEt0ZEdyaWRJdGVtUmVjdCwgS3RkR3JpZEl0ZW1SZW5kZXJEYXRhLCBLdGRHcmlkTGF5b3V0LFxuICAgIEt0ZEdyaWRMYXlvdXRJdGVtXG59IGZyb20gJy4vZ3JpZC5kZWZpbml0aW9ucyc7XG5pbXBvcnQgeyBrdGRNb3VzZU9yVG91Y2hFbmQsIGt0ZFBvaW50ZXJDbGllbnRYLCBrdGRQb2ludGVyQ2xpZW50WSB9IGZyb20gJy4vdXRpbHMvcG9pbnRlci51dGlscyc7XG5pbXBvcnQgeyBLdGREaWN0aW9uYXJ5IH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgS3RkR3JpZFNlcnZpY2UgfSBmcm9tICcuL2dyaWQuc2VydmljZSc7XG5pbXBvcnQgeyBnZXRNdXRhYmxlQ2xpZW50UmVjdCB9IGZyb20gJy4vdXRpbHMvY2xpZW50LXJlY3QnO1xuaW1wb3J0IHsga3RkR2V0U2Nyb2xsVG90YWxSZWxhdGl2ZURpZmZlcmVuY2UkLCBrdGRTY3JvbGxJZk5lYXJFbGVtZW50Q2xpZW50UmVjdCQgfSBmcm9tICcuL3V0aWxzL3Njcm9sbCc7XG5pbXBvcnQgeyBCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSB9IGZyb20gJy4vY29lcmNpb24vYm9vbGVhbi1wcm9wZXJ0eSc7XG5cbmludGVyZmFjZSBLdGREcmFnUmVzaXplRXZlbnQge1xuICAgIGxheW91dDogS3RkR3JpZExheW91dDtcbiAgICBsYXlvdXRJdGVtOiBLdGRHcmlkTGF5b3V0SXRlbTtcbiAgICBncmlkSXRlbVJlZjogS3RkR3JpZEl0ZW1Db21wb25lbnQ7XG59XG5cbmV4cG9ydCB0eXBlIEt0ZERyYWdTdGFydCA9IEt0ZERyYWdSZXNpemVFdmVudDtcbmV4cG9ydCB0eXBlIEt0ZFJlc2l6ZVN0YXJ0ID0gS3RkRHJhZ1Jlc2l6ZUV2ZW50O1xuZXhwb3J0IHR5cGUgS3RkRHJhZ0VuZCA9IEt0ZERyYWdSZXNpemVFdmVudDtcbmV4cG9ydCB0eXBlIEt0ZFJlc2l6ZUVuZCA9IEt0ZERyYWdSZXNpemVFdmVudDtcblxuZnVuY3Rpb24gZ2V0RHJhZ1Jlc2l6ZUV2ZW50RGF0YShncmlkSXRlbTogS3RkR3JpZEl0ZW1Db21wb25lbnQsIGxheW91dDogS3RkR3JpZExheW91dCk6IEt0ZERyYWdSZXNpemVFdmVudCB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbGF5b3V0LFxuICAgICAgICBsYXlvdXRJdGVtOiBsYXlvdXQuZmluZCgoaXRlbSkgPT4gaXRlbS5pZCA9PT0gZ3JpZEl0ZW0uaWQpISxcbiAgICAgICAgZ3JpZEl0ZW1SZWY6IGdyaWRJdGVtXG4gICAgfTtcbn1cblxuXG5mdW5jdGlvbiBsYXlvdXRUb1JlbmRlckl0ZW1zKGNvbmZpZzogS3RkR3JpZENmZywgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiBLdGREaWN0aW9uYXJ5PEt0ZEdyaWRJdGVtUmVuZGVyRGF0YTxudW1iZXI+PiB7XG4gICAgY29uc3Qge2NvbHMsIHJvd0hlaWdodCwgbGF5b3V0fSA9IGNvbmZpZztcblxuICAgIGNvbnN0IHJlbmRlckl0ZW1zOiBLdGREaWN0aW9uYXJ5PEt0ZEdyaWRJdGVtUmVuZGVyRGF0YTxudW1iZXI+PiA9IHt9O1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBsYXlvdXQpIHtcbiAgICAgICAgcmVuZGVySXRlbXNbaXRlbS5pZF0gPSB7XG4gICAgICAgICAgICBpZDogaXRlbS5pZCxcbiAgICAgICAgICAgIHRvcDogaXRlbS55ID09PSAwID8gMCA6IGl0ZW0ueSAqIHJvd0hlaWdodCxcbiAgICAgICAgICAgIGxlZnQ6IGl0ZW0ueCAqICh3aWR0aCAvIGNvbHMpLFxuICAgICAgICAgICAgd2lkdGg6IGl0ZW0udyAqICh3aWR0aCAvIGNvbHMpLFxuICAgICAgICAgICAgaGVpZ2h0OiBpdGVtLmggKiByb3dIZWlnaHRcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHJlbmRlckl0ZW1zO1xufVxuXG5mdW5jdGlvbiBnZXRHcmlkSGVpZ2h0KGxheW91dDogS3RkR3JpZExheW91dCwgcm93SGVpZ2h0OiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiBsYXlvdXQucmVkdWNlKChhY2MsIGN1cikgPT4gTWF0aC5tYXgoYWNjLCAoY3VyLnkgKyBjdXIuaCkgKiByb3dIZWlnaHQpLCAwKTtcbn1cblxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VSZW5kZXJJdGVtVG9QaXhlbHMocmVuZGVySXRlbTogS3RkR3JpZEl0ZW1SZW5kZXJEYXRhPG51bWJlcj4pOiBLdGRHcmlkSXRlbVJlbmRlckRhdGE8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IHJlbmRlckl0ZW0uaWQsXG4gICAgICAgIHRvcDogYCR7cmVuZGVySXRlbS50b3B9cHhgLFxuICAgICAgICBsZWZ0OiBgJHtyZW5kZXJJdGVtLmxlZnR9cHhgLFxuICAgICAgICB3aWR0aDogYCR7cmVuZGVySXRlbS53aWR0aH1weGAsXG4gICAgICAgIGhlaWdodDogYCR7cmVuZGVySXRlbS5oZWlnaHR9cHhgXG4gICAgfTtcbn1cblxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmt0ZC1wcmVmaXgtY29kZVxuZXhwb3J0IGZ1bmN0aW9uIF9fZ3JpZEl0ZW1HZXRSZW5kZXJEYXRhRmFjdG9yeUZ1bmMoZ3JpZENtcDogS3RkR3JpZENvbXBvbmVudCkge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpvbmx5LWFycm93LWZ1bmN0aW9uc1xuICAgIHJldHVybiBmdW5jdGlvbihpZDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBwYXJzZVJlbmRlckl0ZW1Ub1BpeGVscyhncmlkQ21wLmdldEl0ZW1SZW5kZXJEYXRhKGlkKSk7XG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGt0ZEdyaWRJdGVtR2V0UmVuZGVyRGF0YUZhY3RvcnlGdW5jKGdyaWRDbXA6IEt0ZEdyaWRDb21wb25lbnQpIHtcbiAgICAvLyBXb3JrYXJvdW5kIGV4cGxhaW5lZDogaHR0cHM6Ly9naXRodWIuY29tL25nLXBhY2thZ3IvbmctcGFja2Fnci9pc3N1ZXMvNjk2I2lzc3VlY29tbWVudC0zODcxMTQ2MTNcbiAgICBjb25zdCByZXN1bHRGdW5jID0gX19ncmlkSXRlbUdldFJlbmRlckRhdGFGYWN0b3J5RnVuYyhncmlkQ21wKTtcbiAgICByZXR1cm4gcmVzdWx0RnVuYztcbn1cblxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2t0ZC1ncmlkJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vZ3JpZC5jb21wb25lbnQuaHRtbCcsXG4gICAgc3R5bGVVcmxzOiBbJy4vZ3JpZC5jb21wb25lbnQuc2NzcyddLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHByb3ZpZGU6IEdSSURfSVRFTV9HRVRfUkVOREVSX0RBVEFfVE9LRU4sXG4gICAgICAgICAgICB1c2VGYWN0b3J5OiBrdGRHcmlkSXRlbUdldFJlbmRlckRhdGFGYWN0b3J5RnVuYyxcbiAgICAgICAgICAgIGRlcHM6IFtLdGRHcmlkQ29tcG9uZW50XVxuICAgICAgICB9XG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBLdGRHcmlkQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBBZnRlckNvbnRlbnRJbml0LCBBZnRlckNvbnRlbnRDaGVja2VkLCBPbkRlc3Ryb3kge1xuICAgIC8qKiBRdWVyeSBsaXN0IG9mIGdyaWQgaXRlbXMgdGhhdCBhcmUgYmVpbmcgcmVuZGVyZWQuICovXG4gICAgQENvbnRlbnRDaGlsZHJlbihLdGRHcmlkSXRlbUNvbXBvbmVudCwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2dyaWRJdGVtczogUXVlcnlMaXN0PEt0ZEdyaWRJdGVtQ29tcG9uZW50PjtcblxuICAgIC8qKiBFbWl0cyB3aGVuIGxheW91dCBjaGFuZ2UgKi9cbiAgICBAT3V0cHV0KCkgbGF5b3V0VXBkYXRlZDogRXZlbnRFbWl0dGVyPEt0ZEdyaWRMYXlvdXQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxLdGRHcmlkTGF5b3V0PigpO1xuXG4gICAgLyoqIEVtaXRzIHdoZW4gZHJhZyBzdGFydHMgKi9cbiAgICBAT3V0cHV0KCkgZHJhZ1N0YXJ0ZWQ6IEV2ZW50RW1pdHRlcjxLdGREcmFnU3RhcnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxLdGREcmFnU3RhcnQ+KCk7XG5cbiAgICAvKiogRW1pdHMgd2hlbiByZXNpemUgc3RhcnRzICovXG4gICAgQE91dHB1dCgpIHJlc2l6ZVN0YXJ0ZWQ6IEV2ZW50RW1pdHRlcjxLdGRSZXNpemVTdGFydD4gPSBuZXcgRXZlbnRFbWl0dGVyPEt0ZFJlc2l6ZVN0YXJ0PigpO1xuXG4gICAgLyoqIEVtaXRzIHdoZW4gZHJhZyBlbmRzICovXG4gICAgQE91dHB1dCgpIGRyYWdFbmRlZDogRXZlbnRFbWl0dGVyPEt0ZERyYWdFbmQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxLdGREcmFnRW5kPigpO1xuXG4gICAgLyoqIEVtaXRzIHdoZW4gcmVzaXplIGVuZHMgKi9cbiAgICBAT3V0cHV0KCkgcmVzaXplRW5kZWQ6IEV2ZW50RW1pdHRlcjxLdGRSZXNpemVFbmQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxLdGRSZXNpemVFbmQ+KCk7XG5cbiAgICAvKipcbiAgICAgKiBQYXJlbnQgZWxlbWVudCB0aGF0IGNvbnRhaW5zIHRoZSBzY3JvbGwuIElmIGFuIHN0cmluZyBpcyBwcm92aWRlZCBpdCB3b3VsZCBzZWFyY2ggdGhhdCBlbGVtZW50IGJ5IGlkIG9uIHRoZSBkb20uXG4gICAgICogSWYgbm8gZGF0YSBwcm92aWRlZCBvciBudWxsIGF1dG9zY3JvbGwgaXMgbm90IHBlcmZvcm1lZC5cbiAgICAgKi9cbiAgICBASW5wdXQoKSBzY3JvbGxhYmxlUGFyZW50OiBIVE1MRWxlbWVudCB8IERvY3VtZW50IHwgc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgICAvKiogV2hldGhlciBvciBub3QgdG8gdXBkYXRlIHRoZSBpbnRlcm5hbCBsYXlvdXQgd2hlbiBzb21lIGRlcGVuZGVudCBwcm9wZXJ0eSBjaGFuZ2UuICovXG4gICAgQElucHV0KClcbiAgICBnZXQgY29tcGFjdE9uUHJvcHNDaGFuZ2UoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9jb21wYWN0T25Qcm9wc0NoYW5nZTsgfVxuXG4gICAgc2V0IGNvbXBhY3RPblByb3BzQ2hhbmdlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2NvbXBhY3RPblByb3BzQ2hhbmdlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9jb21wYWN0T25Qcm9wc0NoYW5nZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgICAvKiogSWYgdHJ1ZSwgZ3JpZCBpdGVtcyB3b24ndCBjaGFuZ2UgcG9zaXRpb24gd2hlbiBiZWluZyBkcmFnZ2VkIG92ZXIuIEhhbmR5IHdoZW4gdXNpbmcgbm8gY29tcGFjdGlvbiAqL1xuICAgIEBJbnB1dCgpXG4gICAgZ2V0IHByZXZlbnRDb2xsaXNpb24oKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9wcmV2ZW50Q29sbGlzaW9uOyB9XG5cbiAgICBzZXQgcHJldmVudENvbGxpc2lvbih2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9wcmV2ZW50Q29sbGlzaW9uID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9wcmV2ZW50Q29sbGlzaW9uOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAvKiogTnVtYmVyIG9mIENTUyBwaXhlbHMgdGhhdCB3b3VsZCBiZSBzY3JvbGxlZCBvbiBlYWNoICd0aWNrJyB3aGVuIGF1dG8gc2Nyb2xsIGlzIHBlcmZvcm1lZC4gKi9cbiAgICBASW5wdXQoKVxuICAgIGdldCBzY3JvbGxTcGVlZCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fc2Nyb2xsU3BlZWQ7IH1cblxuICAgIHNldCBzY3JvbGxTcGVlZCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX3Njcm9sbFNwZWVkID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUsIDIpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3Njcm9sbFNwZWVkOiBudW1iZXIgPSAyO1xuXG4gICAgLyoqIFR5cGUgb2YgY29tcGFjdGlvbiB0aGF0IHdpbGwgYmUgYXBwbGllZCB0byB0aGUgbGF5b3V0ICh2ZXJ0aWNhbCwgaG9yaXpvbnRhbCBvciBmcmVlKS4gRGVmYXVsdHMgdG8gJ3ZlcnRpY2FsJyAqL1xuICAgIEBJbnB1dCgpXG4gICAgZ2V0IGNvbXBhY3RUeXBlKCk6IEt0ZEdyaWRDb21wYWN0VHlwZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb21wYWN0VHlwZTtcbiAgICB9XG5cbiAgICBzZXQgY29tcGFjdFR5cGUodmFsOiBLdGRHcmlkQ29tcGFjdFR5cGUpIHtcbiAgICAgICAgdGhpcy5fY29tcGFjdFR5cGUgPSB2YWw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfY29tcGFjdFR5cGU6IEt0ZEdyaWRDb21wYWN0VHlwZSA9ICd2ZXJ0aWNhbCc7XG5cbiAgICAvKiogUm93IGhlaWdodCBpbiBjc3MgcGl4ZWxzICovXG4gICAgQElucHV0KClcbiAgICBnZXQgcm93SGVpZ2h0KCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9yb3dIZWlnaHQ7IH1cblxuICAgIHNldCByb3dIZWlnaHQodmFsOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fcm93SGVpZ2h0ID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZChjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWwpKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcm93SGVpZ2h0OiBudW1iZXIgPSAxMDA7XG5cbiAgICAvKiogTnVtYmVyIG9mIGNvbHVtbnMgICovXG4gICAgQElucHV0KClcbiAgICBnZXQgY29scygpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fY29sczsgfVxuXG4gICAgc2V0IGNvbHModmFsOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fY29scyA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQoY29lcmNlTnVtYmVyUHJvcGVydHkodmFsKSkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2NvbHM6IG51bWJlciA9IDY7XG5cbiAgICAvKiogTGF5b3V0IG9mIHRoZSBncmlkLiBBcnJheSBvZiBhbGwgdGhlIGdyaWQgaXRlbXMgd2l0aCBpdHMgJ2lkJyBhbmQgcG9zaXRpb24gb24gdGhlIGdyaWQuICovXG4gICAgQElucHV0KClcbiAgICBnZXQgbGF5b3V0KCk6IEt0ZEdyaWRMYXlvdXQgeyByZXR1cm4gdGhpcy5fbGF5b3V0OyB9XG5cbiAgICBzZXQgbGF5b3V0KGxheW91dDogS3RkR3JpZExheW91dCkge1xuICAgICAgICAvKipcbiAgICAgICAgICogRW5oYW5jZW1lbnQ6XG4gICAgICAgICAqIE9ubHkgc2V0IGxheW91dCBpZiBpdCdzIHJlZmVyZW5jZSBoYXMgY2hhbmdlZCBhbmQgdXNlIGEgYm9vbGVhbiB0byB0cmFjayB3aGVuZXZlciByZWNhbGN1bGF0ZSB0aGUgbGF5b3V0IG9uIG5nT25DaGFuZ2VzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBXaHk6XG4gICAgICAgICAqIFRoZSBub3JtYWwgdXNlIG9mIHRoaXMgbGliIGlzIGhhdmluZyB0aGUgdmFyaWFibGUgbGF5b3V0IGluIHRoZSBvdXRlciBjb21wb25lbnQgb3IgaW4gYSBzdG9yZSwgYXNzaWduaW5nIGl0IHdoZW5ldmVyIGl0IGNoYW5nZXMgYW5kXG4gICAgICAgICAqIGJpbmRlZCBpbiB0aGUgY29tcG9uZW50IHdpdGggaXQncyBpbnB1dCBbbGF5b3V0XS4gSW4gdGhpcyBzY2VuYXJpbywgd2Ugd291bGQgYWx3YXlzIGNhbGN1bGF0ZSBvbmUgdW5uZWNlc3NhcnkgY2hhbmdlIG9uIHRoZSBsYXlvdXQgd2hlblxuICAgICAgICAgKiBpdCBpcyByZS1iaW5kZWQgb24gdGhlIGlucHV0LlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fbGF5b3V0ID0gbGF5b3V0O1xuICAgIH1cblxuICAgIHByaXZhdGUgX2xheW91dDogS3RkR3JpZExheW91dDtcblxuICAgIGdldCBjb25maWcoKTogS3RkR3JpZENmZyB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb2xzOiB0aGlzLmNvbHMsXG4gICAgICAgICAgICByb3dIZWlnaHQ6IHRoaXMucm93SGVpZ2h0LFxuICAgICAgICAgICAgbGF5b3V0OiB0aGlzLmxheW91dCxcbiAgICAgICAgICAgIHByZXZlbnRDb2xsaXNpb246IHRoaXMucHJldmVudENvbGxpc2lvbixcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKiogVG90YWwgaGVpZ2h0IG9mIHRoZSBncmlkICovXG4gICAgcHJpdmF0ZSBfaGVpZ2h0OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBfZ3JpZEl0ZW1zUmVuZGVyRGF0YTogS3RkRGljdGlvbmFyeTxLdGRHcmlkSXRlbVJlbmRlckRhdGE8bnVtYmVyPj47XG4gICAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZ3JpZFNlcnZpY2U6IEt0ZEdyaWRTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSkge1xuXG4gICAgfVxuXG4gICAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgICAgICBsZXQgbmVlZHNDb21wYWN0TGF5b3V0ID0gZmFsc2U7XG4gICAgICAgIGxldCBuZWVkc1JlY2FsY3VsYXRlUmVuZGVyRGF0YSA9IGZhbHNlO1xuXG4gICAgICAgIC8vIFRPRE86IERvZXMgZmlzdCBjaGFuZ2UgbmVlZCB0byBiZSBjb21wYWN0ZWQgYnkgZGVmYXVsdD9cbiAgICAgICAgLy8gQ29tcGFjdCBsYXlvdXQgd2hlbmV2ZXIgc29tZSBkZXBlbmRlbnQgcHJvcCBjaGFuZ2VzLlxuICAgICAgICBpZiAoY2hhbmdlcy5jb21wYWN0VHlwZSB8fCBjaGFuZ2VzLmNvbHMgfHwgY2hhbmdlcy5sYXlvdXQpIHtcbiAgICAgICAgICAgIG5lZWRzQ29tcGFjdExheW91dCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBpZiB3ZWUgbmVlZCB0byByZWNhbGN1bGF0ZSByZW5kZXJpbmcgZGF0YS5cbiAgICAgICAgaWYgKG5lZWRzQ29tcGFjdExheW91dCB8fCBjaGFuZ2VzLnJvd0hlaWdodCkge1xuICAgICAgICAgICAgbmVlZHNSZWNhbGN1bGF0ZVJlbmRlckRhdGEgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gT25seSBjb21wYWN0IGxheW91dCBpZiBsaWIgdXNlciBoYXMgcHJvdmlkZWQgaXQuIExpYiB1c2VycyB0aGF0IHdhbnQgdG8gc2F2ZS9zdG9yZSBhbHdheXMgdGhlIHNhbWUgbGF5b3V0ICBhcyBpdCBpcyByZXByZXNlbnRlZCAoY29tcGFjdGVkKVxuICAgICAgICAvLyBjYW4gdXNlIEt0ZENvbXBhY3RHcmlkIHV0aWxpdHkgYW5kIHByZS1jb21wYWN0IHRoZSBsYXlvdXQuIFRoaXMgaXMgdGhlIHJlY29tbWVuZGVkIGJlaGF2aW91ciBmb3IgYWx3YXlzIGhhdmluZyBhIHRoZSBzYW1lIGxheW91dCBvbiB0aGlzIGNvbXBvbmVudFxuICAgICAgICAvLyBhbmQgdGhlIG9uZXMgdGhhdCB1c2VzIGl0LlxuICAgICAgICBpZiAobmVlZHNDb21wYWN0TGF5b3V0ICYmIHRoaXMuY29tcGFjdE9uUHJvcHNDaGFuZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcGFjdExheW91dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5lZWRzUmVjYWxjdWxhdGVSZW5kZXJEYXRhKSB7XG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZVJlbmRlckRhdGEoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy5pbml0U3Vic2NyaXB0aW9ucygpO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG5cbiAgICByZXNpemUoKSB7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlUmVuZGVyRGF0YSgpO1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWIgPT4gc3ViLnVuc3Vic2NyaWJlKCkpO1xuICAgIH1cblxuICAgIGNvbXBhY3RMYXlvdXQoKSB7XG4gICAgICAgIHRoaXMubGF5b3V0ID0gY29tcGFjdCh0aGlzLmxheW91dCwgdGhpcy5jb21wYWN0VHlwZSwgdGhpcy5jb2xzKTtcbiAgICB9XG5cbiAgICBnZXRJdGVtc1JlbmRlckRhdGEoKTogS3RkRGljdGlvbmFyeTxLdGRHcmlkSXRlbVJlbmRlckRhdGE8bnVtYmVyPj4ge1xuICAgICAgICByZXR1cm4gey4uLnRoaXMuX2dyaWRJdGVtc1JlbmRlckRhdGF9O1xuICAgIH1cblxuICAgIGdldEl0ZW1SZW5kZXJEYXRhKGl0ZW1JZDogc3RyaW5nKTogS3RkR3JpZEl0ZW1SZW5kZXJEYXRhPG51bWJlcj4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ3JpZEl0ZW1zUmVuZGVyRGF0YVtpdGVtSWRdO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZVJlbmRlckRhdGEoKSB7XG4gICAgICAgIGNvbnN0IGNsaWVudFJlY3QgPSAodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB0aGlzLl9ncmlkSXRlbXNSZW5kZXJEYXRhID0gbGF5b3V0VG9SZW5kZXJJdGVtcyh0aGlzLmNvbmZpZywgY2xpZW50UmVjdC53aWR0aCwgY2xpZW50UmVjdC5oZWlnaHQpO1xuICAgICAgICB0aGlzLl9oZWlnaHQgPSBnZXRHcmlkSGVpZ2h0KHRoaXMubGF5b3V0LCB0aGlzLnJvd0hlaWdodCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnaGVpZ2h0JywgYCR7dGhpcy5faGVpZ2h0fXB4YCk7XG4gICAgICAgIHRoaXMudXBkYXRlR3JpZEl0ZW1zU3R5bGVzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVHcmlkSXRlbXNTdHlsZXMoKSB7XG4gICAgICAgIHRoaXMuX2dyaWRJdGVtcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgY29uc3QgZ3JpZEl0ZW1SZW5kZXJEYXRhOiBLdGRHcmlkSXRlbVJlbmRlckRhdGE8bnVtYmVyPiB8IHVuZGVmaW5lZCA9IHRoaXMuX2dyaWRJdGVtc1JlbmRlckRhdGFbaXRlbS5pZF07XG4gICAgICAgICAgICBpZiAoZ3JpZEl0ZW1SZW5kZXJEYXRhID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBDb3VsZG5cXCd0IGZpbmQgdGhlIHNwZWNpZmllZCBncmlkIGl0ZW0gZm9yIHRoZSBpZDogJHtpdGVtLmlkfWApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpdGVtLnNldFN0eWxlcyhwYXJzZVJlbmRlckl0ZW1Ub1BpeGVscyhncmlkSXRlbVJlbmRlckRhdGEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0U3Vic2NyaXB0aW9ucygpIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zID0gW1xuICAgICAgICAgICAgdGhpcy5fZ3JpZEl0ZW1zLmNoYW5nZXMucGlwZShcbiAgICAgICAgICAgICAgICBzdGFydFdpdGgodGhpcy5fZ3JpZEl0ZW1zKSxcbiAgICAgICAgICAgICAgICBzd2l0Y2hNYXAoKGdyaWRJdGVtczogUXVlcnlMaXN0PEt0ZEdyaWRJdGVtQ29tcG9uZW50PikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWVyZ2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5ncmlkSXRlbXMubWFwKChncmlkSXRlbSkgPT4gZ3JpZEl0ZW0uZHJhZ1N0YXJ0JC5waXBlKG1hcCgoZXZlbnQpID0+ICh7ZXZlbnQsIGdyaWRJdGVtLCB0eXBlOiAnZHJhZyd9KSkpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLmdyaWRJdGVtcy5tYXAoKGdyaWRJdGVtKSA9PiBncmlkSXRlbS5yZXNpemVTdGFydCQucGlwZShtYXAoKGV2ZW50KSA9PiAoe2V2ZW50LCBncmlkSXRlbSwgdHlwZTogJ3Jlc2l6ZSd9KSkpKSxcbiAgICAgICAgICAgICAgICAgICAgKS5waXBlKGV4aGF1c3RNYXAoKHtldmVudCwgZ3JpZEl0ZW0sIHR5cGV9KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBFbWl0IGRyYWcgb3IgcmVzaXplIHN0YXJ0IGV2ZW50cy4gRW5zdXJlIHRoYXQgaXMgc3RhcnQgZXZlbnQgaXMgaW5zaWRlIHRoZSB6b25lLlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+ICh0eXBlID09PSAnZHJhZycgPyB0aGlzLmRyYWdTdGFydGVkIDogdGhpcy5yZXNpemVTdGFydGVkKS5lbWl0KGdldERyYWdSZXNpemVFdmVudERhdGEoZ3JpZEl0ZW0sIHRoaXMubGF5b3V0KSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBjb3JyZWN0IG5ld1N0YXRlRnVuYyBkZXBlbmRpbmcgb24gaWYgd2UgYXJlIGRyYWdnaW5nIG9yIHJlc2l6aW5nXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjYWxjTmV3U3RhdGVGdW5jID0gdHlwZSA9PT0gJ2RyYWcnID8ga3RkR3JpZEl0ZW1EcmFnZ2luZyA6IGt0ZEdyaWRJdGVtUmVzaXppbmc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBlcmZvcm0gZHJhZyBzZXF1ZW5jZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGVyZm9ybURyYWdTZXF1ZW5jZSQoZ3JpZEl0ZW0sIGV2ZW50LCAoZ3JpZEl0ZW1JZCwgY29uZmlnLCBjb21wYWN0aW9uVHlwZSwgZHJhZ2dpbmdEYXRhKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGNOZXdTdGF0ZUZ1bmMoZ3JpZEl0ZW1JZCwgY29uZmlnLCBjb21wYWN0aW9uVHlwZSwgZHJhZ2dpbmdEYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgKS5waXBlKG1hcCgobGF5b3V0KSA9PiAoe2xheW91dCwgZ3JpZEl0ZW0sIHR5cGV9KSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKS5zdWJzY3JpYmUoKHtsYXlvdXQsIGdyaWRJdGVtLCB0eXBlfSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubGF5b3V0ID0gbGF5b3V0O1xuICAgICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBuZXcgcmVuZGVyaW5nIGRhdGEgZ2l2ZW4gdGhlIG5ldyBsYXlvdXQuXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVSZW5kZXJEYXRhKCk7XG4gICAgICAgICAgICAgICAgLy8gRW1pdCBkcmFnIG9yIHJlc2l6ZSBlbmQgZXZlbnRzLlxuICAgICAgICAgICAgICAgICh0eXBlID09PSAnZHJhZycgPyB0aGlzLmRyYWdFbmRlZCA6IHRoaXMucmVzaXplRW5kZWQpLmVtaXQoZ2V0RHJhZ1Jlc2l6ZUV2ZW50RGF0YShncmlkSXRlbSwgbGF5b3V0KSk7XG4gICAgICAgICAgICAgICAgLy8gTm90aWZ5IHRoYXQgdGhlIGxheW91dCBoYXMgYmVlbiB1cGRhdGVkLlxuICAgICAgICAgICAgICAgIHRoaXMubGF5b3V0VXBkYXRlZC5lbWl0KGxheW91dCk7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGVyZm9ybSBhIGdlbmVyYWwgZ3JpZCBkcmFnIGFjdGlvbiwgZnJvbSBzdGFydCB0byBlbmQuIEEgZ2VuZXJhbCBncmlkIGRyYWcgYWN0aW9uIGJhc2ljYWxseSBpbmNsdWRlcyBjcmVhdGluZyB0aGUgcGxhY2Vob2xkZXIgZWxlbWVudCBhbmQgYWRkaW5nXG4gICAgICogc29tZSBjbGFzcyBhbmltYXRpb25zLiBjYWxjTmV3U3RhdGVGdW5jIG5lZWRzIHRvIGJlIHByb3ZpZGVkIGluIG9yZGVyIHRvIGNhbGN1bGF0ZSB0aGUgbmV3IHN0YXRlIG9mIHRoZSBsYXlvdXQuXG4gICAgICogQHBhcmFtIGdyaWRJdGVtIHRoYXQgaXMgYmVlbiBkcmFnZ2VkXG4gICAgICogQHBhcmFtIHBvaW50ZXJEb3duRXZlbnQgZXZlbnQgKG1vdXNlZG93biBvciB0b3VjaGRvd24pIHdoZXJlIHRoZSB1c2VyIGluaXRpYXRlZCB0aGUgZHJhZ1xuICAgICAqIEBwYXJhbSBjYWxjTmV3U3RhdGVGdW5jIGZ1bmN0aW9uIHRoYXQgcmV0dXJuIHRoZSBuZXcgbGF5b3V0IHN0YXRlIGFuZCB0aGUgZHJhZyBlbGVtZW50IHBvc2l0aW9uXG4gICAgICovXG4gICAgcHJpdmF0ZSBwZXJmb3JtRHJhZ1NlcXVlbmNlJChncmlkSXRlbTogS3RkR3JpZEl0ZW1Db21wb25lbnQsIHBvaW50ZXJEb3duRXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsY05ld1N0YXRlRnVuYzogKGdyaWRJdGVtSWQ6IHN0cmluZywgY29uZmlnOiBLdGRHcmlkQ2ZnLCBjb21wYWN0aW9uVHlwZTogQ29tcGFjdFR5cGUsIGRyYWdnaW5nRGF0YTogS3RkRHJhZ2dpbmdEYXRhKSA9PiB7IGxheW91dDogS3RkR3JpZExheW91dEl0ZW1bXTsgZHJhZ2dlZEl0ZW1Qb3M6IEt0ZEdyaWRJdGVtUmVjdCB9KTogT2JzZXJ2YWJsZTxLdGRHcmlkTGF5b3V0PiB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPEt0ZEdyaWRMYXlvdXQ+KChvYnNlcnZlcjogT2JzZXJ2ZXI8S3RkR3JpZExheW91dD4pID0+IHtcbiAgICAgICAgICAgIC8vIFJldHJpZXZlIGdyaWQgKHBhcmVudCkgYW5kIGdyaWRJdGVtIChkcmFnZ2VkRWxlbSkgY2xpZW50IHJlY3RzLlxuICAgICAgICAgICAgY29uc3QgZ3JpZEVsZW1DbGllbnRSZWN0OiBDbGllbnRSZWN0ID0gZ2V0TXV0YWJsZUNsaWVudFJlY3QodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpO1xuICAgICAgICAgICAgY29uc3QgZHJhZ0VsZW1DbGllbnRSZWN0OiBDbGllbnRSZWN0ID0gZ2V0TXV0YWJsZUNsaWVudFJlY3QoZ3JpZEl0ZW0uZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50KTtcblxuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsYWJsZVBhcmVudCA9IHR5cGVvZiB0aGlzLnNjcm9sbGFibGVQYXJlbnQgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5zY3JvbGxhYmxlUGFyZW50KSA6IHRoaXMuc2Nyb2xsYWJsZVBhcmVudDtcblxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhncmlkSXRlbS5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICduby10cmFuc2l0aW9ucycpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhncmlkSXRlbS5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdrdGQtZ3JpZC1pdGVtLWRyYWdnaW5nJyk7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSBwbGFjZWhvbGRlciBlbGVtZW50LiBUaGlzIGVsZW1lbnQgd291bGQgcmVwcmVzZW50IHRoZSBwb3NpdGlvbiB3aGVyZSB0aGUgZHJhZ2dlZC9yZXNpemVkIGVsZW1lbnQgd291bGQgYmUgaWYgdGhlIGFjdGlvbiBlbmRzXG4gICAgICAgICAgICBjb25zdCBwbGFjZWhvbGRlckVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyRWxlbWVudC5zdHlsZS53aWR0aCA9IGAke2RyYWdFbGVtQ2xpZW50UmVjdC53aWR0aH1weGA7XG4gICAgICAgICAgICBwbGFjZWhvbGRlckVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7ZHJhZ0VsZW1DbGllbnRSZWN0LmhlaWdodH1weGA7XG4gICAgICAgICAgICBwbGFjZWhvbGRlckVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHtkcmFnRWxlbUNsaWVudFJlY3QubGVmdCAtIGdyaWRFbGVtQ2xpZW50UmVjdC5sZWZ0fXB4KSB0cmFuc2xhdGVZKCR7ZHJhZ0VsZW1DbGllbnRSZWN0LnRvcCAtIGdyaWRFbGVtQ2xpZW50UmVjdC50b3B9cHgpYDtcblxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhwbGFjZWhvbGRlckVsZW1lbnQsICdrdGQtZ3JpZC1pdGVtLXBsYWNlaG9sZGVyJyk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCBwbGFjZWhvbGRlckVsZW1lbnQpO1xuXG4gICAgICAgICAgICBsZXQgbmV3TGF5b3V0OiBLdGRHcmlkTGF5b3V0SXRlbVtdO1xuXG4gICAgICAgICAgICAvLyBUT0RPIChlbmhhbmNlbWVudCk6IGNvbnNpZGVyIG1vdmUgdGhpcyAnc2lkZSBlZmZlY3QnIG9ic2VydmFibGUgaW5zaWRlIHRoZSBtYWluIGRyYWcgbG9vcC5cbiAgICAgICAgICAgIC8vICAtIFByb3MgYXJlIHRoYXQgd2Ugd291bGQgbm90IHJlcGVhdCBzdWJzY3JpcHRpb25zIGFuZCB0YWtlVW50aWwgd291bGQgc2h1dCBkb3duIG9ic2VydmFibGVzIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAgICAgICAgICAvLyAgLSBDb25zIGFyZSB0aGF0IG1vdmluZyB0aGlzIGZ1bmN0aW9uYWxpdHkgYXMgYSBzaWRlIGVmZmVjdCBpbnNpZGUgdGhlIG1haW4gZHJhZyBsb29wIHdvdWxkIGJlIGNvbmZ1c2luZy5cbiAgICAgICAgICAgIGNvbnN0IHNjcm9sbFN1YnNjcmlwdGlvbiA9IHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+XG4gICAgICAgICAgICAgICAgKCFzY3JvbGxhYmxlUGFyZW50ID8gTkVWRVIgOiB0aGlzLmdyaWRTZXJ2aWNlLm1vdXNlT3JUb3VjaE1vdmUkKGRvY3VtZW50KS5waXBlKFxuICAgICAgICAgICAgICAgICAgICBtYXAoKGV2ZW50KSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRlclg6IGt0ZFBvaW50ZXJDbGllbnRYKGV2ZW50KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50ZXJZOiBrdGRQb2ludGVyQ2xpZW50WShldmVudClcbiAgICAgICAgICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgICAgICAgICBrdGRTY3JvbGxJZk5lYXJFbGVtZW50Q2xpZW50UmVjdCQoc2Nyb2xsYWJsZVBhcmVudCwge3Njcm9sbFN0ZXA6IHRoaXMuc2Nyb2xsU3BlZWR9KVxuICAgICAgICAgICAgICAgICkpLnBpcGUoXG4gICAgICAgICAgICAgICAgICAgIHRha2VVbnRpbChrdGRNb3VzZU9yVG91Y2hFbmQoZG9jdW1lbnQpKVxuICAgICAgICAgICAgICAgICkuc3Vic2NyaWJlKCkpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1haW4gc3Vic2NyaXB0aW9uLCBpdCBsaXN0ZW5zIGZvciAncG9pbnRlciBtb3ZlJyBhbmQgJ3Njcm9sbCcgZXZlbnRzIGFuZCByZWNhbGN1bGF0ZXMgdGhlIGxheW91dCBvbiBlYWNoIGVtaXNzaW9uXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+XG4gICAgICAgICAgICAgICAgbWVyZ2UoXG4gICAgICAgICAgICAgICAgICAgIGNvbWJpbmVMYXRlc3QoW1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmlkU2VydmljZS5tb3VzZU9yVG91Y2hNb3ZlJChkb2N1bWVudCksXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi4oIXNjcm9sbGFibGVQYXJlbnQgPyBbb2Yoe3RvcDogMCwgbGVmdDogMH0pXSA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrdGRHZXRTY3JvbGxUb3RhbFJlbGF0aXZlRGlmZmVyZW5jZSQoc2Nyb2xsYWJsZVBhcmVudCkucGlwZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRXaXRoKHt0b3A6IDAsIGxlZnQ6IDB9KSAvLyBGb3JjZSBmaXJzdCBlbWlzc2lvbiB0byBhbGxvdyBDb21iaW5lTGF0ZXN0IHRvIGVtaXQgZXZlbiBubyBzY3JvbGwgZXZlbnQgaGFzIG9jY3VycmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgICApLnBpcGUoXG4gICAgICAgICAgICAgICAgICAgIHRha2VVbnRpbChrdGRNb3VzZU9yVG91Y2hFbmQoZG9jdW1lbnQpKSxcbiAgICAgICAgICAgICAgICApLnN1YnNjcmliZSgoW3BvaW50ZXJEcmFnRXZlbnQsIHNjcm9sbERpZmZlcmVuY2VdOiBbTW91c2VFdmVudCB8IFRvdWNoRXZlbnQsIHsgdG9wOiBudW1iZXIsIGxlZnQ6IG51bWJlciB9XSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRlckRyYWdFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIFNldCB0aGUgbmV3IGxheW91dCB0byBiZSB0aGUgbGF5b3V0IGluIHdoaWNoIHRoZSBjYWxjTmV3U3RhdGVGdW5jIHdvdWxkIGJlIGV4ZWN1dGVkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICogTk9URTogdXNpbmcgdGhlIG11dGF0ZWQgbGF5b3V0IGlzIHRoZSB3YXkgdG8gZ28gYnkgJ3JlYWN0LWdyaWQtbGF5b3V0JyB1dGlscy4gSWYgd2UgZG9uJ3QgdXNlIHRoZSBwcmV2aW91cyBsYXlvdXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBzb21lIHV0aWxpdGllcyBmcm9tICdyZWFjdC1ncmlkLWxheW91dCcgd291bGQgbm90IHdvcmsgYXMgZXhwZWN0ZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRMYXlvdXQ6IEt0ZEdyaWRMYXlvdXQgPSBuZXdMYXlvdXQgfHwgdGhpcy5sYXlvdXQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHtsYXlvdXQsIGRyYWdnZWRJdGVtUG9zfSA9IGNhbGNOZXdTdGF0ZUZ1bmMoZ3JpZEl0ZW0uaWQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXlvdXQ6IGN1cnJlbnRMYXlvdXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93SGVpZ2h0OiB0aGlzLnJvd0hlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xzOiB0aGlzLmNvbHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldmVudENvbGxpc2lvbjogdGhpcy5wcmV2ZW50Q29sbGlzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzLmNvbXBhY3RUeXBlLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRlckRvd25FdmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludGVyRHJhZ0V2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyaWRFbGVtQ2xpZW50UmVjdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkcmFnRWxlbUNsaWVudFJlY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsRGlmZmVyZW5jZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdMYXlvdXQgPSBsYXlvdXQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2hlaWdodCA9IGdldEdyaWRIZWlnaHQobmV3TGF5b3V0LCB0aGlzLnJvd0hlaWdodCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2dyaWRJdGVtc1JlbmRlckRhdGEgPSBsYXlvdXRUb1JlbmRlckl0ZW1zKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xzOiB0aGlzLmNvbHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93SGVpZ2h0OiB0aGlzLnJvd0hlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXlvdXQ6IG5ld0xheW91dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2ZW50Q29sbGlzaW9uOiB0aGlzLnByZXZlbnRDb2xsaXNpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBncmlkRWxlbUNsaWVudFJlY3Qud2lkdGgsIGdyaWRFbGVtQ2xpZW50UmVjdC5oZWlnaHQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwbGFjZWhvbGRlclN0eWxlcyA9IHBhcnNlUmVuZGVySXRlbVRvUGl4ZWxzKHRoaXMuX2dyaWRJdGVtc1JlbmRlckRhdGFbZ3JpZEl0ZW0uaWRdKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUHV0IHRoZSByZWFsIGZpbmFsIHBvc2l0aW9uIHRvIHRoZSBwbGFjZWhvbGRlciBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlckVsZW1lbnQuc3R5bGUud2lkdGggPSBwbGFjZWhvbGRlclN0eWxlcy53aWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBwbGFjZWhvbGRlclN0eWxlcy5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlckVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHtwbGFjZWhvbGRlclN0eWxlcy5sZWZ0fSkgdHJhbnNsYXRlWSgke3BsYWNlaG9sZGVyU3R5bGVzLnRvcH0pYDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbW9kaWZ5IHRoZSBwb3NpdGlvbiBvZiB0aGUgZHJhZ2dlZCBpdGVtIHRvIGJlIHRoZSBvbmNlIHdlIHdhbnQgKGZvciBleGFtcGxlIHRoZSBtb3VzZSBwb3NpdGlvbiBvciB3aGF0ZXZlcilcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2dyaWRJdGVtc1JlbmRlckRhdGFbZ3JpZEl0ZW0uaWRdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmRyYWdnZWRJdGVtUG9zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiB0aGlzLl9ncmlkSXRlbXNSZW5kZXJEYXRhW2dyaWRJdGVtLmlkXS5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiBvYnNlcnZlci5lcnJvcihlcnJvciksXG4gICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGRyYWcgY2xhc3Nlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3MoZ3JpZEl0ZW0uZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnbm8tdHJhbnNpdGlvbnMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKGdyaWRJdGVtLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2t0ZC1ncmlkLWl0ZW0tZHJhZ2dpbmcnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBwbGFjZWhvbGRlciBlbGVtZW50IGZyb20gdGhlIGRvbVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5PVEU6IElmIHdlIGRvbid0IHB1dCB0aGUgcmVtb3ZlQ2hpbGQgaW5zaWRlIHRoZSB6b25lIGl0IHdvdWxkIG5vdCB3b3JrLi4uIFRoaXMgbWF5IGJlIGEgYnVnIGZyb20gYW5ndWxhciBvciBtYXliZSBpcyB0aGUgaW50ZW5kZWQgYmVoYXZpb3VyLCBhbHRob3VnaCBzdHJhbmdlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEl0IHNob3VsZCB3b3JrIHNpbmNlIEFGQUlLIHRoaXMgYWN0aW9uIHNob3VsZCBub3QgYmUgZG9uZSBpbiBhIENEIGN5Y2xlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHBsYWNlaG9sZGVyRWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3TGF5b3V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFBydW5lIHJlYWN0LWdyaWQtbGF5b3V0IGNvbXBhY3QgZXh0cmEgcHJvcGVydGllcy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dChuZXdMYXlvdXQubWFwKGl0ZW0gPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBpdGVtLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogaXRlbS54LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogaXRlbS55LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdzogaXRlbS53LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaDogaXRlbS5oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKSBhcyBLdGRHcmlkTGF5b3V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiBOZWVkIHdlIHJlYWxseSB0byBlbWl0IGlmIHRoZXJlIGlzIG5vIGxheW91dCBjaGFuZ2UgYnV0IGRyYWcgc3RhcnRlZCBhbmQgZW5kZWQ/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLm5leHQodGhpcy5sYXlvdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9KSk7XG5cblxuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBzY3JvbGxTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gICAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2NvbHM6IE51bWJlcklucHV0O1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICAgIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yb3dIZWlnaHQ6IE51bWJlcklucHV0O1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICAgIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9zY3JvbGxTcGVlZDogTnVtYmVySW5wdXQ7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gICAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2NvbXBhY3RPblByb3BzQ2hhbmdlOiBCb29sZWFuSW5wdXQ7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gICAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3ByZXZlbnRDb2xsaXNpb246IEJvb2xlYW5JbnB1dDtcbn1cblxuIiwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuIl19