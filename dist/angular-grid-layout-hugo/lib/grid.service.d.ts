import { NgZone, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
export declare class KtdGridService implements OnDestroy {
    private ngZone;
    touchMove$: Observable<TouchEvent>;
    private touchMoveSubject;
    private touchMoveSubscription;
    constructor(ngZone: NgZone);
    ngOnDestroy(): void;
    mouseOrTouchMove$(element: any): Observable<MouseEvent | TouchEvent>;
    private registerTouchMoveSubscription;
}
