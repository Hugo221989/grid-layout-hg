import { Directive, ElementRef, InjectionToken, } from '@angular/core';
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
KtdGridResizeHandle.decorators = [
    { type: Directive, args: [{
                selector: '[ktdGridResizeHandle]',
                host: {
                    class: 'ktd-grid-resize-handle'
                },
                providers: [{ provide: KTD_GRID_RESIZE_HANDLE, useExisting: KtdGridResizeHandle }],
            },] }
];
KtdGridResizeHandle.ctorParameters = () => [
    { type: ElementRef }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXplLWhhbmRsZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWdyaWQtbGF5b3V0LWh1Z28vc3JjLyIsInNvdXJjZXMiOlsibGliL2RpcmVjdGl2ZXMvcmVzaXplLWhhbmRsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxjQUFjLEdBQUcsTUFBTSxlQUFlLENBQUM7QUFHdkU7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFHLElBQUksY0FBYyxDQUFzQixxQkFBcUIsQ0FBQyxDQUFDO0FBRXJHLDhEQUE4RDtBQVE5RCxNQUFNLE9BQU8sbUJBQW1CO0lBRTVCLFlBQ1csT0FBZ0M7UUFBaEMsWUFBTyxHQUFQLE9BQU8sQ0FBeUI7SUFDM0MsQ0FBQzs7O1lBWEosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSx1QkFBdUI7Z0JBQ2pDLElBQUksRUFBRTtvQkFDRixLQUFLLEVBQUUsd0JBQXdCO2lCQUNsQztnQkFDRCxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUMsQ0FBQzthQUNuRjs7O1lBakJtQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbmplY3Rpb25Ub2tlbiwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlZmVyZW5jZSBpbnN0YW5jZXMgb2YgYEt0ZEdyaWRSZXNpemVIYW5kbGVgLiBJdCBzZXJ2ZXMgYXNcbiAqIGFsdGVybmF0aXZlIHRva2VuIHRvIHRoZSBhY3R1YWwgYEt0ZEdyaWRSZXNpemVIYW5kbGVgIGNsYXNzIHdoaWNoIGNvdWxkIGNhdXNlIHVubmVjZXNzYXJ5XG4gKiByZXRlbnRpb24gb2YgdGhlIGNsYXNzIGFuZCBpdHMgZGlyZWN0aXZlIG1ldGFkYXRhLlxuICovXG5leHBvcnQgY29uc3QgS1REX0dSSURfUkVTSVpFX0hBTkRMRSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxLdGRHcmlkUmVzaXplSGFuZGxlPignS3RkR3JpZFJlc2l6ZUhhbmRsZScpO1xuXG4vKiogSGFuZGxlIHRoYXQgY2FuIGJlIHVzZWQgdG8gZHJhZyBhIEt0ZEdyaWRJdGVtIGluc3RhbmNlLiAqL1xuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdba3RkR3JpZFJlc2l6ZUhhbmRsZV0nLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdrdGQtZ3JpZC1yZXNpemUtaGFuZGxlJ1xuICAgIH0sXG4gICAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IEtURF9HUklEX1JFU0laRV9IQU5ETEUsIHVzZUV4aXN0aW5nOiBLdGRHcmlkUmVzaXplSGFuZGxlfV0sXG59KVxuZXhwb3J0IGNsYXNzIEt0ZEdyaWRSZXNpemVIYW5kbGUge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuICAgIH1cbn1cbiJdfQ==