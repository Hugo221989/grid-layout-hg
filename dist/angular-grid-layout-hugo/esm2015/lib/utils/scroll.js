import { animationFrameScheduler, fromEvent, interval, NEVER } from 'rxjs';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { ktdNormalizePassiveListenerOptions } from './passive-listeners';
import { getMutableClientRect } from './client-rect';
import { ktdNoEmit } from './operators';
/**
 * Proximity, as a ratio to width/height at which to start auto-scrolling.
 * The value comes from trying it out manually until it feels right.
 */
const SCROLL_PROXIMITY_THRESHOLD = 0.05;
/**
 * Increments the vertical scroll position of a node.
 * @param node Node whose scroll position should change.
 * @param amount Amount of pixels that the `node` should be scrolled.
 */
function incrementVerticalScroll(node, amount) {
    if (node === window) {
        node.scrollBy(0, amount);
    }
    else {
        // Ideally we could use `Element.scrollBy` here as well, but IE and Edge don't support it.
        node.scrollTop += amount;
    }
}
/**
 * Increments the horizontal scroll position of a node.
 * @param node Node whose scroll position should change.
 * @param amount Amount of pixels that the `node` should be scrolled.
 */
function incrementHorizontalScroll(node, amount) {
    if (node === window) {
        node.scrollBy(amount, 0);
    }
    else {
        // Ideally we could use `Element.scrollBy` here as well, but IE and Edge don't support it.
        node.scrollLeft += amount;
    }
}
/**
 * Gets whether the vertical auto-scroll direction of a node.
 * @param clientRect Dimensions of the node.
 * @param pointerY Position of the user's pointer along the y axis.
 */
function getVerticalScrollDirection(clientRect, pointerY) {
    const { top, bottom, height } = clientRect;
    const yThreshold = height * SCROLL_PROXIMITY_THRESHOLD;
    if (pointerY >= top - yThreshold && pointerY <= top + yThreshold) {
        return 1 /* UP */;
    }
    else if (pointerY >= bottom - yThreshold && pointerY <= bottom + yThreshold) {
        return 2 /* DOWN */;
    }
    return 0 /* NONE */;
}
/**
 * Gets whether the horizontal auto-scroll direction of a node.
 * @param clientRect Dimensions of the node.
 * @param pointerX Position of the user's pointer along the x axis.
 */
function getHorizontalScrollDirection(clientRect, pointerX) {
    const { left, right, width } = clientRect;
    const xThreshold = width * SCROLL_PROXIMITY_THRESHOLD;
    if (pointerX >= left - xThreshold && pointerX <= left + xThreshold) {
        return 1 /* LEFT */;
    }
    else if (pointerX >= right - xThreshold && pointerX <= right + xThreshold) {
        return 2 /* RIGHT */;
    }
    return 0 /* NONE */;
}
/**
 * Returns an observable that schedules a loop and apply scroll on the scrollNode into the specified direction/s.
 * This observable doesn't emit, it just performs the 'scroll' side effect.
 * @param scrollNode, node where the scroll would be applied.
 * @param verticalScrollDirection, vertical direction of the scroll.
 * @param horizontalScrollDirection, horizontal direction of the scroll.
 * @param scrollStep, scroll step in CSS pixels that would be applied in every loop.
 */
function scrollToDirectionInterval$(scrollNode, verticalScrollDirection, horizontalScrollDirection, scrollStep = 2) {
    return interval(0, animationFrameScheduler)
        .pipe(tap(() => {
        if (verticalScrollDirection === 1 /* UP */) {
            incrementVerticalScroll(scrollNode, -scrollStep);
        }
        else if (verticalScrollDirection === 2 /* DOWN */) {
            incrementVerticalScroll(scrollNode, scrollStep);
        }
        if (horizontalScrollDirection === 1 /* LEFT */) {
            incrementHorizontalScroll(scrollNode, -scrollStep);
        }
        else if (horizontalScrollDirection === 2 /* RIGHT */) {
            incrementHorizontalScroll(scrollNode, scrollStep);
        }
    }), ktdNoEmit());
}
/**
 * Given a source$ observable with pointer location, scroll the scrollNode if the pointer is near to it.
 * This observable doesn't emit, it just performs a 'scroll' side effect.
 * @param scrollableParent, parent node in which the scroll would be performed.
 * @param options, configuration options.
 */
export function ktdScrollIfNearElementClientRect$(scrollableParent, options) {
    let scrollNode;
    let scrollableParentClientRect;
    let scrollableParentScrollWidth;
    if (scrollableParent === document) {
        scrollNode = document.defaultView;
        const { width, height } = getViewportSize();
        scrollableParentClientRect = { width, height, top: 0, right: width, bottom: height, left: 0 };
        scrollableParentScrollWidth = getDocumentScrollWidth();
    }
    else {
        scrollNode = scrollableParent;
        scrollableParentClientRect = getMutableClientRect(scrollableParent);
        scrollableParentScrollWidth = scrollableParent.scrollWidth;
    }
    /**
     * IMPORTANT: By design, only let scroll horizontal if the scrollable parent has explicitly an scroll horizontal.
     * This layout solution is not designed in mind to have any scroll horizontal, but exceptionally we allow it in this
     * specific use case.
     */
    options = options || {};
    if (options.disableHorizontal == null && scrollableParentScrollWidth <= scrollableParentClientRect.width) {
        options.disableHorizontal = true;
    }
    return (source$) => source$.pipe(map(({ pointerX, pointerY }) => {
        let verticalScrollDirection = getVerticalScrollDirection(scrollableParentClientRect, pointerY);
        let horizontalScrollDirection = getHorizontalScrollDirection(scrollableParentClientRect, pointerX);
        // Check if scroll directions are disabled.
        if (options === null || options === void 0 ? void 0 : options.disableVertical) {
            verticalScrollDirection = 0 /* NONE */;
        }
        if (options === null || options === void 0 ? void 0 : options.disableHorizontal) {
            horizontalScrollDirection = 0 /* NONE */;
        }
        return { verticalScrollDirection, horizontalScrollDirection };
    }), distinctUntilChanged((prev, actual) => {
        return prev.verticalScrollDirection === actual.verticalScrollDirection
            && prev.horizontalScrollDirection === actual.horizontalScrollDirection;
    }), switchMap(({ verticalScrollDirection, horizontalScrollDirection }) => {
        if (verticalScrollDirection || horizontalScrollDirection) {
            return scrollToDirectionInterval$(scrollNode, verticalScrollDirection, horizontalScrollDirection, options === null || options === void 0 ? void 0 : options.scrollStep);
        }
        else {
            return NEVER;
        }
    }));
}
/**
 * Emits on EVERY scroll event and returns the accumulated scroll offset relative to the initial scroll position.
 * @param scrollableParent, node in which scroll events would be listened.
 */
