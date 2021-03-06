export declare type NumberInput = string | number | null | undefined;
/** Coerces a data-bound value (typically a string) to a number. */
export declare function coerceNumberProperty(value: any): number;
export declare function coerceNumberProperty<D>(value: any, fallback: D): number | D;
/**
 * Whether the provided value is considered a number.
 * @docs-private
 */
export declare function _isNumberValue(value: any): boolean;
