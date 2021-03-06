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

export type KtdGridCompactType = CompactType;

export interface KtdGridCfg {
    cols: number;
    rowHeight: number; // row height in pixels
    layout: KtdGridLayoutItem[];
    preventCollision: boolean;
}

export type KtdGridLayout = KtdGridLayoutItem[];

// TODO: Remove this interface. If can't remove, move and rename this interface in the core module or similar.
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
export type KtdGridItemRenderDataTokenType = (id: string) => KtdGridItemRenderData<string>;
export const GRID_ITEM_GET_RENDER_DATA_TOKEN: InjectionToken<KtdGridItemRenderDataTokenType> = new InjectionToken('GRID_ITEM_GET_RENDER_DATA_TOKEN');

export interface KtdDraggingData {
    pointerDownEvent: MouseEvent | TouchEvent;
    pointerDragEvent: MouseEvent | TouchEvent;
    gridElemClientRect: ClientRect;
    dragElemClientRect: ClientRect;
    scrollDifference: { top: number, left: number };
}
