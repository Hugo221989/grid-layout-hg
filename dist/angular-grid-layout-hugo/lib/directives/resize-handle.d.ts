import { ElementRef, InjectionToken } from '@angular/core';
/**
 * Injection token that can be used to reference instances of `KtdGridResizeHandle`. It serves as
 * alternative token to the actual `KtdGridResizeHandle` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export declare const KTD_GRID_RESIZE_HANDLE: InjectionToken<KtdGridResizeHandle>;
/** Handle that can be used to drag a KtdGridItem instance. */
export declare class KtdGridResizeHandle {
    element: ElementRef<HTMLElement>;
    constructor(element: ElementRef<HTMLElement>);
}
