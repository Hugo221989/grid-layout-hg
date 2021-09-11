import { ElementRef, InjectionToken } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Injection token that can be used to reference instances of `KtdGridDragHandle`. It serves as
 * alternative token to the actual `KtdGridDragHandle` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export declare const KTD_GRID_DRAG_HANDLE: InjectionToken<KtdGridDragHandle>;
/** Handle that can be used to drag a KtdGridItem instance. */
export declare class KtdGridDragHandle {
    element: ElementRef<HTMLElement>;
    constructor(element: ElementRef<HTMLElement>);
    static ɵfac: i0.ɵɵFactoryDef<KtdGridDragHandle, never>;
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<KtdGridDragHandle, "[ktdGridDragHandle]", never, {}, {}, never>;
}
//# sourceMappingURL=drag-handle.d.ts.map