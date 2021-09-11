import { compact, getFirstCollision, moveElement } from './react-grid-layout.utils';
import { ktdPointerClientX, ktdPointerClientY } from './pointer.utils';
/** Tracks items by id. This function is mean to be used in conjunction with the ngFor that renders the 'ktd-grid-items' */
export function ktdTrackById(index, item) {
    return item.id;
}
/**
 * Call react-grid-layout utils 'compact()' function and return the compacted layout.
 * @param layout to be compacted.
 * @param compactType, type of compaction.
 * @param cols, number of columns of the grid.
 */
export function ktdGridCompact(layout, compactType, cols) {
    return compact(layout, compactType, cols)
        // Prune react-grid-layout compact extra properties.
        .map(item => ({ id: item.id, x: item.x, y: item.y, w: item.w, h: item.h }));
}
function screenXPosToGridValue(screenXPos, cols, width) {
    return Math.round((screenXPos * cols) / width);
}
function screenYPosToGridValue(screenYPos, rowHeight, height) {
    return Math.round(screenYPos / rowHeight);
}
/** Returns a Dictionary where the key is the id and the value is the change applied to that item. If no changes Dictionary is empty. */
export function ktdGetGridLayoutDiff(gridLayoutA, gridLayoutB) {
    const diff = {};
    gridLayoutA.forEach(itemA => {
        const itemB = gridLayoutB.find(_itemB => _itemB.id === itemA.id);
        if (itemB != null) {
            const posChanged = itemA.x !== itemB.x || itemA.y !== itemB.y;
            const sizeChanged = itemA.w !== itemB.w || itemA.h !== itemB.h;
            const change = posChanged && sizeChanged ? 'moveresize' : posChanged ? 'move' : sizeChanged ? 'resize' : null;
            if (change) {
                diff[itemB.id] = { change };
            }
        }
    });
    return diff;
}
/**
 * Given the grid config & layout data and the current drag position & information, returns the corresponding layout and drag item position
 * @param gridItemId id of the grid item that is been dragged
 * @param config current grid configuration
 * @param compactionType type of compaction that will be performed
 * @param draggingData contains all the information about the drag
 */
export function ktdGridItemDragging(gridItemId, config, compactionType, draggingData) {
    const { pointerDownEvent, pointerDragEvent, gridElemClientRect, dragElemClientRect, scrollDifference } = draggingData;
    const draggingElemPrevItem = config.layout.find(item => item.id === gridItemId);
    const clientStartX = ktdPointerClientX(pointerDownEvent);
    const clientStartY = ktdPointerClientY(pointerDownEvent);
    const clientX = ktdPointerClientX(pointerDragEvent);
    const clientY = ktdPointerClientY(pointerDragEvent);
    const offsetX = clientStartX - dragElemClientRect.left;
    const offsetY = clientStartY - dragElemClientRect.top;
    // Grid element positions taking into account the possible scroll total difference from the beginning.
    const gridElementLeftPosition = gridElemClientRect.left + scrollDifference.left;
    const gridElementTopPosition = gridElemClientRect.top + scrollDifference.top;
    // Calculate position relative to the grid element.
    const gridRelXPos = clientX - gridElementLeftPosition - offsetX;
    const gridRelYPos = clientY - gridElementTopPosition - offsetY;
    // Get layout item position
    const layoutItem = Object.assign(Object.assign({}, draggingElemPrevItem), { x: screenXPosToGridValue(gridRelXPos, config.cols, gridElemClientRect.width), y: screenYPosToGridValue(gridRelYPos, config.rowHeight, gridElemClientRect.height) });
    // Correct the values if they overflow, since 'moveElement' function doesn't do it
    layoutItem.x = Math.max(0, layoutItem.x);
    layoutItem.y = Math.max(0, layoutItem.y);
    if (layoutItem.x + layoutItem.w > config.cols) {
        layoutItem.x = Math.max(0, config.cols - layoutItem.w);
    }
    // Parse to LayoutItem array data in order to use 'react.grid-layout' utils
    const layoutItems = config.layout;
    const draggedLayoutItem = layoutItems.find(item => item.id === gridItemId);
    let newLayoutItems = moveElement(layoutItems, draggedLayoutItem, layoutItem.x, layoutItem.y, true, config.preventCollision, compactionType, config.cols);
    newLayoutItems = compact(newLayoutItems, compactionType, config.cols);
    return {
        layout: newLayoutItems,
        draggedItemPos: {
            top: gridRelYPos,
            left: gridRelXPos,
            width: dragElemClientRect.width,
            height: dragElemClientRect.height,
        }
    };
}
/**
 * Given the grid config & layout data and the current drag position & information, returns the corresponding layout and drag item position
 * @param gridItemId id of the grid item that is been dragged
 * @param config current grid configuration
 * @param compactionType type of compaction that will be performed
 * @param draggingData contains all the information about the drag
 */
