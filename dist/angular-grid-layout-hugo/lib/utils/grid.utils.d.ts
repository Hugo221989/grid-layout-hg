import { CompactType } from './react-grid-layout.utils';
import { KtdDraggingData, KtdGridCfg, KtdGridCompactType, KtdGridItemRect, KtdGridLayout, KtdGridLayoutItem } from '../grid.definitions';
import { KtdDictionary } from '../../types';
/** Tracks items by id. This function is mean to be used in conjunction with the ngFor that renders the 'ktd-grid-items' */
export declare function ktdTrackById(index: number, item: {
    id: string;
}): string;
/**
 * Call react-grid-layout utils 'compact()' function and return the compacted layout.
 * @param layout to be compacted.
 * @param compactType, type of compaction.
 * @param cols, number of columns of the grid.
 */
export declare function ktdGridCompact(layout: KtdGridLayout, compactType: KtdGridCompactType, cols: number): KtdGridLayout;
/** Returns a Dictionary where the key is the id and the value is the change applied to that item. If no changes Dictionary is empty. */
export declare function ktdGetGridLayoutDiff(gridLayoutA: KtdGridLayoutItem[], gridLayoutB: KtdGridLayoutItem[]): KtdDictionary<{
    change: 'move' | 'resize' | 'moveresize';
}>;
/**
 * Given the grid config & layout data and the current drag position & information, returns the corresponding layout and drag item position
 * @param gridItemId id of the grid item that is been dragged
 * @param config current grid configuration
 * @param compactionType type of compaction that will be performed
 * @param draggingData contains all the information about the drag
 */
export declare function ktdGridItemDragging(gridItemId: string, config: KtdGridCfg, compactionType: CompactType, draggingData: KtdDraggingData): {
    layout: KtdGridLayoutItem[];
    draggedItemPos: KtdGridItemRect;
};
/**
 * Given the grid config & layout data and the current drag position & information, returns the corresponding layout and drag item position
 * @param gridItemId id of the grid item that is been dragged
 * @param config current grid configuration
 * @param compactionType type of compaction that will be performed
 * @param draggingData contains all the information about the drag
 */
export declare function ktdGridItemResizing(gridItemId: string, config: KtdGridCfg, compactionType: CompactType, draggingData: KtdDraggingData): {
    layout: KtdGridLayoutItem[];
    draggedItemPos: KtdGridItemRect;
};
