/**
 * IMPORTANT:
 * This utils are taken from the project: https://github.com/STRML/react-grid-layout.
 * The code should be as less modified as possible for easy maintenance.
 */
const DEBUG = false;
/**
 * Return the bottom coordinate of the layout.
 *
 * @param  {Array} layout Layout array.
 * @return {Number}       Bottom coordinate.
 */
export function bottom(layout) {
    let max = 0, bottomY;
    for (let i = 0, len = layout.length; i < len; i++) {
        bottomY = layout[i].y + layout[i].h;
        if (bottomY > max) {
            max = bottomY;
        }
    }
    return max;
}
export function cloneLayout(layout) {
    const newLayout = Array(layout.length);
    for (let i = 0, len = layout.length; i < len; i++) {
        newLayout[i] = cloneLayoutItem(layout[i]);
    }
    return newLayout;
}
// Fast path to cloning, since this is monomorphic
/** NOTE: This code has been modified from the original source */
export function cloneLayoutItem(layoutItem) {
    const clonedLayoutItem = {
        w: layoutItem.w,
        h: layoutItem.h,
        x: layoutItem.x,
        y: layoutItem.y,
        id: layoutItem.id,
        moved: !!layoutItem.moved,
        static: !!layoutItem.static,
    };
    if (layoutItem.minW !== undefined) {
        clonedLayoutItem.minW = layoutItem.minW;
    }
    if (layoutItem.maxW !== undefined) {
        clonedLayoutItem.maxW = layoutItem.maxW;
    }
    if (layoutItem.minH !== undefined) {
        clonedLayoutItem.minH = layoutItem.minH;
    }
    if (layoutItem.maxH !== undefined) {
        clonedLayoutItem.maxH = layoutItem.maxH;
    }
    // These can be null
    if (layoutItem.isDraggable !== undefined) {
        clonedLayoutItem.isDraggable = layoutItem.isDraggable;
    }
    if (layoutItem.isResizable !== undefined) {
        clonedLayoutItem.isResizable = layoutItem.isResizable;
    }
    return clonedLayoutItem;
}
/**
 * Given two layoutitems, check if they collide.
 */
export function collides(l1, l2) {
    if (l1.id === l2.id) {
        return false;
    } // same element
    if (l1.x + l1.w <= l2.x) {
        return false;
    } // l1 is left of l2
    if (l1.x >= l2.x + l2.w) {
        return false;
    } // l1 is right of l2
    if (l1.y + l1.h <= l2.y) {
        return false;
    } // l1 is above l2
    if (l1.y >= l2.y + l2.h) {
        return false;
    } // l1 is below l2
    return true; // boxes overlap
}
/**
 * Given a layout, compact it. This involves going down each y coordinate and removing gaps
 * between items.
 *
 * @param  {Array} layout Layout.
 * @param  {Boolean} verticalCompact Whether or not to compact the layout
 *   vertically.
 * @return {Array}       Compacted Layout.
 */
export function compact(layout, compactType, cols) {
    // Statics go in the compareWith array right away so items flow around them.
    const compareWith = getStatics(layout);
    // We go through the items by row and column.
    const sorted = sortLayoutItems(layout, compactType);
    // Holding for new items.
    const out = Array(layout.length);
    for (let i = 0, len = sorted.length; i < len; i++) {
        let l = cloneLayoutItem(sorted[i]);
        // Don't move static elements
        if (!l.static) {
            l = compactItem(compareWith, l, compactType, cols, sorted);
            // Add to comparison array. We only collide with items before this one.
            // Statics are already in this array.
            compareWith.push(l);
        }
        // Add to output array to make sure they still come out in the right order.
        out[layout.indexOf(sorted[i])] = l;
        // Clear moved flag, if it exists.
        l.moved = false;
    }
    return out;
}
const heightWidth = { x: 'w', y: 'h' };
/**
 * Before moving item down, it will check if the movement will cause collisions and move those items down before.
 */
function resolveCompactionCollision(layout, item, moveToCoord, axis) {
    const sizeProp = heightWidth[axis];
    item[axis] += 1;
    const itemIndex = layout
        .map(layoutItem => {
        return layoutItem.id;
    })
        .indexOf(item.id);
    // Go through each item we collide with.
    for (let i = itemIndex + 1; i < layout.length; i++) {
        const otherItem = layout[i];
        // Ignore static items
        if (otherItem.static) {
            continue;
        }
        // Optimization: we can break early if we know we're past this el
        // We can do this b/c it's a sorted layout
        if (otherItem.y > item.y + item.h) {
            break;
        }
        if (collides(item, otherItem)) {
            resolveCompactionCollision(layout, otherItem, moveToCoord + item[sizeProp], axis);
        }
    }
    item[axis] = moveToCoord;
}
/**
 * Compact an item in the layout.
 */
export function compactItem(compareWith, l, compactType, cols, fullLayout) {
    const compactV = compactType === 'vertical';
    const compactH = compactType === 'horizontal';
    if (compactV) {
        // Bottom 'y' possible is the bottom of the layout.
        // This allows you to do nice stuff like specify {y: Infinity}
        // This is here because the layout must be sorted in order to get the correct bottom `y`.
        l.y = Math.min(bottom(compareWith), l.y);
        // Move the element up as far as it can go without colliding.
        while (l.y > 0 && !getFirstCollision(compareWith, l)) {
            l.y--;
        }
    }
    else if (compactH) {
        l.y = Math.min(bottom(compareWith), l.y);
        // Move the element left as far as it can go without colliding.
        while (l.x > 0 && !getFirstCollision(compareWith, l)) {
            l.x--;
        }
    }
    // Move it down, and keep moving it down if it's colliding.
    let collides;
    while ((collides = getFirstCollision(compareWith, l))) {
        if (compactH) {
            resolveCompactionCollision(fullLayout, l, collides.x + collides.w, 'x');
        }
        else {
            resolveCompactionCollision(fullLayout, l, collides.y + collides.h, 'y');
        }
        // Since we can't grow without bounds horizontally, if we've overflown, let's move it down and try again.
        if (compactH && l.x + l.w > cols) {
            l.x = cols - l.w;
            l.y++;
        }
    }
    return l;
}
/**
 * Given a layout, make sure all elements fit within its bounds.
 *
 * @param  {Array} layout Layout array.
 * @param  {Number} bounds Number of columns.
 */
export function correctBounds(layout, bounds) {
    const collidesWith = getStatics(layout);
    for (let i = 0, len = layout.length; i < len; i++) {
        const l = layout[i];
        // Overflows right
        if (l.x + l.w > bounds.cols) {
            l.x = bounds.cols - l.w;
        }
        // Overflows left
        if (l.x < 0) {
            l.x = 0;
            l.w = bounds.cols;
        }
        if (!l.static) {
            collidesWith.push(l);
        }
        else {
            // If this is static and collides with other statics, we must move it down.
            // We have to do something nicer than just letting them overlap.
            while (getFirstCollision(collidesWith, l)) {
                l.y++;
            }
        }
    }
    return layout;
}
/**
 * Get a layout item by ID. Used so we can override later on if necessary.
 *
 * @param  {Array}  layout Layout array.
 * @param  {String} id     ID
 * @return {LayoutItem}    Item at ID.
 */
export function getLayoutItem(layout, id) {
    for (let i = 0, len = layout.length; i < len; i++) {
        if (layout[i].id === id) {
            return layout[i];
        }
    }
    return null;
}
/**
 * Returns the first item this layout collides with.
 * It doesn't appear to matter which order we approach this from, although
 * perhaps that is the wrong thing to do.
 *
 * @param  {Object} layoutItem Layout item.
 * @return {Object|undefined}  A colliding layout item, or undefined.
 */
export function getFirstCollision(layout, layoutItem) {
    for (let i = 0, len = layout.length; i < len; i++) {
        if (collides(layout[i], layoutItem)) {
            return layout[i];
        }
    }
    return null;
}
export function getAllCollisions(layout, layoutItem) {
    return layout.filter(l => collides(l, layoutItem));
}
/**
 * Get all static elements.
 * @param  {Array} layout Array of layout objects.
 * @return {Array}        Array of static layout items..
 */
export function getStatics(layout) {
    return layout.filter(l => l.static);
}
/**
 * Move an element. Responsible for doing cascading movements of other elements.
 *
 * @param  {Array}      layout            Full layout to modify.
 * @param  {LayoutItem} l                 element to move.
 * @param  {Number}     [x]               X position in grid units.
 * @param  {Number}     [y]               Y position in grid units.
 */