export function ktdGridItemResizing(gridItemId, config, compactionType, draggingData) {
    const { pointerDownEvent, pointerDragEvent, gridElemClientRect, dragElemClientRect, scrollDifference } = draggingData;
    const clientStartX = ktdPointerClientX(pointerDownEvent);
    const clientStartY = ktdPointerClientY(pointerDownEvent);
    const clientX = ktdPointerClientX(pointerDragEvent);
    const clientY = ktdPointerClientY(pointerDragEvent);
    // Get the difference between the mouseDown and the position 'right' of the resize element.
    const resizeElemOffsetX = dragElemClientRect.width - (clientStartX - dragElemClientRect.left);
    const resizeElemOffsetY = dragElemClientRect.height - (clientStartY - dragElemClientRect.top);
    const draggingElemPrevItem = config.layout.find(item => item.id === gridItemId);
    const width = clientX + resizeElemOffsetX - (dragElemClientRect.left + scrollDifference.left);
    const height = clientY + resizeElemOffsetY - (dragElemClientRect.top + scrollDifference.top);
    // Get layout item grid position
    const layoutItem = Object.assign(Object.assign({}, draggingElemPrevItem), { w: screenXPosToGridValue(width, config.cols, gridElemClientRect.width), h: screenYPosToGridValue(height, config.rowHeight, gridElemClientRect.height) });
    layoutItem.w = Math.max(1, layoutItem.w);
    layoutItem.h = Math.max(1, layoutItem.h);
    if (layoutItem.x + layoutItem.w > config.cols) {
        layoutItem.w = Math.max(1, config.cols - layoutItem.x);
    }
    if (config.preventCollision) {
        const maxW = layoutItem.w;
        const maxH = layoutItem.h;
        let colliding = hasCollision(config.layout, layoutItem);
        let shrunkDimension;
        while (colliding) {
            shrunkDimension = getDimensionToShrink(layoutItem, shrunkDimension);
            layoutItem[shrunkDimension]--;
            colliding = hasCollision(config.layout, layoutItem);
        }
        if (shrunkDimension === 'w') {
            layoutItem.h = maxH;
            colliding = hasCollision(config.layout, layoutItem);
            while (colliding) {
                layoutItem.h--;
                colliding = hasCollision(config.layout, layoutItem);
            }
        }
        if (shrunkDimension === 'h') {
            layoutItem.w = maxW;
            colliding = hasCollision(config.layout, layoutItem);
            while (colliding) {
                layoutItem.w--;
                colliding = hasCollision(config.layout, layoutItem);
            }
        }
    }
    const newLayoutItems = config.layout.map((item) => {
        return item.id === gridItemId ? layoutItem : item;
    });
    return {
        layout: compact(newLayoutItems, compactionType, config.cols),
        draggedItemPos: {
            top: dragElemClientRect.top - gridElemClientRect.top,
            left: dragElemClientRect.left - gridElemClientRect.left,
            width,
            height,
        }
    };
}
function hasCollision(layout, layoutItem) {
    return !!getFirstCollision(layout, layoutItem);
}
function getDimensionToShrink(layoutItem, lastShrunk) {
    if (layoutItem.h <= 1) {
        return 'w';
    }
    if (layoutItem.w <= 1) {
        return 'h';
    }
    return lastShrunk === 'w' ? 'h' : 'w';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC51dGlscy5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWdyaWQtbGF5b3V0L3NyYy8iLCJzb3VyY2VzIjpbImxpYi91dGlscy9ncmlkLnV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQWUsaUJBQWlCLEVBQXNCLFdBQVcsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRXJILE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBR3ZFLDJIQUEySDtBQUMzSCxNQUFNLFVBQVUsWUFBWSxDQUFDLEtBQWEsRUFBRSxJQUFrQjtJQUMxRCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDbkIsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLGNBQWMsQ0FBQyxNQUFxQixFQUFFLFdBQStCLEVBQUUsSUFBWTtJQUMvRixPQUFPLE9BQU8sQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQztRQUNyQyxvREFBb0Q7U0FDbkQsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xGLENBQUM7QUFFRCxTQUFTLHFCQUFxQixDQUFDLFVBQWtCLEVBQUUsSUFBWSxFQUFFLEtBQWE7SUFDMUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUFFRCxTQUFTLHFCQUFxQixDQUFDLFVBQWtCLEVBQUUsU0FBaUIs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LEdBQUcsRUFBRSxrQkFBa0IsQ0FBQyxHQUFHLEdBQUcsa0JBQWtCLENBQUMsR0FBRztZQUNwRCxJQUFJLEVBQUUsa0JBQWtCLENBQUMsSUFBSSxHQUFHLGtCQUFrQixDQUFDLElBQUk7WUFDdkQsS0FBSztZQUNMLE1BQU07U0FDVDtLQUNKLENBQUM7QUFDTixDQUFDO0FBRUQsU0FBUyxZQUFZLENBQUMsTUFBYyxFQUFFLFVBQXNCO0lBQ3hELE9BQU8sQ0FBQyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNuRCxDQUFDO0FBRUQsU0FBUyxvQkFBb0IsQ0FBQyxVQUFVLEVBQUUsVUFBVTtJQUNoRCxJQUFJLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ25CLE9BQU8sR0FBRyxDQUFDO0tBQ2Q7SUFDRCxJQUFJLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ25CLE9BQU8sR0FBRyxDQUFDO0tBQ2Q7SUFFRCxPQUFPLFVBQVUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQzFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb21wYWN0LCBDb21wYWN0VHlwZSwgZ2V0Rmlyc3RDb2xsaXNpb24sIExheW91dCwgTGF5b3V0SXRlbSwgbW92ZUVsZW1lbnQgfSBmcm9tICcuL3JlYWN0LWdyaWQtbGF5b3V0LnV0aWxzJztcbmltcG9ydCB7IEt0ZERyYWdnaW5nRGF0YSwgS3RkR3JpZENmZywgS3RkR3JpZENvbXBhY3RUeXBlLCBLdGRHcmlkSXRlbVJlY3QsIEt0ZEdyaWRMYXlvdXQsIEt0ZEdyaWRMYXlvdXRJdGVtIH0gZnJvbSAnLi4vZ3JpZC5kZWZpbml0aW9ucyc7XG5pbXBvcnQgeyBrdGRQb2ludGVyQ2xpZW50WCwga3RkUG9pbnRlckNsaWVudFkgfSBmcm9tICcuL3BvaW50ZXIudXRpbHMnO1xuaW1wb3J0IHsgS3RkRGljdGlvbmFyeSB9IGZyb20gJy4uLy4uL3R5cGVzJztcblxuLyoqIFRyYWNrcyBpdGVtcyBieSBpZC4gVGhpcyBmdW5jdGlvbiBpcyBtZWFuIHRvIGJlIHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCB0aGUgbmdGb3IgdGhhdCByZW5kZXJzIHRoZSAna3RkLWdyaWQtaXRlbXMnICovXG5leHBvcnQgZnVuY3Rpb24ga3RkVHJhY2tCeUlkKGluZGV4OiBudW1iZXIsIGl0ZW06IHtpZDogc3RyaW5nfSkge1xuICAgIHJldHVybiBpdGVtLmlkO1xufVxuXG4vKipcbiAqIENhbGwgcmVhY3QtZ3JpZC1sYXlvdXQgdXRpbHMgJ2NvbXBhY3QoKScgZnVuY3Rpb24gYW5kIHJldHVybiB0aGUgY29tcGFjdGVkIGxheW91dC5cbiAqIEBwYXJhbSBsYXlvdXQgdG8gYmUgY29tcGFjdGVkLlxuICogQHBhcmFtIGNvbXBhY3RUeXBlLCB0eXBlIG9mIGNvbXBhY3Rpb24uXG4gKiBAcGFyYW0gY29scywgbnVtYmVyIG9mIGNvbHVtbnMgb2YgdGhlIGdyaWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBrdGRHcmlkQ29tcGFjdChsYXlvdXQ6IEt0ZEdyaWRMYXlvdXQsIGNvbXBhY3RUeXBlOiBLdGRHcmlkQ29tcGFjdFR5cGUsIGNvbHM6IG51bWJlcik6IEt0ZEdyaWRMYXlvdXQge1xuICAgIHJldHVybiBjb21wYWN0KGxheW91dCwgY29tcGFjdFR5cGUsIGNvbHMpXG4gICAgICAgIC8vIFBydW5lIHJlYWN0LWdyaWQtbGF5b3V0IGNvbXBhY3QgZXh0cmEgcHJvcGVydGllcy5cbiAgICAgICAgLm1hcChpdGVtID0+ICh7aWQ6IGl0ZW0uaWQsIHg6IGl0ZW0ueCwgeTogaXRlbS55LCB3OiBpdGVtLncsIGg6IGl0ZW0uaH0pKTtcbn1cblxuZnVuY3Rpb24gc2NyZWVuWFBvc1RvR3JpZFZhbHVlKHNjcmVlblhQb3M6IG51bWJlciwgY29sczogbnVtYmVyLCB3aWR0aDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCgoc2NyZWVuWFBvcyAqIGNvbHMpIC8gd2lkdGgpO1xufVxuXG5mdW5jdGlvbiBzY3JlZW5ZUG9zVG9HcmlkVmFsdWUoc2NyZWVuWVBvczogbnVtYmVyLCByb3dIZWlnaHQ6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKHNjcmVlbllQb3MgLyByb3dIZWlnaHQpO1xufVxuXG4vKiogUmV0dXJucyBhIERpY3Rpb25hcnkgd2hlcmUgdGhlIGtleSBpcyB0aGUgaWQgYW5kIHRoZSB2YWx1ZSBpcyB0aGUgY2hhbmdlIGFwcGxpZWQgdG8gdGhhdCBpdGVtLiBJZiBubyBjaGFuZ2VzIERpY3Rpb25hcnkgaXMgZW1wdHkuICovXG5leHBvcnQgZnVuY3Rpb24ga3RkR2V0R3JpZExheW91dERpZmYoZ3JpZExheW91dEE6IEt0ZEdyaWRMYXlvdXRJdGVtW10sIGdyaWRMYXlvdXRCOiBLdGRHcmlkTGF5b3V0SXRlbVtdKTogS3RkRGljdGlvbmFyeTx7IGNoYW5nZTogJ21vdmUnIHwgJ3Jlc2l6ZScgfCAnbW92ZXJlc2l6ZScgfT4ge1xuICAgIGNvbnN0IGRpZmY6IEt0ZERpY3Rpb25hcnk8eyBjaGFuZ2U6ICdtb3ZlJyB8ICdyZXNpemUnIHwgJ21vdmVyZXNpemUnIH0+ID0ge307XG5cbiAgICBncmlkTGF5b3V0QS5mb3JFYWNoKGl0ZW1BID0+IHtcbiAgICAgICAgY29uc3QgaXRlbUIgPSBncmlkTGF5b3V0Qi5maW5kKF9pdGVtQiA9PiBfaXRlbUIuaWQgPT09IGl0ZW1BLmlkKTtcbiAgICAgICAgaWYgKGl0ZW1CICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHBvc0NoYW5nZWQgPSBpdGVtQS54ICE9PSBpdGVtQi54IHx8IGl0ZW1BLnkgIT09IGl0ZW1CLnk7XG4gICAgICAgICAgICBjb25zdCBzaXplQ2hhbmdlZCA9IGl0ZW1BLncgIT09IGl0ZW1CLncgfHwgaXRlbUEuaCAhPT0gaXRlbUIuaDtcbiAgICAgICAgICAgIGNvbnN0IGNoYW5nZTogJ21vdmUnIHwgJ3Jlc2l6ZScgfCAnbW92ZXJlc2l6ZScgfCBudWxsID0gcG9zQ2hhbmdlZCAmJiBzaXplQ2hhbmdlZCA/ICdtb3ZlcmVzaXplJyA6IHBvc0NoYW5nZWQgPyAnbW92ZScgOiBzaXplQ2hhbmdlZCA/ICdyZXNpemUnIDogbnVsbDtcbiAgICAgICAgICAgIGlmIChjaGFuZ2UpIHtcbiAgICAgICAgICAgICAgICBkaWZmW2l0ZW1CLmlkXSA9IHtjaGFuZ2V9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRpZmY7XG59XG5cbi8qKlxuICogR2l2ZW4gdGhlIGdyaWQgY29uZmlnICYgbGF5b3V0IGRhdGEgYW5kIHRoZSBjdXJyZW50IGRyYWcgcG9zaXRpb24gJiBpbmZvcm1hdGlvbiwgcmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBsYXlvdXQgYW5kIGRyYWcgaXRlbSBwb3NpdGlvblxuICogQHBhcmFtIGdyaWRJdGVtSWQgaWQgb2YgdGhlIGdyaWQgaXRlbSB0aGF0IGlzIGJlZW4gZHJhZ2dlZFxuICogQHBhcmFtIGNvbmZpZyBjdXJyZW50IGdyaWQgY29uZmlndXJhdGlvblxuICogQHBhcmFtIGNvbXBhY3Rpb25UeXBlIHR5cGUgb2YgY29tcGFjdGlvbiB0aGF0IHdpbGwgYmUgcGVyZm9ybWVkXG4gKiBAcGFyYW0gZHJhZ2dpbmdEYXRhIGNvbnRhaW5zIGFsbCB0aGUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGRyYWdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGt0ZEdyaWRJdGVtRHJhZ2dpbmcoZ3JpZEl0ZW1JZDogc3RyaW5nLCBjb25maWc6IEt0ZEdyaWRDZmcsIGNvbXBhY3Rpb25UeXBlOiBDb21wYWN0VHlwZSwgZHJhZ2dpbmdEYXRhOiBLdGREcmFnZ2luZ0RhdGEpOiB7IGxheW91dDogS3RkR3JpZExheW91dEl0ZW1bXTsgZHJhZ2dlZEl0ZW1Qb3M6IEt0ZEdyaWRJdGVtUmVjdCB9IHtcbiAgICBjb25zdCB7cG9pbnRlckRvd25FdmVudCwgcG9pbnRlckRyYWdFdmVudCwgZ3JpZEVsZW1DbGllbnRSZWN0LCBkcmFnRWxlbUNsaWVudFJlY3QsIHNjcm9sbERpZmZlcmVuY2V9ID0gZHJhZ2dpbmdEYXRhO1xuXG4gICAgY29uc3QgZHJhZ2dpbmdFbGVtUHJldkl0ZW0gPSBjb25maWcubGF5b3V0LmZpbmQoaXRlbSA9PiBpdGVtLmlkID09PSBncmlkSXRlbUlkKSE7XG5cbiAgICBjb25zdCBjbGllbnRTdGFydFggPSBrdGRQb2ludGVyQ2xpZW50WChwb2ludGVyRG93bkV2ZW50KTtcbiAgICBjb25zdCBjbGllbnRTdGFydFkgPSBrdGRQb2ludGVyQ2xpZW50WShwb2ludGVyRG93bkV2ZW50KTtcbiAgICBjb25zdCBjbGllbnRYID0ga3RkUG9pbnRlckNsaWVudFgocG9pbnRlckRyYWdFdmVudCk7XG4gICAgY29uc3QgY2xpZW50WSA9IGt0ZFBvaW50ZXJDbGllbnRZKHBvaW50ZXJEcmFnRXZlbnQpO1xuXG4gICAgY29uc3Qgb2Zmc2V0WCA9IGNsaWVudFN0YXJ0WCAtIGRyYWdFbGVtQ2xpZW50UmVjdC5sZWZ0O1xuICAgIGNvbnN0IG9mZnNldFkgPSBjbGllbnRTdGFydFkgLSBkcmFnRWxlbUNsaWVudFJlY3QudG9wO1xuXG4gICAgLy8gR3JpZCBlbGVtZW50IHBvc2l0aW9ucyB0YWtpbmcgaW50byBhY2NvdW50IHRoZSBwb3NzaWJsZSBzY3JvbGwgdG90YWwgZGlmZmVyZW5jZSBmcm9tIHRoZSBiZWdpbm5pbmcuXG4gICAgY29uc3QgZ3JpZEVsZW1lbnRMZWZ0UG9zaXRpb24gPSBncmlkRWxlbUNsaWVudFJlY3QubGVmdCArIHNjcm9sbERpZmZlcmVuY2UubGVmdDtcbiAgICBjb25zdCBncmlkRWxlbWVudFRvcFBvc2l0aW9uID0gZ3JpZEVsZW1DbGllbnRSZWN0LnRvcCArIHNjcm9sbERpZmZlcmVuY2UudG9wO1xuXG4gICAgLy8gQ2FsY3VsYXRlIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSBncmlkIGVsZW1lbnQuXG4gICAgY29uc3QgZ3JpZFJlbFhQb3MgPSBjbGllbnRYIC0gZ3JpZEVsZW1lbnRMZWZ0UG9zaXRpb24gLSBvZmZzZXRYO1xuICAgIGNvbnN0IGdyaWRSZWxZUG9zID0gY2xpZW50WSAtIGdyaWRFbGVtZW50VG9wUG9zaXRpb24gLSBvZmZzZXRZO1xuXG4gICAgLy8gR2V0IGxheW91dCBpdGVtIHBvc2l0aW9uXG4gICAgY29uc3QgbGF5b3V0SXRlbTogS3RkR3JpZExheW91dEl0ZW0gPSB7XG4gICAgICAgIC4uLmRyYWdnaW5nRWxlbVByZXZJdGVtLFxuICAgICAgICB4OiBzY3JlZW5YUG9zVG9HcmlkVmFsdWUoZ3JpZFJlbFhQb3MsIGNvbmZpZy5jb2xzLCBncmlkRWxlbUNsaWVudFJlY3Qud2lkdGgpLFxuICAgICAgICB5OiBzY3JlZW5ZUG9zVG9HcmlkVmFsdWUoZ3JpZFJlbFlQb3MsIGNvbmZpZy5yb3dIZWlnaHQsIGdyaWRFbGVtQ2xpZW50UmVjdC5oZWlnaHQpXG4gICAgfTtcblxuICAgIC8vIENvcnJlY3QgdGhlIHZhbHVlcyBpZiB0aGV5IG92ZXJmbG93LCBzaW5jZSAnbW92ZUVsZW1lbnQnIGZ1bmN0aW9uIGRvZXNuJ3QgZG8gaXRcbiAgICBsYXlvdXRJdGVtLnggPSBNYXRoLm1heCgwLCBsYXlvdXRJdGVtLngpO1xuICAgIGxheW91dEl0ZW0ueSA9IE1hdGgubWF4KDAsIGxheW91dEl0ZW0ueSk7XG4gICAgaWYgKGxheW91dEl0ZW0ueCArIGxheW91dEl0ZW0udyA+IGNvbmZpZy5jb2xzKSB7XG4gICAgICAgIGxheW91dEl0ZW0ueCA9IE1hdGgubWF4KDAsIGNvbmZpZy5jb2xzIC0gbGF5b3V0SXRlbS53KTtcbiAgICB9XG5cbiAgICAvLyBQYXJzZSB0byBMYXlvdXRJdGVtIGFycmF5IGRhdGEgaW4gb3JkZXIgdG8gdXNlICdyZWFjdC5ncmlkLWxheW91dCcgdXRpbHNcbiAgICBjb25zdCBsYXlvdXRJdGVtczogTGF5b3V0SXRlbVtdID0gY29uZmlnLmxheW91dDtcbiAgICBjb25zdCBkcmFnZ2VkTGF5b3V0SXRlbTogTGF5b3V0SXRlbSA9IGxheW91dEl0ZW1zLmZpbmQoaXRlbSA9PiBpdGVtLmlkID09PSBncmlkSXRlbUlkKSE7XG5cbiAgICBsZXQgbmV3TGF5b3V0SXRlbXM6IExheW91dEl0ZW1bXSA9IG1vdmVFbGVtZW50KFxuICAgICAgICBsYXlvdXRJdGVtcyxcbiAgICAgICAgZHJhZ2dlZExheW91dEl0ZW0sXG4gICAgICAgIGxheW91dEl0ZW0ueCxcbiAgICAgICAgbGF5b3V0SXRlbS55LFxuICAgICAgICB0cnVlLFxuICAgICAgICBjb25maWcucHJldmVudENvbGxpc2lvbixcbiAgICAgICAgY29tcGFjdGlvblR5cGUsXG4gICAgICAgIGNvbmZpZy5jb2xzXG4gICAgKTtcblxuICAgIG5ld0xheW91dEl0ZW1zID0gY29tcGFjdChuZXdMYXlvdXRJdGVtcywgY29tcGFjdGlvblR5cGUsIGNvbmZpZy5jb2xzKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGxheW91dDogbmV3TGF5b3V0SXRlbXMsXG4gICAgICAgIGRyYWdnZWRJdGVtUG9zOiB7XG4gICAgICAgICAgICB0b3A6IGdyaWRSZWxZUG9zLFxuICAgICAgICAgICAgbGVmdDogZ3JpZFJlbFhQb3MsXG4gICAgICAgICAgICB3aWR0aDogZHJhZ0VsZW1DbGllbnRSZWN0LndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBkcmFnRWxlbUNsaWVudFJlY3QuaGVpZ2h0LFxuICAgICAgICB9XG4gICAgfTtcbn1cblxuLyoqXG4gKiBHaXZlbiB0aGUgZ3JpZCBjb25maWcgJiBsYXlvdXQgZGF0YSBhbmQgdGhlIGN1cnJlbnQgZHJhZyBwb3NpdGlvbiAmIGluZm9ybWF0aW9uLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGxheW91dCBhbmQgZHJhZyBpdGVtIHBvc2l0aW9uXG4gKiBAcGFyYW0gZ3JpZEl0ZW1JZCBpZCBvZiB0aGUgZ3JpZCBpdGVtIHRoYXQgaXMgYmVlbiBkcmFnZ2VkXG4gKiBAcGFyYW0gY29uZmlnIGN1cnJlbnQgZ3JpZCBjb25maWd1cmF0aW9uXG4gKiBAcGFyYW0gY29tcGFjdGlvblR5cGUgdHlwZSBvZiBjb21wYWN0aW9uIHRoYXQgd2lsbCBiZSBwZXJmb3JtZWRcbiAqIEBwYXJhbSBkcmFnZ2luZ0RhdGEgY29udGFpbnMgYWxsIHRoZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZHJhZ1xuICovXG5leHBvcnQgZnVuY3Rpb24ga3RkR3JpZEl0ZW1SZXNpemluZyhncmlkSXRlbUlkOiBzdHJpbmcsIGNvbmZpZzogS3RkR3JpZENmZywgY29tcGFjdGlvblR5cGU6IENvbXBhY3RUeXBlLCBkcmFnZ2luZ0RhdGE6IEt0ZERyYWdnaW5nRGF0YSk6IHsgbGF5b3V0OiBLdGRHcmlkTGF5b3V0SXRlbVtdOyBkcmFnZ2VkSXRlbVBvczogS3RkR3JpZEl0ZW1SZWN0IH0ge1xuICAgIGNvbnN0IHtwb2ludGVyRG93bkV2ZW50LCBwb2ludGVyRHJhZ0V2ZW50LCBncmlkRWxlbUNsaWVudFJlY3QsIGRyYWdFbGVtQ2xpZW50UmVjdCwgc2Nyb2xsRGlmZmVyZW5jZX0gPSBkcmFnZ2luZ0RhdGE7XG5cbiAgICBjb25zdCBjbGllbnRTdGFydFggPSBrdGRQb2ludGVyQ2xpZW50WChwb2ludGVyRG93bkV2ZW50KTtcbiAgICBjb25zdCBjbGllbnRTdGFydFkgPSBrdGRQb2ludGVyQ2xpZW50WShwb2ludGVyRG93bkV2ZW50KTtcbiAgICBjb25zdCBjbGllbnRYID0ga3RkUG9pbnRlckNsaWVudFgocG9pbnRlckRyYWdFdmVudCk7XG4gICAgY29uc3QgY2xpZW50WSA9IGt0ZFBvaW50ZXJDbGllbnRZKHBvaW50ZXJEcmFnRXZlbnQpO1xuXG4gICAgLy8gR2V0IHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIG1vdXNlRG93biBhbmQgdGhlIHBvc2l0aW9uICdyaWdodCcgb2YgdGhlIHJlc2l6ZSBlbGVtZW50LlxuICAgIGNvbnN0IHJlc2l6ZUVsZW1PZmZzZXRYID0gZHJhZ0VsZW1DbGllbnRSZWN0LndpZHRoIC0gKGNsaWVudFN0YXJ0WCAtIGRyYWdFbGVtQ2xpZW50UmVjdC5sZWZ0KTtcbiAgICBjb25zdCByZXNpemVFbGVtT2Zmc2V0WSA9IGRyYWdFbGVtQ2xpZW50UmVjdC5oZWlnaHQgLSAoY2xpZW50U3RhcnRZIC0gZHJhZ0VsZW1DbGllbnRSZWN0LnRvcCk7XG5cbiAgICBjb25zdCBkcmFnZ2luZ0VsZW1QcmV2SXRlbSA9IGNvbmZpZy5sYXlvdXQuZmluZChpdGVtID0+IGl0ZW0uaWQgPT09IGdyaWRJdGVtSWQpITtcbiAgICBjb25zdCB3aWR0aCA9IGNsaWVudFggKyByZXNpemVFbGVtT2Zmc2V0WCAtIChkcmFnRWxlbUNsaWVudFJlY3QubGVmdCArIHNjcm9sbERpZmZlcmVuY2UubGVmdCk7XG4gICAgY29uc3QgaGVpZ2h0ID0gY2xpZW50WSArIHJlc2l6ZUVsZW1PZmZzZXRZIC0gKGRyYWdFbGVtQ2xpZW50UmVjdC50b3AgKyBzY3JvbGxEaWZmZXJlbmNlLnRvcCk7XG5cblxuICAgIC8vIEdldCBsYXlvdXQgaXRlbSBncmlkIHBvc2l0aW9uXG4gICAgY29uc3QgbGF5b3V0SXRlbTogS3RkR3JpZExheW91dEl0ZW0gPSB7XG4gICAgICAgIC4uLmRyYWdnaW5nRWxlbVByZXZJdGVtLFxuICAgICAgICB3OiBzY3JlZW5YUG9zVG9HcmlkVmFsdWUod2lkdGgsIGNvbmZpZy5jb2xzLCBncmlkRWxlbUNsaWVudFJlY3Qud2lkdGgpLFxuICAgICAgICBoOiBzY3JlZW5ZUG9zVG9HcmlkVmFsdWUoaGVpZ2h0LCBjb25maWcucm93SGVpZ2h0LCBncmlkRWxlbUNsaWVudFJlY3QuaGVpZ2h0KVxuICAgIH07XG5cbiAgICBsYXlvdXRJdGVtLncgPSBNYXRoLm1heCgxLCBsYXlvdXRJdGVtLncpO1xuICAgIGxheW91dEl0ZW0uaCA9IE1hdGgubWF4KDEsIGxheW91dEl0ZW0uaCk7XG4gICAgaWYgKGxheW91dEl0ZW0ueCArIGxheW91dEl0ZW0udyA+IGNvbmZpZy5jb2xzKSB7XG4gICAgICAgIGxheW91dEl0ZW0udyA9IE1hdGgubWF4KDEsIGNvbmZpZy5jb2xzIC0gbGF5b3V0SXRlbS54KTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLnByZXZlbnRDb2xsaXNpb24pIHtcbiAgICAgICAgY29uc3QgbWF4VyA9IGxheW91dEl0ZW0udztcbiAgICAgICAgY29uc3QgbWF4SCA9IGxheW91dEl0ZW0uaDtcblxuICAgICAgICBsZXQgY29sbGlkaW5nID0gaGFzQ29sbGlzaW9uKGNvbmZpZy5sYXlvdXQsIGxheW91dEl0ZW0pO1xuICAgICAgICBsZXQgc2hydW5rRGltZW5zaW9uOiAndycgfCAnaCcgfCB1bmRlZmluZWQ7XG5cbiAgICAgICAgd2hpbGUgKGNvbGxpZGluZykge1xuICAgICAgICAgICAgc2hydW5rRGltZW5zaW9uID0gZ2V0RGltZW5zaW9uVG9TaHJpbmsobGF5b3V0SXRlbSwgc2hydW5rRGltZW5zaW9uKTtcbiAgICAgICAgICAgIGxheW91dEl0ZW1bc2hydW5rRGltZW5zaW9uXS0tO1xuICAgICAgICAgICAgY29sbGlkaW5nID0gaGFzQ29sbGlzaW9uKGNvbmZpZy5sYXlvdXQsIGxheW91dEl0ZW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNocnVua0RpbWVuc2lvbiA9PT0gJ3cnKSB7XG4gICAgICAgICAgICBsYXlvdXRJdGVtLmggPSBtYXhIO1xuXG4gICAgICAgICAgICBjb2xsaWRpbmcgPSBoYXNDb2xsaXNpb24oY29uZmlnLmxheW91dCwgbGF5b3V0SXRlbSk7XG4gICAgICAgICAgICB3aGlsZSAoY29sbGlkaW5nKSB7XG4gICAgICAgICAgICAgICAgbGF5b3V0SXRlbS5oLS07XG4gICAgICAgICAgICAgICAgY29sbGlkaW5nID0gaGFzQ29sbGlzaW9uKGNvbmZpZy5sYXlvdXQsIGxheW91dEl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzaHJ1bmtEaW1lbnNpb24gPT09ICdoJykge1xuICAgICAgICAgICAgbGF5b3V0SXRlbS53ID0gbWF4VztcblxuICAgICAgICAgICAgY29sbGlkaW5nID0gaGFzQ29sbGlzaW9uKGNvbmZpZy5sYXlvdXQsIGxheW91dEl0ZW0pO1xuICAgICAgICAgICAgd2hpbGUgKGNvbGxpZGluZykge1xuICAgICAgICAgICAgICAgIGxheW91dEl0ZW0udy0tO1xuICAgICAgICAgICAgICAgIGNvbGxpZGluZyA9IGhhc0NvbGxpc2lvbihjb25maWcubGF5b3V0LCBsYXlvdXRJdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgY29uc3QgbmV3TGF5b3V0SXRlbXM6IExheW91dEl0ZW1bXSA9IGNvbmZpZy5sYXlvdXQubWFwKChpdGVtKSA9PiB7XG4gICAgICAgIHJldHVybiBpdGVtLmlkID09PSBncmlkSXRlbUlkID8gbGF5b3V0SXRlbSA6IGl0ZW07XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBsYXlvdXQ6IGNvbXBhY3QobmV3TGF5b3V0SXRlbXMsIGNvbXBhY3Rpb25UeXBlLCBjb25maWcuY29scyksXG4gICAgICAgIGRyYWdnZWRJdGVtUG9zOiB7XG4gICAgICAgICAgICB0b3A6IGRyYWdFbGVtQ2xpZW50UmVjdC50b3AgLSBncmlkRWxlbUNsaWVudFJlY3QudG9wLFxuICAgICAgICAgICAgbGVmdDogZHJhZ0VsZW1DbGllbnRSZWN0LmxlZnQgLSBncmlkRWxlbUNsaWVudFJlY3QubGVmdCxcbiAgICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0LFxuICAgICAgICB9XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gaGFzQ29sbGlzaW9uKGxheW91dDogTGF5b3V0LCBsYXlvdXRJdGVtOiBMYXlvdXRJdGVtKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhZ2V0Rmlyc3RDb2xsaXNpb24obGF5b3V0LCBsYXlvdXRJdGVtKTtcbn1cblxuZnVuY3Rpb24gZ2V0RGltZW5zaW9uVG9TaHJpbmsobGF5b3V0SXRlbSwgbGFzdFNocnVuayk6ICd3JyB8ICdoJyB7XG4gICAgaWYgKGxheW91dEl0ZW0uaCA8PSAxKSB7XG4gICAgICAgIHJldHVybiAndyc7XG4gICAgfVxuICAgIGlmIChsYXlvdXRJdGVtLncgPD0gMSkge1xuICAgICAgICByZXR1cm4gJ2gnO1xuICAgIH1cblxuICAgIHJldHVybiBsYXN0U2hydW5rID09PSAndycgPyAnaCcgOiAndyc7XG59XG4iXX0=