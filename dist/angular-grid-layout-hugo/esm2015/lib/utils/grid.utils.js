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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC51dGlscy5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWdyaWQtbGF5b3V0LWh1Z28vc3JjLyIsInNvdXJjZXMiOlsibGliL3V0aWxzL2dyaWQudXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBZSxpQkFBaUIsRUFBc0IsV0FBVyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFckgsT0FBTyxFQUFFLGlCQUFpQixFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFHdkUsMkhBQTJIO0FBQzNILE1BQU0sVUFBVSxZQUFZLENBQUMsS0FBYSxFQUFFLElBQWtCO0lBQzFELE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUNuQixDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsY0FBYyxDQUFDLE1BQXFCLEVBQUUsV0FBK0IsRUFBRSxJQUFZO0lBQy9GLE9BQU8sT0FBTyxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDO1FBQ3JDLG9EQUFvRDtTQUNuRCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEYsQ0FBQztBQUVELFNBQVMscUJBQXFCLENBQUMsVUFBa0IsRUFBRSxJQUFZLEVBQUUsS0FBYTtJQUMxRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7QUFDbkQsQ0FBQztBQUVELFNBQVMscUJBQXFCLENBQUMsVUFBa0IsRUFBRSxT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O1lBQ1osR0FBRyxFQUFFLGtCQUFrQixDQUFDLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQyxHQUFHO1lBQ3BELElBQUksRUFBRSxrQkFBa0IsQ0FBQyxJQUFJLEdBQUcsa0JBQWtCLENBQUMsSUFBSTtZQUN2RCxLQUFLO1lBQ0wsTUFBTTtTQUNUO0tBQ0osQ0FBQztBQUNOLENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBQyxNQUFjLEVBQUUsVUFBc0I7SUFDeEQsT0FBTyxDQUFDLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUFFRCxTQUFTLG9CQUFvQixDQUFDLFVBQVUsRUFBRSxVQUFVO0lBQ2hELElBQUksVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDbkIsT0FBTyxHQUFHLENBQUM7S0FDZDtJQUNELElBQUksVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDbkIsT0FBTyxHQUFHLENBQUM7S0FDZDtJQUVELE9BQU8sVUFBVSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFDMUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNvbXBhY3QsIENvbXBhY3RUeXBlLCBnZXRGaXJzdENvbGxpc2lvbiwgTGF5b3V0LCBMYXlvdXRJdGVtLCBtb3ZlRWxlbWVudCB9IGZyb20gJy4vcmVhY3QtZ3JpZC1sYXlvdXQudXRpbHMnO1xuaW1wb3J0IHsgS3RkRHJhZ2dpbmdEYXRhLCBLdGRHcmlkQ2ZnLCBLdGRHcmlkQ29tcGFjdFR5cGUsIEt0ZEdyaWRJdGVtUmVjdCwgS3RkR3JpZExheW91dCwgS3RkR3JpZExheW91dEl0ZW0gfSBmcm9tICcuLi9ncmlkLmRlZmluaXRpb25zJztcbmltcG9ydCB7IGt0ZFBvaW50ZXJDbGllbnRYLCBrdGRQb2ludGVyQ2xpZW50WSB9IGZyb20gJy4vcG9pbnRlci51dGlscyc7XG5pbXBvcnQgeyBLdGREaWN0aW9uYXJ5IH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG4vKiogVHJhY2tzIGl0ZW1zIGJ5IGlkLiBUaGlzIGZ1bmN0aW9uIGlzIG1lYW4gdG8gYmUgdXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIHRoZSBuZ0ZvciB0aGF0IHJlbmRlcnMgdGhlICdrdGQtZ3JpZC1pdGVtcycgKi9cbmV4cG9ydCBmdW5jdGlvbiBrdGRUcmFja0J5SWQoaW5kZXg6IG51bWJlciwgaXRlbToge2lkOiBzdHJpbmd9KSB7XG4gICAgcmV0dXJuIGl0ZW0uaWQ7XG59XG5cbi8qKlxuICogQ2FsbCByZWFjdC1ncmlkLWxheW91dCB1dGlscyAnY29tcGFjdCgpJyBmdW5jdGlvbiBhbmQgcmV0dXJuIHRoZSBjb21wYWN0ZWQgbGF5b3V0LlxuICogQHBhcmFtIGxheW91dCB0byBiZSBjb21wYWN0ZWQuXG4gKiBAcGFyYW0gY29tcGFjdFR5cGUsIHR5cGUgb2YgY29tcGFjdGlvbi5cbiAqIEBwYXJhbSBjb2xzLCBudW1iZXIgb2YgY29sdW1ucyBvZiB0aGUgZ3JpZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGt0ZEdyaWRDb21wYWN0KGxheW91dDogS3RkR3JpZExheW91dCwgY29tcGFjdFR5cGU6IEt0ZEdyaWRDb21wYWN0VHlwZSwgY29sczogbnVtYmVyKTogS3RkR3JpZExheW91dCB7XG4gICAgcmV0dXJuIGNvbXBhY3QobGF5b3V0LCBjb21wYWN0VHlwZSwgY29scylcbiAgICAgICAgLy8gUHJ1bmUgcmVhY3QtZ3JpZC1sYXlvdXQgY29tcGFjdCBleHRyYSBwcm9wZXJ0aWVzLlxuICAgICAgICAubWFwKGl0ZW0gPT4gKHtpZDogaXRlbS5pZCwgeDogaXRlbS54LCB5OiBpdGVtLnksIHc6IGl0ZW0udywgaDogaXRlbS5ofSkpO1xufVxuXG5mdW5jdGlvbiBzY3JlZW5YUG9zVG9HcmlkVmFsdWUoc2NyZWVuWFBvczogbnVtYmVyLCBjb2xzOiBudW1iZXIsIHdpZHRoOiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKChzY3JlZW5YUG9zICogY29scykgLyB3aWR0aCk7XG59XG5cbmZ1bmN0aW9uIHNjcmVlbllQb3NUb0dyaWRWYWx1ZShzY3JlZW5ZUG9zOiBudW1iZXIsIHJvd0hlaWdodDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoc2NyZWVuWVBvcyAvIHJvd0hlaWdodCk7XG59XG5cbi8qKiBSZXR1cm5zIGEgRGljdGlvbmFyeSB3aGVyZSB0aGUga2V5IGlzIHRoZSBpZCBhbmQgdGhlIHZhbHVlIGlzIHRoZSBjaGFuZ2UgYXBwbGllZCB0byB0aGF0IGl0ZW0uIElmIG5vIGNoYW5nZXMgRGljdGlvbmFyeSBpcyBlbXB0eS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBrdGRHZXRHcmlkTGF5b3V0RGlmZihncmlkTGF5b3V0QTogS3RkR3JpZExheW91dEl0ZW1bXSwgZ3JpZExheW91dEI6IEt0ZEdyaWRMYXlvdXRJdGVtW10pOiBLdGREaWN0aW9uYXJ5PHsgY2hhbmdlOiAnbW92ZScgfCAncmVzaXplJyB8ICdtb3ZlcmVzaXplJyB9PiB7XG4gICAgY29uc3QgZGlmZjogS3RkRGljdGlvbmFyeTx7IGNoYW5nZTogJ21vdmUnIHwgJ3Jlc2l6ZScgfCAnbW92ZXJlc2l6ZScgfT4gPSB7fTtcblxuICAgIGdyaWRMYXlvdXRBLmZvckVhY2goaXRlbUEgPT4ge1xuICAgICAgICBjb25zdCBpdGVtQiA9IGdyaWRMYXlvdXRCLmZpbmQoX2l0ZW1CID0+IF9pdGVtQi5pZCA9PT0gaXRlbUEuaWQpO1xuICAgICAgICBpZiAoaXRlbUIgIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgcG9zQ2hhbmdlZCA9IGl0ZW1BLnggIT09IGl0ZW1CLnggfHwgaXRlbUEueSAhPT0gaXRlbUIueTtcbiAgICAgICAgICAgIGNvbnN0IHNpemVDaGFuZ2VkID0gaXRlbUEudyAhPT0gaXRlbUIudyB8fCBpdGVtQS5oICE9PSBpdGVtQi5oO1xuICAgICAgICAgICAgY29uc3QgY2hhbmdlOiAnbW92ZScgfCAncmVzaXplJyB8ICdtb3ZlcmVzaXplJyB8IG51bGwgPSBwb3NDaGFuZ2VkICYmIHNpemVDaGFuZ2VkID8gJ21vdmVyZXNpemUnIDogcG9zQ2hhbmdlZCA/ICdtb3ZlJyA6IHNpemVDaGFuZ2VkID8gJ3Jlc2l6ZScgOiBudWxsO1xuICAgICAgICAgICAgaWYgKGNoYW5nZSkge1xuICAgICAgICAgICAgICAgIGRpZmZbaXRlbUIuaWRdID0ge2NoYW5nZX07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGlmZjtcbn1cblxuLyoqXG4gKiBHaXZlbiB0aGUgZ3JpZCBjb25maWcgJiBsYXlvdXQgZGF0YSBhbmQgdGhlIGN1cnJlbnQgZHJhZyBwb3NpdGlvbiAmIGluZm9ybWF0aW9uLCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIGxheW91dCBhbmQgZHJhZyBpdGVtIHBvc2l0aW9uXG4gKiBAcGFyYW0gZ3JpZEl0ZW1JZCBpZCBvZiB0aGUgZ3JpZCBpdGVtIHRoYXQgaXMgYmVlbiBkcmFnZ2VkXG4gKiBAcGFyYW0gY29uZmlnIGN1cnJlbnQgZ3JpZCBjb25maWd1cmF0aW9uXG4gKiBAcGFyYW0gY29tcGFjdGlvblR5cGUgdHlwZSBvZiBjb21wYWN0aW9uIHRoYXQgd2lsbCBiZSBwZXJmb3JtZWRcbiAqIEBwYXJhbSBkcmFnZ2luZ0RhdGEgY29udGFpbnMgYWxsIHRoZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgZHJhZ1xuICovXG5leHBvcnQgZnVuY3Rpb24ga3RkR3JpZEl0ZW1EcmFnZ2luZyhncmlkSXRlbUlkOiBzdHJpbmcsIGNvbmZpZzogS3RkR3JpZENmZywgY29tcGFjdGlvblR5cGU6IENvbXBhY3RUeXBlLCBkcmFnZ2luZ0RhdGE6IEt0ZERyYWdnaW5nRGF0YSk6IHsgbGF5b3V0OiBLdGRHcmlkTGF5b3V0SXRlbVtdOyBkcmFnZ2VkSXRlbVBvczogS3RkR3JpZEl0ZW1SZWN0IH0ge1xuICAgIGNvbnN0IHtwb2ludGVyRG93bkV2ZW50LCBwb2ludGVyRHJhZ0V2ZW50LCBncmlkRWxlbUNsaWVudFJlY3QsIGRyYWdFbGVtQ2xpZW50UmVjdCwgc2Nyb2xsRGlmZmVyZW5jZX0gPSBkcmFnZ2luZ0RhdGE7XG5cbiAgICBjb25zdCBkcmFnZ2luZ0VsZW1QcmV2SXRlbSA9IGNvbmZpZy5sYXlvdXQuZmluZChpdGVtID0+IGl0ZW0uaWQgPT09IGdyaWRJdGVtSWQpITtcblxuICAgIGNvbnN0IGNsaWVudFN0YXJ0WCA9IGt0ZFBvaW50ZXJDbGllbnRYKHBvaW50ZXJEb3duRXZlbnQpO1xuICAgIGNvbnN0IGNsaWVudFN0YXJ0WSA9IGt0ZFBvaW50ZXJDbGllbnRZKHBvaW50ZXJEb3duRXZlbnQpO1xuICAgIGNvbnN0IGNsaWVudFggPSBrdGRQb2ludGVyQ2xpZW50WChwb2ludGVyRHJhZ0V2ZW50KTtcbiAgICBjb25zdCBjbGllbnRZID0ga3RkUG9pbnRlckNsaWVudFkocG9pbnRlckRyYWdFdmVudCk7XG5cbiAgICBjb25zdCBvZmZzZXRYID0gY2xpZW50U3RhcnRYIC0gZHJhZ0VsZW1DbGllbnRSZWN0LmxlZnQ7XG4gICAgY29uc3Qgb2Zmc2V0WSA9IGNsaWVudFN0YXJ0WSAtIGRyYWdFbGVtQ2xpZW50UmVjdC50b3A7XG5cbiAgICAvLyBHcmlkIGVsZW1lbnQgcG9zaXRpb25zIHRha2luZyBpbnRvIGFjY291bnQgdGhlIHBvc3NpYmxlIHNjcm9sbCB0b3RhbCBkaWZmZXJlbmNlIGZyb20gdGhlIGJlZ2lubmluZy5cbiAgICBjb25zdCBncmlkRWxlbWVudExlZnRQb3NpdGlvbiA9IGdyaWRFbGVtQ2xpZW50UmVjdC5sZWZ0ICsgc2Nyb2xsRGlmZmVyZW5jZS5sZWZ0O1xuICAgIGNvbnN0IGdyaWRFbGVtZW50VG9wUG9zaXRpb24gPSBncmlkRWxlbUNsaWVudFJlY3QudG9wICsgc2Nyb2xsRGlmZmVyZW5jZS50b3A7XG5cbiAgICAvLyBDYWxjdWxhdGUgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGdyaWQgZWxlbWVudC5cbiAgICBjb25zdCBncmlkUmVsWFBvcyA9IGNsaWVudFggLSBncmlkRWxlbWVudExlZnRQb3NpdGlvbiAtIG9mZnNldFg7XG4gICAgY29uc3QgZ3JpZFJlbFlQb3MgPSBjbGllbnRZIC0gZ3JpZEVsZW1lbnRUb3BQb3NpdGlvbiAtIG9mZnNldFk7XG5cbiAgICAvLyBHZXQgbGF5b3V0IGl0ZW0gcG9zaXRpb25cbiAgICBjb25zdCBsYXlvdXRJdGVtOiBLdGRHcmlkTGF5b3V0SXRlbSA9IHtcbiAgICAgICAgLi4uZHJhZ2dpbmdFbGVtUHJldkl0ZW0sXG4gICAgICAgIHg6IHNjcmVlblhQb3NUb0dyaWRWYWx1ZShncmlkUmVsWFBvcywgY29uZmlnLmNvbHMsIGdyaWRFbGVtQ2xpZW50UmVjdC53aWR0aCksXG4gICAgICAgIHk6IHNjcmVlbllQb3NUb0dyaWRWYWx1ZShncmlkUmVsWVBvcywgY29uZmlnLnJvd0hlaWdodCwgZ3JpZEVsZW1DbGllbnRSZWN0LmhlaWdodClcbiAgICB9O1xuXG4gICAgLy8gQ29ycmVjdCB0aGUgdmFsdWVzIGlmIHRoZXkgb3ZlcmZsb3csIHNpbmNlICdtb3ZlRWxlbWVudCcgZnVuY3Rpb24gZG9lc24ndCBkbyBpdFxuICAgIGxheW91dEl0ZW0ueCA9IE1hdGgubWF4KDAsIGxheW91dEl0ZW0ueCk7XG4gICAgbGF5b3V0SXRlbS55ID0gTWF0aC5tYXgoMCwgbGF5b3V0SXRlbS55KTtcbiAgICBpZiAobGF5b3V0SXRlbS54ICsgbGF5b3V0SXRlbS53ID4gY29uZmlnLmNvbHMpIHtcbiAgICAgICAgbGF5b3V0SXRlbS54ID0gTWF0aC5tYXgoMCwgY29uZmlnLmNvbHMgLSBsYXlvdXRJdGVtLncpO1xuICAgIH1cblxuICAgIC8vIFBhcnNlIHRvIExheW91dEl0ZW0gYXJyYXkgZGF0YSBpbiBvcmRlciB0byB1c2UgJ3JlYWN0LmdyaWQtbGF5b3V0JyB1dGlsc1xuICAgIGNvbnN0IGxheW91dEl0ZW1zOiBMYXlvdXRJdGVtW10gPSBjb25maWcubGF5b3V0O1xuICAgIGNvbnN0IGRyYWdnZWRMYXlvdXRJdGVtOiBMYXlvdXRJdGVtID0gbGF5b3V0SXRlbXMuZmluZChpdGVtID0+IGl0ZW0uaWQgPT09IGdyaWRJdGVtSWQpITtcblxuICAgIGxldCBuZXdMYXlvdXRJdGVtczogTGF5b3V0SXRlbVtdID0gbW92ZUVsZW1lbnQoXG4gICAgICAgIGxheW91dEl0ZW1zLFxuICAgICAgICBkcmFnZ2VkTGF5b3V0SXRlbSxcbiAgICAgICAgbGF5b3V0SXRlbS54LFxuICAgICAgICBsYXlvdXRJdGVtLnksXG4gICAgICAgIHRydWUsXG4gICAgICAgIGNvbmZpZy5wcmV2ZW50Q29sbGlzaW9uLFxuICAgICAgICBjb21wYWN0aW9uVHlwZSxcbiAgICAgICAgY29uZmlnLmNvbHNcbiAgICApO1xuXG4gICAgbmV3TGF5b3V0SXRlbXMgPSBjb21wYWN0KG5ld0xheW91dEl0ZW1zLCBjb21wYWN0aW9uVHlwZSwgY29uZmlnLmNvbHMpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbGF5b3V0OiBuZXdMYXlvdXRJdGVtcyxcbiAgICAgICAgZHJhZ2dlZEl0ZW1Qb3M6IHtcbiAgICAgICAgICAgIHRvcDogZ3JpZFJlbFlQb3MsXG4gICAgICAgICAgICBsZWZ0OiBncmlkUmVsWFBvcyxcbiAgICAgICAgICAgIHdpZHRoOiBkcmFnRWxlbUNsaWVudFJlY3Qud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IGRyYWdFbGVtQ2xpZW50UmVjdC5oZWlnaHQsXG4gICAgICAgIH1cbiAgICB9O1xufVxuXG4vKipcbiAqIEdpdmVuIHRoZSBncmlkIGNvbmZpZyAmIGxheW91dCBkYXRhIGFuZCB0aGUgY3VycmVudCBkcmFnIHBvc2l0aW9uICYgaW5mb3JtYXRpb24sIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgbGF5b3V0IGFuZCBkcmFnIGl0ZW0gcG9zaXRpb25cbiAqIEBwYXJhbSBncmlkSXRlbUlkIGlkIG9mIHRoZSBncmlkIGl0ZW0gdGhhdCBpcyBiZWVuIGRyYWdnZWRcbiAqIEBwYXJhbSBjb25maWcgY3VycmVudCBncmlkIGNvbmZpZ3VyYXRpb25cbiAqIEBwYXJhbSBjb21wYWN0aW9uVHlwZSB0eXBlIG9mIGNvbXBhY3Rpb24gdGhhdCB3aWxsIGJlIHBlcmZvcm1lZFxuICogQHBhcmFtIGRyYWdnaW5nRGF0YSBjb250YWlucyBhbGwgdGhlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBkcmFnXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBrdGRHcmlkSXRlbVJlc2l6aW5nKGdyaWRJdGVtSWQ6IHN0cmluZywgY29uZmlnOiBLdGRHcmlkQ2ZnLCBjb21wYWN0aW9uVHlwZTogQ29tcGFjdFR5cGUsIGRyYWdnaW5nRGF0YTogS3RkRHJhZ2dpbmdEYXRhKTogeyBsYXlvdXQ6IEt0ZEdyaWRMYXlvdXRJdGVtW107IGRyYWdnZWRJdGVtUG9zOiBLdGRHcmlkSXRlbVJlY3QgfSB7XG4gICAgY29uc3Qge3BvaW50ZXJEb3duRXZlbnQsIHBvaW50ZXJEcmFnRXZlbnQsIGdyaWRFbGVtQ2xpZW50UmVjdCwgZHJhZ0VsZW1DbGllbnRSZWN0LCBzY3JvbGxEaWZmZXJlbmNlfSA9IGRyYWdnaW5nRGF0YTtcblxuICAgIGNvbnN0IGNsaWVudFN0YXJ0WCA9IGt0ZFBvaW50ZXJDbGllbnRYKHBvaW50ZXJEb3duRXZlbnQpO1xuICAgIGNvbnN0IGNsaWVudFN0YXJ0WSA9IGt0ZFBvaW50ZXJDbGllbnRZKHBvaW50ZXJEb3duRXZlbnQpO1xuICAgIGNvbnN0IGNsaWVudFggPSBrdGRQb2ludGVyQ2xpZW50WChwb2ludGVyRHJhZ0V2ZW50KTtcbiAgICBjb25zdCBjbGllbnRZID0ga3RkUG9pbnRlckNsaWVudFkocG9pbnRlckRyYWdFdmVudCk7XG5cbiAgICAvLyBHZXQgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgbW91c2VEb3duIGFuZCB0aGUgcG9zaXRpb24gJ3JpZ2h0JyBvZiB0aGUgcmVzaXplIGVsZW1lbnQuXG4gICAgY29uc3QgcmVzaXplRWxlbU9mZnNldFggPSBkcmFnRWxlbUNsaWVudFJlY3Qud2lkdGggLSAoY2xpZW50U3RhcnRYIC0gZHJhZ0VsZW1DbGllbnRSZWN0LmxlZnQpO1xuICAgIGNvbnN0IHJlc2l6ZUVsZW1PZmZzZXRZID0gZHJhZ0VsZW1DbGllbnRSZWN0LmhlaWdodCAtIChjbGllbnRTdGFydFkgLSBkcmFnRWxlbUNsaWVudFJlY3QudG9wKTtcblxuICAgIGNvbnN0IGRyYWdnaW5nRWxlbVByZXZJdGVtID0gY29uZmlnLmxheW91dC5maW5kKGl0ZW0gPT4gaXRlbS5pZCA9PT0gZ3JpZEl0ZW1JZCkhO1xuICAgIGNvbnN0IHdpZHRoID0gY2xpZW50WCArIHJlc2l6ZUVsZW1PZmZzZXRYIC0gKGRyYWdFbGVtQ2xpZW50UmVjdC5sZWZ0ICsgc2Nyb2xsRGlmZmVyZW5jZS5sZWZ0KTtcbiAgICBjb25zdCBoZWlnaHQgPSBjbGllbnRZICsgcmVzaXplRWxlbU9mZnNldFkgLSAoZHJhZ0VsZW1DbGllbnRSZWN0LnRvcCArIHNjcm9sbERpZmZlcmVuY2UudG9wKTtcblxuXG4gICAgLy8gR2V0IGxheW91dCBpdGVtIGdyaWQgcG9zaXRpb25cbiAgICBjb25zdCBsYXlvdXRJdGVtOiBLdGRHcmlkTGF5b3V0SXRlbSA9IHtcbiAgICAgICAgLi4uZHJhZ2dpbmdFbGVtUHJldkl0ZW0sXG4gICAgICAgIHc6IHNjcmVlblhQb3NUb0dyaWRWYWx1ZSh3aWR0aCwgY29uZmlnLmNvbHMsIGdyaWRFbGVtQ2xpZW50UmVjdC53aWR0aCksXG4gICAgICAgIGg6IHNjcmVlbllQb3NUb0dyaWRWYWx1ZShoZWlnaHQsIGNvbmZpZy5yb3dIZWlnaHQsIGdyaWRFbGVtQ2xpZW50UmVjdC5oZWlnaHQpXG4gICAgfTtcblxuICAgIGxheW91dEl0ZW0udyA9IE1hdGgubWF4KDEsIGxheW91dEl0ZW0udyk7XG4gICAgbGF5b3V0SXRlbS5oID0gTWF0aC5tYXgoMSwgbGF5b3V0SXRlbS5oKTtcbiAgICBpZiAobGF5b3V0SXRlbS54ICsgbGF5b3V0SXRlbS53ID4gY29uZmlnLmNvbHMpIHtcbiAgICAgICAgbGF5b3V0SXRlbS53ID0gTWF0aC5tYXgoMSwgY29uZmlnLmNvbHMgLSBsYXlvdXRJdGVtLngpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcucHJldmVudENvbGxpc2lvbikge1xuICAgICAgICBjb25zdCBtYXhXID0gbGF5b3V0SXRlbS53O1xuICAgICAgICBjb25zdCBtYXhIID0gbGF5b3V0SXRlbS5oO1xuXG4gICAgICAgIGxldCBjb2xsaWRpbmcgPSBoYXNDb2xsaXNpb24oY29uZmlnLmxheW91dCwgbGF5b3V0SXRlbSk7XG4gICAgICAgIGxldCBzaHJ1bmtEaW1lbnNpb246ICd3JyB8ICdoJyB8IHVuZGVmaW5lZDtcblxuICAgICAgICB3aGlsZSAoY29sbGlkaW5nKSB7XG4gICAgICAgICAgICBzaHJ1bmtEaW1lbnNpb24gPSBnZXREaW1lbnNpb25Ub1NocmluayhsYXlvdXRJdGVtLCBzaHJ1bmtEaW1lbnNpb24pO1xuICAgICAgICAgICAgbGF5b3V0SXRlbVtzaHJ1bmtEaW1lbnNpb25dLS07XG4gICAgICAgICAgICBjb2xsaWRpbmcgPSBoYXNDb2xsaXNpb24oY29uZmlnLmxheW91dCwgbGF5b3V0SXRlbSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2hydW5rRGltZW5zaW9uID09PSAndycpIHtcbiAgICAgICAgICAgIGxheW91dEl0ZW0uaCA9IG1heEg7XG5cbiAgICAgICAgICAgIGNvbGxpZGluZyA9IGhhc0NvbGxpc2lvbihjb25maWcubGF5b3V0LCBsYXlvdXRJdGVtKTtcbiAgICAgICAgICAgIHdoaWxlIChjb2xsaWRpbmcpIHtcbiAgICAgICAgICAgICAgICBsYXlvdXRJdGVtLmgtLTtcbiAgICAgICAgICAgICAgICBjb2xsaWRpbmcgPSBoYXNDb2xsaXNpb24oY29uZmlnLmxheW91dCwgbGF5b3V0SXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNocnVua0RpbWVuc2lvbiA9PT0gJ2gnKSB7XG4gICAgICAgICAgICBsYXlvdXRJdGVtLncgPSBtYXhXO1xuXG4gICAgICAgICAgICBjb2xsaWRpbmcgPSBoYXNDb2xsaXNpb24oY29uZmlnLmxheW91dCwgbGF5b3V0SXRlbSk7XG4gICAgICAgICAgICB3aGlsZSAoY29sbGlkaW5nKSB7XG4gICAgICAgICAgICAgICAgbGF5b3V0SXRlbS53LS07XG4gICAgICAgICAgICAgICAgY29sbGlkaW5nID0gaGFzQ29sbGlzaW9uKGNvbmZpZy5sYXlvdXQsIGxheW91dEl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBjb25zdCBuZXdMYXlvdXRJdGVtczogTGF5b3V0SXRlbVtdID0gY29uZmlnLmxheW91dC5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgcmV0dXJuIGl0ZW0uaWQgPT09IGdyaWRJdGVtSWQgPyBsYXlvdXRJdGVtIDogaXRlbTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGxheW91dDogY29tcGFjdChuZXdMYXlvdXRJdGVtcywgY29tcGFjdGlvblR5cGUsIGNvbmZpZy5jb2xzKSxcbiAgICAgICAgZHJhZ2dlZEl0ZW1Qb3M6IHtcbiAgICAgICAgICAgIHRvcDogZHJhZ0VsZW1DbGllbnRSZWN0LnRvcCAtIGdyaWRFbGVtQ2xpZW50UmVjdC50b3AsXG4gICAgICAgICAgICBsZWZ0OiBkcmFnRWxlbUNsaWVudFJlY3QubGVmdCAtIGdyaWRFbGVtQ2xpZW50UmVjdC5sZWZ0LFxuICAgICAgICAgICAgd2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQsXG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5mdW5jdGlvbiBoYXNDb2xsaXNpb24obGF5b3V0OiBMYXlvdXQsIGxheW91dEl0ZW06IExheW91dEl0ZW0pOiBib29sZWFuIHtcbiAgICByZXR1cm4gISFnZXRGaXJzdENvbGxpc2lvbihsYXlvdXQsIGxheW91dEl0ZW0pO1xufVxuXG5mdW5jdGlvbiBnZXREaW1lbnNpb25Ub1NocmluayhsYXlvdXRJdGVtLCBsYXN0U2hydW5rKTogJ3cnIHwgJ2gnIHtcbiAgICBpZiAobGF5b3V0SXRlbS5oIDw9IDEpIHtcbiAgICAgICAgcmV0dXJuICd3JztcbiAgICB9XG4gICAgaWYgKGxheW91dEl0ZW0udyA8PSAxKSB7XG4gICAgICAgIHJldHVybiAnaCc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxhc3RTaHJ1bmsgPT09ICd3JyA/ICdoJyA6ICd3Jztcbn1cbiJdfQ==