export function moveElement(layout, l, x, y, isUserAction, preventCollision, compactType, cols) {
    // If this is static and not explicitly enabled as draggable,
    // no move is possible, so we can short-circuit this immediately.
    if (l.static && l.isDraggable !== true) {
        return layout;
    }
    // Short-circuit if nothing to do.
    if (l.y === y && l.x === x) {
        return layout;
    }
    log(`Moving element ${l.id} to [${String(x)},${String(y)}] from [${l.x},${l.y}]`);
    const oldX = l.x;
    const oldY = l.y;
    // This is quite a bit faster than extending the object
    if (typeof x === 'number') {
        l.x = x;
    }
    if (typeof y === 'number') {
        l.y = y;
    }
    l.moved = true;
    // If this collides with anything, move it.
    // When doing this comparison, we have to sort the items we compare with
    // to ensure, in the case of multiple collisions, that we're getting the
    // nearest collision.
    let sorted = sortLayoutItems(layout, compactType);
    const movingUp = compactType === 'vertical' && typeof y === 'number'
        ? oldY >= y
        : compactType === 'horizontal' && typeof x === 'number'
            ? oldX >= x
            : false;
    if (movingUp) {
        sorted = sorted.reverse();
    }
    const collisions = getAllCollisions(sorted, l);
    // There was a collision; abort
    if (preventCollision && collisions.length) {
        log(`Collision prevented on ${l.id}, reverting.`);
        l.x = oldX;
        l.y = oldY;
        l.moved = false;
        return layout;
    }
    // Move each item that collides away from this element.
    for (let i = 0, len = collisions.length; i < len; i++) {
        const collision = collisions[i];
        log(`Resolving collision between ${l.id} at [${l.x},${l.y}] and ${collision.id} at [${collision.x},${collision.y}]`);
        // Short circuit so we can't infinite loop
        if (collision.moved) {
            continue;
        }
        // Don't move static items - we have to move *this* element away
        if (collision.static) {
            layout = moveElementAwayFromCollision(layout, collision, l, isUserAction, compactType, cols);
        }
        else {
            layout = moveElementAwayFromCollision(layout, l, collision, isUserAction, compactType, cols);
        }
    }
    return layout;
}
/**
 * This is where the magic needs to happen - given a collision, move an element away from the collision.
 * We attempt to move it up if there's room, otherwise it goes below.
 *
 * @param  {Array} layout            Full layout to modify.
 * @param  {LayoutItem} collidesWith Layout item we're colliding with.
 * @param  {LayoutItem} itemToMove   Layout item we're moving.
 */
export function moveElementAwayFromCollision(layout, collidesWith, itemToMove, isUserAction, compactType, cols) {
    const compactH = compactType === 'horizontal';
    // Compact vertically if not set to horizontal
    const compactV = compactType !== 'horizontal';
    const preventCollision = collidesWith.static; // we're already colliding (not for static items)
    // If there is enough space above the collision to put this element, move it there.
    // We only do this on the main collision as this can get funky in cascades and cause
    // unwanted swapping behavior.
    if (isUserAction) {
        // Reset isUserAction flag because we're not in the main collision anymore.
        isUserAction = false;
        // Make a mock item so we don't modify the item here, only modify in moveElement.
        const fakeItem = {
            x: compactH
                ? Math.max(collidesWith.x - itemToMove.w, 0)
                : itemToMove.x,
            y: compactV
                ? Math.max(collidesWith.y - itemToMove.h, 0)
                : itemToMove.y,
            w: itemToMove.w,
            h: itemToMove.h,
            id: '-1',
        };
        // No collision? If so, we can go up there; otherwise, we'll end up moving down as normal
        if (!getFirstCollision(layout, fakeItem)) {
            log(`Doing reverse collision on ${itemToMove.id} up to [${fakeItem.x},${fakeItem.y}].`);
            return moveElement(layout, itemToMove, compactH ? fakeItem.x : undefined, compactV ? fakeItem.y : undefined, isUserAction, preventCollision, compactType, cols);
        }
    }
    return moveElement(layout, itemToMove, compactH ? itemToMove.x + 1 : undefined, compactV ? itemToMove.y + 1 : undefined, isUserAction, preventCollision, compactType, cols);
}
/**
 * Helper to convert a number to a percentage string.
 *
 * @param  {Number} num Any number
 * @return {String}     That number as a percentage.
 */
export function perc(num) {
    return num * 100 + '%';
}
export function setTransform({ top, left, width, height }) {
    // Replace unitless items with px
    const translate = `translate(${left}px,${top}px)`;
    return {
        transform: translate,
        WebkitTransform: translate,
        MozTransform: translate,
        msTransform: translate,
        OTransform: translate,
        width: `${width}px`,
        height: `${height}px`,
        position: 'absolute',
    };
}
export function setTopLeft({ top, left, width, height }) {
    return {
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
        position: 'absolute',
    };
}
/**
 * Get layout items sorted from top left to right and down.
 *
 * @return {Array} Array of layout objects.
 * @return {Array}        Layout, sorted static items first.
 */
export function sortLayoutItems(layout, compactType) {
    if (compactType === 'horizontal') {
        return sortLayoutItemsByColRow(layout);
    }
    else {
        return sortLayoutItemsByRowCol(layout);
    }
}
export function sortLayoutItemsByRowCol(layout) {
    return [].concat(layout).sort(function (a, b) {
        if (a.y > b.y || (a.y === b.y && a.x > b.x)) {
            return 1;
        }
        else if (a.y === b.y && a.x === b.x) {
            // Without this, we can get different sort results in IE vs. Chrome/FF
            return 0;
        }
        return -1;
    });
}
export function sortLayoutItemsByColRow(layout) {
    return [].concat(layout).sort(function (a, b) {
        if (a.x > b.x || (a.x === b.x && a.y > b.y)) {
            return 1;
        }
        return -1;
    });
}
/**
 * Validate a layout. Throws errors.
 *
 * @param  {Array}  layout        Array of layout items.
 * @param  {String} [contextName] Context name for errors.
 * @throw  {Error}                Validation error.
 */
