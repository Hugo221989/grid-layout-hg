/** Cached result of whether the user's browser supports passive event listeners. */
let supportsPassiveEvents;
/**
 * Checks whether the user's browser supports passive event listeners.
 * See: https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
 */
export function ktdSupportsPassiveEventListeners() {
    if (supportsPassiveEvents == null && typeof window !== 'undefined') {
        try {
            window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
                get: () => supportsPassiveEvents = true
            }));
        }
        finally {
            supportsPassiveEvents = supportsPassiveEvents || false;
        }
    }
    return supportsPassiveEvents;
}
/**
 * Normalizes an `AddEventListener` object to something that can be passed
 * to `addEventListener` on any browser, no matter whether it supports the
 * `options` parameter.
 * @param options Object to be normalized.
 */
export function ktdNormalizePassiveListenerOptions(options) {
    return ktdSupportsPassiveEventListeners() ? options : !!options.capture;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc2l2ZS1saXN0ZW5lcnMuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1ncmlkLWxheW91dC1odWdvL3NyYy8iLCJzb3VyY2VzIjpbImxpYi91dGlscy9wYXNzaXZlLWxpc3RlbmVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvRkFBb0Y7QUFDcEYsSUFBSSxxQkFBOEIsQ0FBQztBQUVuQzs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsZ0NBQWdDO0lBQzVDLElBQUkscUJBQXFCLElBQUksSUFBSSxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsRUFBRTtRQUNoRSxJQUFJO1lBQ0EsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFLLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFFO2dCQUN4RSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMscUJBQXFCLEdBQUcsSUFBSTthQUMxQyxDQUFDLENBQUMsQ0FBQztTQUNQO2dCQUFTO1lBQ04scUJBQXFCLEdBQUcscUJBQXFCLElBQUksS0FBSyxDQUFDO1NBQzFEO0tBQ0o7SUFFRCxPQUFPLHFCQUFxQixDQUFDO0FBQ2pDLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxrQ0FBa0MsQ0FBQyxPQUFnQztJQUUvRSxPQUFPLGdDQUFnQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7QUFDNUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBDYWNoZWQgcmVzdWx0IG9mIHdoZXRoZXIgdGhlIHVzZXIncyBicm93c2VyIHN1cHBvcnRzIHBhc3NpdmUgZXZlbnQgbGlzdGVuZXJzLiAqL1xubGV0IHN1cHBvcnRzUGFzc2l2ZUV2ZW50czogYm9vbGVhbjtcblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciB0aGUgdXNlcidzIGJyb3dzZXIgc3VwcG9ydHMgcGFzc2l2ZSBldmVudCBsaXN0ZW5lcnMuXG4gKiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9XSUNHL0V2ZW50TGlzdGVuZXJPcHRpb25zL2Jsb2IvZ2gtcGFnZXMvZXhwbGFpbmVyLm1kXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBrdGRTdXBwb3J0c1Bhc3NpdmVFdmVudExpc3RlbmVycygpOiBib29sZWFuIHtcbiAgICBpZiAoc3VwcG9ydHNQYXNzaXZlRXZlbnRzID09IG51bGwgJiYgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0ZXN0JywgbnVsbCEsIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ3Bhc3NpdmUnLCB7XG4gICAgICAgICAgICAgICAgZ2V0OiAoKSA9PiBzdXBwb3J0c1Bhc3NpdmVFdmVudHMgPSB0cnVlXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBzdXBwb3J0c1Bhc3NpdmVFdmVudHMgPSBzdXBwb3J0c1Bhc3NpdmVFdmVudHMgfHwgZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3VwcG9ydHNQYXNzaXZlRXZlbnRzO1xufVxuXG4vKipcbiAqIE5vcm1hbGl6ZXMgYW4gYEFkZEV2ZW50TGlzdGVuZXJgIG9iamVjdCB0byBzb21ldGhpbmcgdGhhdCBjYW4gYmUgcGFzc2VkXG4gKiB0byBgYWRkRXZlbnRMaXN0ZW5lcmAgb24gYW55IGJyb3dzZXIsIG5vIG1hdHRlciB3aGV0aGVyIGl0IHN1cHBvcnRzIHRoZVxuICogYG9wdGlvbnNgIHBhcmFtZXRlci5cbiAqIEBwYXJhbSBvcHRpb25zIE9iamVjdCB0byBiZSBub3JtYWxpemVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24ga3RkTm9ybWFsaXplUGFzc2l2ZUxpc3RlbmVyT3B0aW9ucyhvcHRpb25zOiBBZGRFdmVudExpc3RlbmVyT3B0aW9ucyk6XG4gICAgQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMgfCBib29sZWFuIHtcbiAgICByZXR1cm4ga3RkU3VwcG9ydHNQYXNzaXZlRXZlbnRMaXN0ZW5lcnMoKSA/IG9wdGlvbnMgOiAhIW9wdGlvbnMuY2FwdHVyZTtcbn1cbiJdfQ==