/**
 * Client rect utilities.
 * This file is taken from Angular Material repository. This is the reason why the tslint is disabled on this case.
 * Don't enable it until some custom change is done on this file.
 */
/** Gets a mutable version of an element's bounding `ClientRect`. */
export declare function getMutableClientRect(element: Element): ClientRect;
/**
 * Checks whether some coordinates are within a `ClientRect`.
 * @param clientRect ClientRect that is being checked.
 * @param x Coordinates along the X axis.
 * @param y Coordinates along the Y axis.
 */
export declare function isInsideClientRect(clientRect: ClientRect, x: number, y: number): boolean;
/**
 * Updates the top/left positions of a `ClientRect`, as well as their bottom/right counterparts.
 * @param clientRect `ClientRect` that should be updated.
 * @param top Amount to add to the `top` position.
 * @param left Amount to add to the `left` position.
 */
export declare function adjustClientRect(clientRect: ClientRect, top: number, left: number): void;
/**
 * Checks whether the pointer coordinates are close to a ClientRect.
 * @param rect ClientRect to check against.
 * @param threshold Threshold around the ClientRect.
 * @param pointerX Coordinates along the X axis.
 * @param pointerY Coordinates along the Y axis.
 */
export declare function isPointerNearClientRect(rect: ClientRect, threshold: number, pointerX: number, pointerY: number): boolean;
