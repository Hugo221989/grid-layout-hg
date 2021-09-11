import { ChangeDetectionStrategy, Component, ContentChildren, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { BehaviorSubject, iif, merge, NEVER, Subject } from 'rxjs';
import { exhaustMap, filter, map, startWith, switchMap, take, takeUntil } from 'rxjs/operators';
import { ktdMouseOrTouchDown, ktdMouseOrTouchEnd, ktdPointerClient } from '../utils/pointer.utils';
import { GRID_ITEM_GET_RENDER_DATA_TOKEN } from '../grid.definitions';
import { KTD_GRID_DRAG_HANDLE } from '../directives/drag-handle';
import { KTD_GRID_RESIZE_HANDLE } from '../directives/resize-handle';
import { ktdOutsideZone } from '../utils/operators';
import { coerceBooleanProperty } from '../coercion/boolean-property';
import { coerceNumberProperty } from '../coercion/number-property';
import * as i0 from "@angular/core";
import * as i1 from "../grid.service";
const _c0 = ["resizeElem"];
const _c1 = ["*"];
export class KtdGridItemComponent {
    constructor(elementRef, gridService, renderer, ngZone, getItemRenderData) {
        this.elementRef = elementRef;
        this.gridService = gridService;
        this.renderer = renderer;
        this.ngZone = ngZone;
        this.getItemRenderData = getItemRenderData;
        /** CSS transition style. Note that for more performance is preferable only make transition on transform property. */
        this.transition = 'transform 500ms ease, width 500ms ease, height 500ms ease';
        this._dragStartThreshold = 0;
        this._draggable = true;
        this._draggable$ = new BehaviorSubject(this._draggable);
        this._resizable = true;
        this._resizable$ = new BehaviorSubject(this._resizable);
        this.dragStartSubject = new Subject();
        this.resizeStartSubject = new Subject();
        this.subscriptions = [];
        this.dragStart$ = this.dragStartSubject.asObservable();
        this.resizeStart$ = this.resizeStartSubject.asObservable();
    }
    /** Id of the grid item. This property is strictly compulsory. */
    get id() {
        return this._id;
    }
    set id(val) {
        this._id = val;
    }
    /** Minimum amount of pixels that the user should move before it starts the drag sequence. */
    get dragStartThreshold() { return this._dragStartThreshold; }
    set dragStartThreshold(val) {
        this._dragStartThreshold = coerceNumberProperty(val);
    }
    /** Whether the item is draggable or not. Defaults to true. */
    get draggable() {
        return this._draggable;
    }
    set draggable(val) {
        this._draggable = coerceBooleanProperty(val);
        this._draggable$.next(this._draggable);
    }
    /** Whether the item is resizable or not. Defaults to true. */
    get resizable() {
        return this._resizable;
    }
    set resizable(val) {
        this._resizable = coerceBooleanProperty(val);
        this._resizable$.next(this._resizable);
    }
    ngOnInit() {
        const gridItemRenderData = this.getItemRenderData(this.id);
        this.setStyles(gridItemRenderData);
    }
    ngAfterContentInit() {
        this.subscriptions.push(this._dragStart$().subscribe(this.dragStartSubject), this._resizeStart$().subscribe(this.resizeStartSubject));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    setStyles({ top, left, width, height }) {
        // transform is 6x times faster than top/left
        this.renderer.setStyle(this.elementRef.nativeElement, 'transform', `translateX(${left}) translateY(${top})`);
        this.renderer.setStyle(this.elementRef.nativeElement, 'display', `block`);
        this.renderer.setStyle(this.elementRef.nativeElement, 'transition', this.transition);
        if (width != null) {
            this.renderer.setStyle(this.elementRef.nativeElement, 'width', width);
        }
        if (height != null) {
            this.renderer.setStyle(this.elementRef.nativeElement, 'height', height);
        }
    }
    _dragStart$() {
        return this._draggable$.pipe(switchMap((draggable) => {
            if (!draggable) {
                return NEVER;
            }
            else {
                return this._dragHandles.changes.pipe(startWith(this._dragHandles), switchMap((dragHandles) => {
                    return iif(() => dragHandles.length > 0, merge(...dragHandles.toArray().map(dragHandle => ktdMouseOrTouchDown(dragHandle.element.nativeElement, 1))), ktdMouseOrTouchDown(this.elementRef.nativeElement, 1)).pipe(exhaustMap((startEvent) => {
                        // If the event started from an element with the native HTML drag&drop, it'll interfere
                        // with our own dragging (e.g. `img` tags do it by default). Prevent the default action
                        // to stop it from happening. Note that preventing on `dragstart` also seems to work, but
                        // it's flaky and it fails if the user drags it away quickly. Also note that we only want
                        // to do this for `mousedown` since doing the same for `touchstart` will stop any `click`
                        // events from firing on touch devices.
                        if (startEvent.target && startEvent.target.draggable && startEvent.type === 'mousedown') {
                            startEvent.preventDefault();
                        }
                        const startPointer = ktdPointerClient(startEvent);
                        return this.gridService.mouseOrTouchMove$(document).pipe(takeUntil(ktdMouseOrTouchEnd(document, 1)), ktdOutsideZone(this.ngZone), filter((moveEvent) => {
                            moveEvent.preventDefault();
                            const movePointer = ktdPointerClient(moveEvent);
                            const distanceX = Math.abs(startPointer.clientX - movePointer.clientX);
                            const distanceY = Math.abs(startPointer.clientY - movePointer.clientY);
                            // When this conditions returns true mean that we are over threshold.
                            return distanceX + distanceY >= this.dragStartThreshold;
                        }), take(1), 
                        // Return the original start event
                        map(() => startEvent));
                    }));
                }));
            }
        }));
    }
    _resizeStart$() {
        return this._resizable$.pipe(switchMap((resizable) => {
            if (!resizable) {
                // Side effect to hide the resizeElem if resize is disabled.
                this.renderer.setStyle(this.resizeElem.nativeElement, 'display', 'none');
                return NEVER;
            }
            else {
                return this._resizeHandles.changes.pipe(startWith(this._resizeHandles), switchMap((resizeHandles) => {
                    if (resizeHandles.length > 0) {
                        // Side effect to hide the resizeElem if there are resize handles.
                        this.renderer.setStyle(this.resizeElem.nativeElement, 'display', 'none');
                        return merge(...resizeHandles.toArray().map(resizeHandle => ktdMouseOrTouchDown(resizeHandle.element.nativeElement, 1)));
                    }
                    else {
                        this.renderer.setStyle(this.resizeElem.nativeElement, 'display', 'block');
                        return ktdMouseOrTouchDown(this.resizeElem.nativeElement, 1);
                    }
                }));
            }
        }));
    }
}
KtdGridItemComponent.ɵfac = function KtdGridItemComponent_Factory(t) { return new (t || KtdGridItemComponent)(i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i1.KtdGridService), i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.NgZone), i0.ɵɵdirectiveInject(GRID_ITEM_GET_RENDER_DATA_TOKEN)); };
KtdGridItemComponent.ɵcmp = i0.ɵɵdefineComponent({ type: KtdGridItemComponent, selectors: [["ktd-grid-item"]], contentQueries: function KtdGridItemComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
        i0.ɵɵcontentQuery(dirIndex, KTD_GRID_DRAG_HANDLE, true);
        i0.ɵɵcontentQuery(dirIndex, KTD_GRID_RESIZE_HANDLE, true);
    } if (rf & 2) {
        let _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx._dragHandles = _t);
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx._resizeHandles = _t);
    } }, viewQuery: function KtdGridItemComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵstaticViewQuery(_c0, true, ElementRef);
    } if (rf & 2) {
        let _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.resizeElem = _t.first);
    } }, inputs: { transition: "transition", id: "id", dragStartThreshold: "dragStartThreshold", draggable: "draggable", resizable: "resizable" }, ngContentSelectors: _c1, decls: 3, vars: 0, consts: [[1, "grid-item-resize-icon"], ["resizeElem", ""]], template: function KtdGridItemComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵprojectionDef();
        i0.ɵɵprojection(0);
        i0.ɵɵelement(1, "div", 0, 1);
    } }, styles: ["[_nghost-%COMP%]{display:none;overflow:hidden;z-index:1}[_nghost-%COMP%], [_nghost-%COMP%]   div[_ngcontent-%COMP%]{position:absolute}[_nghost-%COMP%]   div[_ngcontent-%COMP%]{-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;user-select:none;z-index:10}[_nghost-%COMP%]   div.grid-item-resize-icon[_ngcontent-%COMP%]{bottom:0;color:inherit;cursor:se-resize;height:20px;right:0;width:20px}[_nghost-%COMP%]   div.grid-item-resize-icon[_ngcontent-%COMP%]:after{border-bottom:2px solid;border-right:2px solid;bottom:3px;content:\"\";height:5px;position:absolute;right:3px;width:5px}.display-none[_ngcontent-%COMP%]{display:none!important}"], changeDetection: 0 });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(KtdGridItemComponent, [{
        type: Component,
        args: [{
                selector: 'ktd-grid-item',
                templateUrl: './grid-item.component.html',
                styleUrls: ['./grid-item.component.scss'],
                changeDetection: ChangeDetectionStrategy.OnPush
            }]
    }], function () { return [{ type: i0.ElementRef }, { type: i1.KtdGridService }, { type: i0.Renderer2 }, { type: i0.NgZone }, { type: undefined, decorators: [{
                type: Inject,
                args: [GRID_ITEM_GET_RENDER_DATA_TOKEN]
            }] }]; }, { _dragHandles: [{
            type: ContentChildren,
            args: [KTD_GRID_DRAG_HANDLE, { descendants: true }]
        }], _resizeHandles: [{
            type: ContentChildren,
            args: [KTD_GRID_RESIZE_HANDLE, { descendants: true }]
        }], resizeElem: [{
            type: ViewChild,
            args: ['resizeElem', { static: true, read: ElementRef }]
        }], transition: [{
            type: Input
        }], id: [{
            type: Input
        }], dragStartThreshold: [{
            type: Input
        }], draggable: [{
            type: Input
        }], resizable: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1pdGVtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWdyaWQtbGF5b3V0L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9ncmlkLWl0ZW0vZ3JpZC1pdGVtLmNvbXBvbmVudC50cyIsImxpYi9ncmlkLWl0ZW0vZ3JpZC1pdGVtLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDZSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUNoRyxTQUFTLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGVBQWUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBYyxPQUFPLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQzdGLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNuRyxPQUFPLEVBQUUsK0JBQStCLEVBQWtDLE1BQU0scUJBQXFCLENBQUM7QUFDdEcsT0FBTyxFQUFFLG9CQUFvQixFQUFxQixNQUFNLDJCQUEyQixDQUFDO0FBQ3BGLE9BQU8sRUFBRSxzQkFBc0IsRUFBdUIsTUFBTSw2QkFBNkIsQ0FBQztBQUUxRixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDcEQsT0FBTyxFQUFnQixxQkFBcUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ25GLE9BQU8sRUFBRSxvQkFBb0IsRUFBZSxNQUFNLDZCQUE2QixDQUFDOzs7OztBQVFoRixNQUFNLE9BQU8sb0JBQW9CO0lBb0U3QixZQUFtQixVQUFzQixFQUNyQixX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QUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBQztZQUdoRCxVQUFVO2tCQUFsQixLQUFLO1lBT0YsRUFBRTtrQkFETCxLQUFLO1lBYUYsa0JBQWtCO2tCQURyQixLQUFLO1lBWUYsU0FBUztrQkFEWixLQUFLO1lBZUYsU0FBUztrQkFEWixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBBZnRlckNvbnRlbnRJbml0LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBDb250ZW50Q2hpbGRyZW4sIEVsZW1lbnRSZWYsIEluamVjdCwgSW5wdXQsIE5nWm9uZSwgT25EZXN0cm95LCBPbkluaXQsIFF1ZXJ5TGlzdCwgUmVuZGVyZXIyLFxuICAgIFZpZXdDaGlsZFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgaWlmLCBtZXJnZSwgTkVWRVIsIE9ic2VydmFibGUsIFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZXhoYXVzdE1hcCwgZmlsdGVyLCBtYXAsIHN0YXJ0V2l0aCwgc3dpdGNoTWFwLCB0YWtlLCB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBrdGRNb3VzZU9yVG91Y2hEb3duLCBrdGRNb3VzZU9yVG91Y2hFbmQsIGt0ZFBvaW50ZXJDbGllbnQgfSBmcm9tICcuLi91dGlscy9wb2ludGVyLnV0aWxzJztcbmltcG9ydCB7IEdSSURfSVRFTV9HRVRfUkVOREVSX0RBVEFfVE9LRU4sIEt0ZEdyaWRJdGVtUmVuZGVyRGF0YVRva2VuVHlwZSB9IGZyb20gJy4uL2dyaWQuZGVmaW5pdGlvbnMnO1xuaW1wb3J0IHsgS1REX0dSSURfRFJBR19IQU5ETEUsIEt0ZEdyaWREcmFnSGFuZGxlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9kcmFnLWhhbmRsZSc7XG5pbXBvcnQgeyBLVERfR1JJRF9SRVNJWkVfSEFORExFLCBLdGRHcmlkUmVzaXplSGFuZGxlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9yZXNpemUtaGFuZGxlJztcbmltcG9ydCB7IEt0ZEdyaWRTZXJ2aWNlIH0gZnJvbSAnLi4vZ3JpZC5zZXJ2aWNlJztcbmltcG9ydCB7IGt0ZE91dHNpZGVab25lIH0gZnJvbSAnLi4vdXRpbHMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEJvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5IH0gZnJvbSAnLi4vY29lcmNpb24vYm9vbGVhbi1wcm9wZXJ0eSc7XG5pbXBvcnQgeyBjb2VyY2VOdW1iZXJQcm9wZXJ0eSwgTnVtYmVySW5wdXQgfSBmcm9tICcuLi9jb2VyY2lvbi9udW1iZXItcHJvcGVydHknO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ2t0ZC1ncmlkLWl0ZW0nLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9ncmlkLWl0ZW0uY29tcG9uZW50Lmh0bWwnLFxuICAgIHN0eWxlVXJsczogWycuL2dyaWQtaXRlbS5jb21wb25lbnQuc2NzcyddLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIEt0ZEdyaWRJdGVtQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIEFmdGVyQ29udGVudEluaXQge1xuICAgIC8qKiBFbGVtZW50cyB0aGF0IGNhbiBiZSB1c2VkIHRvIGRyYWcgdGhlIGdyaWQgaXRlbS4gKi9cbiAgICBAQ29udGVudENoaWxkcmVuKEtURF9HUklEX0RSQUdfSEFORExFLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfZHJhZ0hhbmRsZXM6IFF1ZXJ5TGlzdDxLdGRHcmlkRHJhZ0hhbmRsZT47XG4gICAgQENvbnRlbnRDaGlsZHJlbihLVERfR1JJRF9SRVNJWkVfSEFORExFLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfcmVzaXplSGFuZGxlczogUXVlcnlMaXN0PEt0ZEdyaWRSZXNpemVIYW5kbGU+O1xuICAgIEBWaWV3Q2hpbGQoJ3Jlc2l6ZUVsZW0nLCB7c3RhdGljOiB0cnVlLCByZWFkOiBFbGVtZW50UmVmfSkgcmVzaXplRWxlbTogRWxlbWVudFJlZjtcblxuICAgIC8qKiBDU1MgdHJhbnNpdGlvbiBzdHlsZS4gTm90ZSB0aGF0IGZvciBtb3JlIHBlcmZvcm1hbmNlIGlzIHByZWZlcmFibGUgb25seSBtYWtlIHRyYW5zaXRpb24gb24gdHJhbnNmb3JtIHByb3BlcnR5LiAqL1xuICAgIEBJbnB1dCgpIHRyYW5zaXRpb246IHN0cmluZyA9ICd0cmFuc2Zvcm0gNTAwbXMgZWFzZSwgd2lkdGggNTAwbXMgZWFzZSwgaGVpZ2h0IDUwMG1zIGVhc2UnO1xuXG4gICAgZHJhZ1N0YXJ0JDogT2JzZXJ2YWJsZTxNb3VzZUV2ZW50IHwgVG91Y2hFdmVudD47XG4gICAgcmVzaXplU3RhcnQkOiBPYnNlcnZhYmxlPE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50PjtcblxuICAgIC8qKiBJZCBvZiB0aGUgZ3JpZCBpdGVtLiBUaGlzIHByb3BlcnR5IGlzIHN0cmljdGx5IGNvbXB1bHNvcnkuICovXG4gICAgQElucHV0KClcbiAgICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lkO1xuICAgIH1cblxuICAgIHNldCBpZCh2YWw6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9pZCA9IHZhbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9pZDogc3RyaW5nO1xuXG4gICAgLyoqIE1pbmltdW0gYW1vdW50IG9mIHBpeGVscyB0aGF0IHRoZSB1c2VyIHNob3VsZCBtb3ZlIGJlZm9yZSBpdCBzdGFydHMgdGhlIGRyYWcgc2VxdWVuY2UuICovXG4gICAgQElucHV0KClcbiAgICBnZXQgZHJhZ1N0YXJ0VGhyZXNob2xkKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9kcmFnU3RhcnRUaHJlc2hvbGQ7IH1cblxuICAgIHNldCBkcmFnU3RhcnRUaHJlc2hvbGQodmFsOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fZHJhZ1N0YXJ0VGhyZXNob2xkID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9kcmFnU3RhcnRUaHJlc2hvbGQ6IG51bWJlciA9IDA7XG5cblxuICAgIC8qKiBXaGV0aGVyIHRoZSBpdGVtIGlzIGRyYWdnYWJsZSBvciBub3QuIERlZmF1bHRzIHRvIHRydWUuICovXG4gICAgQElucHV0KClcbiAgICBnZXQgZHJhZ2dhYmxlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fZHJhZ2dhYmxlO1xuICAgIH1cblxuICAgIHNldCBkcmFnZ2FibGUodmFsOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2RyYWdnYWJsZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWwpO1xuICAgICAgICB0aGlzLl9kcmFnZ2FibGUkLm5leHQodGhpcy5fZHJhZ2dhYmxlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9kcmFnZ2FibGU6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHByaXZhdGUgX2RyYWdnYWJsZSQ6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4odGhpcy5fZHJhZ2dhYmxlKTtcblxuICAgIC8qKiBXaGV0aGVyIHRoZSBpdGVtIGlzIHJlc2l6YWJsZSBvciBub3QuIERlZmF1bHRzIHRvIHRydWUuICovXG4gICAgQElucHV0KClcbiAgICBnZXQgcmVzaXphYmxlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzaXphYmxlO1xuICAgIH1cblxuICAgIHNldCByZXNpemFibGUodmFsOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX3Jlc2l6YWJsZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWwpO1xuICAgICAgICB0aGlzLl9yZXNpemFibGUkLm5leHQodGhpcy5fcmVzaXphYmxlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9yZXNpemFibGU6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHByaXZhdGUgX3Jlc2l6YWJsZSQ6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4odGhpcy5fcmVzaXphYmxlKTtcblxuICAgIHByaXZhdGUgZHJhZ1N0YXJ0U3ViamVjdDogU3ViamVjdDxNb3VzZUV2ZW50IHwgVG91Y2hFdmVudD4gPSBuZXcgU3ViamVjdDxNb3VzZUV2ZW50IHwgVG91Y2hFdmVudD4oKTtcbiAgICBwcml2YXRlIHJlc2l6ZVN0YXJ0U3ViamVjdDogU3ViamVjdDxNb3VzZUV2ZW50IHwgVG91Y2hFdmVudD4gPSBuZXcgU3ViamVjdDxNb3VzZUV2ZW50IHwgVG91Y2hFdmVudD4oKTtcblxuICAgIHByaXZhdGUgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgZ3JpZFNlcnZpY2U6IEt0ZEdyaWRTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgICAgICAgICAgICBwcml2YXRlIG5nWm9uZTogTmdab25lLFxuICAgICAgICAgICAgICAgIEBJbmplY3QoR1JJRF9JVEVNX0dFVF9SRU5ERVJfREFUQV9UT0tFTikgcHJpdmF0ZSBnZXRJdGVtUmVuZGVyRGF0YTogS3RkR3JpZEl0ZW1SZW5kZXJEYXRhVG9rZW5UeXBlKSB7XG4gICAgICAgIHRoaXMuZHJhZ1N0YXJ0JCA9IHRoaXMuZHJhZ1N0YXJ0U3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgICAgICAgdGhpcy5yZXNpemVTdGFydCQgPSB0aGlzLnJlc2l6ZVN0YXJ0U3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgY29uc3QgZ3JpZEl0ZW1SZW5kZXJEYXRhID0gdGhpcy5nZXRJdGVtUmVuZGVyRGF0YSh0aGlzLmlkKSE7XG4gICAgICAgIHRoaXMuc2V0U3R5bGVzKGdyaWRJdGVtUmVuZGVyRGF0YSk7XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgICAgIHRoaXMuX2RyYWdTdGFydCQoKS5zdWJzY3JpYmUodGhpcy5kcmFnU3RhcnRTdWJqZWN0KSxcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZVN0YXJ0JCgpLnN1YnNjcmliZSh0aGlzLnJlc2l6ZVN0YXJ0U3ViamVjdCksXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gICAgfVxuXG4gICAgc2V0U3R5bGVzKHt0b3AsIGxlZnQsIHdpZHRoLCBoZWlnaHR9OiB7IHRvcDogc3RyaW5nLCBsZWZ0OiBzdHJpbmcsIHdpZHRoPzogc3RyaW5nLCBoZWlnaHQ/OiBzdHJpbmcgfSkge1xuICAgICAgICAvLyB0cmFuc2Zvcm0gaXMgNnggdGltZXMgZmFzdGVyIHRoYW4gdG9wL2xlZnRcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGVYKCR7bGVmdH0pIHRyYW5zbGF0ZVkoJHt0b3B9KWApO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzcGxheScsIGBibG9ja2ApO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAndHJhbnNpdGlvbicsIHRoaXMudHJhbnNpdGlvbik7XG4gICAgICAgIGlmICh3aWR0aCAhPSBudWxsKSB7IHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICd3aWR0aCcsIHdpZHRoKTsgfVxuICAgICAgICBpZiAoaGVpZ2h0ICE9IG51bGwpIHt0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnaGVpZ2h0JywgaGVpZ2h0KTsgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX2RyYWdTdGFydCQoKTogT2JzZXJ2YWJsZTxNb3VzZUV2ZW50IHwgVG91Y2hFdmVudD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fZHJhZ2dhYmxlJC5waXBlKFxuICAgICAgICAgICAgc3dpdGNoTWFwKChkcmFnZ2FibGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWRyYWdnYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTkVWRVI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RyYWdIYW5kbGVzLmNoYW5nZXMucGlwZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0V2l0aCh0aGlzLl9kcmFnSGFuZGxlcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2hNYXAoKGRyYWdIYW5kbGVzOiBRdWVyeUxpc3Q8S3RkR3JpZERyYWdIYW5kbGU+KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlpZihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCkgPT4gZHJhZ0hhbmRsZXMubGVuZ3RoID4gMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2UoLi4uZHJhZ0hhbmRsZXMudG9BcnJheSgpLm1hcChkcmFnSGFuZGxlID0+IGt0ZE1vdXNlT3JUb3VjaERvd24oZHJhZ0hhbmRsZS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIDEpKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGt0ZE1vdXNlT3JUb3VjaERvd24odGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIDEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKS5waXBlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGhhdXN0TWFwKChzdGFydEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgZXZlbnQgc3RhcnRlZCBmcm9tIGFuIGVsZW1lbnQgd2l0aCB0aGUgbmF0aXZlIEhUTUwgZHJhZyZkcm9wLCBpdCdsbCBpbnRlcmZlcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdpdGggb3VyIG93biBkcmFnZ2luZyAoZS5nLiBgaW1nYCB0YWdzIGRvIGl0IGJ5IGRlZmF1bHQpLiBQcmV2ZW50IHRoZSBkZWZhdWx0IGFjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG8gc3RvcCBpdCBmcm9tIGhhcHBlbmluZy4gTm90ZSB0aGF0IHByZXZlbnRpbmcgb24gYGRyYWdzdGFydGAgYWxzbyBzZWVtcyB0byB3b3JrLCBidXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0J3MgZmxha3kgYW5kIGl0IGZhaWxzIGlmIHRoZSB1c2VyIGRyYWdzIGl0IGF3YXkgcXVpY2tseS4gQWxzbyBub3RlIHRoYXQgd2Ugb25seSB3YW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0byBkbyB0aGlzIGZvciBgbW91c2Vkb3duYCBzaW5jZSBkb2luZyB0aGUgc2FtZSBmb3IgYHRvdWNoc3RhcnRgIHdpbGwgc3RvcCBhbnkgYGNsaWNrYFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXZlbnRzIGZyb20gZmlyaW5nIG9uIHRvdWNoIGRldmljZXMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRFdmVudC50YXJnZXQgJiYgKHN0YXJ0RXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5kcmFnZ2FibGUgJiYgc3RhcnRFdmVudC50eXBlID09PSAnbW91c2Vkb3duJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0RXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhcnRQb2ludGVyID0ga3RkUG9pbnRlckNsaWVudChzdGFydEV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdyaWRTZXJ2aWNlLm1vdXNlT3JUb3VjaE1vdmUkKGRvY3VtZW50KS5waXBlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRha2VVbnRpbChrdGRNb3VzZU9yVG91Y2hFbmQoZG9jdW1lbnQsIDEpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrdGRPdXRzaWRlWm9uZSh0aGlzLm5nWm9uZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyKChtb3ZlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW92ZUV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vdmVQb2ludGVyID0ga3RkUG9pbnRlckNsaWVudChtb3ZlRXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZVggPSBNYXRoLmFicyhzdGFydFBvaW50ZXIuY2xpZW50WCAtIG1vdmVQb2ludGVyLmNsaWVudFgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZVkgPSBNYXRoLmFicyhzdGFydFBvaW50ZXIuY2xpZW50WSAtIG1vdmVQb2ludGVyLmNsaWVudFkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXaGVuIHRoaXMgY29uZGl0aW9ucyByZXR1cm5zIHRydWUgbWVhbiB0aGF0IHdlIGFyZSBvdmVyIHRocmVzaG9sZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRpc3RhbmNlWCArIGRpc3RhbmNlWSA+PSB0aGlzLmRyYWdTdGFydFRocmVzaG9sZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWtlKDEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJldHVybiB0aGUgb3JpZ2luYWwgc3RhcnQgZXZlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXAoKCkgPT4gc3RhcnRFdmVudClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9yZXNpemVTdGFydCQoKTogT2JzZXJ2YWJsZTxNb3VzZUV2ZW50IHwgVG91Y2hFdmVudD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzaXphYmxlJC5waXBlKFxuICAgICAgICAgICAgc3dpdGNoTWFwKChyZXNpemFibGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXJlc2l6YWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTaWRlIGVmZmVjdCB0byBoaWRlIHRoZSByZXNpemVFbGVtIGlmIHJlc2l6ZSBpcyBkaXNhYmxlZC5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLnJlc2l6ZUVsZW0ubmF0aXZlRWxlbWVudCwgJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTkVWRVI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc2l6ZUhhbmRsZXMuY2hhbmdlcy5waXBlKFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRXaXRoKHRoaXMuX3Jlc2l6ZUhhbmRsZXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoTWFwKChyZXNpemVIYW5kbGVzOiBRdWVyeUxpc3Q8S3RkR3JpZFJlc2l6ZUhhbmRsZT4pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzaXplSGFuZGxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNpZGUgZWZmZWN0IHRvIGhpZGUgdGhlIHJlc2l6ZUVsZW0gaWYgdGhlcmUgYXJlIHJlc2l6ZSBoYW5kbGVzLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMucmVzaXplRWxlbS5uYXRpdmVFbGVtZW50LCAnZGlzcGxheScsICdub25lJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBtZXJnZSguLi5yZXNpemVIYW5kbGVzLnRvQXJyYXkoKS5tYXAocmVzaXplSGFuZGxlID0+IGt0ZE1vdXNlT3JUb3VjaERvd24ocmVzaXplSGFuZGxlLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgMSkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMucmVzaXplRWxlbS5uYXRpdmVFbGVtZW50LCAnZGlzcGxheScsICdibG9jaycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ga3RkTW91c2VPclRvdWNoRG93bih0aGlzLnJlc2l6ZUVsZW0ubmF0aXZlRWxlbWVudCwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH1cblxuXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gICAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2RyYWdnYWJsZTogQm9vbGVhbklucHV0O1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICAgIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yZXNpemFibGU6IEJvb2xlYW5JbnB1dDtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZHJhZ1N0YXJ0VGhyZXNob2xkOiBOdW1iZXJJbnB1dDtcblxufVxuIiwiPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuPGRpdiAjcmVzaXplRWxlbSBjbGFzcz1cImdyaWQtaXRlbS1yZXNpemUtaWNvblwiPjwvZGl2PlxuIl19