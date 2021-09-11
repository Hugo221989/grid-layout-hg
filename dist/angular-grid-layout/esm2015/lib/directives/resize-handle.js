import { Directive, InjectionToken, } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Injection token that can be used to reference instances of `KtdGridResizeHandle`. It serves as
 * alternative token to the actual `KtdGridResizeHandle` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const KTD_GRID_RESIZE_HANDLE = new InjectionToken('KtdGridResizeHandle');
/** Handle that can be used to drag a KtdGridItem instance. */
export class KtdGridResizeHandle {
    constructor(element) {
        this.element = element;
    }
}
KtdGridResizeHandle.ɵfac = function KtdGridResizeHandle_Factory(t) { return new (t || KtdGridResizeHandle)(i0.ɵɵdirectiveInject(i0.ElementRef)); };
KtdGridResizeHandle.ɵdir = i0.ɵɵdefineDirective({ type: KtdGridResizeHandle, selectors: [["", "ktdGridResizeHandle", ""]], hostAttrs: [1, "ktd-grid-resize-handle"], features: [i0.ɵɵProvidersFeature([{ provide: KTD_GRID_RESIZE_HANDLE, useExisting: KtdGridResizeHandle }])] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(KtdGridResizeHandle, [{
        type: Directive,
        args: [{
                selector: '[ktdGridResizeHandle]',
                host: {
                    class: 'ktd-grid-resize-handle'
                },
                providers: [{ provide: KTD_GRID_RESIZE_HANDLE, useExisting: KtdGridResizeHandle }],
            }]
    }], function () { return [{ type: i0.ElementRef }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXplLWhhbmRsZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWdyaWQtbGF5b3V0L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9kaXJlY3RpdmVzL3Jlc2l6ZS1oYW5kbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBYyxjQUFjLEdBQUcsTUFBTSxlQUFlLENBQUM7O0FBR3ZFOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLGNBQWMsQ0FBc0IscUJBQXFCLENBQUMsQ0FBQztBQUVyRyw4REFBOEQ7QUFROUQsTUFBTSxPQUFPLG1CQUFtQjtJQUU1QixZQUNXLE9BQWdDO1FBQWhDLFlBQU8sR0FBUCxPQUFPLENBQXlCO0lBQzNDLENBQUM7O3NGQUpRLG1CQUFtQjt3REFBbkIsbUJBQW1CLDJIQUZqQixDQUFDLEVBQUMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLFdBQVcsRUFBRSxtQkFBbUIsRUFBQyxDQUFDO2tEQUV2RSxtQkFBbUI7Y0FQL0IsU0FBUztlQUFDO2dCQUNQLFFBQVEsRUFBRSx1QkFBdUI7Z0JBQ2pDLElBQUksRUFBRTtvQkFDRixLQUFLLEVBQUUsd0JBQXdCO2lCQUNsQztnQkFDRCxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxXQUFXLHFCQUFxQixFQUFDLENBQUM7YUFDbkYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEluamVjdGlvblRva2VuLCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVmZXJlbmNlIGluc3RhbmNlcyBvZiBgS3RkR3JpZFJlc2l6ZUhhbmRsZWAuIEl0IHNlcnZlcyBhc1xuICogYWx0ZXJuYXRpdmUgdG9rZW4gdG8gdGhlIGFjdHVhbCBgS3RkR3JpZFJlc2l6ZUhhbmRsZWAgY2xhc3Mgd2hpY2ggY291bGQgY2F1c2UgdW5uZWNlc3NhcnlcbiAqIHJldGVudGlvbiBvZiB0aGUgY2xhc3MgYW5kIGl0cyBkaXJlY3RpdmUgbWV0YWRhdGEuXG4gKi9cbmV4cG9ydCBjb25zdCBLVERfR1JJRF9SRVNJWkVfSEFORExFID0gbmV3IEluamVjdGlvblRva2VuPEt0ZEdyaWRSZXNpemVIYW5kbGU+KCdLdGRHcmlkUmVzaXplSGFuZGxlJyk7XG5cbi8qKiBIYW5kbGUgdGhhdCBjYW4gYmUgdXNlZCB0byBkcmFnIGEgS3RkR3JpZEl0ZW0gaW5zdGFuY2UuICovXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1trdGRHcmlkUmVzaXplSGFuZGxlXScsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ2t0ZC1ncmlkLXJlc2l6ZS1oYW5kbGUnXG4gICAgfSxcbiAgICBwcm92aWRlcnM6IFt7cHJvdmlkZTogS1REX0dSSURfUkVTSVpFX0hBTkRMRSwgdXNlRXhpc3Rpbmc6IEt0ZEdyaWRSZXNpemVIYW5kbGV9XSxcbn0pXG5leHBvcnQgY2xhc3MgS3RkR3JpZFJlc2l6ZUhhbmRsZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIGVsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7XG4gICAgfVxufVxuIl19