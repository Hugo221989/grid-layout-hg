import { InjectionToken } from '@angular/core';
import { CompactType } from './utils/react-grid-layout.utils';
export interface KtdGridLayoutItem {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    content?: Widget;
    idItem?: number;
    hierarchyId?: number;
}
export declare type KtdGridCompactType = CompactType;
export interface KtdGridCfg {
    cols: number;
    rowHeight: number;
    layout: KtdGridLayoutItem[];
    preventCollision: boolean;
}
export declare type KtdGridLayout = KtdGridLayoutItem[];
export interface KtdGridItemRect {
    top: number;
    left: number;
    width: number;
    height: number;
}
export interface KtdGridItemRenderData<T = number | string> {
    id: string;
    top: T;
    left: T;
    width: T;
    height: T;
    content?: Widget;
}
export interface Widget {
    id: number;
    name: string;
    content: string;
    idLayout: string;
    show: boolean;
    size: number;
    hierarchyId: number;
}
/**
 * We inject a token because of the 'circular dependency issue warning'. In case we don't had this issue with the circular dependency, we could just
 * import KtdGridComponent on KtdGridItem and execute the needed function to get the rendering data.
 */
export declare type KtdGridItemRenderDataTokenType = (id: string) => KtdGridItemRenderData<string>;
export declare const GRID_ITEM_GET_RENDER_DATA_TOKEN: InjectionToken<KtdGridItemRenderDataTokenType>;
export interface KtdDraggingData {
    pointerDownEvent: MouseEvent | TouchEvent;
    pointerDragEvent: MouseEvent | TouchEvent;
    gridElemClientRect: ClientRect;
    dragElemClientRect: ClientRect;
    scrollDifference: {
        top: number;
        left: number;
    };
}
//# sourceMappingURL=grid.definitions.d.ts.map