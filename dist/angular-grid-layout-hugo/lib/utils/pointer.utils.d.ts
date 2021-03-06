import { Observable } from 'rxjs';
export declare function ktdIsMobileOrTablet(): boolean;
export declare function ktdIsMouseEvent(event: any): event is MouseEvent;
export declare function ktdIsTouchEvent(event: any): event is TouchEvent;
export declare function ktdPointerClientX(event: MouseEvent | TouchEvent): number;
export declare function ktdPointerClientY(event: MouseEvent | TouchEvent): number;
export declare function ktdPointerClient(event: MouseEvent | TouchEvent): {
    clientX: number;
    clientY: number;
};
/**
 * Emits when a mousedown or touchstart emits. Avoids conflicts between both events.
 * @param element, html element where to  listen the events.
 * @param touchNumber number of the touch to track the event, default to the first one.
 */
export declare function ktdMouseOrTouchDown(element: any, touchNumber?: number): Observable<MouseEvent | TouchEvent>;
/**
 * Emits when a 'mousemove' or a 'touchmove' event gets fired.
 * @param element, html element where to  listen the events.
 * @param touchNumber number of the touch to track the event, default to the first one.
 */
export declare function ktdMouseOrTouchMove(element: any, touchNumber?: number): Observable<MouseEvent | TouchEvent>;
export declare function ktdTouchEnd(element: any, touchNumber?: number): Observable<TouchEvent>;
/**
 * Emits when a there is a 'mouseup' or the touch ends.
 * @param element, html element where to  listen the events.
 * @param touchNumber number of the touch to track the event, default to the first one.
 */
export declare function ktdMouseOrTouchEnd(element: any, touchNumber?: number): Observable<MouseEvent | TouchEvent>;
