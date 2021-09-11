import { NgZone, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class KtdGridService implements OnDestroy {
    private ngZone;
    touchMove$: Observable<TouchEvent>;
    private touchMoveSubject;
    private touchMoveSubscription;
    constructor(ngZone: NgZone);
    ngOnDestroy(): void;
    mouseOrTouchMove$(element: any): Observable<MouseEvent | TouchEvent>;
    private registerTouchMoveSubscription;
    static ɵfac: i0.ɵɵFactoryDef<KtdGridService, never>;
    static ɵprov: i0.ɵɵInjectableDef<KtdGridService>;
}
//# sourceMappingURL=grid.service.d.ts.map