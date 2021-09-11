import { Injectable } from '@angular/core';
import { ktdNormalizePassiveListenerOptions } from './utils/passive-listeners';
import { fromEvent, iif, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ktdIsMobileOrTablet } from './utils/pointer.utils';
import * as i0 from "@angular/core";
/** Event options that can be used to bind an active, capturing event. */
const activeCapturingEventOptions = ktdNormalizePassiveListenerOptions({
    passive: false,
    capture: true
});
export class KtdGridService {
    constructor(ngZone) {
        this.ngZone = ngZone;
        this.touchMoveSubject = new Subject();
        this.touchMove$ = this.touchMoveSubject.asObservable();
        this.registerTouchMoveSubscription();
    }
    ngOnDestroy() {
        this.touchMoveSubscription.unsubscribe();
    }
    mouseOrTouchMove$(element) {
        return iif(() => ktdIsMobileOrTablet(), this.touchMove$, fromEvent(element, 'mousemove', activeCapturingEventOptions) // TODO: Fix rxjs typings, boolean should be a good param too.
        );
    }
    registerTouchMoveSubscription() {
        // The `touchmove` event gets bound once, ahead of time, because WebKit
        // won't preventDefault on a dynamically-added `touchmove` listener.
        // See https://bugs.webkit.org/show_bug.cgi?id=184250.
        this.touchMoveSubscription = this.ngZone.runOutsideAngular(() => 
        // The event handler has to be explicitly active,
        // because newer browsers make it passive by default.
        fromEvent(document, 'touchmove', activeCapturingEventOptions) // TODO: Fix rxjs typings, boolean should be a good param too.
            .pipe(filter((touchEvent) => touchEvent.touches.length === 1))
            .subscribe((touchEvent) => this.touchMoveSubject.next(touchEvent)));
    }
}
KtdGridService.ɵfac = function KtdGridService_Factory(t) { return new (t || KtdGridService)(i0.ɵɵinject(i0.NgZone)); };
KtdGridService.ɵprov = i0.ɵɵdefineInjectable({ token: KtdGridService, factory: KtdGridService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(KtdGridService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], function () { return [{ type: i0.NgZone }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItZ3JpZC1sYXlvdXQvc3JjLyIsInNvdXJjZXMiOlsibGliL2dyaWQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFxQixNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsa0NBQWtDLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMvRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBYyxPQUFPLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQzs7QUFFNUQseUVBQXlFO0FBQ3pFLE1BQU0sMkJBQTJCLEdBQUcsa0NBQWtDLENBQUM7SUFDbkUsT0FBTyxFQUFFLEtBQUs7SUFDZCxPQUFPLEVBQUUsSUFBSTtDQUNoQixDQUFDLENBQUM7QUFHSCxNQUFNLE9BQU8sY0FBYztJQU12QixZQUFvQixNQUFjO1FBQWQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUgxQixxQkFBZ0IsR0FBd0IsSUFBSSxPQUFPLEVBQWMsQ0FBQztRQUl0RSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN2RCxJQUFJLENBQUMsNkJBQTZCLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM3QyxDQUFDO0lBRUQsaUJBQWlCLENBQUMsT0FBTztRQUNyQixPQUFPLEdBQUcsQ0FDTixHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxFQUMzQixJQUFJLENBQUMsVUFBVSxFQUNmLFNBQVMsQ0FBYSxPQUFPLEVBQUUsV0FBVyxFQUFFLDJCQUFzRCxDQUFDLENBQUMsOERBQThEO1NBQ3JLLENBQUM7SUFDTixDQUFDO0lBRU8sNkJBQTZCO1FBQ2pDLHVFQUF1RTtRQUN2RSxvRUFBb0U7UUFDcEUsc0RBQXNEO1FBQ3RELElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtRQUM1RCxpREFBaUQ7UUFDakQscURBQXFEO1FBQ3JELFNBQVMsQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLDJCQUFzRCxDQUFDLENBQUMsOERBQThEO2FBQ2xKLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFzQixFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQzthQUN6RSxTQUFTLENBQUMsQ0FBQyxVQUFzQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQ3JGLENBQUM7SUFDTixDQUFDOzs0RUFsQ1EsY0FBYztzREFBZCxjQUFjLFdBQWQsY0FBYyxtQkFERixNQUFNO2tEQUNsQixjQUFjO2NBRDFCLFVBQVU7ZUFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBOZ1pvbmUsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsga3RkTm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyB9IGZyb20gJy4vdXRpbHMvcGFzc2l2ZS1saXN0ZW5lcnMnO1xuaW1wb3J0IHsgZnJvbUV2ZW50LCBpaWYsIE9ic2VydmFibGUsIFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsga3RkSXNNb2JpbGVPclRhYmxldCB9IGZyb20gJy4vdXRpbHMvcG9pbnRlci51dGlscyc7XG5cbi8qKiBFdmVudCBvcHRpb25zIHRoYXQgY2FuIGJlIHVzZWQgdG8gYmluZCBhbiBhY3RpdmUsIGNhcHR1cmluZyBldmVudC4gKi9cbmNvbnN0IGFjdGl2ZUNhcHR1cmluZ0V2ZW50T3B0aW9ucyA9IGt0ZE5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMoe1xuICAgIHBhc3NpdmU6IGZhbHNlLFxuICAgIGNhcHR1cmU6IHRydWVcbn0pO1xuXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBLdGRHcmlkU2VydmljZSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG5cbiAgICB0b3VjaE1vdmUkOiBPYnNlcnZhYmxlPFRvdWNoRXZlbnQ+O1xuICAgIHByaXZhdGUgdG91Y2hNb3ZlU3ViamVjdDogU3ViamVjdDxUb3VjaEV2ZW50PiA9IG5ldyBTdWJqZWN0PFRvdWNoRXZlbnQ+KCk7XG4gICAgcHJpdmF0ZSB0b3VjaE1vdmVTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbmdab25lOiBOZ1pvbmUpIHtcbiAgICAgICAgdGhpcy50b3VjaE1vdmUkID0gdGhpcy50b3VjaE1vdmVTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyVG91Y2hNb3ZlU3Vic2NyaXB0aW9uKCk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMudG91Y2hNb3ZlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgbW91c2VPclRvdWNoTW92ZSQoZWxlbWVudCk6IE9ic2VydmFibGU8TW91c2VFdmVudCB8IFRvdWNoRXZlbnQ+IHtcbiAgICAgICAgcmV0dXJuIGlpZihcbiAgICAgICAgICAgICgpID0+IGt0ZElzTW9iaWxlT3JUYWJsZXQoKSxcbiAgICAgICAgICAgIHRoaXMudG91Y2hNb3ZlJCxcbiAgICAgICAgICAgIGZyb21FdmVudDxNb3VzZUV2ZW50PihlbGVtZW50LCAnbW91c2Vtb3ZlJywgYWN0aXZlQ2FwdHVyaW5nRXZlbnRPcHRpb25zIGFzIEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zKSAvLyBUT0RPOiBGaXggcnhqcyB0eXBpbmdzLCBib29sZWFuIHNob3VsZCBiZSBhIGdvb2QgcGFyYW0gdG9vLlxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVnaXN0ZXJUb3VjaE1vdmVTdWJzY3JpcHRpb24oKSB7XG4gICAgICAgIC8vIFRoZSBgdG91Y2htb3ZlYCBldmVudCBnZXRzIGJvdW5kIG9uY2UsIGFoZWFkIG9mIHRpbWUsIGJlY2F1c2UgV2ViS2l0XG4gICAgICAgIC8vIHdvbid0IHByZXZlbnREZWZhdWx0IG9uIGEgZHluYW1pY2FsbHktYWRkZWQgYHRvdWNobW92ZWAgbGlzdGVuZXIuXG4gICAgICAgIC8vIFNlZSBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTg0MjUwLlxuICAgICAgICB0aGlzLnRvdWNoTW92ZVN1YnNjcmlwdGlvbiA9IHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+XG4gICAgICAgICAgICAvLyBUaGUgZXZlbnQgaGFuZGxlciBoYXMgdG8gYmUgZXhwbGljaXRseSBhY3RpdmUsXG4gICAgICAgICAgICAvLyBiZWNhdXNlIG5ld2VyIGJyb3dzZXJzIG1ha2UgaXQgcGFzc2l2ZSBieSBkZWZhdWx0LlxuICAgICAgICAgICAgZnJvbUV2ZW50KGRvY3VtZW50LCAndG91Y2htb3ZlJywgYWN0aXZlQ2FwdHVyaW5nRXZlbnRPcHRpb25zIGFzIEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zKSAvLyBUT0RPOiBGaXggcnhqcyB0eXBpbmdzLCBib29sZWFuIHNob3VsZCBiZSBhIGdvb2QgcGFyYW0gdG9vLlxuICAgICAgICAgICAgICAgIC5waXBlKGZpbHRlcigodG91Y2hFdmVudDogVG91Y2hFdmVudCkgPT4gdG91Y2hFdmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMSkpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgodG91Y2hFdmVudDogVG91Y2hFdmVudCkgPT4gdGhpcy50b3VjaE1vdmVTdWJqZWN0Lm5leHQodG91Y2hFdmVudCkpXG4gICAgICAgICk7XG4gICAgfVxufVxuIl19