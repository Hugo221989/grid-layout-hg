import { Observable } from 'rxjs';
export interface KtdScrollPosition {
    top: number;
    left: number;
}
export interface KtdScrollIfNearElementOptions {
    scrollStep?: number;
    disableVertical?: boolean;
    disableHorizontal?: boolean;
}
/**
 * Given a source$ observable with pointer location, scroll the scrollNode if the pointer is near to it.
 * This observable doesn't emit, it just performs a 'scroll' side effect.
 * @param scrollableParent, parent node in which the scroll would be performed.
 * @param options, configuration options.
 */
export declare function ktdScrollIfNearElementClientRect$(scrollableParent: HTMLElement | Document, options?: KtdScrollIfNearElementOptions): (source$: Observable<{
    pointerX: number;
    pointerY: number;
}>) => Observable<any>;
/**
 * Emits on EVERY scroll event and returns the accumulated scroll offset relative to the initial scroll position.
 * @param scrollableParent, node in which scroll events would be listened.
 */
export declare function ktdGetScrollTotalRelativeDifference$(scrollableParent: HTMLElement | Document): Observable<{
    top: number;
    left: number;
}>;
