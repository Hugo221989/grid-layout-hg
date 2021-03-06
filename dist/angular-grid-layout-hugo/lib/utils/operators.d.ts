import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';
/** Runs source observable outside the zone */
export declare function ktdOutsideZone<T>(zone: NgZone): (source: Observable<T>) => Observable<T>;
/** Rxjs operator that makes source observable to no emit any data */
export declare function ktdNoEmit(): (source$: Observable<any>) => Observable<any>;