export function validateLayout(layout, contextName = 'Layout') {
    const subProps = ['x', 'y', 'w', 'h'];
    if (!Array.isArray(layout)) {
        throw new Error(contextName + ' must be an array!');
    }
    for (let i = 0, len = layout.length; i < len; i++) {
        const item = layout[i];
        for (let j = 0; j < subProps.length; j++) {
            if (typeof item[subProps[j]] !== 'number') {
                throw new Error('ReactGridLayout: ' +
                    contextName +
                    '[' +
                    i +
                    '].' +
                    subProps[j] +
                    ' must be a number!');
            }
        }
        if (item.id && typeof item.id !== 'string') {
            throw new Error('ReactGridLayout: ' +
                contextName +
                '[' +
                i +
                '].i must be a string!');
        }
        if (item.static !== undefined && typeof item.static !== 'boolean') {
            throw new Error('ReactGridLayout: ' +
                contextName +
                '[' +
                i +
                '].static must be a boolean!');
        }
    }
}
// Flow can't really figure this out, so we just use Object
export function autoBindHandlers(el, fns) {
    fns.forEach(key => (el[key] = el[key].bind(el)));
}
function log(...args) {
    if (!DEBUG) {
        return;
    }
    // eslint-disable-next-line no-console
    console.log(...args);
}
export const noop = () => { };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3QtZ3JpZC1sYXlvdXQudXRpbHMuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1ncmlkLWxheW91dC9zcmMvIiwic291cmNlcyI6WyJsaWIvdXRpbHMvcmVhY3QtZ3JpZC1sYXlvdXQudXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7Ozs7R0FJRztBQXFFSCxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUM7QUFFcEI7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsTUFBTSxDQUFDLE1BQWM7SUFDakMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUNQLE9BQU8sQ0FBQztJQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDL0MsT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxJQUFJLE9BQU8sR0FBRyxHQUFHLEVBQUU7WUFDZixHQUFHLEdBQUcsT0FBTyxDQUFDO1NBQ2pCO0tBQ0o7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7QUFFRCxNQUFNLFVBQVUsV0FBVyxDQUFDLE1BQWM7SUFDdEMsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQy9DLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDN0M7SUFDRCxPQUFPLFNBQVMsQ0FBQztBQUNyQixDQUFDO0FBRUQsa0RBQWtE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QyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDekIsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKlxuICogSU1QT1JUQU5UOlxuICogVGhpcyB1dGlscyBhcmUgdGFrZW4gZnJvbSB0aGUgcHJvamVjdDogaHR0cHM6Ly9naXRodWIuY29tL1NUUk1ML3JlYWN0LWdyaWQtbGF5b3V0LlxuICogVGhlIGNvZGUgc2hvdWxkIGJlIGFzIGxlc3MgbW9kaWZpZWQgYXMgcG9zc2libGUgZm9yIGVhc3kgbWFpbnRlbmFuY2UuXG4gKi9cblxuLy8gRGlzYWJsZSBsaW50IHNpbmNlIHdlIGRvbid0IHdhbnQgdG8gbW9kaWZ5IHRoaXMgY29kZVxuLy8gdHNsaW50OmRpc2FibGVcbmV4cG9ydCB0eXBlIExheW91dEl0ZW0gPSB7XG4gICAgdzogbnVtYmVyO1xuICAgIGg6IG51bWJlcjtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICAgIGlkOiBzdHJpbmc7XG4gICAgbWluVz86IG51bWJlcjtcbiAgICBtaW5IPzogbnVtYmVyO1xuICAgIG1heFc/OiBudW1iZXI7XG4gICAgbWF4SD86IG51bWJlcjtcbiAgICBtb3ZlZD86IGJvb2xlYW47XG4gICAgc3RhdGljPzogYm9vbGVhbjtcbiAgICBpc0RyYWdnYWJsZT86IGJvb2xlYW4gfCBudWxsIHwgdW5kZWZpbmVkO1xuICAgIGlzUmVzaXphYmxlPzogYm9vbGVhbiB8IG51bGwgfCB1bmRlZmluZWQ7XG59O1xuZXhwb3J0IHR5cGUgTGF5b3V0ID0gQXJyYXk8TGF5b3V0SXRlbT47XG5leHBvcnQgdHlwZSBQb3NpdGlvbiA9IHtcbiAgICBsZWZ0OiBudW1iZXI7XG4gICAgdG9wOiBudW1iZXI7XG4gICAgd2lkdGg6IG51bWJlcjtcbiAgICBoZWlnaHQ6IG51bWJlcjtcbn07XG5leHBvcnQgdHlwZSBSZWFjdERyYWdnYWJsZUNhbGxiYWNrRGF0YSA9IHtcbiAgICBub2RlOiBIVE1MRWxlbWVudDtcbiAgICB4PzogbnVtYmVyO1xuICAgIHk/OiBudW1iZXI7XG4gICAgZGVsdGFYOiBudW1iZXI7XG4gICAgZGVsdGFZOiBudW1iZXI7XG4gICAgbGFzdFg/OiBudW1iZXI7XG4gICAgbGFzdFk/OiBudW1iZXI7XG59O1xuXG5leHBvcnQgdHlwZSBQYXJ0aWFsUG9zaXRpb24gPSB7IGxlZnQ6IG51bWJlcjsgdG9wOiBudW1iZXIgfTtcbmV4cG9ydCB0eXBlIERyb3BwaW5nUG9zaXRpb24gPSB7IHg6IG51bWJlcjsgeTogbnVtYmVyOyBlOiBFdmVudCB9O1xuZXhwb3J0IHR5cGUgU2l6ZSA9IHsgd2lkdGg6IG51bWJlcjsgaGVpZ2h0OiBudW1iZXIgfTtcbmV4cG9ydCB0eXBlIEdyaWREcmFnRXZlbnQgPSB7XG4gICAgZTogRXZlbnQ7XG4gICAgbm9kZTogSFRNTEVsZW1lbnQ7XG4gICAgbmV3UG9zaXRpb246IFBhcnRpYWxQb3NpdGlvbjtcbn07XG5leHBvcnQgdHlwZSBHcmlkUmVzaXplRXZlbnQgPSB7IGU6IEV2ZW50OyBub2RlOiBIVE1MRWxlbWVudDsgc2l6ZTogU2l6ZSB9O1xuZXhwb3J0IHR5cGUgRHJhZ092ZXJFdmVudCA9IE1vdXNlRXZlbnQgJiB7XG4gICAgbmF0aXZlRXZlbnQ6IHtcbiAgICAgICAgbGF5ZXJYOiBudW1iZXI7XG4gICAgICAgIGxheWVyWTogbnVtYmVyO1xuICAgICAgICB0YXJnZXQ6IHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogU3RyaW5nO1xuICAgICAgICB9O1xuICAgIH07XG59O1xuXG4vL3R5cGUgUkVsID0gUmVhY3RFbGVtZW50PGFueT47XG4vL2V4cG9ydCB0eXBlIFJlYWN0Q2hpbGRyZW4gPSBSZWFjdENoaWxkcmVuQXJyYXk8UkVsPjtcblxuLy8gQWxsIGNhbGxiYWNrcyBhcmUgb2YgdGhlIHNpZ25hdHVyZSAobGF5b3V0LCBvbGRJdGVtLCBuZXdJdGVtLCBwbGFjZWhvbGRlciwgZSkuXG5leHBvcnQgdHlwZSBFdmVudENhbGxiYWNrID0gKFxuICAgIGFyZzA6IExheW91dCxcbiAgICBvbGRJdGVtOiBMYXlvdXRJdGVtIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICBuZXdJdGVtOiBMYXlvdXRJdGVtIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICBwbGFjZWhvbGRlcjogTGF5b3V0SXRlbSB8IG51bGwgfCB1bmRlZmluZWQsXG4gICAgYXJnNDogRXZlbnQsXG4gICAgYXJnNTogSFRNTEVsZW1lbnQgfCBudWxsIHwgdW5kZWZpbmVkLFxuKSA9PiB2b2lkO1xuZXhwb3J0IHR5cGUgQ29tcGFjdFR5cGUgPSAoJ2hvcml6b250YWwnIHwgJ3ZlcnRpY2FsJykgfCBudWxsIHwgdW5kZWZpbmVkO1xuXG5jb25zdCBERUJVRyA9IGZhbHNlO1xuXG4vKipcbiAqIFJldHVybiB0aGUgYm90dG9tIGNvb3JkaW5hdGUgb2YgdGhlIGxheW91dC5cbiAqXG4gKiBAcGFyYW0gIHtBcnJheX0gbGF5b3V0IExheW91dCBhcnJheS5cbiAqIEByZXR1cm4ge051bWJlcn0gICAgICAgQm90dG9tIGNvb3JkaW5hdGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBib3R0b20obGF5b3V0OiBMYXlvdXQpOiBudW1iZXIge1xuICAgIGxldCBtYXggPSAwLFxuICAgICAgICBib3R0b21ZO1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBsYXlvdXQubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgYm90dG9tWSA9IGxheW91dFtpXS55ICsgbGF5b3V0W2ldLmg7XG4gICAgICAgIGlmIChib3R0b21ZID4gbWF4KSB7XG4gICAgICAgICAgICBtYXggPSBib3R0b21ZO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYXg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9uZUxheW91dChsYXlvdXQ6IExheW91dCk6IExheW91dCB7XG4gICAgY29uc3QgbmV3TGF5b3V0ID0gQXJyYXkobGF5b3V0Lmxlbmd0aCk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGxheW91dC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBuZXdMYXlvdXRbaV0gPSBjbG9uZUxheW91dEl0ZW0obGF5b3V0W2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld0xheW91dDtcbn1cblxuLy8gRmFzdCBwYXRoIHRvIGNsb25pbmcsIHNpbmNlIHRoaXMgaXMgbW9ub21vcnBoaWNcbi8qKiBOT1RFOiBUaGlzIGNvZGUgaGFzIGJlZW4gbW9kaWZpZWQgZnJvbSB0aGUgb3JpZ2luYWwgc291cmNlICovXG5leHBvcnQgZnVuY3Rpb24gY2xvbmVMYXlvdXRJdGVtKGxheW91dEl0ZW06IExheW91dEl0ZW0pOiBMYXlvdXRJdGVtIHtcbiAgICBjb25zdCBjbG9uZWRMYXlvdXRJdGVtOiBMYXlvdXRJdGVtID0ge1xuICAgICAgICB3OiBsYXlvdXRJdGVtLncsXG4gICAgICAgIGg6IGxheW91dEl0ZW0uaCxcbiAgICAgICAgeDogbGF5b3V0SXRlbS54LFxuICAgICAgICB5OiBsYXlvdXRJdGVtLnksXG4gICAgICAgIGlkOiBsYXlvdXRJdGVtLmlkLFxuICAgICAgICBtb3ZlZDogISFsYXlvdXRJdGVtLm1vdmVkLFxuICAgICAgICBzdGF0aWM6ICEhbGF5b3V0SXRlbS5zdGF0aWMsXG4gICAgfTtcblxuICAgIGlmIChsYXlvdXRJdGVtLm1pblcgIT09IHVuZGVmaW5lZCkgeyBjbG9uZWRMYXlvdXRJdGVtLm1pblcgPSBsYXlvdXRJdGVtLm1pblc7fVxuICAgIGlmIChsYXlvdXRJdGVtLm1heFcgIT09IHVuZGVmaW5lZCkgeyBjbG9uZWRMYXlvdXRJdGVtLm1heFcgPSBsYXlvdXRJdGVtLm1heFc7fVxuICAgIGlmIChsYXlvdXRJdGVtLm1pbkggIT09IHVuZGVmaW5lZCkgeyBjbG9uZWRMYXlvdXRJdGVtLm1pbkggPSBsYXlvdXRJdGVtLm1pbkg7fVxuICAgIGlmIChsYXlvdXRJdGVtLm1heEggIT09IHVuZGVmaW5lZCkgeyBjbG9uZWRMYXlvdXRJdGVtLm1heEggPSBsYXlvdXRJdGVtLm1heEg7fVxuICAgIC8vIFRoZXNlIGNhbiBiZSBudWxsXG4gICAgaWYgKGxheW91dEl0ZW0uaXNEcmFnZ2FibGUgIT09IHVuZGVmaW5lZCkgeyBjbG9uZWRMYXlvdXRJdGVtLmlzRHJhZ2dhYmxlID0gbGF5b3V0SXRlbS5pc0RyYWdnYWJsZTt9XG4gICAgaWYgKGxheW91dEl0ZW0uaXNSZXNpemFibGUgIT09IHVuZGVmaW5lZCkgeyBjbG9uZWRMYXlvdXRJdGVtLmlzUmVzaXphYmxlID0gbGF5b3V0SXRlbS5pc1Jlc2l6YWJsZTt9XG5cbiAgICByZXR1cm4gY2xvbmVkTGF5b3V0SXRlbTtcbn1cblxuLyoqXG4gKiBHaXZlbiB0d28gbGF5b3V0aXRlbXMsIGNoZWNrIGlmIHRoZXkgY29sbGlkZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbGxpZGVzKGwxOiBMYXlvdXRJdGVtLCBsMjogTGF5b3V0SXRlbSk6IGJvb2xlYW4ge1xuICAgIGlmIChsMS5pZCA9PT0gbDIuaWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gLy8gc2FtZSBlbGVtZW50XG4gICAgaWYgKGwxLnggKyBsMS53IDw9IGwyLngpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gLy8gbDEgaXMgbGVmdCBvZiBsMlxuICAgIGlmIChsMS54ID49IGwyLnggKyBsMi53KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IC8vIGwxIGlzIHJpZ2h0IG9mIGwyXG4gICAgaWYgKGwxLnkgKyBsMS5oIDw9IGwyLnkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gLy8gbDEgaXMgYWJvdmUgbDJcbiAgICBpZiAobDEueSA+PSBsMi55ICsgbDIuaCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSAvLyBsMSBpcyBiZWxvdyBsMlxuICAgIHJldHVybiB0cnVlOyAvLyBib3hlcyBvdmVybGFwXG59XG5cbi8qKlxuICogR2l2ZW4gYSBsYXlvdXQsIGNvbXBhY3QgaXQuIFRoaXMgaW52b2x2ZXMgZ29pbmcgZG93biBlYWNoIHkgY29vcmRpbmF0ZSBhbmQgcmVtb3ZpbmcgZ2Fwc1xuICogYmV0d2VlbiBpdGVtcy5cbiAqXG4gKiBAcGFyYW0gIHtBcnJheX0gbGF5b3V0IExheW91dC5cbiAqIEBwYXJhbSAge0Jvb2xlYW59IHZlcnRpY2FsQ29tcGFjdCBXaGV0aGVyIG9yIG5vdCB0byBjb21wYWN0IHRoZSBsYXlvdXRcbiAqICAgdmVydGljYWxseS5cbiAqIEByZXR1cm4ge0FycmF5fSAgICAgICBDb21wYWN0ZWQgTGF5b3V0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcGFjdChcbiAgICBsYXlvdXQ6IExheW91dCxcbiAgICBjb21wYWN0VHlwZTogQ29tcGFjdFR5cGUsXG4gICAgY29sczogbnVtYmVyLFxuKTogTGF5b3V0IHtcbiAgICAvLyBTdGF0aWNzIGdvIGluIHRoZSBjb21wYXJlV2l0aCBhcnJheSByaWdodCBhd2F5IHNvIGl0ZW1zIGZsb3cgYXJvdW5kIHRoZW0uXG4gICAgY29uc3QgY29tcGFyZVdpdGggPSBnZXRTdGF0aWNzKGxheW91dCk7XG4gICAgLy8gV2UgZ28gdGhyb3VnaCB0aGUgaXRlbXMgYnkgcm93IGFuZCBjb2x1bW4uXG4gICAgY29uc3Qgc29ydGVkID0gc29ydExheW91dEl0ZW1zKGxheW91dCwgY29tcGFjdFR5cGUpO1xuICAgIC8vIEhvbGRpbmcgZm9yIG5ldyBpdGVtcy5cbiAgICBjb25zdCBvdXQgPSBBcnJheShsYXlvdXQubGVuZ3RoKTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBzb3J0ZWQubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbGV0IGwgPSBjbG9uZUxheW91dEl0ZW0oc29ydGVkW2ldKTtcblxuICAgICAgICAvLyBEb24ndCBtb3ZlIHN0YXRpYyBlbGVtZW50c1xuICAgICAgICBpZiAoIWwuc3RhdGljKSB7XG4gICAgICAgICAgICBsID0gY29tcGFjdEl0ZW0oY29tcGFyZVdpdGgsIGwsIGNvbXBhY3RUeXBlLCBjb2xzLCBzb3J0ZWQpO1xuXG4gICAgICAgICAgICAvLyBBZGQgdG8gY29tcGFyaXNvbiBhcnJheS4gV2Ugb25seSBjb2xsaWRlIHdpdGggaXRlbXMgYmVmb3JlIHRoaXMgb25lLlxuICAgICAgICAgICAgLy8gU3RhdGljcyBhcmUgYWxyZWFkeSBpbiB0aGlzIGFycmF5LlxuICAgICAgICAgICAgY29tcGFyZVdpdGgucHVzaChsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCB0byBvdXRwdXQgYXJyYXkgdG8gbWFrZSBzdXJlIHRoZXkgc3RpbGwgY29tZSBvdXQgaW4gdGhlIHJpZ2h0IG9yZGVyLlxuICAgICAgICBvdXRbbGF5b3V0LmluZGV4T2Yoc29ydGVkW2ldKV0gPSBsO1xuXG4gICAgICAgIC8vIENsZWFyIG1vdmVkIGZsYWcsIGlmIGl0IGV4aXN0cy5cbiAgICAgICAgbC5tb3ZlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG59XG5cbmNvbnN0IGhlaWdodFdpZHRoID0ge3g6ICd3JywgeTogJ2gnfTtcblxuLyoqXG4gKiBCZWZvcmUgbW92aW5nIGl0ZW0gZG93biwgaXQgd2lsbCBjaGVjayBpZiB0aGUgbW92ZW1lbnQgd2lsbCBjYXVzZSBjb2xsaXNpb25zIGFuZCBtb3ZlIHRob3NlIGl0ZW1zIGRvd24gYmVmb3JlLlxuICovXG5mdW5jdGlvbiByZXNvbHZlQ29tcGFjdGlvbkNvbGxpc2lvbihcbiAgICBsYXlvdXQ6IExheW91dCxcbiAgICBpdGVtOiBMYXlvdXRJdGVtLFxuICAgIG1vdmVUb0Nvb3JkOiBudW1iZXIsXG4gICAgYXhpczogJ3gnIHwgJ3knLFxuKSB7XG4gICAgY29uc3Qgc2l6ZVByb3AgPSBoZWlnaHRXaWR0aFtheGlzXTtcbiAgICBpdGVtW2F4aXNdICs9IDE7XG4gICAgY29uc3QgaXRlbUluZGV4ID0gbGF5b3V0XG4gICAgICAgIC5tYXAobGF5b3V0SXRlbSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbGF5b3V0SXRlbS5pZDtcbiAgICAgICAgfSlcbiAgICAgICAgLmluZGV4T2YoaXRlbS5pZCk7XG5cbiAgICAvLyBHbyB0aHJvdWdoIGVhY2ggaXRlbSB3ZSBjb2xsaWRlIHdpdGguXG4gICAgZm9yIChsZXQgaSA9IGl0ZW1JbmRleCArIDE7IGkgPCBsYXlvdXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qgb3RoZXJJdGVtID0gbGF5b3V0W2ldO1xuICAgICAgICAvLyBJZ25vcmUgc3RhdGljIGl0ZW1zXG4gICAgICAgIGlmIChvdGhlckl0ZW0uc3RhdGljKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE9wdGltaXphdGlvbjogd2UgY2FuIGJyZWFrIGVhcmx5IGlmIHdlIGtub3cgd2UncmUgcGFzdCB0aGlzIGVsXG4gICAgICAgIC8vIFdlIGNhbiBkbyB0aGlzIGIvYyBpdCdzIGEgc29ydGVkIGxheW91dFxuICAgICAgICBpZiAob3RoZXJJdGVtLnkgPiBpdGVtLnkgKyBpdGVtLmgpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbGxpZGVzKGl0ZW0sIG90aGVySXRlbSkpIHtcbiAgICAgICAgICAgIHJlc29sdmVDb21wYWN0aW9uQ29sbGlzaW9uKFxuICAgICAgICAgICAgICAgIGxheW91dCxcbiAgICAgICAgICAgICAgICBvdGhlckl0ZW0sXG4gICAgICAgICAgICAgICAgbW92ZVRvQ29vcmQgKyBpdGVtW3NpemVQcm9wXSxcbiAgICAgICAgICAgICAgICBheGlzLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGl0ZW1bYXhpc10gPSBtb3ZlVG9Db29yZDtcbn1cblxuLyoqXG4gKiBDb21wYWN0IGFuIGl0ZW0gaW4gdGhlIGxheW91dC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBhY3RJdGVtKFxuICAgIGNvbXBhcmVXaXRoOiBMYXlvdXQsXG4gICAgbDogTGF5b3V0SXRlbSxcbiAgICBjb21wYWN0VHlwZTogQ29tcGFjdFR5cGUsXG4gICAgY29sczogbnVtYmVyLFxuICAgIGZ1bGxMYXlvdXQ6IExheW91dCxcbik6IExheW91dEl0ZW0ge1xuICAgIGNvbnN0IGNvbXBhY3RWID0gY29tcGFjdFR5cGUgPT09ICd2ZXJ0aWNhbCc7XG4gICAgY29uc3QgY29tcGFjdEggPSBjb21wYWN0VHlwZSA9PT0gJ2hvcml6b250YWwnO1xuICAgIGlmIChjb21wYWN0Vikge1xuICAgICAgICAvLyBCb3R0b20gJ3knIHBvc3NpYmxlIGlzIHRoZSBib3R0b20gb2YgdGhlIGxheW91dC5cbiAgICAgICAgLy8gVGhpcyBhbGxvd3MgeW91IHRvIGRvIG5pY2Ugc3R1ZmYgbGlrZSBzcGVjaWZ5IHt5OiBJbmZpbml0eX1cbiAgICAgICAgLy8gVGhpcyBpcyBoZXJlIGJlY2F1c2UgdGhlIGxheW91dCBtdXN0IGJlIHNvcnRlZCBpbiBvcmRlciB0byBnZXQgdGhlIGNvcnJlY3QgYm90dG9tIGB5YC5cbiAgICAgICAgbC55ID0gTWF0aC5taW4oYm90dG9tKGNvbXBhcmVXaXRoKSwgbC55KTtcbiAgICAgICAgLy8gTW92ZSB0aGUgZWxlbWVudCB1cCBhcyBmYXIgYXMgaXQgY2FuIGdvIHdpdGhvdXQgY29sbGlkaW5nLlxuICAgICAgICB3aGlsZSAobC55ID4gMCAmJiAhZ2V0Rmlyc3RDb2xsaXNpb24oY29tcGFyZVdpdGgsIGwpKSB7XG4gICAgICAgICAgICBsLnktLTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY29tcGFjdEgpIHtcbiAgICAgICAgbC55ID0gTWF0aC5taW4oYm90dG9tKGNvbXBhcmVXaXRoKSwgbC55KTtcbiAgICAgICAgLy8gTW92ZSB0aGUgZWxlbWVudCBsZWZ0IGFzIGZhciBhcyBpdCBjYW4gZ28gd2l0aG91dCBjb2xsaWRpbmcuXG4gICAgICAgIHdoaWxlIChsLnggPiAwICYmICFnZXRGaXJzdENvbGxpc2lvbihjb21wYXJlV2l0aCwgbCkpIHtcbiAgICAgICAgICAgIGwueC0tO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTW92ZSBpdCBkb3duLCBhbmQga2VlcCBtb3ZpbmcgaXQgZG93biBpZiBpdCdzIGNvbGxpZGluZy5cbiAgICBsZXQgY29sbGlkZXM7XG4gICAgd2hpbGUgKChjb2xsaWRlcyA9IGdldEZpcnN0Q29sbGlzaW9uKGNvbXBhcmVXaXRoLCBsKSkpIHtcbiAgICAgICAgaWYgKGNvbXBhY3RIKSB7XG4gICAgICAgICAgICByZXNvbHZlQ29tcGFjdGlvbkNvbGxpc2lvbihcbiAgICAgICAgICAgICAgICBmdWxsTGF5b3V0LFxuICAgICAgICAgICAgICAgIGwsXG4gICAgICAgICAgICAgICAgY29sbGlkZXMueCArIGNvbGxpZGVzLncsXG4gICAgICAgICAgICAgICAgJ3gnLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc29sdmVDb21wYWN0aW9uQ29sbGlzaW9uKFxuICAgICAgICAgICAgICAgIGZ1bGxMYXlvdXQsXG4gICAgICAgICAgICAgICAgbCxcbiAgICAgICAgICAgICAgICBjb2xsaWRlcy55ICsgY29sbGlkZXMuaCxcbiAgICAgICAgICAgICAgICAneScsXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNpbmNlIHdlIGNhbid0IGdyb3cgd2l0aG91dCBib3VuZHMgaG9yaXpvbnRhbGx5LCBpZiB3ZSd2ZSBvdmVyZmxvd24sIGxldCdzIG1vdmUgaXQgZG93biBhbmQgdHJ5IGFnYWluLlxuICAgICAgICBpZiAoY29tcGFjdEggJiYgbC54ICsgbC53ID4gY29scykge1xuICAgICAgICAgICAgbC54ID0gY29scyAtIGwudztcbiAgICAgICAgICAgIGwueSsrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBsO1xufVxuXG4vKipcbiAqIEdpdmVuIGEgbGF5b3V0LCBtYWtlIHN1cmUgYWxsIGVsZW1lbnRzIGZpdCB3aXRoaW4gaXRzIGJvdW5kcy5cbiAqXG4gKiBAcGFyYW0gIHtBcnJheX0gbGF5b3V0IExheW91dCBhcnJheS5cbiAqIEBwYXJhbSAge051bWJlcn0gYm91bmRzIE51bWJlciBvZiBjb2x1bW5zLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29ycmVjdEJvdW5kcyhsYXlvdXQ6IExheW91dCwgYm91bmRzOiB7IGNvbHM6IG51bWJlciB9KTogTGF5b3V0IHtcbiAgICBjb25zdCBjb2xsaWRlc1dpdGggPSBnZXRTdGF0aWNzKGxheW91dCk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGxheW91dC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBjb25zdCBsID0gbGF5b3V0W2ldO1xuICAgICAgICAvLyBPdmVyZmxvd3MgcmlnaHRcbiAgICAgICAgaWYgKGwueCArIGwudyA+IGJvdW5kcy5jb2xzKSB7XG4gICAgICAgICAgICBsLnggPSBib3VuZHMuY29scyAtIGwudztcbiAgICAgICAgfVxuICAgICAgICAvLyBPdmVyZmxvd3MgbGVmdFxuICAgICAgICBpZiAobC54IDwgMCkge1xuICAgICAgICAgICAgbC54ID0gMDtcbiAgICAgICAgICAgIGwudyA9IGJvdW5kcy5jb2xzO1xuICAgICAgICB9XG4gICAgICAgIGlmICghbC5zdGF0aWMpIHtcbiAgICAgICAgICAgIGNvbGxpZGVzV2l0aC5wdXNoKGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBzdGF0aWMgYW5kIGNvbGxpZGVzIHdpdGggb3RoZXIgc3RhdGljcywgd2UgbXVzdCBtb3ZlIGl0IGRvd24uXG4gICAgICAgICAgICAvLyBXZSBoYXZlIHRvIGRvIHNvbWV0aGluZyBuaWNlciB0aGFuIGp1c3QgbGV0dGluZyB0aGVtIG92ZXJsYXAuXG4gICAgICAgICAgICB3aGlsZSAoZ2V0Rmlyc3RDb2xsaXNpb24oY29sbGlkZXNXaXRoLCBsKSkge1xuICAgICAgICAgICAgICAgIGwueSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBsYXlvdXQ7XG59XG5cbi8qKlxuICogR2V0IGEgbGF5b3V0IGl0ZW0gYnkgSUQuIFVzZWQgc28gd2UgY2FuIG92ZXJyaWRlIGxhdGVyIG9uIGlmIG5lY2Vzc2FyeS5cbiAqXG4gKiBAcGFyYW0gIHtBcnJheX0gIGxheW91dCBMYXlvdXQgYXJyYXkuXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGlkICAgICBJRFxuICogQHJldHVybiB7TGF5b3V0SXRlbX0gICAgSXRlbSBhdCBJRC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldExheW91dEl0ZW0oXG4gICAgbGF5b3V0OiBMYXlvdXQsXG4gICAgaWQ6IHN0cmluZyxcbik6IExheW91dEl0ZW0gfCBudWxsIHwgdW5kZWZpbmVkIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbGF5b3V0Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChsYXlvdXRbaV0uaWQgPT09IGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gbGF5b3V0W2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGZpcnN0IGl0ZW0gdGhpcyBsYXlvdXQgY29sbGlkZXMgd2l0aC5cbiAqIEl0IGRvZXNuJ3QgYXBwZWFyIHRvIG1hdHRlciB3aGljaCBvcmRlciB3ZSBhcHByb2FjaCB0aGlzIGZyb20sIGFsdGhvdWdoXG4gKiBwZXJoYXBzIHRoYXQgaXMgdGhlIHdyb25nIHRoaW5nIHRvIGRvLlxuICpcbiAqIEBwYXJhbSAge09iamVjdH0gbGF5b3V0SXRlbSBMYXlvdXQgaXRlbS5cbiAqIEByZXR1cm4ge09iamVjdHx1bmRlZmluZWR9ICBBIGNvbGxpZGluZyBsYXlvdXQgaXRlbSwgb3IgdW5kZWZpbmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Rmlyc3RDb2xsaXNpb24oXG4gICAgbGF5b3V0OiBMYXlvdXQsXG4gICAgbGF5b3V0SXRlbTogTGF5b3V0SXRlbSxcbik6IExheW91dEl0ZW0gfCBudWxsIHwgdW5kZWZpbmVkIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbGF5b3V0Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChjb2xsaWRlcyhsYXlvdXRbaV0sIGxheW91dEl0ZW0pKSB7XG4gICAgICAgICAgICByZXR1cm4gbGF5b3V0W2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWxsQ29sbGlzaW9ucyhcbiAgICBsYXlvdXQ6IExheW91dCxcbiAgICBsYXlvdXRJdGVtOiBMYXlvdXRJdGVtLFxuKTogQXJyYXk8TGF5b3V0SXRlbT4ge1xuICAgIHJldHVybiBsYXlvdXQuZmlsdGVyKGwgPT4gY29sbGlkZXMobCwgbGF5b3V0SXRlbSkpO1xufVxuXG4vKipcbiAqIEdldCBhbGwgc3RhdGljIGVsZW1lbnRzLlxuICogQHBhcmFtICB7QXJyYXl9IGxheW91dCBBcnJheSBvZiBsYXlvdXQgb2JqZWN0cy5cbiAqIEByZXR1cm4ge0FycmF5fSAgICAgICAgQXJyYXkgb2Ygc3RhdGljIGxheW91dCBpdGVtcy4uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdGF0aWNzKGxheW91dDogTGF5b3V0KTogQXJyYXk8TGF5b3V0SXRlbT4ge1xuICAgIHJldHVybiBsYXlvdXQuZmlsdGVyKGwgPT4gbC5zdGF0aWMpO1xufVxuXG4vKipcbiAqIE1vdmUgYW4gZWxlbWVudC4gUmVzcG9uc2libGUgZm9yIGRvaW5nIGNhc2NhZGluZyBtb3ZlbWVudHMgb2Ygb3RoZXIgZWxlbWVudHMuXG4gKlxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgbGF5b3V0ICAgICAgICAgICAgRnVsbCBsYXlvdXQgdG8gbW9kaWZ5LlxuICogQHBhcmFtICB7TGF5b3V0SXRlbX0gbCAgICAgICAgICAgICAgICAgZWxlbWVudCB0byBtb3ZlLlxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgW3hdICAgICAgICAgICAgICAgWCBwb3NpdGlvbiBpbiBncmlkIHVuaXRzLlxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgW3ldICAgICAgICAgICAgICAgWSBwb3NpdGlvbiBpbiBncmlkIHVuaXRzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbW92ZUVsZW1lbnQoXG4gICAgbGF5b3V0OiBMYXlvdXQsXG4gICAgbDogTGF5b3V0SXRlbSxcbiAgICB4OiBudW1iZXIgfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgIHk6IG51bWJlciB8IG51bGwgfCB1bmRlZmluZWQsXG4gICAgaXNVc2VyQWN0aW9uOiBib29sZWFuIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICBwcmV2ZW50Q29sbGlzaW9uOiBib29sZWFuIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICBjb21wYWN0VHlwZTogQ29tcGFjdFR5cGUsXG4gICAgY29sczogbnVtYmVyLFxuKTogTGF5b3V0IHtcbiAgICAvLyBJZiB0aGlzIGlzIHN0YXRpYyBhbmQgbm90IGV4cGxpY2l0bHkgZW5hYmxlZCBhcyBkcmFnZ2FibGUsXG4gICAgLy8gbm8gbW92ZSBpcyBwb3NzaWJsZSwgc28gd2UgY2FuIHNob3J0LWNpcmN1aXQgdGhpcyBpbW1lZGlhdGVseS5cbiAgICBpZiAobC5zdGF0aWMgJiYgbC5pc0RyYWdnYWJsZSAhPT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gbGF5b3V0O1xuICAgIH1cblxuICAgIC8vIFNob3J0LWNpcmN1aXQgaWYgbm90aGluZyB0byBkby5cbiAgICBpZiAobC55ID09PSB5ICYmIGwueCA9PT0geCkge1xuICAgICAgICByZXR1cm4gbGF5b3V0O1xuICAgIH1cblxuICAgIGxvZyhcbiAgICAgICAgYE1vdmluZyBlbGVtZW50ICR7bC5pZH0gdG8gWyR7U3RyaW5nKHgpfSwke1N0cmluZyh5KX1dIGZyb20gWyR7bC54fSwke1xuICAgICAgICAgICAgbC55XG4gICAgICAgIH1dYCxcbiAgICApO1xuICAgIGNvbnN0IG9sZFggPSBsLng7XG4gICAgY29uc3Qgb2xkWSA9IGwueTtcblxuICAgIC8vIFRoaXMgaXMgcXVpdGUgYSBiaXQgZmFzdGVyIHRoYW4gZXh0ZW5kaW5nIHRoZSBvYmplY3RcbiAgICBpZiAodHlwZW9mIHggPT09ICdudW1iZXInKSB7XG4gICAgICAgIGwueCA9IHg7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgeSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgbC55ID0geTtcbiAgICB9XG4gICAgbC5tb3ZlZCA9IHRydWU7XG5cbiAgICAvLyBJZiB0aGlzIGNvbGxpZGVzIHdpdGggYW55dGhpbmcsIG1vdmUgaXQuXG4gICAgLy8gV2hlbiBkb2luZyB0aGlzIGNvbXBhcmlzb24sIHdlIGhhdmUgdG8gc29ydCB0aGUgaXRlbXMgd2UgY29tcGFyZSB3aXRoXG4gICAgLy8gdG8gZW5zdXJlLCBpbiB0aGUgY2FzZSBvZiBtdWx0aXBsZSBjb2xsaXNpb25zLCB0aGF0IHdlJ3JlIGdldHRpbmcgdGhlXG4gICAgLy8gbmVhcmVzdCBjb2xsaXNpb24uXG4gICAgbGV0IHNvcnRlZCA9IHNvcnRMYXlvdXRJdGVtcyhsYXlvdXQsIGNvbXBhY3RUeXBlKTtcbiAgICBjb25zdCBtb3ZpbmdVcCA9XG4gICAgICAgIGNvbXBhY3RUeXBlID09PSAndmVydGljYWwnICYmIHR5cGVvZiB5ID09PSAnbnVtYmVyJ1xuICAgICAgICAgICAgPyBvbGRZID49IHlcbiAgICAgICAgICAgIDogY29tcGFjdFR5cGUgPT09ICdob3Jpem9udGFsJyAmJiB0eXBlb2YgeCA9PT0gJ251bWJlcidcbiAgICAgICAgICAgID8gb2xkWCA+PSB4XG4gICAgICAgICAgICA6IGZhbHNlO1xuICAgIGlmIChtb3ZpbmdVcCkge1xuICAgICAgICBzb3J0ZWQgPSBzb3J0ZWQucmV2ZXJzZSgpO1xuICAgIH1cbiAgICBjb25zdCBjb2xsaXNpb25zID0gZ2V0QWxsQ29sbGlzaW9ucyhzb3J0ZWQsIGwpO1xuXG4gICAgLy8gVGhlcmUgd2FzIGEgY29sbGlzaW9uOyBhYm9ydFxuICAgIGlmIChwcmV2ZW50Q29sbGlzaW9uICYmIGNvbGxpc2lvbnMubGVuZ3RoKSB7XG4gICAgICAgIGxvZyhgQ29sbGlzaW9uIHByZXZlbnRlZCBvbiAke2wuaWR9LCByZXZlcnRpbmcuYCk7XG4gICAgICAgIGwueCA9IG9sZFg7XG4gICAgICAgIGwueSA9IG9sZFk7XG4gICAgICAgIGwubW92ZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGxheW91dDtcbiAgICB9XG5cbiAgICAvLyBNb3ZlIGVhY2ggaXRlbSB0aGF0IGNvbGxpZGVzIGF3YXkgZnJvbSB0aGlzIGVsZW1lbnQuXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGNvbGxpc2lvbnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY29uc3QgY29sbGlzaW9uID0gY29sbGlzaW9uc1tpXTtcbiAgICAgICAgbG9nKFxuICAgICAgICAgICAgYFJlc29sdmluZyBjb2xsaXNpb24gYmV0d2VlbiAke2wuaWR9IGF0IFske2wueH0sJHtsLnl9XSBhbmQgJHtcbiAgICAgICAgICAgICAgICBjb2xsaXNpb24uaWRcbiAgICAgICAgICAgIH0gYXQgWyR7Y29sbGlzaW9uLnh9LCR7Y29sbGlzaW9uLnl9XWAsXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gU2hvcnQgY2lyY3VpdCBzbyB3ZSBjYW4ndCBpbmZpbml0ZSBsb29wXG4gICAgICAgIGlmIChjb2xsaXNpb24ubW92ZWQpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRG9uJ3QgbW92ZSBzdGF0aWMgaXRlbXMgLSB3ZSBoYXZlIHRvIG1vdmUgKnRoaXMqIGVsZW1lbnQgYXdheVxuICAgICAgICBpZiAoY29sbGlzaW9uLnN0YXRpYykge1xuICAgICAgICAgICAgbGF5b3V0ID0gbW92ZUVsZW1lbnRBd2F5RnJvbUNvbGxpc2lvbihcbiAgICAgICAgICAgICAgICBsYXlvdXQsXG4gICAgICAgICAgICAgICAgY29sbGlzaW9uLFxuICAgICAgICAgICAgICAgIGwsXG4gICAgICAgICAgICAgICAgaXNVc2VyQWN0aW9uLFxuICAgICAgICAgICAgICAgIGNvbXBhY3RUeXBlLFxuICAgICAgICAgICAgICAgIGNvbHMsXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGF5b3V0ID0gbW92ZUVsZW1lbnRBd2F5RnJvbUNvbGxpc2lvbihcbiAgICAgICAgICAgICAgICBsYXlvdXQsXG4gICAgICAgICAgICAgICAgbCxcbiAgICAgICAgICAgICAgICBjb2xsaXNpb24sXG4gICAgICAgICAgICAgICAgaXNVc2VyQWN0aW9uLFxuICAgICAgICAgICAgICAgIGNvbXBhY3RUeXBlLFxuICAgICAgICAgICAgICAgIGNvbHMsXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGxheW91dDtcbn1cblxuLyoqXG4gKiBUaGlzIGlzIHdoZXJlIHRoZSBtYWdpYyBuZWVkcyB0byBoYXBwZW4gLSBnaXZlbiBhIGNvbGxpc2lvbiwgbW92ZSBhbiBlbGVtZW50IGF3YXkgZnJvbSB0aGUgY29sbGlzaW9uLlxuICogV2UgYXR0ZW1wdCB0byBtb3ZlIGl0IHVwIGlmIHRoZXJlJ3Mgcm9vbSwgb3RoZXJ3aXNlIGl0IGdvZXMgYmVsb3cuXG4gKlxuICogQHBhcmFtICB7QXJyYXl9IGxheW91dCAgICAgICAgICAgIEZ1bGwgbGF5b3V0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSAge0xheW91dEl0ZW19IGNvbGxpZGVzV2l0aCBMYXlvdXQgaXRlbSB3ZSdyZSBjb2xsaWRpbmcgd2l0aC5cbiAqIEBwYXJhbSAge0xheW91dEl0ZW19IGl0ZW1Ub01vdmUgICBMYXlvdXQgaXRlbSB3ZSdyZSBtb3ZpbmcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtb3ZlRWxlbWVudEF3YXlGcm9tQ29sbGlzaW9uKFxuICAgIGxheW91dDogTGF5b3V0LFxuICAgIGNvbGxpZGVzV2l0aDogTGF5b3V0SXRlbSxcbiAgICBpdGVtVG9Nb3ZlOiBMYXlvdXRJdGVtLFxuICAgIGlzVXNlckFjdGlvbjogYm9vbGVhbiB8IG51bGwgfCB1bmRlZmluZWQsXG4gICAgY29tcGFjdFR5cGU6IENvbXBhY3RUeXBlLFxuICAgIGNvbHM6IG51bWJlcixcbik6IExheW91dCB7XG4gICAgY29uc3QgY29tcGFjdEggPSBjb21wYWN0VHlwZSA9PT0gJ2hvcml6b250YWwnO1xuICAgIC8vIENvbXBhY3QgdmVydGljYWxseSBpZiBub3Qgc2V0IHRvIGhvcml6b250YWxcbiAgICBjb25zdCBjb21wYWN0ViA9IGNvbXBhY3RUeXBlICE9PSAnaG9yaXpvbnRhbCc7XG4gICAgY29uc3QgcHJldmVudENvbGxpc2lvbiA9IGNvbGxpZGVzV2l0aC5zdGF0aWM7IC8vIHdlJ3JlIGFscmVhZHkgY29sbGlkaW5nIChub3QgZm9yIHN0YXRpYyBpdGVtcylcblxuICAgIC8vIElmIHRoZXJlIGlzIGVub3VnaCBzcGFjZSBhYm92ZSB0aGUgY29sbGlzaW9uIHRvIHB1dCB0aGlzIGVsZW1lbnQsIG1vdmUgaXQgdGhlcmUuXG4gICAgLy8gV2Ugb25seSBkbyB0aGlzIG9uIHRoZSBtYWluIGNvbGxpc2lvbiBhcyB0aGlzIGNhbiBnZXQgZnVua3kgaW4gY2FzY2FkZXMgYW5kIGNhdXNlXG4gICAgLy8gdW53YW50ZWQgc3dhcHBpbmcgYmVoYXZpb3IuXG4gICAgaWYgKGlzVXNlckFjdGlvbikge1xuICAgICAgICAvLyBSZXNldCBpc1VzZXJBY3Rpb24gZmxhZyBiZWNhdXNlIHdlJ3JlIG5vdCBpbiB0aGUgbWFpbiBjb2xsaXNpb24gYW55bW9yZS5cbiAgICAgICAgaXNVc2VyQWN0aW9uID0gZmFsc2U7XG5cbiAgICAgICAgLy8gTWFrZSBhIG1vY2sgaXRlbSBzbyB3ZSBkb24ndCBtb2RpZnkgdGhlIGl0ZW0gaGVyZSwgb25seSBtb2RpZnkgaW4gbW92ZUVsZW1lbnQuXG4gICAgICAgIGNvbnN0IGZha2VJdGVtOiBMYXlvdXRJdGVtID0ge1xuICAgICAgICAgICAgeDogY29tcGFjdEhcbiAgICAgICAgICAgICAgICA/IE1hdGgubWF4KGNvbGxpZGVzV2l0aC54IC0gaXRlbVRvTW92ZS53LCAwKVxuICAgICAgICAgICAgICAgIDogaXRlbVRvTW92ZS54LFxuICAgICAgICAgICAgeTogY29tcGFjdFZcbiAgICAgICAgICAgICAgICA/IE1hdGgubWF4KGNvbGxpZGVzV2l0aC55IC0gaXRlbVRvTW92ZS5oLCAwKVxuICAgICAgICAgICAgICAgIDogaXRlbVRvTW92ZS55LFxuICAgICAgICAgICAgdzogaXRlbVRvTW92ZS53LFxuICAgICAgICAgICAgaDogaXRlbVRvTW92ZS5oLFxuICAgICAgICAgICAgaWQ6ICctMScsXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gTm8gY29sbGlzaW9uPyBJZiBzbywgd2UgY2FuIGdvIHVwIHRoZXJlOyBvdGhlcndpc2UsIHdlJ2xsIGVuZCB1cCBtb3ZpbmcgZG93biBhcyBub3JtYWxcbiAgICAgICAgaWYgKCFnZXRGaXJzdENvbGxpc2lvbihsYXlvdXQsIGZha2VJdGVtKSkge1xuICAgICAgICAgICAgbG9nKFxuICAgICAgICAgICAgICAgIGBEb2luZyByZXZlcnNlIGNvbGxpc2lvbiBvbiAke2l0ZW1Ub01vdmUuaWR9IHVwIHRvIFske1xuICAgICAgICAgICAgICAgICAgICBmYWtlSXRlbS54XG4gICAgICAgICAgICAgICAgfSwke2Zha2VJdGVtLnl9XS5gLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBtb3ZlRWxlbWVudChcbiAgICAgICAgICAgICAgICBsYXlvdXQsXG4gICAgICAgICAgICAgICAgaXRlbVRvTW92ZSxcbiAgICAgICAgICAgICAgICBjb21wYWN0SCA/IGZha2VJdGVtLnggOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgY29tcGFjdFYgPyBmYWtlSXRlbS55IDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGlzVXNlckFjdGlvbixcbiAgICAgICAgICAgICAgICBwcmV2ZW50Q29sbGlzaW9uLFxuICAgICAgICAgICAgICAgIGNvbXBhY3RUeXBlLFxuICAgICAgICAgICAgICAgIGNvbHMsXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vdmVFbGVtZW50KFxuICAgICAgICBsYXlvdXQsXG4gICAgICAgIGl0ZW1Ub01vdmUsXG4gICAgICAgIGNvbXBhY3RIID8gaXRlbVRvTW92ZS54ICsgMSA6IHVuZGVmaW5lZCxcbiAgICAgICAgY29tcGFjdFYgPyBpdGVtVG9Nb3ZlLnkgKyAxIDogdW5kZWZpbmVkLFxuICAgICAgICBpc1VzZXJBY3Rpb24sXG4gICAgICAgIHByZXZlbnRDb2xsaXNpb24sXG4gICAgICAgIGNvbXBhY3RUeXBlLFxuICAgICAgICBjb2xzLFxuICAgICk7XG59XG5cbi8qKlxuICogSGVscGVyIHRvIGNvbnZlcnQgYSBudW1iZXIgdG8gYSBwZXJjZW50YWdlIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IG51bSBBbnkgbnVtYmVyXG4gKiBAcmV0dXJuIHtTdHJpbmd9ICAgICBUaGF0IG51bWJlciBhcyBhIHBlcmNlbnRhZ2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwZXJjKG51bTogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbnVtICogMTAwICsgJyUnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0VHJhbnNmb3JtKHt0b3AsIGxlZnQsIHdpZHRoLCBoZWlnaHR9OiBQb3NpdGlvbik6IE9iamVjdCB7XG4gICAgLy8gUmVwbGFjZSB1bml0bGVzcyBpdGVtcyB3aXRoIHB4XG4gICAgY29uc3QgdHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgke2xlZnR9cHgsJHt0b3B9cHgpYDtcbiAgICByZXR1cm4ge1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSxcbiAgICAgICAgV2Via2l0VHJhbnNmb3JtOiB0cmFuc2xhdGUsXG4gICAgICAgIE1velRyYW5zZm9ybTogdHJhbnNsYXRlLFxuICAgICAgICBtc1RyYW5zZm9ybTogdHJhbnNsYXRlLFxuICAgICAgICBPVHJhbnNmb3JtOiB0cmFuc2xhdGUsXG4gICAgICAgIHdpZHRoOiBgJHt3aWR0aH1weGAsXG4gICAgICAgIGhlaWdodDogYCR7aGVpZ2h0fXB4YCxcbiAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFRvcExlZnQoe3RvcCwgbGVmdCwgd2lkdGgsIGhlaWdodH06IFBvc2l0aW9uKTogT2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0b3A6IGAke3RvcH1weGAsXG4gICAgICAgIGxlZnQ6IGAke2xlZnR9cHhgLFxuICAgICAgICB3aWR0aDogYCR7d2lkdGh9cHhgLFxuICAgICAgICBoZWlnaHQ6IGAke2hlaWdodH1weGAsXG4gICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIH07XG59XG5cbi8qKlxuICogR2V0IGxheW91dCBpdGVtcyBzb3J0ZWQgZnJvbSB0b3AgbGVmdCB0byByaWdodCBhbmQgZG93bi5cbiAqXG4gKiBAcmV0dXJuIHtBcnJheX0gQXJyYXkgb2YgbGF5b3V0IG9iamVjdHMuXG4gKiBAcmV0dXJuIHtBcnJheX0gICAgICAgIExheW91dCwgc29ydGVkIHN0YXRpYyBpdGVtcyBmaXJzdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNvcnRMYXlvdXRJdGVtcyhcbiAgICBsYXlvdXQ6IExheW91dCxcbiAgICBjb21wYWN0VHlwZTogQ29tcGFjdFR5cGUsXG4pOiBMYXlvdXQge1xuICAgIGlmIChjb21wYWN0VHlwZSA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgIHJldHVybiBzb3J0TGF5b3V0SXRlbXNCeUNvbFJvdyhsYXlvdXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzb3J0TGF5b3V0SXRlbXNCeVJvd0NvbChsYXlvdXQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNvcnRMYXlvdXRJdGVtc0J5Um93Q29sKGxheW91dDogTGF5b3V0KTogTGF5b3V0IHtcbiAgICByZXR1cm4gKFtdIGFzIGFueVtdKS5jb25jYXQobGF5b3V0KS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIGlmIChhLnkgPiBiLnkgfHwgKGEueSA9PT0gYi55ICYmIGEueCA+IGIueCkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IGVsc2UgaWYgKGEueSA9PT0gYi55ICYmIGEueCA9PT0gYi54KSB7XG4gICAgICAgICAgICAvLyBXaXRob3V0IHRoaXMsIHdlIGNhbiBnZXQgZGlmZmVyZW50IHNvcnQgcmVzdWx0cyBpbiBJRSB2cy4gQ2hyb21lL0ZGXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzb3J0TGF5b3V0SXRlbXNCeUNvbFJvdyhsYXlvdXQ6IExheW91dCk6IExheW91dCB7XG4gICAgcmV0dXJuIChbXSBhcyBhbnlbXSkuY29uY2F0KGxheW91dCkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICBpZiAoYS54ID4gYi54IHx8IChhLnggPT09IGIueCAmJiBhLnkgPiBiLnkpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfSk7XG59XG5cbi8qKlxuICogVmFsaWRhdGUgYSBsYXlvdXQuIFRocm93cyBlcnJvcnMuXG4gKlxuICogQHBhcmFtICB7QXJyYXl9ICBsYXlvdXQgICAgICAgIEFycmF5IG9mIGxheW91dCBpdGVtcy5cbiAqIEBwYXJhbSAge1N0cmluZ30gW2NvbnRleHROYW1lXSBDb250ZXh0IG5hbWUgZm9yIGVycm9ycy5cbiAqIEB0aHJvdyAge0Vycm9yfSAgICAgICAgICAgICAgICBWYWxpZGF0aW9uIGVycm9yLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVMYXlvdXQoXG4gICAgbGF5b3V0OiBMYXlvdXQsXG4gICAgY29udGV4dE5hbWU6IHN0cmluZyA9ICdMYXlvdXQnLFxuKTogdm9pZCB7XG4gICAgY29uc3Qgc3ViUHJvcHMgPSBbJ3gnLCAneScsICd3JywgJ2gnXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkobGF5b3V0KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoY29udGV4dE5hbWUgKyAnIG11c3QgYmUgYW4gYXJyYXkhJyk7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBsYXlvdXQubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IGxheW91dFtpXTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzdWJQcm9wcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpdGVtW3N1YlByb3BzW2pdXSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICdSZWFjdEdyaWRMYXlvdXQ6ICcgK1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0TmFtZSArXG4gICAgICAgICAgICAgICAgICAgICdbJyArXG4gICAgICAgICAgICAgICAgICAgIGkgK1xuICAgICAgICAgICAgICAgICAgICAnXS4nICtcbiAgICAgICAgICAgICAgICAgICAgc3ViUHJvcHNbal0gK1xuICAgICAgICAgICAgICAgICAgICAnIG11c3QgYmUgYSBudW1iZXIhJyxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChpdGVtLmlkICYmIHR5cGVvZiBpdGVtLmlkICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICdSZWFjdEdyaWRMYXlvdXQ6ICcgK1xuICAgICAgICAgICAgICAgIGNvbnRleHROYW1lICtcbiAgICAgICAgICAgICAgICAnWycgK1xuICAgICAgICAgICAgICAgIGkgK1xuICAgICAgICAgICAgICAgICddLmkgbXVzdCBiZSBhIHN0cmluZyEnLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS5zdGF0aWMgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgaXRlbS5zdGF0aWMgIT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICdSZWFjdEdyaWRMYXlvdXQ6ICcgK1xuICAgICAgICAgICAgICAgIGNvbnRleHROYW1lICtcbiAgICAgICAgICAgICAgICAnWycgK1xuICAgICAgICAgICAgICAgIGkgK1xuICAgICAgICAgICAgICAgICddLnN0YXRpYyBtdXN0IGJlIGEgYm9vbGVhbiEnLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gRmxvdyBjYW4ndCByZWFsbHkgZmlndXJlIHRoaXMgb3V0LCBzbyB3ZSBqdXN0IHVzZSBPYmplY3RcbmV4cG9ydCBmdW5jdGlvbiBhdXRvQmluZEhhbmRsZXJzKGVsOiBPYmplY3QsIGZuczogQXJyYXk8c3RyaW5nPik6IHZvaWQge1xuICAgIGZucy5mb3JFYWNoKGtleSA9PiAoZWxba2V5XSA9IGVsW2tleV0uYmluZChlbCkpKTtcbn1cblxuZnVuY3Rpb24gbG9nKC4uLmFyZ3MpIHtcbiAgICBpZiAoIURFQlVHKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmxvZyguLi5hcmdzKTtcbn1cblxuZXhwb3J0IGNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcbiJdfQ==