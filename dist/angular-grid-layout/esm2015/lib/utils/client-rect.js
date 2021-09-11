// tslint:disable
/**
 * Client rect utilities.
 * This file is taken from Angular Material repository. This is the reason why the tslint is disabled on this case.
 * Don't enable it until some custom change is done on this file.
 */
/** Gets a mutable version of an element's bounding `ClientRect`. */
export function getMutableClientRect(element) {
    const clientRect = element.getBoundingClientRect();
    // We need to clone the `clientRect` here, because all the values on it are readonly
    // and we need to be able to update them. Also we can't use a spread here, because
    // the values on a `ClientRect` aren't own properties. See:
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect#Notes
    return {
        top: clientRect.top,
        right: clientRect.right,
        bottom: clientRect.bottom,
        left: clientRect.left,
        width: clientRect.width,
        height: clientRect.height
    };
}
/**
 * Checks whether some coordinates are within a `ClientRect`.
 * @param clientRect ClientRect that is being checked.
 * @param x Coordinates along the X axis.
 * @param y Coordinates along the Y axis.
 */
export function isInsideClientRect(clientRect, x, y) {
    const { top, bottom, left, right } = clientRect;
    return y >= top && y <= bottom && x >= left && x <= right;
}
/**
 * Updates the top/left positions of a `ClientRect`, as well as their bottom/right counterparts.
 * @param clientRect `ClientRect` that should be updated.
 * @param top Amount to add to the `top` position.
 * @param left Amount to add to the `left` position.
 */
export function adjustClientRect(clientRect, top, left) {
    clientRect.top += top;
    clientRect.bottom = clientRect.top + clientRect.height;
    clientRect.left += left;
    clientRect.right = clientRect.left + clientRect.width;
}
/**
 * Checks whether the pointer coordinates are close to a ClientRect.
 * @param rect ClientRect to check against.
 * @param threshold Threshold around the ClientRect.
 * @param pointerX Coordinates along the X axis.
 * @param pointerY Coordinates along the Y axis.
 */
export function isPointerNearClientRect(rect, threshold, pointerX, pointerY) {
    const { top, right, bottom, left, width, height } = rect;
    const xThreshold = width * threshold;
    const yThreshold = height * threshold;
    return pointerY > top - yThreshold && pointerY < bottom + yThreshold &&
        pointerX > left - xThreshold && pointerX < right + xThreshold;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LXJlY3QuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1ncmlkLWxheW91dC9zcmMvIiwic291cmNlcyI6WyJsaWIvdXRpbHMvY2xpZW50LXJlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsaUJBQWlCO0FBRWpCOzs7O0dBSUc7QUFHSCxvRUFBb0U7QUFDcEUsTUFBTSxVQUFVLG9CQUFvQixDQUFDLE9BQWdCO0lBQ25ELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBRW5ELG9GQUFvRjtJQUNwRixrRkFBa0Y7SUFDbEYsMkRBQTJEO0lBQzNELHVGQUF1RjtJQUN2RixPQUFPO1FBQ0wsR0FBRyxFQUFFLFVBQVUsQ0FBQyxHQUFHO1FBQ25CLEtBQUssRUFBRSxVQUFVLENBQUMsS0FBSztRQUN2QixNQUFNLEVBQUUsVUFBVSxDQUFDLE1BQU07UUFDekIsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJO1FBQ3JCLEtBQUssRUFBRSxVQUFVLENBQUMsS0FBSztRQUN2QixNQUFNLEVBQUUsVUFBVSxDQUFDLE1BQU07S0FDMUIsQ0FBQztBQUNKLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxrQkFBa0IsQ0FBQyxVQUFzQixFQUFFLENBQVMsRUFBRSxDQUFTO0lBQzdFLE1BQU0sRUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUMsR0FBRyxVQUFVLENBQUM7SUFDOUMsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxNQUFNLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDO0FBQzVELENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxVQUFzQixFQUFFLEdBQVcsRUFBRSxJQUFZO0lBQ2hGLFVBQVUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDO0lBQ3RCLFVBQVUsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO0lBRXZELFVBQVUsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDO0lBQ3hCLFVBQVUsQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO0FBQ3hELENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxNQUFNLFVBQVUsdUJBQXVCLENBQUMsSUFBZ0IsRUFDaEIsU0FBaUIsRUFDakIsUUFBZ0IsRUFDaEIsUUFBZ0I7SUFDdEQsTUFBTSxFQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3ZELE1BQU0sVUFBVSxHQUFHLEtBQUssR0FBRyxTQUFTLENBQUM7SUFDckMsTUFBTSxVQUFVLEdBQUcsTUFBTSxHQUFHLFNBQVMsQ0FBQztJQUV0QyxPQUFPLFFBQVEsR0FBRyxHQUFHLEdBQUcsVUFBVSxJQUFJLFFBQVEsR0FBRyxNQUFNLEdBQUcsVUFBVTtRQUM3RCxRQUFRLEdBQUcsSUFBSSxHQUFHLFVBQVUsSUFBSSxRQUFRLEdBQUcsS0FBSyxHQUFHLFVBQVUsQ0FBQztBQUN2RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG4vLyB0c2xpbnQ6ZGlzYWJsZVxuXG4vKipcbiAqIENsaWVudCByZWN0IHV0aWxpdGllcy5cbiAqIFRoaXMgZmlsZSBpcyB0YWtlbiBmcm9tIEFuZ3VsYXIgTWF0ZXJpYWwgcmVwb3NpdG9yeS4gVGhpcyBpcyB0aGUgcmVhc29uIHdoeSB0aGUgdHNsaW50IGlzIGRpc2FibGVkIG9uIHRoaXMgY2FzZS5cbiAqIERvbid0IGVuYWJsZSBpdCB1bnRpbCBzb21lIGN1c3RvbSBjaGFuZ2UgaXMgZG9uZSBvbiB0aGlzIGZpbGUuXG4gKi9cblxuXG4vKiogR2V0cyBhIG11dGFibGUgdmVyc2lvbiBvZiBhbiBlbGVtZW50J3MgYm91bmRpbmcgYENsaWVudFJlY3RgLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE11dGFibGVDbGllbnRSZWN0KGVsZW1lbnQ6IEVsZW1lbnQpOiBDbGllbnRSZWN0IHtcbiAgY29uc3QgY2xpZW50UmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgLy8gV2UgbmVlZCB0byBjbG9uZSB0aGUgYGNsaWVudFJlY3RgIGhlcmUsIGJlY2F1c2UgYWxsIHRoZSB2YWx1ZXMgb24gaXQgYXJlIHJlYWRvbmx5XG4gIC8vIGFuZCB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gdXBkYXRlIHRoZW0uIEFsc28gd2UgY2FuJ3QgdXNlIGEgc3ByZWFkIGhlcmUsIGJlY2F1c2VcbiAgLy8gdGhlIHZhbHVlcyBvbiBhIGBDbGllbnRSZWN0YCBhcmVuJ3Qgb3duIHByb3BlcnRpZXMuIFNlZTpcbiAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvZ2V0Qm91bmRpbmdDbGllbnRSZWN0I05vdGVzXG4gIHJldHVybiB7XG4gICAgdG9wOiBjbGllbnRSZWN0LnRvcCxcbiAgICByaWdodDogY2xpZW50UmVjdC5yaWdodCxcbiAgICBib3R0b206IGNsaWVudFJlY3QuYm90dG9tLFxuICAgIGxlZnQ6IGNsaWVudFJlY3QubGVmdCxcbiAgICB3aWR0aDogY2xpZW50UmVjdC53aWR0aCxcbiAgICBoZWlnaHQ6IGNsaWVudFJlY3QuaGVpZ2h0XG4gIH07XG59XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgc29tZSBjb29yZGluYXRlcyBhcmUgd2l0aGluIGEgYENsaWVudFJlY3RgLlxuICogQHBhcmFtIGNsaWVudFJlY3QgQ2xpZW50UmVjdCB0aGF0IGlzIGJlaW5nIGNoZWNrZWQuXG4gKiBAcGFyYW0geCBDb29yZGluYXRlcyBhbG9uZyB0aGUgWCBheGlzLlxuICogQHBhcmFtIHkgQ29vcmRpbmF0ZXMgYWxvbmcgdGhlIFkgYXhpcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSW5zaWRlQ2xpZW50UmVjdChjbGllbnRSZWN0OiBDbGllbnRSZWN0LCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICBjb25zdCB7dG9wLCBib3R0b20sIGxlZnQsIHJpZ2h0fSA9IGNsaWVudFJlY3Q7XG4gIHJldHVybiB5ID49IHRvcCAmJiB5IDw9IGJvdHRvbSAmJiB4ID49IGxlZnQgJiYgeCA8PSByaWdodDtcbn1cblxuLyoqXG4gKiBVcGRhdGVzIHRoZSB0b3AvbGVmdCBwb3NpdGlvbnMgb2YgYSBgQ2xpZW50UmVjdGAsIGFzIHdlbGwgYXMgdGhlaXIgYm90dG9tL3JpZ2h0IGNvdW50ZXJwYXJ0cy5cbiAqIEBwYXJhbSBjbGllbnRSZWN0IGBDbGllbnRSZWN0YCB0aGF0IHNob3VsZCBiZSB1cGRhdGVkLlxuICogQHBhcmFtIHRvcCBBbW91bnQgdG8gYWRkIHRvIHRoZSBgdG9wYCBwb3NpdGlvbi5cbiAqIEBwYXJhbSBsZWZ0IEFtb3VudCB0byBhZGQgdG8gdGhlIGBsZWZ0YCBwb3NpdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkanVzdENsaWVudFJlY3QoY2xpZW50UmVjdDogQ2xpZW50UmVjdCwgdG9wOiBudW1iZXIsIGxlZnQ6IG51bWJlcikge1xuICBjbGllbnRSZWN0LnRvcCArPSB0b3A7XG4gIGNsaWVudFJlY3QuYm90dG9tID0gY2xpZW50UmVjdC50b3AgKyBjbGllbnRSZWN0LmhlaWdodDtcblxuICBjbGllbnRSZWN0LmxlZnQgKz0gbGVmdDtcbiAgY2xpZW50UmVjdC5yaWdodCA9IGNsaWVudFJlY3QubGVmdCArIGNsaWVudFJlY3Qud2lkdGg7XG59XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgdGhlIHBvaW50ZXIgY29vcmRpbmF0ZXMgYXJlIGNsb3NlIHRvIGEgQ2xpZW50UmVjdC5cbiAqIEBwYXJhbSByZWN0IENsaWVudFJlY3QgdG8gY2hlY2sgYWdhaW5zdC5cbiAqIEBwYXJhbSB0aHJlc2hvbGQgVGhyZXNob2xkIGFyb3VuZCB0aGUgQ2xpZW50UmVjdC5cbiAqIEBwYXJhbSBwb2ludGVyWCBDb29yZGluYXRlcyBhbG9uZyB0aGUgWCBheGlzLlxuICogQHBhcmFtIHBvaW50ZXJZIENvb3JkaW5hdGVzIGFsb25nIHRoZSBZIGF4aXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1BvaW50ZXJOZWFyQ2xpZW50UmVjdChyZWN0OiBDbGllbnRSZWN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocmVzaG9sZDogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvaW50ZXJYOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRlclk6IG51bWJlcik6IGJvb2xlYW4ge1xuICBjb25zdCB7dG9wLCByaWdodCwgYm90dG9tLCBsZWZ0LCB3aWR0aCwgaGVpZ2h0fSA9IHJlY3Q7XG4gIGNvbnN0IHhUaHJlc2hvbGQgPSB3aWR0aCAqIHRocmVzaG9sZDtcbiAgY29uc3QgeVRocmVzaG9sZCA9IGhlaWdodCAqIHRocmVzaG9sZDtcblxuICByZXR1cm4gcG9pbnRlclkgPiB0b3AgLSB5VGhyZXNob2xkICYmIHBvaW50ZXJZIDwgYm90dG9tICsgeVRocmVzaG9sZCAmJlxuICAgICAgICAgcG9pbnRlclggPiBsZWZ0IC0geFRocmVzaG9sZCAmJiBwb2ludGVyWCA8IHJpZ2h0ICsgeFRocmVzaG9sZDtcbn1cbiJdfQ==