export function ktdGetScrollTotalRelativeDifference$(scrollableParent) {
    let scrollInitialPosition;
    // Calculate initial scroll position
    if (scrollableParent === document) {
        scrollInitialPosition = getViewportScrollPosition();
    }
    else {
        scrollInitialPosition = {
            top: scrollableParent.scrollTop,
            left: scrollableParent.scrollLeft
        };
    }
    return fromEvent(scrollableParent, 'scroll', ktdNormalizePassiveListenerOptions({ capture: true })).pipe(map(() => {
        let newTop;
        let newLeft;
        if (scrollableParent === document) {
            const viewportScrollPosition = getViewportScrollPosition();
            newTop = viewportScrollPosition.top;
            newLeft = viewportScrollPosition.left;
        }
        else {
            newTop = scrollableParent.scrollTop;
            newLeft = scrollableParent.scrollLeft;
        }
        const topDifference = scrollInitialPosition.top - newTop;
        const leftDifference = scrollInitialPosition.left - newLeft;
        return { top: topDifference, left: leftDifference };
    }));
}
/** Returns the viewport's width and height. */
function getViewportSize() {
    const _window = document.defaultView || window;
    return {
        width: _window.innerWidth,
        height: _window.innerHeight
    };
}
/** Gets a ClientRect for the viewport's bounds. */
function getViewportRect() {
    // Use the document element's bounding rect rather than the window scroll properties
    // (e.g. pageYOffset, scrollY) due to in issue in Chrome and IE where window scroll
    // properties and client coordinates (boundingClientRect, clientX/Y, etc.) are in different
    // conceptual viewports. Under most circumstances these viewports are equivalent, but they
    // can disagree when the page is pinch-zoomed (on devices that support touch).
    // See https://bugs.chromium.org/p/chromium/issues/detail?id=489206#c4
    // We use the documentElement instead of the body because, by default (without a css reset)
    // browsers typically give the document body an 8px margin, which is not included in
    // getBoundingClientRect().
    const scrollPosition = getViewportScrollPosition();
    const { width, height } = getViewportSize();
    return {
        top: scrollPosition.top,
        left: scrollPosition.left,
        bottom: scrollPosition.top + height,
        right: scrollPosition.left + width,
        height,
        width,
    };
}
/** Gets the (top, left) scroll position of the viewport. */
function getViewportScrollPosition() {
    // The top-left-corner of the viewport is determined by the scroll position of the document
    // body, normally just (scrollLeft, scrollTop). However, Chrome and Firefox disagree about
    // whether `document.body` or `document.documentElement` is the scrolled element, so reading
    // `scrollTop` and `scrollLeft` is inconsistent. However, using the bounding rect of
    // `document.documentElement` works consistently, where the `top` and `left` values will
    // equal negative the scroll position.
    const windowRef = document.defaultView || window;
    const documentElement = document.documentElement;
    const documentRect = documentElement.getBoundingClientRect();
    const top = -documentRect.top || document.body.scrollTop || windowRef.scrollY ||
        documentElement.scrollTop || 0;
    const left = -documentRect.left || document.body.scrollLeft || windowRef.scrollX ||
        documentElement.scrollLeft || 0;
    return { top, left };
}
/** Returns the document scroll width */
function getDocumentScrollWidth() {
    return Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItZ3JpZC1sYXlvdXQtaHVnby9zcmMvIiwic291cmNlcyI6WyJsaWIvdXRpbHMvc2Nyb2xsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBYyxNQUFNLE1BQU0sQ0FBQztBQUN2RixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzRSxPQUFPLEVBQUUsa0NBQWtDLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN6RSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUV4Qzs7O0dBR0c7QUFDSCxNQUFNLDBCQUEwQixHQUFHLElBQUksQ0FBQztBQWN4Qzs7OztHQUlHO0FBQ0gsU0FBUyx1QkFBdUIsQ0FBQyxJQUEwQixFQUFFLE1BQWM7SUFDdkUsSUFBSSxJQUFJLEtBQUssTUFBTSxFQUFFO1FBQ2hCLElBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQ3hDO1NBQU07UUFDSCwwRkFBMEY7UUFDekYsSUFBb0IsQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDO0tBQzdDO0FBQ0wsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFTLHlCQUF5QixDQUFDLElBQTBCLEVBQUUsTUFBYztJQUN6RSxJQUFJLElBQUksS0FBSyxNQUFNLEVBQUU7UUFDaEIsSUFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDeEM7U0FBTTtRQUNILDBGQUEwRjtRQUN6RixJQUFvQixDQUFDLFVBQVUsSUFBSSxNQUFNLENBQUM7S0FDOUM7QUFDTCxDQUFDO0FBR0Q7Ozs7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QUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsZUFBZ0IsQ0FBQztJQUNsRCxNQUFNLFlBQVksR0FBRyxlQUFlLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUU3RCxNQUFNLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLE9BQU87UUFDekUsZUFBZSxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUM7SUFFbkMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLFNBQVMsQ0FBQyxPQUFPO1FBQzVFLGVBQWUsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDO0lBRXBDLE9BQU8sRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDLENBQUM7QUFDdkIsQ0FBQztBQUVELHdDQUF3QztBQUN4QyxTQUFTLHNCQUFzQjtJQUMzQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIsIGZyb21FdmVudCwgaW50ZXJ2YWwsIE5FVkVSLCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgbWFwLCBzd2l0Y2hNYXAsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGt0ZE5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMgfSBmcm9tICcuL3Bhc3NpdmUtbGlzdGVuZXJzJztcbmltcG9ydCB7IGdldE11dGFibGVDbGllbnRSZWN0IH0gZnJvbSAnLi9jbGllbnQtcmVjdCc7XG5pbXBvcnQgeyBrdGROb0VtaXQgfSBmcm9tICcuL29wZXJhdG9ycyc7XG5cbi8qKlxuICogUHJveGltaXR5LCBhcyBhIHJhdGlvIHRvIHdpZHRoL2hlaWdodCBhdCB3aGljaCB0byBzdGFydCBhdXRvLXNjcm9sbGluZy5cbiAqIFRoZSB2YWx1ZSBjb21lcyBmcm9tIHRyeWluZyBpdCBvdXQgbWFudWFsbHkgdW50aWwgaXQgZmVlbHMgcmlnaHQuXG4gKi9cbmNvbnN0IFNDUk9MTF9QUk9YSU1JVFlfVEhSRVNIT0xEID0gMC4wNTtcblxuLyoqIFZlcnRpY2FsIGRpcmVjdGlvbiBpbiB3aGljaCB3ZSBjYW4gYXV0by1zY3JvbGwuICovXG5jb25zdCBlbnVtIEF1dG9TY3JvbGxWZXJ0aWNhbERpcmVjdGlvbiB7Tk9ORSwgVVAsIERPV059XG5cbi8qKiBIb3Jpem9udGFsIGRpcmVjdGlvbiBpbiB3aGljaCB3ZSBjYW4gYXV0by1zY3JvbGwuICovXG5jb25zdCBlbnVtIEF1dG9TY3JvbGxIb3Jpem9udGFsRGlyZWN0aW9uIHtOT05FLCBMRUZULCBSSUdIVH1cblxuZXhwb3J0IGludGVyZmFjZSBLdGRTY3JvbGxQb3NpdGlvbiB7XG4gICAgdG9wOiBudW1iZXI7XG4gICAgbGVmdDogbnVtYmVyO1xufVxuXG5cbi8qKlxuICogSW5jcmVtZW50cyB0aGUgdmVydGljYWwgc2Nyb2xsIHBvc2l0aW9uIG9mIGEgbm9kZS5cbiAqIEBwYXJhbSBub2RlIE5vZGUgd2hvc2Ugc2Nyb2xsIHBvc2l0aW9uIHNob3VsZCBjaGFuZ2UuXG4gKiBAcGFyYW0gYW1vdW50IEFtb3VudCBvZiBwaXhlbHMgdGhhdCB0aGUgYG5vZGVgIHNob3VsZCBiZSBzY3JvbGxlZC5cbiAqL1xuZnVuY3Rpb24gaW5jcmVtZW50VmVydGljYWxTY3JvbGwobm9kZTogSFRNTEVsZW1lbnQgfCBXaW5kb3csIGFtb3VudDogbnVtYmVyKSB7XG4gICAgaWYgKG5vZGUgPT09IHdpbmRvdykge1xuICAgICAgICAobm9kZSBhcyBXaW5kb3cpLnNjcm9sbEJ5KDAsIGFtb3VudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSWRlYWxseSB3ZSBjb3VsZCB1c2UgYEVsZW1lbnQuc2Nyb2xsQnlgIGhlcmUgYXMgd2VsbCwgYnV0IElFIGFuZCBFZGdlIGRvbid0IHN1cHBvcnQgaXQuXG4gICAgICAgIChub2RlIGFzIEhUTUxFbGVtZW50KS5zY3JvbGxUb3AgKz0gYW1vdW50O1xuICAgIH1cbn1cblxuLyoqXG4gKiBJbmNyZW1lbnRzIHRoZSBob3Jpem9udGFsIHNjcm9sbCBwb3NpdGlvbiBvZiBhIG5vZGUuXG4gKiBAcGFyYW0gbm9kZSBOb2RlIHdob3NlIHNjcm9sbCBwb3NpdGlvbiBzaG91bGQgY2hhbmdlLlxuICogQHBhcmFtIGFtb3VudCBBbW91bnQgb2YgcGl4ZWxzIHRoYXQgdGhlIGBub2RlYCBzaG91bGQgYmUgc2Nyb2xsZWQuXG4gKi9cbmZ1bmN0aW9uIGluY3JlbWVudEhvcml6b250YWxTY3JvbGwobm9kZTogSFRNTEVsZW1lbnQgfCBXaW5kb3csIGFtb3VudDogbnVtYmVyKSB7XG4gICAgaWYgKG5vZGUgPT09IHdpbmRvdykge1xuICAgICAgICAobm9kZSBhcyBXaW5kb3cpLnNjcm9sbEJ5KGFtb3VudCwgMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSWRlYWxseSB3ZSBjb3VsZCB1c2UgYEVsZW1lbnQuc2Nyb2xsQnlgIGhlcmUgYXMgd2VsbCwgYnV0IElFIGFuZCBFZGdlIGRvbid0IHN1cHBvcnQgaXQuXG4gICAgICAgIChub2RlIGFzIEhUTUxFbGVtZW50KS5zY3JvbGxMZWZ0ICs9IGFtb3VudDtcbiAgICB9XG59XG5cblxuLyoqXG4gKiBHZXRzIHdoZXRoZXIgdGhlIHZlcnRpY2FsIGF1dG8tc2Nyb2xsIGRpcmVjdGlvbiBvZiBhIG5vZGUuXG4gKiBAcGFyYW0gY2xpZW50UmVjdCBEaW1lbnNpb25zIG9mIHRoZSBub2RlLlxuICogQHBhcmFtIHBvaW50ZXJZIFBvc2l0aW9uIG9mIHRoZSB1c2VyJ3MgcG9pbnRlciBhbG9uZyB0aGUgeSBheGlzLlxuICovXG5mdW5jdGlvbiBnZXRWZXJ0aWNhbFNjcm9sbERpcmVjdGlvbihjbGllbnRSZWN0OiBDbGllbnRSZWN0LCBwb2ludGVyWTogbnVtYmVyKSB7XG4gICAgY29uc3Qge3RvcCwgYm90dG9tLCBoZWlnaHR9ID0gY2xpZW50UmVjdDtcbiAgICBjb25zdCB5VGhyZXNob2xkID0gaGVpZ2h0ICogU0NST0xMX1BST1hJTUlUWV9USFJFU0hPTEQ7XG5cbiAgICBpZiAocG9pbnRlclkgPj0gdG9wIC0geVRocmVzaG9sZCAmJiBwb2ludGVyWSA8PSB0b3AgKyB5VGhyZXNob2xkKSB7XG4gICAgICAgIHJldHVybiBBdXRvU2Nyb2xsVmVydGljYWxEaXJlY3Rpb24uVVA7XG4gICAgfSBlbHNlIGlmIChwb2ludGVyWSA+PSBib3R0b20gLSB5VGhyZXNob2xkICYmIHBvaW50ZXJZIDw9IGJvdHRvbSArIHlUaHJlc2hvbGQpIHtcbiAgICAgICAgcmV0dXJuIEF1dG9TY3JvbGxWZXJ0aWNhbERpcmVjdGlvbi5ET1dOO1xuICAgIH1cblxuICAgIHJldHVybiBBdXRvU2Nyb2xsVmVydGljYWxEaXJlY3Rpb24uTk9ORTtcbn1cblxuLyoqXG4gKiBHZXRzIHdoZXRoZXIgdGhlIGhvcml6b250YWwgYXV0by1zY3JvbGwgZGlyZWN0aW9uIG9mIGEgbm9kZS5cbiAqIEBwYXJhbSBjbGllbnRSZWN0IERpbWVuc2lvbnMgb2YgdGhlIG5vZGUuXG4gKiBAcGFyYW0gcG9pbnRlclggUG9zaXRpb24gb2YgdGhlIHVzZXIncyBwb2ludGVyIGFsb25nIHRoZSB4IGF4aXMuXG4gKi9cbmZ1bmN0aW9uIGdldEhvcml6b250YWxTY3JvbGxEaXJlY3Rpb24oY2xpZW50UmVjdDogQ2xpZW50UmVjdCwgcG9pbnRlclg6IG51bWJlcikge1xuICAgIGNvbnN0IHtsZWZ0LCByaWdodCwgd2lkdGh9ID0gY2xpZW50UmVjdDtcbiAgICBjb25zdCB4VGhyZXNob2xkID0gd2lkdGggKiBTQ1JPTExfUFJPWElNSVRZX1RIUkVTSE9MRDtcblxuICAgIGlmIChwb2ludGVyWCA+PSBsZWZ0IC0geFRocmVzaG9sZCAmJiBwb2ludGVyWCA8PSBsZWZ0ICsgeFRocmVzaG9sZCkge1xuICAgICAgICByZXR1cm4gQXV0b1Njcm9sbEhvcml6b250YWxEaXJlY3Rpb24uTEVGVDtcbiAgICB9IGVsc2UgaWYgKHBvaW50ZXJYID49IHJpZ2h0IC0geFRocmVzaG9sZCAmJiBwb2ludGVyWCA8PSByaWdodCArIHhUaHJlc2hvbGQpIHtcbiAgICAgICAgcmV0dXJuIEF1dG9TY3JvbGxIb3Jpem9udGFsRGlyZWN0aW9uLlJJR0hUO1xuICAgIH1cblxuICAgIHJldHVybiBBdXRvU2Nyb2xsSG9yaXpvbnRhbERpcmVjdGlvbi5OT05FO1xufVxuXG4vKipcbiAqIFJldHVybnMgYW4gb2JzZXJ2YWJsZSB0aGF0IHNjaGVkdWxlcyBhIGxvb3AgYW5kIGFwcGx5IHNjcm9sbCBvbiB0aGUgc2Nyb2xsTm9kZSBpbnRvIHRoZSBzcGVjaWZpZWQgZGlyZWN0aW9uL3MuXG4gKiBUaGlzIG9ic2VydmFibGUgZG9lc24ndCBlbWl0LCBpdCBqdXN0IHBlcmZvcm1zIHRoZSAnc2Nyb2xsJyBzaWRlIGVmZmVjdC5cbiAqIEBwYXJhbSBzY3JvbGxOb2RlLCBub2RlIHdoZXJlIHRoZSBzY3JvbGwgd291bGQgYmUgYXBwbGllZC5cbiAqIEBwYXJhbSB2ZXJ0aWNhbFNjcm9sbERpcmVjdGlvbiwgdmVydGljYWwgZGlyZWN0aW9uIG9mIHRoZSBzY3JvbGwuXG4gKiBAcGFyYW0gaG9yaXpvbnRhbFNjcm9sbERpcmVjdGlvbiwgaG9yaXpvbnRhbCBkaXJlY3Rpb24gb2YgdGhlIHNjcm9sbC5cbiAqIEBwYXJhbSBzY3JvbGxTdGVwLCBzY3JvbGwgc3RlcCBpbiBDU1MgcGl4ZWxzIHRoYXQgd291bGQgYmUgYXBwbGllZCBpbiBldmVyeSBsb29wLlxuICovXG5mdW5jdGlvbiBzY3JvbGxUb0RpcmVjdGlvbkludGVydmFsJChzY3JvbGxOb2RlOiBIVE1MRWxlbWVudCB8IFdpbmRvdywgdmVydGljYWxTY3JvbGxEaXJlY3Rpb246IEF1dG9TY3JvbGxWZXJ0aWNhbERpcmVjdGlvbiwgaG9yaXpvbnRhbFNjcm9sbERpcmVjdGlvbjogQXV0b1Njcm9sbEhvcml6b250YWxEaXJlY3Rpb24sIHNjcm9sbFN0ZXA6IG51bWJlciA9IDIpIHtcbiAgICByZXR1cm4gaW50ZXJ2YWwoMCwgYW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIpXG4gICAgICAgIC5waXBlKFxuICAgICAgICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodmVydGljYWxTY3JvbGxEaXJlY3Rpb24gPT09IEF1dG9TY3JvbGxWZXJ0aWNhbERpcmVjdGlvbi5VUCkge1xuICAgICAgICAgICAgICAgICAgICBpbmNyZW1lbnRWZXJ0aWNhbFNjcm9sbChzY3JvbGxOb2RlLCAtc2Nyb2xsU3RlcCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2ZXJ0aWNhbFNjcm9sbERpcmVjdGlvbiA9PT0gQXV0b1Njcm9sbFZlcnRpY2FsRGlyZWN0aW9uLkRPV04pIHtcbiAgICAgICAgICAgICAgICAgICAgaW5jcmVtZW50VmVydGljYWxTY3JvbGwoc2Nyb2xsTm9kZSwgc2Nyb2xsU3RlcCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGhvcml6b250YWxTY3JvbGxEaXJlY3Rpb24gPT09IEF1dG9TY3JvbGxIb3Jpem9udGFsRGlyZWN0aW9uLkxFRlQpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5jcmVtZW50SG9yaXpvbnRhbFNjcm9sbChzY3JvbGxOb2RlLCAtc2Nyb2xsU3RlcCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChob3Jpem9udGFsU2Nyb2xsRGlyZWN0aW9uID09PSBBdXRvU2Nyb2xsSG9yaXpvbnRhbERpcmVjdGlvbi5SSUdIVCkge1xuICAgICAgICAgICAgICAgICAgICBpbmNyZW1lbnRIb3Jpem9udGFsU2Nyb2xsKHNjcm9sbE5vZGUsIHNjcm9sbFN0ZXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAga3RkTm9FbWl0KClcbiAgICAgICAgKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBLdGRTY3JvbGxJZk5lYXJFbGVtZW50T3B0aW9ucyB7XG4gICAgc2Nyb2xsU3RlcD86IG51bWJlcjtcbiAgICBkaXNhYmxlVmVydGljYWw/OiBib29sZWFuO1xuICAgIGRpc2FibGVIb3Jpem9udGFsPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBHaXZlbiBhIHNvdXJjZSQgb2JzZXJ2YWJsZSB3aXRoIHBvaW50ZXIgbG9jYXRpb24sIHNjcm9sbCB0aGUgc2Nyb2xsTm9kZSBpZiB0aGUgcG9pbnRlciBpcyBuZWFyIHRvIGl0LlxuICogVGhpcyBvYnNlcnZhYmxlIGRvZXNuJ3QgZW1pdCwgaXQganVzdCBwZXJmb3JtcyBhICdzY3JvbGwnIHNpZGUgZWZmZWN0LlxuICogQHBhcmFtIHNjcm9sbGFibGVQYXJlbnQsIHBhcmVudCBub2RlIGluIHdoaWNoIHRoZSBzY3JvbGwgd291bGQgYmUgcGVyZm9ybWVkLlxuICogQHBhcmFtIG9wdGlvbnMsIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGt0ZFNjcm9sbElmTmVhckVsZW1lbnRDbGllbnRSZWN0JChzY3JvbGxhYmxlUGFyZW50OiBIVE1MRWxlbWVudCB8IERvY3VtZW50LCBvcHRpb25zPzogS3RkU2Nyb2xsSWZOZWFyRWxlbWVudE9wdGlvbnMpOiAoc291cmNlJDogT2JzZXJ2YWJsZTx7IHBvaW50ZXJYOiBudW1iZXIsIHBvaW50ZXJZOiBudW1iZXIgfT4pID0+IE9ic2VydmFibGU8YW55PiB7XG5cbiAgICBsZXQgc2Nyb2xsTm9kZTogV2luZG93IHwgSFRNTEVsZW1lbnQ7XG4gICAgbGV0IHNjcm9sbGFibGVQYXJlbnRDbGllbnRSZWN0OiBDbGllbnRSZWN0O1xuICAgIGxldCBzY3JvbGxhYmxlUGFyZW50U2Nyb2xsV2lkdGg6IG51bWJlcjtcblxuICAgIGlmIChzY3JvbGxhYmxlUGFyZW50ID09PSBkb2N1bWVudCkge1xuICAgICAgICBzY3JvbGxOb2RlID0gZG9jdW1lbnQuZGVmYXVsdFZpZXcgYXMgV2luZG93O1xuICAgICAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSBnZXRWaWV3cG9ydFNpemUoKTtcbiAgICAgICAgc2Nyb2xsYWJsZVBhcmVudENsaWVudFJlY3QgPSB7d2lkdGgsIGhlaWdodCwgdG9wOiAwLCByaWdodDogd2lkdGgsIGJvdHRvbTogaGVpZ2h0LCBsZWZ0OiAwfTtcbiAgICAgICAgc2Nyb2xsYWJsZVBhcmVudFNjcm9sbFdpZHRoID0gZ2V0RG9jdW1lbnRTY3JvbGxXaWR0aCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNjcm9sbE5vZGUgPSBzY3JvbGxhYmxlUGFyZW50IGFzIEhUTUxFbGVtZW50O1xuICAgICAgICBzY3JvbGxhYmxlUGFyZW50Q2xpZW50UmVjdCA9IGdldE11dGFibGVDbGllbnRSZWN0KHNjcm9sbGFibGVQYXJlbnQgYXMgSFRNTEVsZW1lbnQpO1xuICAgICAgICBzY3JvbGxhYmxlUGFyZW50U2Nyb2xsV2lkdGggPSAoc2Nyb2xsYWJsZVBhcmVudCBhcyBIVE1MRWxlbWVudCkuc2Nyb2xsV2lkdGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSU1QT1JUQU5UOiBCeSBkZXNpZ24sIG9ubHkgbGV0IHNjcm9sbCBob3Jpem9udGFsIGlmIHRoZSBzY3JvbGxhYmxlIHBhcmVudCBoYXMgZXhwbGljaXRseSBhbiBzY3JvbGwgaG9yaXpvbnRhbC5cbiAgICAgKiBUaGlzIGxheW91dCBzb2x1dGlvbiBpcyBub3QgZGVzaWduZWQgaW4gbWluZCB0byBoYXZlIGFueSBzY3JvbGwgaG9yaXpvbnRhbCwgYnV0IGV4Y2VwdGlvbmFsbHkgd2UgYWxsb3cgaXQgaW4gdGhpc1xuICAgICAqIHNwZWNpZmljIHVzZSBjYXNlLlxuICAgICAqL1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGlmIChvcHRpb25zLmRpc2FibGVIb3Jpem9udGFsID09IG51bGwgJiYgc2Nyb2xsYWJsZVBhcmVudFNjcm9sbFdpZHRoIDw9IHNjcm9sbGFibGVQYXJlbnRDbGllbnRSZWN0LndpZHRoKSB7XG4gICAgICAgIG9wdGlvbnMuZGlzYWJsZUhvcml6b250YWwgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiAoc291cmNlJCkgPT4gc291cmNlJC5waXBlKFxuICAgICAgICBtYXAoKHtwb2ludGVyWCwgcG9pbnRlcll9KSA9PiB7XG4gICAgICAgICAgICBsZXQgdmVydGljYWxTY3JvbGxEaXJlY3Rpb24gPSBnZXRWZXJ0aWNhbFNjcm9sbERpcmVjdGlvbihzY3JvbGxhYmxlUGFyZW50Q2xpZW50UmVjdCwgcG9pbnRlclkpO1xuICAgICAgICAgICAgbGV0IGhvcml6b250YWxTY3JvbGxEaXJlY3Rpb24gPSBnZXRIb3Jpem9udGFsU2Nyb2xsRGlyZWN0aW9uKHNjcm9sbGFibGVQYXJlbnRDbGllbnRSZWN0LCBwb2ludGVyWCk7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHNjcm9sbCBkaXJlY3Rpb25zIGFyZSBkaXNhYmxlZC5cbiAgICAgICAgICAgIGlmIChvcHRpb25zPy5kaXNhYmxlVmVydGljYWwpIHtcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbFNjcm9sbERpcmVjdGlvbiA9IEF1dG9TY3JvbGxWZXJ0aWNhbERpcmVjdGlvbi5OT05FO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnM/LmRpc2FibGVIb3Jpem9udGFsKSB7XG4gICAgICAgICAgICAgICAgaG9yaXpvbnRhbFNjcm9sbERpcmVjdGlvbiA9IEF1dG9TY3JvbGxIb3Jpem9udGFsRGlyZWN0aW9uLk5PTkU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7dmVydGljYWxTY3JvbGxEaXJlY3Rpb24sIGhvcml6b250YWxTY3JvbGxEaXJlY3Rpb259O1xuICAgICAgICB9KSxcbiAgICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKHByZXYsIGFjdHVhbCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHByZXYudmVydGljYWxTY3JvbGxEaXJlY3Rpb24gPT09IGFjdHVhbC52ZXJ0aWNhbFNjcm9sbERpcmVjdGlvblxuICAgICAgICAgICAgICAgICYmIHByZXYuaG9yaXpvbnRhbFNjcm9sbERpcmVjdGlvbiA9PT0gYWN0dWFsLmhvcml6b250YWxTY3JvbGxEaXJlY3Rpb247XG4gICAgICAgIH0pLFxuICAgICAgICBzd2l0Y2hNYXAoKHt2ZXJ0aWNhbFNjcm9sbERpcmVjdGlvbiwgaG9yaXpvbnRhbFNjcm9sbERpcmVjdGlvbn0pID0+IHtcbiAgICAgICAgICAgIGlmICh2ZXJ0aWNhbFNjcm9sbERpcmVjdGlvbiB8fCBob3Jpem9udGFsU2Nyb2xsRGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNjcm9sbFRvRGlyZWN0aW9uSW50ZXJ2YWwkKHNjcm9sbE5vZGUsIHZlcnRpY2FsU2Nyb2xsRGlyZWN0aW9uLCBob3Jpem9udGFsU2Nyb2xsRGlyZWN0aW9uLCBvcHRpb25zPy5zY3JvbGxTdGVwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE5FVkVSO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICk7XG59XG5cbi8qKlxuICogRW1pdHMgb24gRVZFUlkgc2Nyb2xsIGV2ZW50IGFuZCByZXR1cm5zIHRoZSBhY2N1bXVsYXRlZCBzY3JvbGwgb2Zmc2V0IHJlbGF0aXZlIHRvIHRoZSBpbml0aWFsIHNjcm9sbCBwb3NpdGlvbi5cbiAqIEBwYXJhbSBzY3JvbGxhYmxlUGFyZW50LCBub2RlIGluIHdoaWNoIHNjcm9sbCBldmVudHMgd291bGQgYmUgbGlzdGVuZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBrdGRHZXRTY3JvbGxUb3RhbFJlbGF0aXZlRGlmZmVyZW5jZSQoc2Nyb2xsYWJsZVBhcmVudDogSFRNTEVsZW1lbnQgfCBEb2N1bWVudCk6IE9ic2VydmFibGU8eyB0b3A6IG51bWJlciwgbGVmdDogbnVtYmVyIH0+IHtcbiAgICBsZXQgc2Nyb2xsSW5pdGlhbFBvc2l0aW9uO1xuXG4gICAgLy8gQ2FsY3VsYXRlIGluaXRpYWwgc2Nyb2xsIHBvc2l0aW9uXG4gICAgaWYgKHNjcm9sbGFibGVQYXJlbnQgPT09IGRvY3VtZW50KSB7XG4gICAgICAgIHNjcm9sbEluaXRpYWxQb3NpdGlvbiA9IGdldFZpZXdwb3J0U2Nyb2xsUG9zaXRpb24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzY3JvbGxJbml0aWFsUG9zaXRpb24gPSB7XG4gICAgICAgICAgICB0b3A6IChzY3JvbGxhYmxlUGFyZW50IGFzIEhUTUxFbGVtZW50KS5zY3JvbGxUb3AsXG4gICAgICAgICAgICBsZWZ0OiAoc2Nyb2xsYWJsZVBhcmVudCBhcyBIVE1MRWxlbWVudCkuc2Nyb2xsTGVmdFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmcm9tRXZlbnQoc2Nyb2xsYWJsZVBhcmVudCwgJ3Njcm9sbCcsIGt0ZE5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMoe2NhcHR1cmU6IHRydWV9KSBhcyBBZGRFdmVudExpc3RlbmVyT3B0aW9ucykucGlwZShcbiAgICAgICAgbWFwKCgpID0+IHtcbiAgICAgICAgICAgIGxldCBuZXdUb3A6IG51bWJlcjtcbiAgICAgICAgICAgIGxldCBuZXdMZWZ0OiBudW1iZXI7XG5cbiAgICAgICAgICAgIGlmIChzY3JvbGxhYmxlUGFyZW50ID09PSBkb2N1bWVudCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZpZXdwb3J0U2Nyb2xsUG9zaXRpb24gPSBnZXRWaWV3cG9ydFNjcm9sbFBvc2l0aW9uKCk7XG4gICAgICAgICAgICAgICAgbmV3VG9wID0gdmlld3BvcnRTY3JvbGxQb3NpdGlvbi50b3A7XG4gICAgICAgICAgICAgICAgbmV3TGVmdCA9IHZpZXdwb3J0U2Nyb2xsUG9zaXRpb24ubGVmdDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3VG9wID0gKHNjcm9sbGFibGVQYXJlbnQgYXMgSFRNTEVsZW1lbnQpLnNjcm9sbFRvcDtcbiAgICAgICAgICAgICAgICBuZXdMZWZ0ID0gKHNjcm9sbGFibGVQYXJlbnQgYXMgSFRNTEVsZW1lbnQpLnNjcm9sbExlZnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHRvcERpZmZlcmVuY2UgPSBzY3JvbGxJbml0aWFsUG9zaXRpb24udG9wIC0gbmV3VG9wO1xuICAgICAgICAgICAgY29uc3QgbGVmdERpZmZlcmVuY2UgPSBzY3JvbGxJbml0aWFsUG9zaXRpb24ubGVmdCAtIG5ld0xlZnQ7XG5cbiAgICAgICAgICAgIHJldHVybiB7dG9wOiB0b3BEaWZmZXJlbmNlLCBsZWZ0OiBsZWZ0RGlmZmVyZW5jZX07XG4gICAgICAgIH0pXG4gICAgKTtcblxufVxuXG4vKiogUmV0dXJucyB0aGUgdmlld3BvcnQncyB3aWR0aCBhbmQgaGVpZ2h0LiAqL1xuZnVuY3Rpb24gZ2V0Vmlld3BvcnRTaXplKCk6IHsgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIgfSB7XG4gICAgY29uc3QgX3dpbmRvdyA9IGRvY3VtZW50LmRlZmF1bHRWaWV3IHx8IHdpbmRvdztcbiAgICByZXR1cm4ge1xuICAgICAgICB3aWR0aDogX3dpbmRvdy5pbm5lcldpZHRoLFxuICAgICAgICBoZWlnaHQ6IF93aW5kb3cuaW5uZXJIZWlnaHRcbiAgICB9O1xuXG59XG5cbi8qKiBHZXRzIGEgQ2xpZW50UmVjdCBmb3IgdGhlIHZpZXdwb3J0J3MgYm91bmRzLiAqL1xuZnVuY3Rpb24gZ2V0Vmlld3BvcnRSZWN0KCk6IENsaWVudFJlY3Qge1xuICAgIC8vIFVzZSB0aGUgZG9jdW1lbnQgZWxlbWVudCdzIGJvdW5kaW5nIHJlY3QgcmF0aGVyIHRoYW4gdGhlIHdpbmRvdyBzY3JvbGwgcHJvcGVydGllc1xuICAgIC8vIChlLmcuIHBhZ2VZT2Zmc2V0LCBzY3JvbGxZKSBkdWUgdG8gaW4gaXNzdWUgaW4gQ2hyb21lIGFuZCBJRSB3aGVyZSB3aW5kb3cgc2Nyb2xsXG4gICAgLy8gcHJvcGVydGllcyBhbmQgY2xpZW50IGNvb3JkaW5hdGVzIChib3VuZGluZ0NsaWVudFJlY3QsIGNsaWVudFgvWSwgZXRjLikgYXJlIGluIGRpZmZlcmVudFxuICAgIC8vIGNvbmNlcHR1YWwgdmlld3BvcnRzLiBVbmRlciBtb3N0IGNpcmN1bXN0YW5jZXMgdGhlc2Ugdmlld3BvcnRzIGFyZSBlcXVpdmFsZW50LCBidXQgdGhleVxuICAgIC8vIGNhbiBkaXNhZ3JlZSB3aGVuIHRoZSBwYWdlIGlzIHBpbmNoLXpvb21lZCAob24gZGV2aWNlcyB0aGF0IHN1cHBvcnQgdG91Y2gpLlxuICAgIC8vIFNlZSBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD00ODkyMDYjYzRcbiAgICAvLyBXZSB1c2UgdGhlIGRvY3VtZW50RWxlbWVudCBpbnN0ZWFkIG9mIHRoZSBib2R5IGJlY2F1c2UsIGJ5IGRlZmF1bHQgKHdpdGhvdXQgYSBjc3MgcmVzZXQpXG4gICAgLy8gYnJvd3NlcnMgdHlwaWNhbGx5IGdpdmUgdGhlIGRvY3VtZW50IGJvZHkgYW4gOHB4IG1hcmdpbiwgd2hpY2ggaXMgbm90IGluY2x1ZGVkIGluXG4gICAgLy8gZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuXG4gICAgY29uc3Qgc2Nyb2xsUG9zaXRpb24gPSBnZXRWaWV3cG9ydFNjcm9sbFBvc2l0aW9uKCk7XG4gICAgY29uc3Qge3dpZHRoLCBoZWlnaHR9ID0gZ2V0Vmlld3BvcnRTaXplKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0b3A6IHNjcm9sbFBvc2l0aW9uLnRvcCxcbiAgICAgICAgbGVmdDogc2Nyb2xsUG9zaXRpb24ubGVmdCxcbiAgICAgICAgYm90dG9tOiBzY3JvbGxQb3NpdGlvbi50b3AgKyBoZWlnaHQsXG4gICAgICAgIHJpZ2h0OiBzY3JvbGxQb3NpdGlvbi5sZWZ0ICsgd2lkdGgsXG4gICAgICAgIGhlaWdodCxcbiAgICAgICAgd2lkdGgsXG4gICAgfTtcbn1cblxuLyoqIEdldHMgdGhlICh0b3AsIGxlZnQpIHNjcm9sbCBwb3NpdGlvbiBvZiB0aGUgdmlld3BvcnQuICovXG5mdW5jdGlvbiBnZXRWaWV3cG9ydFNjcm9sbFBvc2l0aW9uKCk6IHsgdG9wOiBudW1iZXIsIGxlZnQ6IG51bWJlciB9IHtcblxuICAgIC8vIFRoZSB0b3AtbGVmdC1jb3JuZXIgb2YgdGhlIHZpZXdwb3J0IGlzIGRldGVybWluZWQgYnkgdGhlIHNjcm9sbCBwb3NpdGlvbiBvZiB0aGUgZG9jdW1lbnRcbiAgICAvLyBib2R5LCBub3JtYWxseSBqdXN0IChzY3JvbGxMZWZ0LCBzY3JvbGxUb3ApLiBIb3dldmVyLCBDaHJvbWUgYW5kIEZpcmVmb3ggZGlzYWdyZWUgYWJvdXRcbiAgICAvLyB3aGV0aGVyIGBkb2N1bWVudC5ib2R5YCBvciBgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50YCBpcyB0aGUgc2Nyb2xsZWQgZWxlbWVudCwgc28gcmVhZGluZ1xuICAgIC8vIGBzY3JvbGxUb3BgIGFuZCBgc2Nyb2xsTGVmdGAgaXMgaW5jb25zaXN0ZW50LiBIb3dldmVyLCB1c2luZyB0aGUgYm91bmRpbmcgcmVjdCBvZlxuICAgIC8vIGBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRgIHdvcmtzIGNvbnNpc3RlbnRseSwgd2hlcmUgdGhlIGB0b3BgIGFuZCBgbGVmdGAgdmFsdWVzIHdpbGxcbiAgICAvLyBlcXVhbCBuZWdhdGl2ZSB0aGUgc2Nyb2xsIHBvc2l0aW9uLlxuICAgIGNvbnN0IHdpbmRvd1JlZiA9IGRvY3VtZW50LmRlZmF1bHRWaWV3IHx8IHdpbmRvdztcbiAgICBjb25zdCBkb2N1bWVudEVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQhO1xuICAgIGNvbnN0IGRvY3VtZW50UmVjdCA9IGRvY3VtZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIGNvbnN0IHRvcCA9IC1kb2N1bWVudFJlY3QudG9wIHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wIHx8IHdpbmRvd1JlZi5zY3JvbGxZIHx8XG4gICAgICAgIGRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgfHwgMDtcblxuICAgIGNvbnN0IGxlZnQgPSAtZG9jdW1lbnRSZWN0LmxlZnQgfHwgZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0IHx8IHdpbmRvd1JlZi5zY3JvbGxYIHx8XG4gICAgICAgIGRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0IHx8IDA7XG5cbiAgICByZXR1cm4ge3RvcCwgbGVmdH07XG59XG5cbi8qKiBSZXR1cm5zIHRoZSBkb2N1bWVudCBzY3JvbGwgd2lkdGggKi9cbmZ1bmN0aW9uIGdldERvY3VtZW50U2Nyb2xsV2lkdGgoKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KGRvY3VtZW50LmJvZHkuc2Nyb2xsV2lkdGgsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxXaWR0aCk7XG59XG5cbiJdfQ==