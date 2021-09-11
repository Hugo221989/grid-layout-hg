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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItZ3JpZC1sYXlvdXQvc3JjLyIsInNvdXJjZXMiOlsibGliL3V0aWxzL3Njcm9sbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQWMsTUFBTSxNQUFNLENBQUM7QUFDdkYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0UsT0FBTyxFQUFFLGtDQUFrQyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDekUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFeEM7OztHQUdHO0FBQ0gsTUFBTSwwQkFBMEIsR0FBRyxJQUFJLENBQUM7QUFjeEM7Ozs7R0FJRztBQUNILFNBQVMsdUJBQXVCLENBQUMsSUFBMEIsRUFBRSxNQUFjO0lBQ3ZFLElBQUksSUFBSSxLQUFLLE1BQU0sRUFBRTtRQUNoQixJQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztLQUN4QztTQUFNO1FBQ0gsMEZBQTBGO1FBQ3pGLElBQW9CLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQztLQUM3QztBQUNMLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBUyx5QkFBeUIsQ0FBQyxJQUEwQixFQUFFLE1BQWM7SUFDekUsSUFBSSxJQUFJLEtBQUssTUFBTSxFQUFFO1FBQ2hCLElBQWUsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3hDO1NBQU07UUFDSCwwRkFBMEY7UUFDekYsSUFBb0IsQ0FBQyxVQUFVLElBQUksTUFBTSxDQUFDO0tBQzlDO0FBQ0wsQ0FBQztBQUdEOzs7O0dBSUc7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QUFlLEdBQUcsUUFBUSxDQUFDLGVBQWdCLENBQUM7SUFDbEQsTUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDLHFCQUFxQixFQUFFLENBQUM7SUFFN0QsTUFBTSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxPQUFPO1FBQ3pFLGVBQWUsQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDO0lBRW5DLE1BQU0sSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxTQUFTLENBQUMsT0FBTztRQUM1RSxlQUFlLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQztJQUVwQyxPQUFPLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQyxDQUFDO0FBQ3ZCLENBQUM7QUFFRCx3Q0FBd0M7QUFDeEMsU0FBUyxzQkFBc0I7SUFDM0IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDckYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyLCBmcm9tRXZlbnQsIGludGVydmFsLCBORVZFUiwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGlzdGluY3RVbnRpbENoYW5nZWQsIG1hcCwgc3dpdGNoTWFwLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBrdGROb3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zIH0gZnJvbSAnLi9wYXNzaXZlLWxpc3RlbmVycyc7XG5pbXBvcnQgeyBnZXRNdXRhYmxlQ2xpZW50UmVjdCB9IGZyb20gJy4vY2xpZW50LXJlY3QnO1xuaW1wb3J0IHsga3RkTm9FbWl0IH0gZnJvbSAnLi9vcGVyYXRvcnMnO1xuXG4vKipcbiAqIFByb3hpbWl0eSwgYXMgYSByYXRpbyB0byB3aWR0aC9oZWlnaHQgYXQgd2hpY2ggdG8gc3RhcnQgYXV0by1zY3JvbGxpbmcuXG4gKiBUaGUgdmFsdWUgY29tZXMgZnJvbSB0cnlpbmcgaXQgb3V0IG1hbnVhbGx5IHVudGlsIGl0IGZlZWxzIHJpZ2h0LlxuICovXG5jb25zdCBTQ1JPTExfUFJPWElNSVRZX1RIUkVTSE9MRCA9IDAuMDU7XG5cbi8qKiBWZXJ0aWNhbCBkaXJlY3Rpb24gaW4gd2hpY2ggd2UgY2FuIGF1dG8tc2Nyb2xsLiAqL1xuY29uc3QgZW51bSBBdXRvU2Nyb2xsVmVydGljYWxEaXJlY3Rpb24ge05PTkUsIFVQLCBET1dOfVxuXG4vKiogSG9yaXpvbnRhbCBkaXJlY3Rpb24gaW4gd2hpY2ggd2UgY2FuIGF1dG8tc2Nyb2xsLiAqL1xuY29uc3QgZW51bSBBdXRvU2Nyb2xsSG9yaXpvbnRhbERpcmVjdGlvbiB7Tk9ORSwgTEVGVCwgUklHSFR9XG5cbmV4cG9ydCBpbnRlcmZhY2UgS3RkU2Nyb2xsUG9zaXRpb24ge1xuICAgIHRvcDogbnVtYmVyO1xuICAgIGxlZnQ6IG51bWJlcjtcbn1cblxuXG4vKipcbiAqIEluY3JlbWVudHMgdGhlIHZlcnRpY2FsIHNjcm9sbCBwb3NpdGlvbiBvZiBhIG5vZGUuXG4gKiBAcGFyYW0gbm9kZSBOb2RlIHdob3NlIHNjcm9sbCBwb3NpdGlvbiBzaG91bGQgY2hhbmdlLlxuICogQHBhcmFtIGFtb3VudCBBbW91bnQgb2YgcGl4ZWxzIHRoYXQgdGhlIGBub2RlYCBzaG91bGQgYmUgc2Nyb2xsZWQuXG4gKi9cbmZ1bmN0aW9uIGluY3JlbWVudFZlcnRpY2FsU2Nyb2xsKG5vZGU6IEhUTUxFbGVtZW50IHwgV2luZG93LCBhbW91bnQ6IG51bWJlcikge1xuICAgIGlmIChub2RlID09PSB3aW5kb3cpIHtcbiAgICAgICAgKG5vZGUgYXMgV2luZG93KS5zY3JvbGxCeSgwLCBhbW91bnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIElkZWFsbHkgd2UgY291bGQgdXNlIGBFbGVtZW50LnNjcm9sbEJ5YCBoZXJlIGFzIHdlbGwsIGJ1dCBJRSBhbmQgRWRnZSBkb24ndCBzdXBwb3J0IGl0LlxuICAgICAgICAobm9kZSBhcyBIVE1MRWxlbWVudCkuc2Nyb2xsVG9wICs9IGFtb3VudDtcbiAgICB9XG59XG5cbi8qKlxuICogSW5jcmVtZW50cyB0aGUgaG9yaXpvbnRhbCBzY3JvbGwgcG9zaXRpb24gb2YgYSBub2RlLlxuICogQHBhcmFtIG5vZGUgTm9kZSB3aG9zZSBzY3JvbGwgcG9zaXRpb24gc2hvdWxkIGNoYW5nZS5cbiAqIEBwYXJhbSBhbW91bnQgQW1vdW50IG9mIHBpeGVscyB0aGF0IHRoZSBgbm9kZWAgc2hvdWxkIGJlIHNjcm9sbGVkLlxuICovXG5mdW5jdGlvbiBpbmNyZW1lbnRIb3Jpem9udGFsU2Nyb2xsKG5vZGU6IEhUTUxFbGVtZW50IHwgV2luZG93LCBhbW91bnQ6IG51bWJlcikge1xuICAgIGlmIChub2RlID09PSB3aW5kb3cpIHtcbiAgICAgICAgKG5vZGUgYXMgV2luZG93KS5zY3JvbGxCeShhbW91bnQsIDApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIElkZWFsbHkgd2UgY291bGQgdXNlIGBFbGVtZW50LnNjcm9sbEJ5YCBoZXJlIGFzIHdlbGwsIGJ1dCBJRSBhbmQgRWRnZSBkb24ndCBzdXBwb3J0IGl0LlxuICAgICAgICAobm9kZSBhcyBIVE1MRWxlbWVudCkuc2Nyb2xsTGVmdCArPSBhbW91bnQ7XG4gICAgfVxufVxuXG5cbi8qKlxuICogR2V0cyB3aGV0aGVyIHRoZSB2ZXJ0aWNhbCBhdXRvLXNjcm9sbCBkaXJlY3Rpb24gb2YgYSBub2RlLlxuICogQHBhcmFtIGNsaWVudFJlY3QgRGltZW5zaW9ucyBvZiB0aGUgbm9kZS5cbiAqIEBwYXJhbSBwb2ludGVyWSBQb3NpdGlvbiBvZiB0aGUgdXNlcidzIHBvaW50ZXIgYWxvbmcgdGhlIHkgYXhpcy5cbiAqL1xuZnVuY3Rpb24gZ2V0VmVydGljYWxTY3JvbGxEaXJlY3Rpb24oY2xpZW50UmVjdDogQ2xpZW50UmVjdCwgcG9pbnRlclk6IG51bWJlcikge1xuICAgIGNvbnN0IHt0b3AsIGJvdHRvbSwgaGVpZ2h0fSA9IGNsaWVudFJlY3Q7XG4gICAgY29uc3QgeVRocmVzaG9sZCA9IGhlaWdodCAqIFNDUk9MTF9QUk9YSU1JVFlfVEhSRVNIT0xEO1xuXG4gICAgaWYgKHBvaW50ZXJZID49IHRvcCAtIHlUaHJlc2hvbGQgJiYgcG9pbnRlclkgPD0gdG9wICsgeVRocmVzaG9sZCkge1xuICAgICAgICByZXR1cm4gQXV0b1Njcm9sbFZlcnRpY2FsRGlyZWN0aW9uLlVQO1xuICAgIH0gZWxzZSBpZiAocG9pbnRlclkgPj0gYm90dG9tIC0geVRocmVzaG9sZCAmJiBwb2ludGVyWSA8PSBib3R0b20gKyB5VGhyZXNob2xkKSB7XG4gICAgICAgIHJldHVybiBBdXRvU2Nyb2xsVmVydGljYWxEaXJlY3Rpb24uRE9XTjtcbiAgICB9XG5cbiAgICByZXR1cm4gQXV0b1Njcm9sbFZlcnRpY2FsRGlyZWN0aW9uLk5PTkU7XG59XG5cbi8qKlxuICogR2V0cyB3aGV0aGVyIHRoZSBob3Jpem9udGFsIGF1dG8tc2Nyb2xsIGRpcmVjdGlvbiBvZiBhIG5vZGUuXG4gKiBAcGFyYW0gY2xpZW50UmVjdCBEaW1lbnNpb25zIG9mIHRoZSBub2RlLlxuICogQHBhcmFtIHBvaW50ZXJYIFBvc2l0aW9uIG9mIHRoZSB1c2VyJ3MgcG9pbnRlciBhbG9uZyB0aGUgeCBheGlzLlxuICovXG5mdW5jdGlvbiBnZXRIb3Jpem9udGFsU2Nyb2xsRGlyZWN0aW9uKGNsaWVudFJlY3Q6IENsaWVudFJlY3QsIHBvaW50ZXJYOiBudW1iZXIpIHtcbiAgICBjb25zdCB7bGVmdCwgcmlnaHQsIHdpZHRofSA9IGNsaWVudFJlY3Q7XG4gICAgY29uc3QgeFRocmVzaG9sZCA9IHdpZHRoICogU0NST0xMX1BST1hJTUlUWV9USFJFU0hPTEQ7XG5cbiAgICBpZiAocG9pbnRlclggPj0gbGVmdCAtIHhUaHJlc2hvbGQgJiYgcG9pbnRlclggPD0gbGVmdCArIHhUaHJlc2hvbGQpIHtcbiAgICAgICAgcmV0dXJuIEF1dG9TY3JvbGxIb3Jpem9udGFsRGlyZWN0aW9uLkxFRlQ7XG4gICAgfSBlbHNlIGlmIChwb2ludGVyWCA+PSByaWdodCAtIHhUaHJlc2hvbGQgJiYgcG9pbnRlclggPD0gcmlnaHQgKyB4VGhyZXNob2xkKSB7XG4gICAgICAgIHJldHVybiBBdXRvU2Nyb2xsSG9yaXpvbnRhbERpcmVjdGlvbi5SSUdIVDtcbiAgICB9XG5cbiAgICByZXR1cm4gQXV0b1Njcm9sbEhvcml6b250YWxEaXJlY3Rpb24uTk9ORTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGFuIG9ic2VydmFibGUgdGhhdCBzY2hlZHVsZXMgYSBsb29wIGFuZCBhcHBseSBzY3JvbGwgb24gdGhlIHNjcm9sbE5vZGUgaW50byB0aGUgc3BlY2lmaWVkIGRpcmVjdGlvbi9zLlxuICogVGhpcyBvYnNlcnZhYmxlIGRvZXNuJ3QgZW1pdCwgaXQganVzdCBwZXJmb3JtcyB0aGUgJ3Njcm9sbCcgc2lkZSBlZmZlY3QuXG4gKiBAcGFyYW0gc2Nyb2xsTm9kZSwgbm9kZSB3aGVyZSB0aGUgc2Nyb2xsIHdvdWxkIGJlIGFwcGxpZWQuXG4gKiBAcGFyYW0gdmVydGljYWxTY3JvbGxEaXJlY3Rpb24sIHZlcnRpY2FsIGRpcmVjdGlvbiBvZiB0aGUgc2Nyb2xsLlxuICogQHBhcmFtIGhvcml6b250YWxTY3JvbGxEaXJlY3Rpb24sIGhvcml6b250YWwgZGlyZWN0aW9uIG9mIHRoZSBzY3JvbGwuXG4gKiBAcGFyYW0gc2Nyb2xsU3RlcCwgc2Nyb2xsIHN0ZXAgaW4gQ1NTIHBpeGVscyB0aGF0IHdvdWxkIGJlIGFwcGxpZWQgaW4gZXZlcnkgbG9vcC5cbiAqL1xuZnVuY3Rpb24gc2Nyb2xsVG9EaXJlY3Rpb25JbnRlcnZhbCQoc2Nyb2xsTm9kZTogSFRNTEVsZW1lbnQgfCBXaW5kb3csIHZlcnRpY2FsU2Nyb2xsRGlyZWN0aW9uOiBBdXRvU2Nyb2xsVmVydGljYWxEaXJlY3Rpb24sIGhvcml6b250YWxTY3JvbGxEaXJlY3Rpb246IEF1dG9TY3JvbGxIb3Jpem9udGFsRGlyZWN0aW9uLCBzY3JvbGxTdGVwOiBudW1iZXIgPSAyKSB7XG4gICAgcmV0dXJuIGludGVydmFsKDAsIGFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyKVxuICAgICAgICAucGlwZShcbiAgICAgICAgICAgIHRhcCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHZlcnRpY2FsU2Nyb2xsRGlyZWN0aW9uID09PSBBdXRvU2Nyb2xsVmVydGljYWxEaXJlY3Rpb24uVVApIHtcbiAgICAgICAgICAgICAgICAgICAgaW5jcmVtZW50VmVydGljYWxTY3JvbGwoc2Nyb2xsTm9kZSwgLXNjcm9sbFN0ZXApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodmVydGljYWxTY3JvbGxEaXJlY3Rpb24gPT09IEF1dG9TY3JvbGxWZXJ0aWNhbERpcmVjdGlvbi5ET1dOKSB7XG4gICAgICAgICAgICAgICAgICAgIGluY3JlbWVudFZlcnRpY2FsU2Nyb2xsKHNjcm9sbE5vZGUsIHNjcm9sbFN0ZXApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChob3Jpem9udGFsU2Nyb2xsRGlyZWN0aW9uID09PSBBdXRvU2Nyb2xsSG9yaXpvbnRhbERpcmVjdGlvbi5MRUZUKSB7XG4gICAgICAgICAgICAgICAgICAgIGluY3JlbWVudEhvcml6b250YWxTY3JvbGwoc2Nyb2xsTm9kZSwgLXNjcm9sbFN0ZXApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaG9yaXpvbnRhbFNjcm9sbERpcmVjdGlvbiA9PT0gQXV0b1Njcm9sbEhvcml6b250YWxEaXJlY3Rpb24uUklHSFQpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5jcmVtZW50SG9yaXpvbnRhbFNjcm9sbChzY3JvbGxOb2RlLCBzY3JvbGxTdGVwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGt0ZE5vRW1pdCgpXG4gICAgICAgICk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgS3RkU2Nyb2xsSWZOZWFyRWxlbWVudE9wdGlvbnMge1xuICAgIHNjcm9sbFN0ZXA/OiBudW1iZXI7XG4gICAgZGlzYWJsZVZlcnRpY2FsPzogYm9vbGVhbjtcbiAgICBkaXNhYmxlSG9yaXpvbnRhbD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogR2l2ZW4gYSBzb3VyY2UkIG9ic2VydmFibGUgd2l0aCBwb2ludGVyIGxvY2F0aW9uLCBzY3JvbGwgdGhlIHNjcm9sbE5vZGUgaWYgdGhlIHBvaW50ZXIgaXMgbmVhciB0byBpdC5cbiAqIFRoaXMgb2JzZXJ2YWJsZSBkb2Vzbid0IGVtaXQsIGl0IGp1c3QgcGVyZm9ybXMgYSAnc2Nyb2xsJyBzaWRlIGVmZmVjdC5cbiAqIEBwYXJhbSBzY3JvbGxhYmxlUGFyZW50LCBwYXJlbnQgbm9kZSBpbiB3aGljaCB0aGUgc2Nyb2xsIHdvdWxkIGJlIHBlcmZvcm1lZC5cbiAqIEBwYXJhbSBvcHRpb25zLCBjb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBrdGRTY3JvbGxJZk5lYXJFbGVtZW50Q2xpZW50UmVjdCQoc2Nyb2xsYWJsZVBhcmVudDogSFRNTEVsZW1lbnQgfCBEb2N1bWVudCwgb3B0aW9ucz86IEt0ZFNjcm9sbElmTmVhckVsZW1lbnRPcHRpb25zKTogKHNvdXJjZSQ6IE9ic2VydmFibGU8eyBwb2ludGVyWDogbnVtYmVyLCBwb2ludGVyWTogbnVtYmVyIH0+KSA9PiBPYnNlcnZhYmxlPGFueT4ge1xuXG4gICAgbGV0IHNjcm9sbE5vZGU6IFdpbmRvdyB8IEhUTUxFbGVtZW50O1xuICAgIGxldCBzY3JvbGxhYmxlUGFyZW50Q2xpZW50UmVjdDogQ2xpZW50UmVjdDtcbiAgICBsZXQgc2Nyb2xsYWJsZVBhcmVudFNjcm9sbFdpZHRoOiBudW1iZXI7XG5cbiAgICBpZiAoc2Nyb2xsYWJsZVBhcmVudCA9PT0gZG9jdW1lbnQpIHtcbiAgICAgICAgc2Nyb2xsTm9kZSA9IGRvY3VtZW50LmRlZmF1bHRWaWV3IGFzIFdpbmRvdztcbiAgICAgICAgY29uc3Qge3dpZHRoLCBoZWlnaHR9ID0gZ2V0Vmlld3BvcnRTaXplKCk7XG4gICAgICAgIHNjcm9sbGFibGVQYXJlbnRDbGllbnRSZWN0ID0ge3dpZHRoLCBoZWlnaHQsIHRvcDogMCwgcmlnaHQ6IHdpZHRoLCBib3R0b206IGhlaWdodCwgbGVmdDogMH07XG4gICAgICAgIHNjcm9sbGFibGVQYXJlbnRTY3JvbGxXaWR0aCA9IGdldERvY3VtZW50U2Nyb2xsV2lkdGgoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzY3JvbGxOb2RlID0gc2Nyb2xsYWJsZVBhcmVudCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgc2Nyb2xsYWJsZVBhcmVudENsaWVudFJlY3QgPSBnZXRNdXRhYmxlQ2xpZW50UmVjdChzY3JvbGxhYmxlUGFyZW50IGFzIEhUTUxFbGVtZW50KTtcbiAgICAgICAgc2Nyb2xsYWJsZVBhcmVudFNjcm9sbFdpZHRoID0gKHNjcm9sbGFibGVQYXJlbnQgYXMgSFRNTEVsZW1lbnQpLnNjcm9sbFdpZHRoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElNUE9SVEFOVDogQnkgZGVzaWduLCBvbmx5IGxldCBzY3JvbGwgaG9yaXpvbnRhbCBpZiB0aGUgc2Nyb2xsYWJsZSBwYXJlbnQgaGFzIGV4cGxpY2l0bHkgYW4gc2Nyb2xsIGhvcml6b250YWwuXG4gICAgICogVGhpcyBsYXlvdXQgc29sdXRpb24gaXMgbm90IGRlc2lnbmVkIGluIG1pbmQgdG8gaGF2ZSBhbnkgc2Nyb2xsIGhvcml6b250YWwsIGJ1dCBleGNlcHRpb25hbGx5IHdlIGFsbG93IGl0IGluIHRoaXNcbiAgICAgKiBzcGVjaWZpYyB1c2UgY2FzZS5cbiAgICAgKi9cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAob3B0aW9ucy5kaXNhYmxlSG9yaXpvbnRhbCA9PSBudWxsICYmIHNjcm9sbGFibGVQYXJlbnRTY3JvbGxXaWR0aCA8PSBzY3JvbGxhYmxlUGFyZW50Q2xpZW50UmVjdC53aWR0aCkge1xuICAgICAgICBvcHRpb25zLmRpc2FibGVIb3Jpem9udGFsID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gKHNvdXJjZSQpID0+IHNvdXJjZSQucGlwZShcbiAgICAgICAgbWFwKCh7cG9pbnRlclgsIHBvaW50ZXJZfSkgPT4ge1xuICAgICAgICAgICAgbGV0IHZlcnRpY2FsU2Nyb2xsRGlyZWN0aW9uID0gZ2V0VmVydGljYWxTY3JvbGxEaXJlY3Rpb24oc2Nyb2xsYWJsZVBhcmVudENsaWVudFJlY3QsIHBvaW50ZXJZKTtcbiAgICAgICAgICAgIGxldCBob3Jpem9udGFsU2Nyb2xsRGlyZWN0aW9uID0gZ2V0SG9yaXpvbnRhbFNjcm9sbERpcmVjdGlvbihzY3JvbGxhYmxlUGFyZW50Q2xpZW50UmVjdCwgcG9pbnRlclgpO1xuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBzY3JvbGwgZGlyZWN0aW9ucyBhcmUgZGlzYWJsZWQuXG4gICAgICAgICAgICBpZiAob3B0aW9ucz8uZGlzYWJsZVZlcnRpY2FsKSB7XG4gICAgICAgICAgICAgICAgdmVydGljYWxTY3JvbGxEaXJlY3Rpb24gPSBBdXRvU2Nyb2xsVmVydGljYWxEaXJlY3Rpb24uTk9ORTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zPy5kaXNhYmxlSG9yaXpvbnRhbCkge1xuICAgICAgICAgICAgICAgIGhvcml6b250YWxTY3JvbGxEaXJlY3Rpb24gPSBBdXRvU2Nyb2xsSG9yaXpvbnRhbERpcmVjdGlvbi5OT05FO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge3ZlcnRpY2FsU2Nyb2xsRGlyZWN0aW9uLCBob3Jpem9udGFsU2Nyb2xsRGlyZWN0aW9ufTtcbiAgICAgICAgfSksXG4gICAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKChwcmV2LCBhY3R1YWwpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBwcmV2LnZlcnRpY2FsU2Nyb2xsRGlyZWN0aW9uID09PSBhY3R1YWwudmVydGljYWxTY3JvbGxEaXJlY3Rpb25cbiAgICAgICAgICAgICAgICAmJiBwcmV2Lmhvcml6b250YWxTY3JvbGxEaXJlY3Rpb24gPT09IGFjdHVhbC5ob3Jpem9udGFsU2Nyb2xsRGlyZWN0aW9uO1xuICAgICAgICB9KSxcbiAgICAgICAgc3dpdGNoTWFwKCh7dmVydGljYWxTY3JvbGxEaXJlY3Rpb24sIGhvcml6b250YWxTY3JvbGxEaXJlY3Rpb259KSA9PiB7XG4gICAgICAgICAgICBpZiAodmVydGljYWxTY3JvbGxEaXJlY3Rpb24gfHwgaG9yaXpvbnRhbFNjcm9sbERpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBzY3JvbGxUb0RpcmVjdGlvbkludGVydmFsJChzY3JvbGxOb2RlLCB2ZXJ0aWNhbFNjcm9sbERpcmVjdGlvbiwgaG9yaXpvbnRhbFNjcm9sbERpcmVjdGlvbiwgb3B0aW9ucz8uc2Nyb2xsU3RlcCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBORVZFUjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICApO1xufVxuXG4vKipcbiAqIEVtaXRzIG9uIEVWRVJZIHNjcm9sbCBldmVudCBhbmQgcmV0dXJucyB0aGUgYWNjdW11bGF0ZWQgc2Nyb2xsIG9mZnNldCByZWxhdGl2ZSB0byB0aGUgaW5pdGlhbCBzY3JvbGwgcG9zaXRpb24uXG4gKiBAcGFyYW0gc2Nyb2xsYWJsZVBhcmVudCwgbm9kZSBpbiB3aGljaCBzY3JvbGwgZXZlbnRzIHdvdWxkIGJlIGxpc3RlbmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24ga3RkR2V0U2Nyb2xsVG90YWxSZWxhdGl2ZURpZmZlcmVuY2UkKHNjcm9sbGFibGVQYXJlbnQ6IEhUTUxFbGVtZW50IHwgRG9jdW1lbnQpOiBPYnNlcnZhYmxlPHsgdG9wOiBudW1iZXIsIGxlZnQ6IG51bWJlciB9PiB7XG4gICAgbGV0IHNjcm9sbEluaXRpYWxQb3NpdGlvbjtcblxuICAgIC8vIENhbGN1bGF0ZSBpbml0aWFsIHNjcm9sbCBwb3NpdGlvblxuICAgIGlmIChzY3JvbGxhYmxlUGFyZW50ID09PSBkb2N1bWVudCkge1xuICAgICAgICBzY3JvbGxJbml0aWFsUG9zaXRpb24gPSBnZXRWaWV3cG9ydFNjcm9sbFBvc2l0aW9uKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc2Nyb2xsSW5pdGlhbFBvc2l0aW9uID0ge1xuICAgICAgICAgICAgdG9wOiAoc2Nyb2xsYWJsZVBhcmVudCBhcyBIVE1MRWxlbWVudCkuc2Nyb2xsVG9wLFxuICAgICAgICAgICAgbGVmdDogKHNjcm9sbGFibGVQYXJlbnQgYXMgSFRNTEVsZW1lbnQpLnNjcm9sbExlZnRcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnJvbUV2ZW50KHNjcm9sbGFibGVQYXJlbnQsICdzY3JvbGwnLCBrdGROb3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zKHtjYXB0dXJlOiB0cnVlfSkgYXMgQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMpLnBpcGUoXG4gICAgICAgIG1hcCgoKSA9PiB7XG4gICAgICAgICAgICBsZXQgbmV3VG9wOiBudW1iZXI7XG4gICAgICAgICAgICBsZXQgbmV3TGVmdDogbnVtYmVyO1xuXG4gICAgICAgICAgICBpZiAoc2Nyb2xsYWJsZVBhcmVudCA9PT0gZG9jdW1lbnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2aWV3cG9ydFNjcm9sbFBvc2l0aW9uID0gZ2V0Vmlld3BvcnRTY3JvbGxQb3NpdGlvbigpO1xuICAgICAgICAgICAgICAgIG5ld1RvcCA9IHZpZXdwb3J0U2Nyb2xsUG9zaXRpb24udG9wO1xuICAgICAgICAgICAgICAgIG5ld0xlZnQgPSB2aWV3cG9ydFNjcm9sbFBvc2l0aW9uLmxlZnQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld1RvcCA9IChzY3JvbGxhYmxlUGFyZW50IGFzIEhUTUxFbGVtZW50KS5zY3JvbGxUb3A7XG4gICAgICAgICAgICAgICAgbmV3TGVmdCA9IChzY3JvbGxhYmxlUGFyZW50IGFzIEhUTUxFbGVtZW50KS5zY3JvbGxMZWZ0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB0b3BEaWZmZXJlbmNlID0gc2Nyb2xsSW5pdGlhbFBvc2l0aW9uLnRvcCAtIG5ld1RvcDtcbiAgICAgICAgICAgIGNvbnN0IGxlZnREaWZmZXJlbmNlID0gc2Nyb2xsSW5pdGlhbFBvc2l0aW9uLmxlZnQgLSBuZXdMZWZ0O1xuXG4gICAgICAgICAgICByZXR1cm4ge3RvcDogdG9wRGlmZmVyZW5jZSwgbGVmdDogbGVmdERpZmZlcmVuY2V9O1xuICAgICAgICB9KVxuICAgICk7XG5cbn1cblxuLyoqIFJldHVybnMgdGhlIHZpZXdwb3J0J3Mgd2lkdGggYW5kIGhlaWdodC4gKi9cbmZ1bmN0aW9uIGdldFZpZXdwb3J0U2l6ZSgpOiB7IHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyIH0ge1xuICAgIGNvbnN0IF93aW5kb3cgPSBkb2N1bWVudC5kZWZhdWx0VmlldyB8fCB3aW5kb3c7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgd2lkdGg6IF93aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgICAgaGVpZ2h0OiBfd2luZG93LmlubmVySGVpZ2h0XG4gICAgfTtcblxufVxuXG4vKiogR2V0cyBhIENsaWVudFJlY3QgZm9yIHRoZSB2aWV3cG9ydCdzIGJvdW5kcy4gKi9cbmZ1bmN0aW9uIGdldFZpZXdwb3J0UmVjdCgpOiBDbGllbnRSZWN0IHtcbiAgICAvLyBVc2UgdGhlIGRvY3VtZW50IGVsZW1lbnQncyBib3VuZGluZyByZWN0IHJhdGhlciB0aGFuIHRoZSB3aW5kb3cgc2Nyb2xsIHByb3BlcnRpZXNcbiAgICAvLyAoZS5nLiBwYWdlWU9mZnNldCwgc2Nyb2xsWSkgZHVlIHRvIGluIGlzc3VlIGluIENocm9tZSBhbmQgSUUgd2hlcmUgd2luZG93IHNjcm9sbFxuICAgIC8vIHByb3BlcnRpZXMgYW5kIGNsaWVudCBjb29yZGluYXRlcyAoYm91bmRpbmdDbGllbnRSZWN0LCBjbGllbnRYL1ksIGV0Yy4pIGFyZSBpbiBkaWZmZXJlbnRcbiAgICAvLyBjb25jZXB0dWFsIHZpZXdwb3J0cy4gVW5kZXIgbW9zdCBjaXJjdW1zdGFuY2VzIHRoZXNlIHZpZXdwb3J0cyBhcmUgZXF1aXZhbGVudCwgYnV0IHRoZXlcbiAgICAvLyBjYW4gZGlzYWdyZWUgd2hlbiB0aGUgcGFnZSBpcyBwaW5jaC16b29tZWQgKG9uIGRldmljZXMgdGhhdCBzdXBwb3J0IHRvdWNoKS5cbiAgICAvLyBTZWUgaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NDg5MjA2I2M0XG4gICAgLy8gV2UgdXNlIHRoZSBkb2N1bWVudEVsZW1lbnQgaW5zdGVhZCBvZiB0aGUgYm9keSBiZWNhdXNlLCBieSBkZWZhdWx0ICh3aXRob3V0IGEgY3NzIHJlc2V0KVxuICAgIC8vIGJyb3dzZXJzIHR5cGljYWxseSBnaXZlIHRoZSBkb2N1bWVudCBib2R5IGFuIDhweCBtYXJnaW4sIHdoaWNoIGlzIG5vdCBpbmNsdWRlZCBpblxuICAgIC8vIGdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLlxuICAgIGNvbnN0IHNjcm9sbFBvc2l0aW9uID0gZ2V0Vmlld3BvcnRTY3JvbGxQb3NpdGlvbigpO1xuICAgIGNvbnN0IHt3aWR0aCwgaGVpZ2h0fSA9IGdldFZpZXdwb3J0U2l6ZSgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdG9wOiBzY3JvbGxQb3NpdGlvbi50b3AsXG4gICAgICAgIGxlZnQ6IHNjcm9sbFBvc2l0aW9uLmxlZnQsXG4gICAgICAgIGJvdHRvbTogc2Nyb2xsUG9zaXRpb24udG9wICsgaGVpZ2h0LFxuICAgICAgICByaWdodDogc2Nyb2xsUG9zaXRpb24ubGVmdCArIHdpZHRoLFxuICAgICAgICBoZWlnaHQsXG4gICAgICAgIHdpZHRoLFxuICAgIH07XG59XG5cbi8qKiBHZXRzIHRoZSAodG9wLCBsZWZ0KSBzY3JvbGwgcG9zaXRpb24gb2YgdGhlIHZpZXdwb3J0LiAqL1xuZnVuY3Rpb24gZ2V0Vmlld3BvcnRTY3JvbGxQb3NpdGlvbigpOiB7IHRvcDogbnVtYmVyLCBsZWZ0OiBudW1iZXIgfSB7XG5cbiAgICAvLyBUaGUgdG9wLWxlZnQtY29ybmVyIG9mIHRoZSB2aWV3cG9ydCBpcyBkZXRlcm1pbmVkIGJ5IHRoZSBzY3JvbGwgcG9zaXRpb24gb2YgdGhlIGRvY3VtZW50XG4gICAgLy8gYm9keSwgbm9ybWFsbHkganVzdCAoc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wKS4gSG93ZXZlciwgQ2hyb21lIGFuZCBGaXJlZm94IGRpc2FncmVlIGFib3V0XG4gICAgLy8gd2hldGhlciBgZG9jdW1lbnQuYm9keWAgb3IgYGRvY3VtZW50LmRvY3VtZW50RWxlbWVudGAgaXMgdGhlIHNjcm9sbGVkIGVsZW1lbnQsIHNvIHJlYWRpbmdcbiAgICAvLyBgc2Nyb2xsVG9wYCBhbmQgYHNjcm9sbExlZnRgIGlzIGluY29uc2lzdGVudC4gSG93ZXZlciwgdXNpbmcgdGhlIGJvdW5kaW5nIHJlY3Qgb2ZcbiAgICAvLyBgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50YCB3b3JrcyBjb25zaXN0ZW50bHksIHdoZXJlIHRoZSBgdG9wYCBhbmQgYGxlZnRgIHZhbHVlcyB3aWxsXG4gICAgLy8gZXF1YWwgbmVnYXRpdmUgdGhlIHNjcm9sbCBwb3NpdGlvbi5cbiAgICBjb25zdCB3aW5kb3dSZWYgPSBkb2N1bWVudC5kZWZhdWx0VmlldyB8fCB3aW5kb3c7XG4gICAgY29uc3QgZG9jdW1lbnRFbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ITtcbiAgICBjb25zdCBkb2N1bWVudFJlY3QgPSBkb2N1bWVudEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICBjb25zdCB0b3AgPSAtZG9jdW1lbnRSZWN0LnRvcCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCB8fCB3aW5kb3dSZWYuc2Nyb2xsWSB8fFxuICAgICAgICBkb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wIHx8IDA7XG5cbiAgICBjb25zdCBsZWZ0ID0gLWRvY3VtZW50UmVjdC5sZWZ0IHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCB8fCB3aW5kb3dSZWYuc2Nyb2xsWCB8fFxuICAgICAgICBkb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCB8fCAwO1xuXG4gICAgcmV0dXJuIHt0b3AsIGxlZnR9O1xufVxuXG4vKiogUmV0dXJucyB0aGUgZG9jdW1lbnQgc2Nyb2xsIHdpZHRoICovXG5mdW5jdGlvbiBnZXREb2N1bWVudFNjcm9sbFdpZHRoKCkge1xuICAgIHJldHVybiBNYXRoLm1heChkb2N1bWVudC5ib2R5LnNjcm9sbFdpZHRoLCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsV2lkdGgpO1xufVxuXG4iXX0=