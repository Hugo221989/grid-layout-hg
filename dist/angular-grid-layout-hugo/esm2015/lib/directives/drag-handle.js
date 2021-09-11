import { Directive, ElementRef, InjectionToken } from '@angular/core';
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
KtdGridDragHandle.decorators = [
    { type: Directive, args: [{
                selector: '[ktdGridDragHandle]',
                host: {
                    class: 'ktd-grid-drag-handle'
                },
                providers: [{ provide: KTD_GRID_DRAG_HANDLE, useExisting: KtdGridDragHandle }],
            },] }
];
KtdGridDragHandle.ctorParameters = () => [
    { type: ElementRef }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZy1oYW5kbGUuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1ncmlkLWxheW91dC1odWdvL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9kaXJlY3RpdmVzL2RyYWctaGFuZGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV0RTs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxjQUFjLENBQW9CLG1CQUFtQixDQUFDLENBQUM7QUFFL0YsOERBQThEO0FBUTlELGtEQUFrRDtBQUNsRCxNQUFNLE9BQU8saUJBQWlCO0lBQzFCLFlBQ1csT0FBZ0M7UUFBaEMsWUFBTyxHQUFQLE9BQU8sQ0FBeUI7SUFDM0MsQ0FBQzs7O1lBWEosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxxQkFBcUI7Z0JBQy9CLElBQUksRUFBRTtvQkFDRixLQUFLLEVBQUUsc0JBQXNCO2lCQUNoQztnQkFDRCxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQUMsQ0FBQzthQUMvRTs7O1lBaEJtQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbmplY3Rpb25Ub2tlbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlZmVyZW5jZSBpbnN0YW5jZXMgb2YgYEt0ZEdyaWREcmFnSGFuZGxlYC4gSXQgc2VydmVzIGFzXG4gKiBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBLdGRHcmlkRHJhZ0hhbmRsZWAgY2xhc3Mgd2hpY2ggY291bGQgY2F1c2UgdW5uZWNlc3NhcnlcbiAqIHJldGVudGlvbiBvZiB0aGUgY2xhc3MgYW5kIGl0cyBkaXJlY3RpdmUgbWV0YWRhdGEuXG4gKi9cbmV4cG9ydCBjb25zdCBLVERfR1JJRF9EUkFHX0hBTkRMRSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxLdGRHcmlkRHJhZ0hhbmRsZT4oJ0t0ZEdyaWREcmFnSGFuZGxlJyk7XG5cbi8qKiBIYW5kbGUgdGhhdCBjYW4gYmUgdXNlZCB0byBkcmFnIGEgS3RkR3JpZEl0ZW0gaW5zdGFuY2UuICovXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1trdGRHcmlkRHJhZ0hhbmRsZV0nLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdrdGQtZ3JpZC1kcmFnLWhhbmRsZSdcbiAgICB9LFxuICAgIHByb3ZpZGVyczogW3twcm92aWRlOiBLVERfR1JJRF9EUkFHX0hBTkRMRSwgdXNlRXhpc3Rpbmc6IEt0ZEdyaWREcmFnSGFuZGxlfV0sXG59KVxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmRpcmVjdGl2ZS1jbGFzcy1zdWZmaXhcbmV4cG9ydCBjbGFzcyBLdGRHcmlkRHJhZ0hhbmRsZSB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuICAgIH1cbn1cbiJdfQ==