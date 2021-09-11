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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3QtZ3JpZC1sYXlvdXQudXRpbHMuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1ncmlkLWxheW91dC1odWdvL3NyYy8iLCJzb3VyY2VzIjpbImxpYi91dGlscy9yZWFjdC1ncmlkLWxheW91dC51dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTs7OztHQUlHO0FBcUVILE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQztBQUVwQjs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxNQUFNLENBQUMsTUFBYztJQUNqQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQ1AsT0FBTyxDQUFDO0lBQ1osS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMvQyxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLElBQUksT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUNmLEdBQUcsR0FBRyxPQUFPLENBQUM7U0FDakI7S0FDSjtJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQUVELE1BQU0sVUFBVSxXQUFXLENBQUMsTUFBYztJQUN0QyxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDL0MsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM3QztJQUNELE9BQU8sU0FBUyxDQUFDO0FBQ3JCLENBQUM7QUFFRCxr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O0lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUN6QixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBJTVBPUlRBTlQ6XG4gKiBUaGlzIHV0aWxzIGFyZSB0YWtlbiBmcm9tIHRoZSBwcm9qZWN0OiBodHRwczovL2dpdGh1Yi5jb20vU1RSTUwvcmVhY3QtZ3JpZC1sYXlvdXQuXG4gKiBUaGUgY29kZSBzaG91bGQgYmUgYXMgbGVzcyBtb2RpZmllZCBhcyBwb3NzaWJsZSBmb3IgZWFzeSBtYWludGVuYW5jZS5cbiAqL1xuXG4vLyBEaXNhYmxlIGxpbnQgc2luY2Ugd2UgZG9uJ3Qgd2FudCB0byBtb2RpZnkgdGhpcyBjb2RlXG4vLyB0c2xpbnQ6ZGlzYWJsZVxuZXhwb3J0IHR5cGUgTGF5b3V0SXRlbSA9IHtcbiAgICB3OiBudW1iZXI7XG4gICAgaDogbnVtYmVyO1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG4gICAgaWQ6IHN0cmluZztcbiAgICBtaW5XPzogbnVtYmVyO1xuICAgIG1pbkg/OiBudW1iZXI7XG4gICAgbWF4Vz86IG51bWJlcjtcbiAgICBtYXhIPzogbnVtYmVyO1xuICAgIG1vdmVkPzogYm9vbGVhbjtcbiAgICBzdGF0aWM/OiBib29sZWFuO1xuICAgIGlzRHJhZ2dhYmxlPzogYm9vbGVhbiB8IG51bGwgfCB1bmRlZmluZWQ7XG4gICAgaXNSZXNpemFibGU/OiBib29sZWFuIHwgbnVsbCB8IHVuZGVmaW5lZDtcbn07XG5leHBvcnQgdHlwZSBMYXlvdXQgPSBBcnJheTxMYXlvdXRJdGVtPjtcbmV4cG9ydCB0eXBlIFBvc2l0aW9uID0ge1xuICAgIGxlZnQ6IG51bWJlcjtcbiAgICB0b3A6IG51bWJlcjtcbiAgICB3aWR0aDogbnVtYmVyO1xuICAgIGhlaWdodDogbnVtYmVyO1xufTtcbmV4cG9ydCB0eXBlIFJlYWN0RHJhZ2dhYmxlQ2FsbGJhY2tEYXRhID0ge1xuICAgIG5vZGU6IEhUTUxFbGVtZW50O1xuICAgIHg/OiBudW1iZXI7XG4gICAgeT86IG51bWJlcjtcbiAgICBkZWx0YVg6IG51bWJlcjtcbiAgICBkZWx0YVk6IG51bWJlcjtcbiAgICBsYXN0WD86IG51bWJlcjtcbiAgICBsYXN0WT86IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIFBhcnRpYWxQb3NpdGlvbiA9IHsgbGVmdDogbnVtYmVyOyB0b3A6IG51bWJlciB9O1xuZXhwb3J0IHR5cGUgRHJvcHBpbmdQb3NpdGlvbiA9IHsgeDogbnVtYmVyOyB5OiBudW1iZXI7IGU6IEV2ZW50IH07XG5leHBvcnQgdHlwZSBTaXplID0geyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9O1xuZXhwb3J0IHR5cGUgR3JpZERyYWdFdmVudCA9IHtcbiAgICBlOiBFdmVudDtcbiAgICBub2RlOiBIVE1MRWxlbWVudDtcbiAgICBuZXdQb3NpdGlvbjogUGFydGlhbFBvc2l0aW9uO1xufTtcbmV4cG9ydCB0eXBlIEdyaWRSZXNpemVFdmVudCA9IHsgZTogRXZlbnQ7IG5vZGU6IEhUTUxFbGVtZW50OyBzaXplOiBTaXplIH07XG5leHBvcnQgdHlwZSBEcmFnT3ZlckV2ZW50ID0gTW91c2VFdmVudCAmIHtcbiAgICBuYXRpdmVFdmVudDoge1xuICAgICAgICBsYXllclg6IG51bWJlcjtcbiAgICAgICAgbGF5ZXJZOiBudW1iZXI7XG4gICAgICAgIHRhcmdldDoge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiBTdHJpbmc7XG4gICAgICAgIH07XG4gICAgfTtcbn07XG5cbi8vdHlwZSBSRWwgPSBSZWFjdEVsZW1lbnQ8YW55Pjtcbi8vZXhwb3J0IHR5cGUgUmVhY3RDaGlsZHJlbiA9IFJlYWN0Q2hpbGRyZW5BcnJheTxSRWw+O1xuXG4vLyBBbGwgY2FsbGJhY2tzIGFyZSBvZiB0aGUgc2lnbmF0dXJlIChsYXlvdXQsIG9sZEl0ZW0sIG5ld0l0ZW0sIHBsYWNlaG9sZGVyLCBlKS5cbmV4cG9ydCB0eXBlIEV2ZW50Q2FsbGJhY2sgPSAoXG4gICAgYXJnMDogTGF5b3V0LFxuICAgIG9sZEl0ZW06IExheW91dEl0ZW0gfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgIG5ld0l0ZW06IExheW91dEl0ZW0gfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgIHBsYWNlaG9sZGVyOiBMYXlvdXRJdGVtIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICBhcmc0OiBFdmVudCxcbiAgICBhcmc1OiBIVE1MRWxlbWVudCB8IG51bGwgfCB1bmRlZmluZWQsXG4pID0+IHZvaWQ7XG5leHBvcnQgdHlwZSBDb21wYWN0VHlwZSA9ICgnaG9yaXpvbnRhbCcgfCAndmVydGljYWwnKSB8IG51bGwgfCB1bmRlZmluZWQ7XG5cbmNvbnN0IERFQlVHID0gZmFsc2U7XG5cbi8qKlxuICogUmV0dXJuIHRoZSBib3R0b20gY29vcmRpbmF0ZSBvZiB0aGUgbGF5b3V0LlxuICpcbiAqIEBwYXJhbSAge0FycmF5fSBsYXlvdXQgTGF5b3V0IGFycmF5LlxuICogQHJldHVybiB7TnVtYmVyfSAgICAgICBCb3R0b20gY29vcmRpbmF0ZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJvdHRvbShsYXlvdXQ6IExheW91dCk6IG51bWJlciB7XG4gICAgbGV0IG1heCA9IDAsXG4gICAgICAgIGJvdHRvbVk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGxheW91dC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBib3R0b21ZID0gbGF5b3V0W2ldLnkgKyBsYXlvdXRbaV0uaDtcbiAgICAgICAgaWYgKGJvdHRvbVkgPiBtYXgpIHtcbiAgICAgICAgICAgIG1heCA9IGJvdHRvbVk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1heDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsb25lTGF5b3V0KGxheW91dDogTGF5b3V0KTogTGF5b3V0IHtcbiAgICBjb25zdCBuZXdMYXlvdXQgPSBBcnJheShsYXlvdXQubGVuZ3RoKTtcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbGF5b3V0Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIG5ld0xheW91dFtpXSA9IGNsb25lTGF5b3V0SXRlbShsYXlvdXRbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gbmV3TGF5b3V0O1xufVxuXG4vLyBGYXN0IHBhdGggdG8gY2xvbmluZywgc2luY2UgdGhpcyBpcyBtb25vbW9ycGhpY1xuLyoqIE5PVEU6IFRoaXMgY29kZSBoYXMgYmVlbiBtb2RpZmllZCBmcm9tIHRoZSBvcmlnaW5hbCBzb3VyY2UgKi9cbmV4cG9ydCBmdW5jdGlvbiBjbG9uZUxheW91dEl0ZW0obGF5b3V0SXRlbTogTGF5b3V0SXRlbSk6IExheW91dEl0ZW0ge1xuICAgIGNvbnN0IGNsb25lZExheW91dEl0ZW06IExheW91dEl0ZW0gPSB7XG4gICAgICAgIHc6IGxheW91dEl0ZW0udyxcbiAgICAgICAgaDogbGF5b3V0SXRlbS5oLFxuICAgICAgICB4OiBsYXlvdXRJdGVtLngsXG4gICAgICAgIHk6IGxheW91dEl0ZW0ueSxcbiAgICAgICAgaWQ6IGxheW91dEl0ZW0uaWQsXG4gICAgICAgIG1vdmVkOiAhIWxheW91dEl0ZW0ubW92ZWQsXG4gICAgICAgIHN0YXRpYzogISFsYXlvdXRJdGVtLnN0YXRpYyxcbiAgICB9O1xuXG4gICAgaWYgKGxheW91dEl0ZW0ubWluVyAhPT0gdW5kZWZpbmVkKSB7IGNsb25lZExheW91dEl0ZW0ubWluVyA9IGxheW91dEl0ZW0ubWluVzt9XG4gICAgaWYgKGxheW91dEl0ZW0ubWF4VyAhPT0gdW5kZWZpbmVkKSB7IGNsb25lZExheW91dEl0ZW0ubWF4VyA9IGxheW91dEl0ZW0ubWF4Vzt9XG4gICAgaWYgKGxheW91dEl0ZW0ubWluSCAhPT0gdW5kZWZpbmVkKSB7IGNsb25lZExheW91dEl0ZW0ubWluSCA9IGxheW91dEl0ZW0ubWluSDt9XG4gICAgaWYgKGxheW91dEl0ZW0ubWF4SCAhPT0gdW5kZWZpbmVkKSB7IGNsb25lZExheW91dEl0ZW0ubWF4SCA9IGxheW91dEl0ZW0ubWF4SDt9XG4gICAgLy8gVGhlc2UgY2FuIGJlIG51bGxcbiAgICBpZiAobGF5b3V0SXRlbS5pc0RyYWdnYWJsZSAhPT0gdW5kZWZpbmVkKSB7IGNsb25lZExheW91dEl0ZW0uaXNEcmFnZ2FibGUgPSBsYXlvdXRJdGVtLmlzRHJhZ2dhYmxlO31cbiAgICBpZiAobGF5b3V0SXRlbS5pc1Jlc2l6YWJsZSAhPT0gdW5kZWZpbmVkKSB7IGNsb25lZExheW91dEl0ZW0uaXNSZXNpemFibGUgPSBsYXlvdXRJdGVtLmlzUmVzaXphYmxlO31cblxuICAgIHJldHVybiBjbG9uZWRMYXlvdXRJdGVtO1xufVxuXG4vKipcbiAqIEdpdmVuIHR3byBsYXlvdXRpdGVtcywgY2hlY2sgaWYgdGhleSBjb2xsaWRlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29sbGlkZXMobDE6IExheW91dEl0ZW0sIGwyOiBMYXlvdXRJdGVtKTogYm9vbGVhbiB7XG4gICAgaWYgKGwxLmlkID09PSBsMi5pZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSAvLyBzYW1lIGVsZW1lbnRcbiAgICBpZiAobDEueCArIGwxLncgPD0gbDIueCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSAvLyBsMSBpcyBsZWZ0IG9mIGwyXG4gICAgaWYgKGwxLnggPj0gbDIueCArIGwyLncpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gLy8gbDEgaXMgcmlnaHQgb2YgbDJcbiAgICBpZiAobDEueSArIGwxLmggPD0gbDIueSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSAvLyBsMSBpcyBhYm92ZSBsMlxuICAgIGlmIChsMS55ID49IGwyLnkgKyBsMi5oKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IC8vIGwxIGlzIGJlbG93IGwyXG4gICAgcmV0dXJuIHRydWU7IC8vIGJveGVzIG92ZXJsYXBcbn1cblxuLyoqXG4gKiBHaXZlbiBhIGxheW91dCwgY29tcGFjdCBpdC4gVGhpcyBpbnZvbHZlcyBnb2luZyBkb3duIGVhY2ggeSBjb29yZGluYXRlIGFuZCByZW1vdmluZyBnYXBzXG4gKiBiZXR3ZWVuIGl0ZW1zLlxuICpcbiAqIEBwYXJhbSAge0FycmF5fSBsYXlvdXQgTGF5b3V0LlxuICogQHBhcmFtICB7Qm9vbGVhbn0gdmVydGljYWxDb21wYWN0IFdoZXRoZXIgb3Igbm90IHRvIGNvbXBhY3QgdGhlIGxheW91dFxuICogICB2ZXJ0aWNhbGx5LlxuICogQHJldHVybiB7QXJyYXl9ICAgICAgIENvbXBhY3RlZCBMYXlvdXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wYWN0KFxuICAgIGxheW91dDogTGF5b3V0LFxuICAgIGNvbXBhY3RUeXBlOiBDb21wYWN0VHlwZSxcbiAgICBjb2xzOiBudW1iZXIsXG4pOiBMYXlvdXQge1xuICAgIC8vIFN0YXRpY3MgZ28gaW4gdGhlIGNvbXBhcmVXaXRoIGFycmF5IHJpZ2h0IGF3YXkgc28gaXRlbXMgZmxvdyBhcm91bmQgdGhlbS5cbiAgICBjb25zdCBjb21wYXJlV2l0aCA9IGdldFN0YXRpY3MobGF5b3V0KTtcbiAgICAvLyBXZSBnbyB0aHJvdWdoIHRoZSBpdGVtcyBieSByb3cgYW5kIGNvbHVtbi5cbiAgICBjb25zdCBzb3J0ZWQgPSBzb3J0TGF5b3V0SXRlbXMobGF5b3V0LCBjb21wYWN0VHlwZSk7XG4gICAgLy8gSG9sZGluZyBmb3IgbmV3IGl0ZW1zLlxuICAgIGNvbnN0IG91dCA9IEFycmF5KGxheW91dC5sZW5ndGgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHNvcnRlZC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBsZXQgbCA9IGNsb25lTGF5b3V0SXRlbShzb3J0ZWRbaV0pO1xuXG4gICAgICAgIC8vIERvbid0IG1vdmUgc3RhdGljIGVsZW1lbnRzXG4gICAgICAgIGlmICghbC5zdGF0aWMpIHtcbiAgICAgICAgICAgIGwgPSBjb21wYWN0SXRlbShjb21wYXJlV2l0aCwgbCwgY29tcGFjdFR5cGUsIGNvbHMsIHNvcnRlZCk7XG5cbiAgICAgICAgICAgIC8vIEFkZCB0byBjb21wYXJpc29uIGFycmF5LiBXZSBvbmx5IGNvbGxpZGUgd2l0aCBpdGVtcyBiZWZvcmUgdGhpcyBvbmUuXG4gICAgICAgICAgICAvLyBTdGF0aWNzIGFyZSBhbHJlYWR5IGluIHRoaXMgYXJyYXkuXG4gICAgICAgICAgICBjb21wYXJlV2l0aC5wdXNoKGwpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIHRvIG91dHB1dCBhcnJheSB0byBtYWtlIHN1cmUgdGhleSBzdGlsbCBjb21lIG91dCBpbiB0aGUgcmlnaHQgb3JkZXIuXG4gICAgICAgIG91dFtsYXlvdXQuaW5kZXhPZihzb3J0ZWRbaV0pXSA9IGw7XG5cbiAgICAgICAgLy8gQ2xlYXIgbW92ZWQgZmxhZywgaWYgaXQgZXhpc3RzLlxuICAgICAgICBsLm1vdmVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbn1cblxuY29uc3QgaGVpZ2h0V2lkdGggPSB7eDogJ3cnLCB5OiAnaCd9O1xuXG4vKipcbiAqIEJlZm9yZSBtb3ZpbmcgaXRlbSBkb3duLCBpdCB3aWxsIGNoZWNrIGlmIHRoZSBtb3ZlbWVudCB3aWxsIGNhdXNlIGNvbGxpc2lvbnMgYW5kIG1vdmUgdGhvc2UgaXRlbXMgZG93biBiZWZvcmUuXG4gKi9cbmZ1bmN0aW9uIHJlc29sdmVDb21wYWN0aW9uQ29sbGlzaW9uKFxuICAgIGxheW91dDogTGF5b3V0LFxuICAgIGl0ZW06IExheW91dEl0ZW0sXG4gICAgbW92ZVRvQ29vcmQ6IG51bWJlcixcbiAgICBheGlzOiAneCcgfCAneScsXG4pIHtcbiAgICBjb25zdCBzaXplUHJvcCA9IGhlaWdodFdpZHRoW2F4aXNdO1xuICAgIGl0ZW1bYXhpc10gKz0gMTtcbiAgICBjb25zdCBpdGVtSW5kZXggPSBsYXlvdXRcbiAgICAgICAgLm1hcChsYXlvdXRJdGVtID0+IHtcbiAgICAgICAgICAgIHJldHVybiBsYXlvdXRJdGVtLmlkO1xuICAgICAgICB9KVxuICAgICAgICAuaW5kZXhPZihpdGVtLmlkKTtcblxuICAgIC8vIEdvIHRocm91Z2ggZWFjaCBpdGVtIHdlIGNvbGxpZGUgd2l0aC5cbiAgICBmb3IgKGxldCBpID0gaXRlbUluZGV4ICsgMTsgaSA8IGxheW91dC5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBvdGhlckl0ZW0gPSBsYXlvdXRbaV07XG4gICAgICAgIC8vIElnbm9yZSBzdGF0aWMgaXRlbXNcbiAgICAgICAgaWYgKG90aGVySXRlbS5zdGF0aWMpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gT3B0aW1pemF0aW9uOiB3ZSBjYW4gYnJlYWsgZWFybHkgaWYgd2Uga25vdyB3ZSdyZSBwYXN0IHRoaXMgZWxcbiAgICAgICAgLy8gV2UgY2FuIGRvIHRoaXMgYi9jIGl0J3MgYSBzb3J0ZWQgbGF5b3V0XG4gICAgICAgIGlmIChvdGhlckl0ZW0ueSA+IGl0ZW0ueSArIGl0ZW0uaCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29sbGlkZXMoaXRlbSwgb3RoZXJJdGVtKSkge1xuICAgICAgICAgICAgcmVzb2x2ZUNvbXBhY3Rpb25Db2xsaXNpb24oXG4gICAgICAgICAgICAgICAgbGF5b3V0LFxuICAgICAgICAgICAgICAgIG90aGVySXRlbSxcbiAgICAgICAgICAgICAgICBtb3ZlVG9Db29yZCArIGl0ZW1bc2l6ZVByb3BdLFxuICAgICAgICAgICAgICAgIGF4aXMsXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXRlbVtheGlzXSA9IG1vdmVUb0Nvb3JkO1xufVxuXG4vKipcbiAqIENvbXBhY3QgYW4gaXRlbSBpbiB0aGUgbGF5b3V0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcGFjdEl0ZW0oXG4gICAgY29tcGFyZVdpdGg6IExheW91dCxcbiAgICBsOiBMYXlvdXRJdGVtLFxuICAgIGNvbXBhY3RUeXBlOiBDb21wYWN0VHlwZSxcbiAgICBjb2xzOiBudW1iZXIsXG4gICAgZnVsbExheW91dDogTGF5b3V0LFxuKTogTGF5b3V0SXRlbSB7XG4gICAgY29uc3QgY29tcGFjdFYgPSBjb21wYWN0VHlwZSA9PT0gJ3ZlcnRpY2FsJztcbiAgICBjb25zdCBjb21wYWN0SCA9IGNvbXBhY3RUeXBlID09PSAnaG9yaXpvbnRhbCc7XG4gICAgaWYgKGNvbXBhY3RWKSB7XG4gICAgICAgIC8vIEJvdHRvbSAneScgcG9zc2libGUgaXMgdGhlIGJvdHRvbSBvZiB0aGUgbGF5b3V0LlxuICAgICAgICAvLyBUaGlzIGFsbG93cyB5b3UgdG8gZG8gbmljZSBzdHVmZiBsaWtlIHNwZWNpZnkge3k6IEluZmluaXR5fVxuICAgICAgICAvLyBUaGlzIGlzIGhlcmUgYmVjYXVzZSB0aGUgbGF5b3V0IG11c3QgYmUgc29ydGVkIGluIG9yZGVyIHRvIGdldCB0aGUgY29ycmVjdCBib3R0b20gYHlgLlxuICAgICAgICBsLnkgPSBNYXRoLm1pbihib3R0b20oY29tcGFyZVdpdGgpLCBsLnkpO1xuICAgICAgICAvLyBNb3ZlIHRoZSBlbGVtZW50IHVwIGFzIGZhciBhcyBpdCBjYW4gZ28gd2l0aG91dCBjb2xsaWRpbmcuXG4gICAgICAgIHdoaWxlIChsLnkgPiAwICYmICFnZXRGaXJzdENvbGxpc2lvbihjb21wYXJlV2l0aCwgbCkpIHtcbiAgICAgICAgICAgIGwueS0tO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChjb21wYWN0SCkge1xuICAgICAgICBsLnkgPSBNYXRoLm1pbihib3R0b20oY29tcGFyZVdpdGgpLCBsLnkpO1xuICAgICAgICAvLyBNb3ZlIHRoZSBlbGVtZW50IGxlZnQgYXMgZmFyIGFzIGl0IGNhbiBnbyB3aXRob3V0IGNvbGxpZGluZy5cbiAgICAgICAgd2hpbGUgKGwueCA+IDAgJiYgIWdldEZpcnN0Q29sbGlzaW9uKGNvbXBhcmVXaXRoLCBsKSkge1xuICAgICAgICAgICAgbC54LS07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNb3ZlIGl0IGRvd24sIGFuZCBrZWVwIG1vdmluZyBpdCBkb3duIGlmIGl0J3MgY29sbGlkaW5nLlxuICAgIGxldCBjb2xsaWRlcztcbiAgICB3aGlsZSAoKGNvbGxpZGVzID0gZ2V0Rmlyc3RDb2xsaXNpb24oY29tcGFyZVdpdGgsIGwpKSkge1xuICAgICAgICBpZiAoY29tcGFjdEgpIHtcbiAgICAgICAgICAgIHJlc29sdmVDb21wYWN0aW9uQ29sbGlzaW9uKFxuICAgICAgICAgICAgICAgIGZ1bGxMYXlvdXQsXG4gICAgICAgICAgICAgICAgbCxcbiAgICAgICAgICAgICAgICBjb2xsaWRlcy54ICsgY29sbGlkZXMudyxcbiAgICAgICAgICAgICAgICAneCcsXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzb2x2ZUNvbXBhY3Rpb25Db2xsaXNpb24oXG4gICAgICAgICAgICAgICAgZnVsbExheW91dCxcbiAgICAgICAgICAgICAgICBsLFxuICAgICAgICAgICAgICAgIGNvbGxpZGVzLnkgKyBjb2xsaWRlcy5oLFxuICAgICAgICAgICAgICAgICd5JyxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU2luY2Ugd2UgY2FuJ3QgZ3JvdyB3aXRob3V0IGJvdW5kcyBob3Jpem9udGFsbHksIGlmIHdlJ3ZlIG92ZXJmbG93biwgbGV0J3MgbW92ZSBpdCBkb3duIGFuZCB0cnkgYWdhaW4uXG4gICAgICAgIGlmIChjb21wYWN0SCAmJiBsLnggKyBsLncgPiBjb2xzKSB7XG4gICAgICAgICAgICBsLnggPSBjb2xzIC0gbC53O1xuICAgICAgICAgICAgbC55Kys7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGw7XG59XG5cbi8qKlxuICogR2l2ZW4gYSBsYXlvdXQsIG1ha2Ugc3VyZSBhbGwgZWxlbWVudHMgZml0IHdpdGhpbiBpdHMgYm91bmRzLlxuICpcbiAqIEBwYXJhbSAge0FycmF5fSBsYXlvdXQgTGF5b3V0IGFycmF5LlxuICogQHBhcmFtICB7TnVtYmVyfSBib3VuZHMgTnVtYmVyIG9mIGNvbHVtbnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb3JyZWN0Qm91bmRzKGxheW91dDogTGF5b3V0LCBib3VuZHM6IHsgY29sczogbnVtYmVyIH0pOiBMYXlvdXQge1xuICAgIGNvbnN0IGNvbGxpZGVzV2l0aCA9IGdldFN0YXRpY3MobGF5b3V0KTtcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbGF5b3V0Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGwgPSBsYXlvdXRbaV07XG4gICAgICAgIC8vIE92ZXJmbG93cyByaWdodFxuICAgICAgICBpZiAobC54ICsgbC53ID4gYm91bmRzLmNvbHMpIHtcbiAgICAgICAgICAgIGwueCA9IGJvdW5kcy5jb2xzIC0gbC53O1xuICAgICAgICB9XG4gICAgICAgIC8vIE92ZXJmbG93cyBsZWZ0XG4gICAgICAgIGlmIChsLnggPCAwKSB7XG4gICAgICAgICAgICBsLnggPSAwO1xuICAgICAgICAgICAgbC53ID0gYm91bmRzLmNvbHM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFsLnN0YXRpYykge1xuICAgICAgICAgICAgY29sbGlkZXNXaXRoLnB1c2gobCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJZiB0aGlzIGlzIHN0YXRpYyBhbmQgY29sbGlkZXMgd2l0aCBvdGhlciBzdGF0aWNzLCB3ZSBtdXN0IG1vdmUgaXQgZG93bi5cbiAgICAgICAgICAgIC8vIFdlIGhhdmUgdG8gZG8gc29tZXRoaW5nIG5pY2VyIHRoYW4ganVzdCBsZXR0aW5nIHRoZW0gb3ZlcmxhcC5cbiAgICAgICAgICAgIHdoaWxlIChnZXRGaXJzdENvbGxpc2lvbihjb2xsaWRlc1dpdGgsIGwpKSB7XG4gICAgICAgICAgICAgICAgbC55Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGxheW91dDtcbn1cblxuLyoqXG4gKiBHZXQgYSBsYXlvdXQgaXRlbSBieSBJRC4gVXNlZCBzbyB3ZSBjYW4gb3ZlcnJpZGUgbGF0ZXIgb24gaWYgbmVjZXNzYXJ5LlxuICpcbiAqIEBwYXJhbSAge0FycmF5fSAgbGF5b3V0IExheW91dCBhcnJheS5cbiAqIEBwYXJhbSAge1N0cmluZ30gaWQgICAgIElEXG4gKiBAcmV0dXJuIHtMYXlvdXRJdGVtfSAgICBJdGVtIGF0IElELlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGF5b3V0SXRlbShcbiAgICBsYXlvdXQ6IExheW91dCxcbiAgICBpZDogc3RyaW5nLFxuKTogTGF5b3V0SXRlbSB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBsYXlvdXQubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGxheW91dFtpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBsYXlvdXRbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZmlyc3QgaXRlbSB0aGlzIGxheW91dCBjb2xsaWRlcyB3aXRoLlxuICogSXQgZG9lc24ndCBhcHBlYXIgdG8gbWF0dGVyIHdoaWNoIG9yZGVyIHdlIGFwcHJvYWNoIHRoaXMgZnJvbSwgYWx0aG91Z2hcbiAqIHBlcmhhcHMgdGhhdCBpcyB0aGUgd3JvbmcgdGhpbmcgdG8gZG8uXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSBsYXlvdXRJdGVtIExheW91dCBpdGVtLlxuICogQHJldHVybiB7T2JqZWN0fHVuZGVmaW5lZH0gIEEgY29sbGlkaW5nIGxheW91dCBpdGVtLCBvciB1bmRlZmluZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaXJzdENvbGxpc2lvbihcbiAgICBsYXlvdXQ6IExheW91dCxcbiAgICBsYXlvdXRJdGVtOiBMYXlvdXRJdGVtLFxuKTogTGF5b3V0SXRlbSB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBsYXlvdXQubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGNvbGxpZGVzKGxheW91dFtpXSwgbGF5b3V0SXRlbSkpIHtcbiAgICAgICAgICAgIHJldHVybiBsYXlvdXRbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxDb2xsaXNpb25zKFxuICAgIGxheW91dDogTGF5b3V0LFxuICAgIGxheW91dEl0ZW06IExheW91dEl0ZW0sXG4pOiBBcnJheTxMYXlvdXRJdGVtPiB7XG4gICAgcmV0dXJuIGxheW91dC5maWx0ZXIobCA9PiBjb2xsaWRlcyhsLCBsYXlvdXRJdGVtKSk7XG59XG5cbi8qKlxuICogR2V0IGFsbCBzdGF0aWMgZWxlbWVudHMuXG4gKiBAcGFyYW0gIHtBcnJheX0gbGF5b3V0IEFycmF5IG9mIGxheW91dCBvYmplY3RzLlxuICogQHJldHVybiB7QXJyYXl9ICAgICAgICBBcnJheSBvZiBzdGF0aWMgbGF5b3V0IGl0ZW1zLi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFN0YXRpY3MobGF5b3V0OiBMYXlvdXQpOiBBcnJheTxMYXlvdXRJdGVtPiB7XG4gICAgcmV0dXJuIGxheW91dC5maWx0ZXIobCA9PiBsLnN0YXRpYyk7XG59XG5cbi8qKlxuICogTW92ZSBhbiBlbGVtZW50LiBSZXNwb25zaWJsZSBmb3IgZG9pbmcgY2FzY2FkaW5nIG1vdmVtZW50cyBvZiBvdGhlciBlbGVtZW50cy5cbiAqXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICBsYXlvdXQgICAgICAgICAgICBGdWxsIGxheW91dCB0byBtb2RpZnkuXG4gKiBAcGFyYW0gIHtMYXlvdXRJdGVtfSBsICAgICAgICAgICAgICAgICBlbGVtZW50IHRvIG1vdmUuXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICBbeF0gICAgICAgICAgICAgICBYIHBvc2l0aW9uIGluIGdyaWQgdW5pdHMuXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICBbeV0gICAgICAgICAgICAgICBZIHBvc2l0aW9uIGluIGdyaWQgdW5pdHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtb3ZlRWxlbWVudChcbiAgICBsYXlvdXQ6IExheW91dCxcbiAgICBsOiBMYXlvdXRJdGVtLFxuICAgIHg6IG51bWJlciB8IG51bGwgfCB1bmRlZmluZWQsXG4gICAgeTogbnVtYmVyIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICBpc1VzZXJBY3Rpb246IGJvb2xlYW4gfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgIHByZXZlbnRDb2xsaXNpb246IGJvb2xlYW4gfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgIGNvbXBhY3RUeXBlOiBDb21wYWN0VHlwZSxcbiAgICBjb2xzOiBudW1iZXIsXG4pOiBMYXlvdXQge1xuICAgIC8vIElmIHRoaXMgaXMgc3RhdGljIGFuZCBub3QgZXhwbGljaXRseSBlbmFibGVkIGFzIGRyYWdnYWJsZSxcbiAgICAvLyBubyBtb3ZlIGlzIHBvc3NpYmxlLCBzbyB3ZSBjYW4gc2hvcnQtY2lyY3VpdCB0aGlzIGltbWVkaWF0ZWx5LlxuICAgIGlmIChsLnN0YXRpYyAmJiBsLmlzRHJhZ2dhYmxlICE9PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBsYXlvdXQ7XG4gICAgfVxuXG4gICAgLy8gU2hvcnQtY2lyY3VpdCBpZiBub3RoaW5nIHRvIGRvLlxuICAgIGlmIChsLnkgPT09IHkgJiYgbC54ID09PSB4KSB7XG4gICAgICAgIHJldHVybiBsYXlvdXQ7XG4gICAgfVxuXG4gICAgbG9nKFxuICAgICAgICBgTW92aW5nIGVsZW1lbnQgJHtsLmlkfSB0byBbJHtTdHJpbmcoeCl9LCR7U3RyaW5nKHkpfV0gZnJvbSBbJHtsLnh9LCR7XG4gICAgICAgICAgICBsLnlcbiAgICAgICAgfV1gLFxuICAgICk7XG4gICAgY29uc3Qgb2xkWCA9IGwueDtcbiAgICBjb25zdCBvbGRZID0gbC55O1xuXG4gICAgLy8gVGhpcyBpcyBxdWl0ZSBhIGJpdCBmYXN0ZXIgdGhhbiBleHRlbmRpbmcgdGhlIG9iamVjdFxuICAgIGlmICh0eXBlb2YgeCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgbC54ID0geDtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB5ID09PSAnbnVtYmVyJykge1xuICAgICAgICBsLnkgPSB5O1xuICAgIH1cbiAgICBsLm1vdmVkID0gdHJ1ZTtcblxuICAgIC8vIElmIHRoaXMgY29sbGlkZXMgd2l0aCBhbnl0aGluZywgbW92ZSBpdC5cbiAgICAvLyBXaGVuIGRvaW5nIHRoaXMgY29tcGFyaXNvbiwgd2UgaGF2ZSB0byBzb3J0IHRoZSBpdGVtcyB3ZSBjb21wYXJlIHdpdGhcbiAgICAvLyB0byBlbnN1cmUsIGluIHRoZSBjYXNlIG9mIG11bHRpcGxlIGNvbGxpc2lvbnMsIHRoYXQgd2UncmUgZ2V0dGluZyB0aGVcbiAgICAvLyBuZWFyZXN0IGNvbGxpc2lvbi5cbiAgICBsZXQgc29ydGVkID0gc29ydExheW91dEl0ZW1zKGxheW91dCwgY29tcGFjdFR5cGUpO1xuICAgIGNvbnN0IG1vdmluZ1VwID1cbiAgICAgICAgY29tcGFjdFR5cGUgPT09ICd2ZXJ0aWNhbCcgJiYgdHlwZW9mIHkgPT09ICdudW1iZXInXG4gICAgICAgICAgICA/IG9sZFkgPj0geVxuICAgICAgICAgICAgOiBjb21wYWN0VHlwZSA9PT0gJ2hvcml6b250YWwnICYmIHR5cGVvZiB4ID09PSAnbnVtYmVyJ1xuICAgICAgICAgICAgPyBvbGRYID49IHhcbiAgICAgICAgICAgIDogZmFsc2U7XG4gICAgaWYgKG1vdmluZ1VwKSB7XG4gICAgICAgIHNvcnRlZCA9IHNvcnRlZC5yZXZlcnNlKCk7XG4gICAgfVxuICAgIGNvbnN0IGNvbGxpc2lvbnMgPSBnZXRBbGxDb2xsaXNpb25zKHNvcnRlZCwgbCk7XG5cbiAgICAvLyBUaGVyZSB3YXMgYSBjb2xsaXNpb247IGFib3J0XG4gICAgaWYgKHByZXZlbnRDb2xsaXNpb24gJiYgY29sbGlzaW9ucy5sZW5ndGgpIHtcbiAgICAgICAgbG9nKGBDb2xsaXNpb24gcHJldmVudGVkIG9uICR7bC5pZH0sIHJldmVydGluZy5gKTtcbiAgICAgICAgbC54ID0gb2xkWDtcbiAgICAgICAgbC55ID0gb2xkWTtcbiAgICAgICAgbC5tb3ZlZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gbGF5b3V0O1xuICAgIH1cblxuICAgIC8vIE1vdmUgZWFjaCBpdGVtIHRoYXQgY29sbGlkZXMgYXdheSBmcm9tIHRoaXMgZWxlbWVudC5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gY29sbGlzaW9ucy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBjb25zdCBjb2xsaXNpb24gPSBjb2xsaXNpb25zW2ldO1xuICAgICAgICBsb2coXG4gICAgICAgICAgICBgUmVzb2x2aW5nIGNvbGxpc2lvbiBiZXR3ZWVuICR7bC5pZH0gYXQgWyR7bC54fSwke2wueX1dIGFuZCAke1xuICAgICAgICAgICAgICAgIGNvbGxpc2lvbi5pZFxuICAgICAgICAgICAgfSBhdCBbJHtjb2xsaXNpb24ueH0sJHtjb2xsaXNpb24ueX1dYCxcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBTaG9ydCBjaXJjdWl0IHNvIHdlIGNhbid0IGluZmluaXRlIGxvb3BcbiAgICAgICAgaWYgKGNvbGxpc2lvbi5tb3ZlZCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEb24ndCBtb3ZlIHN0YXRpYyBpdGVtcyAtIHdlIGhhdmUgdG8gbW92ZSAqdGhpcyogZWxlbWVudCBhd2F5XG4gICAgICAgIGlmIChjb2xsaXNpb24uc3RhdGljKSB7XG4gICAgICAgICAgICBsYXlvdXQgPSBtb3ZlRWxlbWVudEF3YXlGcm9tQ29sbGlzaW9uKFxuICAgICAgICAgICAgICAgIGxheW91dCxcbiAgICAgICAgICAgICAgICBjb2xsaXNpb24sXG4gICAgICAgICAgICAgICAgbCxcbiAgICAgICAgICAgICAgICBpc1VzZXJBY3Rpb24sXG4gICAgICAgICAgICAgICAgY29tcGFjdFR5cGUsXG4gICAgICAgICAgICAgICAgY29scyxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsYXlvdXQgPSBtb3ZlRWxlbWVudEF3YXlGcm9tQ29sbGlzaW9uKFxuICAgICAgICAgICAgICAgIGxheW91dCxcbiAgICAgICAgICAgICAgICBsLFxuICAgICAgICAgICAgICAgIGNvbGxpc2lvbixcbiAgICAgICAgICAgICAgICBpc1VzZXJBY3Rpb24sXG4gICAgICAgICAgICAgICAgY29tcGFjdFR5cGUsXG4gICAgICAgICAgICAgICAgY29scyxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbGF5b3V0O1xufVxuXG4vKipcbiAqIFRoaXMgaXMgd2hlcmUgdGhlIG1hZ2ljIG5lZWRzIHRvIGhhcHBlbiAtIGdpdmVuIGEgY29sbGlzaW9uLCBtb3ZlIGFuIGVsZW1lbnQgYXdheSBmcm9tIHRoZSBjb2xsaXNpb24uXG4gKiBXZSBhdHRlbXB0IHRvIG1vdmUgaXQgdXAgaWYgdGhlcmUncyByb29tLCBvdGhlcndpc2UgaXQgZ29lcyBiZWxvdy5cbiAqXG4gKiBAcGFyYW0gIHtBcnJheX0gbGF5b3V0ICAgICAgICAgICAgRnVsbCBsYXlvdXQgdG8gbW9kaWZ5LlxuICogQHBhcmFtICB7TGF5b3V0SXRlbX0gY29sbGlkZXNXaXRoIExheW91dCBpdGVtIHdlJ3JlIGNvbGxpZGluZyB3aXRoLlxuICogQHBhcmFtICB7TGF5b3V0SXRlbX0gaXRlbVRvTW92ZSAgIExheW91dCBpdGVtIHdlJ3JlIG1vdmluZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1vdmVFbGVtZW50QXdheUZyb21Db2xsaXNpb24oXG4gICAgbGF5b3V0OiBMYXlvdXQsXG4gICAgY29sbGlkZXNXaXRoOiBMYXlvdXRJdGVtLFxuICAgIGl0ZW1Ub01vdmU6IExheW91dEl0ZW0sXG4gICAgaXNVc2VyQWN0aW9uOiBib29sZWFuIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICBjb21wYWN0VHlwZTogQ29tcGFjdFR5cGUsXG4gICAgY29sczogbnVtYmVyLFxuKTogTGF5b3V0IHtcbiAgICBjb25zdCBjb21wYWN0SCA9IGNvbXBhY3RUeXBlID09PSAnaG9yaXpvbnRhbCc7XG4gICAgLy8gQ29tcGFjdCB2ZXJ0aWNhbGx5IGlmIG5vdCBzZXQgdG8gaG9yaXpvbnRhbFxuICAgIGNvbnN0IGNvbXBhY3RWID0gY29tcGFjdFR5cGUgIT09ICdob3Jpem9udGFsJztcbiAgICBjb25zdCBwcmV2ZW50Q29sbGlzaW9uID0gY29sbGlkZXNXaXRoLnN0YXRpYzsgLy8gd2UncmUgYWxyZWFkeSBjb2xsaWRpbmcgKG5vdCBmb3Igc3RhdGljIGl0ZW1zKVxuXG4gICAgLy8gSWYgdGhlcmUgaXMgZW5vdWdoIHNwYWNlIGFib3ZlIHRoZSBjb2xsaXNpb24gdG8gcHV0IHRoaXMgZWxlbWVudCwgbW92ZSBpdCB0aGVyZS5cbiAgICAvLyBXZSBvbmx5IGRvIHRoaXMgb24gdGhlIG1haW4gY29sbGlzaW9uIGFzIHRoaXMgY2FuIGdldCBmdW5reSBpbiBjYXNjYWRlcyBhbmQgY2F1c2VcbiAgICAvLyB1bndhbnRlZCBzd2FwcGluZyBiZWhhdmlvci5cbiAgICBpZiAoaXNVc2VyQWN0aW9uKSB7XG4gICAgICAgIC8vIFJlc2V0IGlzVXNlckFjdGlvbiBmbGFnIGJlY2F1c2Ugd2UncmUgbm90IGluIHRoZSBtYWluIGNvbGxpc2lvbiBhbnltb3JlLlxuICAgICAgICBpc1VzZXJBY3Rpb24gPSBmYWxzZTtcblxuICAgICAgICAvLyBNYWtlIGEgbW9jayBpdGVtIHNvIHdlIGRvbid0IG1vZGlmeSB0aGUgaXRlbSBoZXJlLCBvbmx5IG1vZGlmeSBpbiBtb3ZlRWxlbWVudC5cbiAgICAgICAgY29uc3QgZmFrZUl0ZW06IExheW91dEl0ZW0gPSB7XG4gICAgICAgICAgICB4OiBjb21wYWN0SFxuICAgICAgICAgICAgICAgID8gTWF0aC5tYXgoY29sbGlkZXNXaXRoLnggLSBpdGVtVG9Nb3ZlLncsIDApXG4gICAgICAgICAgICAgICAgOiBpdGVtVG9Nb3ZlLngsXG4gICAgICAgICAgICB5OiBjb21wYWN0VlxuICAgICAgICAgICAgICAgID8gTWF0aC5tYXgoY29sbGlkZXNXaXRoLnkgLSBpdGVtVG9Nb3ZlLmgsIDApXG4gICAgICAgICAgICAgICAgOiBpdGVtVG9Nb3ZlLnksXG4gICAgICAgICAgICB3OiBpdGVtVG9Nb3ZlLncsXG4gICAgICAgICAgICBoOiBpdGVtVG9Nb3ZlLmgsXG4gICAgICAgICAgICBpZDogJy0xJyxcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBObyBjb2xsaXNpb24/IElmIHNvLCB3ZSBjYW4gZ28gdXAgdGhlcmU7IG90aGVyd2lzZSwgd2UnbGwgZW5kIHVwIG1vdmluZyBkb3duIGFzIG5vcm1hbFxuICAgICAgICBpZiAoIWdldEZpcnN0Q29sbGlzaW9uKGxheW91dCwgZmFrZUl0ZW0pKSB7XG4gICAgICAgICAgICBsb2coXG4gICAgICAgICAgICAgICAgYERvaW5nIHJldmVyc2UgY29sbGlzaW9uIG9uICR7aXRlbVRvTW92ZS5pZH0gdXAgdG8gWyR7XG4gICAgICAgICAgICAgICAgICAgIGZha2VJdGVtLnhcbiAgICAgICAgICAgICAgICB9LCR7ZmFrZUl0ZW0ueX1dLmAsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIG1vdmVFbGVtZW50KFxuICAgICAgICAgICAgICAgIGxheW91dCxcbiAgICAgICAgICAgICAgICBpdGVtVG9Nb3ZlLFxuICAgICAgICAgICAgICAgIGNvbXBhY3RIID8gZmFrZUl0ZW0ueCA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBjb21wYWN0ViA/IGZha2VJdGVtLnkgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgaXNVc2VyQWN0aW9uLFxuICAgICAgICAgICAgICAgIHByZXZlbnRDb2xsaXNpb24sXG4gICAgICAgICAgICAgICAgY29tcGFjdFR5cGUsXG4gICAgICAgICAgICAgICAgY29scyxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbW92ZUVsZW1lbnQoXG4gICAgICAgIGxheW91dCxcbiAgICAgICAgaXRlbVRvTW92ZSxcbiAgICAgICAgY29tcGFjdEggPyBpdGVtVG9Nb3ZlLnggKyAxIDogdW5kZWZpbmVkLFxuICAgICAgICBjb21wYWN0ViA/IGl0ZW1Ub01vdmUueSArIDEgOiB1bmRlZmluZWQsXG4gICAgICAgIGlzVXNlckFjdGlvbixcbiAgICAgICAgcHJldmVudENvbGxpc2lvbixcbiAgICAgICAgY29tcGFjdFR5cGUsXG4gICAgICAgIGNvbHMsXG4gICAgKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgdG8gY29udmVydCBhIG51bWJlciB0byBhIHBlcmNlbnRhZ2Ugc3RyaW5nLlxuICpcbiAqIEBwYXJhbSAge051bWJlcn0gbnVtIEFueSBudW1iZXJcbiAqIEByZXR1cm4ge1N0cmluZ30gICAgIFRoYXQgbnVtYmVyIGFzIGEgcGVyY2VudGFnZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBlcmMobnVtOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBudW0gKiAxMDAgKyAnJSc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRUcmFuc2Zvcm0oe3RvcCwgbGVmdCwgd2lkdGgsIGhlaWdodH06IFBvc2l0aW9uKTogT2JqZWN0IHtcbiAgICAvLyBSZXBsYWNlIHVuaXRsZXNzIGl0ZW1zIHdpdGggcHhcbiAgICBjb25zdCB0cmFuc2xhdGUgPSBgdHJhbnNsYXRlKCR7bGVmdH1weCwke3RvcH1weClgO1xuICAgIHJldHVybiB7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlLFxuICAgICAgICBXZWJraXRUcmFuc2Zvcm06IHRyYW5zbGF0ZSxcbiAgICAgICAgTW96VHJhbnNmb3JtOiB0cmFuc2xhdGUsXG4gICAgICAgIG1zVHJhbnNmb3JtOiB0cmFuc2xhdGUsXG4gICAgICAgIE9UcmFuc2Zvcm06IHRyYW5zbGF0ZSxcbiAgICAgICAgd2lkdGg6IGAke3dpZHRofXB4YCxcbiAgICAgICAgaGVpZ2h0OiBgJHtoZWlnaHR9cHhgLFxuICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0VG9wTGVmdCh7dG9wLCBsZWZ0LCB3aWR0aCwgaGVpZ2h0fTogUG9zaXRpb24pOiBPYmplY3Qge1xuICAgIHJldHVybiB7XG4gICAgICAgIHRvcDogYCR7dG9wfXB4YCxcbiAgICAgICAgbGVmdDogYCR7bGVmdH1weGAsXG4gICAgICAgIHdpZHRoOiBgJHt3aWR0aH1weGAsXG4gICAgICAgIGhlaWdodDogYCR7aGVpZ2h0fXB4YCxcbiAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgfTtcbn1cblxuLyoqXG4gKiBHZXQgbGF5b3V0IGl0ZW1zIHNvcnRlZCBmcm9tIHRvcCBsZWZ0IHRvIHJpZ2h0IGFuZCBkb3duLlxuICpcbiAqIEByZXR1cm4ge0FycmF5fSBBcnJheSBvZiBsYXlvdXQgb2JqZWN0cy5cbiAqIEByZXR1cm4ge0FycmF5fSAgICAgICAgTGF5b3V0LCBzb3J0ZWQgc3RhdGljIGl0ZW1zIGZpcnN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gc29ydExheW91dEl0ZW1zKFxuICAgIGxheW91dDogTGF5b3V0LFxuICAgIGNvbXBhY3RUeXBlOiBDb21wYWN0VHlwZSxcbik6IExheW91dCB7XG4gICAgaWYgKGNvbXBhY3RUeXBlID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgcmV0dXJuIHNvcnRMYXlvdXRJdGVtc0J5Q29sUm93KGxheW91dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNvcnRMYXlvdXRJdGVtc0J5Um93Q29sKGxheW91dCk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc29ydExheW91dEl0ZW1zQnlSb3dDb2wobGF5b3V0OiBMYXlvdXQpOiBMYXlvdXQge1xuICAgIHJldHVybiAoW10gYXMgYW55W10pLmNvbmNhdChsYXlvdXQpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgaWYgKGEueSA+IGIueSB8fCAoYS55ID09PSBiLnkgJiYgYS54ID4gYi54KSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSBpZiAoYS55ID09PSBiLnkgJiYgYS54ID09PSBiLngpIHtcbiAgICAgICAgICAgIC8vIFdpdGhvdXQgdGhpcywgd2UgY2FuIGdldCBkaWZmZXJlbnQgc29ydCByZXN1bHRzIGluIElFIHZzLiBDaHJvbWUvRkZcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNvcnRMYXlvdXRJdGVtc0J5Q29sUm93KGxheW91dDogTGF5b3V0KTogTGF5b3V0IHtcbiAgICByZXR1cm4gKFtdIGFzIGFueVtdKS5jb25jYXQobGF5b3V0KS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIGlmIChhLnggPiBiLnggfHwgKGEueCA9PT0gYi54ICYmIGEueSA+IGIueSkpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSBhIGxheW91dC4gVGhyb3dzIGVycm9ycy5cbiAqXG4gKiBAcGFyYW0gIHtBcnJheX0gIGxheW91dCAgICAgICAgQXJyYXkgb2YgbGF5b3V0IGl0ZW1zLlxuICogQHBhcmFtICB7U3RyaW5nfSBbY29udGV4dE5hbWVdIENvbnRleHQgbmFtZSBmb3IgZXJyb3JzLlxuICogQHRocm93ICB7RXJyb3J9ICAgICAgICAgICAgICAgIFZhbGlkYXRpb24gZXJyb3IuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUxheW91dChcbiAgICBsYXlvdXQ6IExheW91dCxcbiAgICBjb250ZXh0TmFtZTogc3RyaW5nID0gJ0xheW91dCcsXG4pOiB2b2lkIHtcbiAgICBjb25zdCBzdWJQcm9wcyA9IFsneCcsICd5JywgJ3cnLCAnaCddO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShsYXlvdXQpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihjb250ZXh0TmFtZSArICcgbXVzdCBiZSBhbiBhcnJheSEnKTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGxheW91dC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBjb25zdCBpdGVtID0gbGF5b3V0W2ldO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHN1YlByb3BzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGl0ZW1bc3ViUHJvcHNbal1dICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgJ1JlYWN0R3JpZExheW91dDogJyArXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHROYW1lICtcbiAgICAgICAgICAgICAgICAgICAgJ1snICtcbiAgICAgICAgICAgICAgICAgICAgaSArXG4gICAgICAgICAgICAgICAgICAgICddLicgK1xuICAgICAgICAgICAgICAgICAgICBzdWJQcm9wc1tqXSArXG4gICAgICAgICAgICAgICAgICAgICcgbXVzdCBiZSBhIG51bWJlciEnLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0uaWQgJiYgdHlwZW9mIGl0ZW0uaWQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgJ1JlYWN0R3JpZExheW91dDogJyArXG4gICAgICAgICAgICAgICAgY29udGV4dE5hbWUgK1xuICAgICAgICAgICAgICAgICdbJyArXG4gICAgICAgICAgICAgICAgaSArXG4gICAgICAgICAgICAgICAgJ10uaSBtdXN0IGJlIGEgc3RyaW5nIScsXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpdGVtLnN0YXRpYyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBpdGVtLnN0YXRpYyAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgJ1JlYWN0R3JpZExheW91dDogJyArXG4gICAgICAgICAgICAgICAgY29udGV4dE5hbWUgK1xuICAgICAgICAgICAgICAgICdbJyArXG4gICAgICAgICAgICAgICAgaSArXG4gICAgICAgICAgICAgICAgJ10uc3RhdGljIG11c3QgYmUgYSBib29sZWFuIScsXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBGbG93IGNhbid0IHJlYWxseSBmaWd1cmUgdGhpcyBvdXQsIHNvIHdlIGp1c3QgdXNlIE9iamVjdFxuZXhwb3J0IGZ1bmN0aW9uIGF1dG9CaW5kSGFuZGxlcnMoZWw6IE9iamVjdCwgZm5zOiBBcnJheTxzdHJpbmc+KTogdm9pZCB7XG4gICAgZm5zLmZvckVhY2goa2V5ID0+IChlbFtrZXldID0gZWxba2V5XS5iaW5kKGVsKSkpO1xufVxuXG5mdW5jdGlvbiBsb2coLi4uYXJncykge1xuICAgIGlmICghREVCVUcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUubG9nKC4uLmFyZ3MpO1xufVxuXG5leHBvcnQgY29uc3Qgbm9vcCA9ICgpID0+IHt9O1xuIl19