import { Directive, InjectionToken } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Injection token that can be used to reference instances of `KtdGridDragHandle`. It serves as
 * alternative token to the actual `KtdGridDragHandle` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const KTD_GRID_DRAG_HANDLE = new InjectionToken('KtdGridDragHandle');
/** Handle that can be used to drag a KtdGridItem instance. */
// tslint:disable-next-line:directive-class-suffix
export class KtdGridDragHandle {
    constructor(element) {
        this.element = element;
    }
}
KtdGridDragHandle.ɵfac = function KtdGridDragHandle_Factory(t) { return new (t || KtdGridDragHandle)(i0.ɵɵdirectiveInject(i0.ElementRef)); };
KtdGridDragHandle.ɵdir = i0.ɵɵdefineDirective({ type: KtdGridDragHandle, selectors: [["", "ktdGridDragHandle", ""]], hostAttrs: [1, "ktd-grid-drag-handle"], features: [i0.ɵɵProvidersFeature([{ provide: KTD_GRID_DRAG_HANDLE, useExisting: KtdGridDragHandle }])] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(KtdGridDragHandle, [{
        type: Directive,
        args: [{
                selector: '[ktdGridDragHandle]',
                host: {
                    class: 'ktd-grid-drag-handle'
                },
                providers: [{ provide: KTD_GRID_DRAG_HANDLE, useExisting: KtdGridDragHandle }],
            }]
    }], function () { return [{ type: i0.ElementRef }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZy1oYW5kbGUuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1ncmlkLWxheW91dC9zcmMvIiwic291cmNlcyI6WyJsaWIvZGlyZWN0aXZlcy9kcmFnLWhhbmRsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFjLGNBQWMsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFFdEU7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLG9CQUFvQixHQUFHLElBQUksY0FBYyxDQUFvQixtQkFBbUIsQ0FBQyxDQUFDO0FBRS9GLDhEQUE4RDtBQVE5RCxrREFBa0Q7QUFDbEQsTUFBTSxPQUFPLGlCQUFpQjtJQUMxQixZQUNXLE9BQWdDO1FBQWhDLFlBQU8sR0FBUCxPQUFPLENBQXlCO0lBQzNDLENBQUM7O2tGQUhRLGlCQUFpQjtzREFBakIsaUJBQWlCLHVIQUhmLENBQUMsRUFBQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFDLENBQUM7a0RBR25FLGlCQUFpQjtjQVI3QixTQUFTO2VBQUM7Z0JBQ1AsUUFBUSxFQUFFLHFCQUFxQjtnQkFDL0IsSUFBSSxFQUFFO29CQUNGLEtBQUssRUFBRSxzQkFBc0I7aUJBQ2hDO2dCQUNELFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLFdBQVcsbUJBQW1CLEVBQUMsQ0FBQzthQUMvRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5qZWN0aW9uVG9rZW4gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byByZWZlcmVuY2UgaW5zdGFuY2VzIG9mIGBLdGRHcmlkRHJhZ0hhbmRsZWAuIEl0IHNlcnZlcyBhc1xuICogYWx0ZXJuYXRpdmUgdG9rZW4gdG8gdGhlIGFjdHVhbCBgS3RkR3JpZERyYWdIYW5kbGVgIGNsYXNzIHdoaWNoIGNvdWxkIGNhdXNlIHVubmVjZXNzYXJ5XG4gKiByZXRlbnRpb24gb2YgdGhlIGNsYXNzIGFuZCBpdHMgZGlyZWN0aXZlIG1ldGFkYXRhLlxuICovXG5leHBvcnQgY29uc3QgS1REX0dSSURfRFJBR19IQU5ETEUgPSBuZXcgSW5qZWN0aW9uVG9rZW48S3RkR3JpZERyYWdIYW5kbGU+KCdLdGRHcmlkRHJhZ0hhbmRsZScpO1xuXG4vKiogSGFuZGxlIHRoYXQgY2FuIGJlIHVzZWQgdG8gZHJhZyBhIEt0ZEdyaWRJdGVtIGluc3RhbmNlLiAqL1xuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdba3RkR3JpZERyYWdIYW5kbGVdJyxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAna3RkLWdyaWQtZHJhZy1oYW5kbGUnXG4gICAgfSxcbiAgICBwcm92aWRlcnM6IFt7cHJvdmlkZTogS1REX0dSSURfRFJBR19IQU5ETEUsIHVzZUV4aXN0aW5nOiBLdGRHcmlkRHJhZ0hhbmRsZX1dLFxufSlcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpkaXJlY3RpdmUtY2xhc3Mtc3VmZml4XG5leHBvcnQgY2xhc3MgS3RkR3JpZERyYWdIYW5kbGUge1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcbiAgICB9XG59XG4iXX0=