import { iif, fromEvent, merge, Subject, Observable, BehaviorSubject, NEVER, interval, animationFrameScheduler, combineLatest, of } from 'rxjs';
import { filter, switchMap, startWith, exhaustMap, takeUntil, take, map, tap, distinctUntilChanged } from 'rxjs/operators';
import { InjectionToken, Directive, ElementRef, ɵɵdefineInjectable, ɵɵinject, NgZone, Injectable, Component, ChangeDetectionStrategy, Renderer2, Inject, ContentChildren, ViewChild, Input, EventEmitter, ViewEncapsulation, Output, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
function bottom(layout) {
    let max = 0, bottomY;
    for (let i = 0, len = layout.length; i < len; i++) {
        bottomY = layout[i].y + layout[i].h;
        if (bottomY > max) {
            max = bottomY;
        }
    }
    return max;
}
function cloneLayout(layout) {
    const newLayout = Array(layout.length);
    for (let i = 0, len = layout.length; i < len; i++) {
        newLayout[i] = cloneLayoutItem(layout[i]);
    }
    return newLayout;
}
// Fast path to cloning, since this is monomorphic
/** NOTE: This code has been modified from the original source */
function cloneLayoutItem(layoutItem) {
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
function collides(l1, l2) {
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
function compact(layout, compactType, cols) {
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
function compactItem(compareWith, l, compactType, cols, fullLayout) {
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
function correctBounds(layout, bounds) {
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
function getLayoutItem(layout, id) {
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
function getFirstCollision(layout, layoutItem) {
    for (let i = 0, len = layout.length; i < len; i++) {
        if (collides(layout[i], layoutItem)) {
            return layout[i];
        }
    }
    return null;
}
function getAllCollisions(layout, layoutItem) {
    return layout.filter(l => collides(l, layoutItem));
}
/**
 * Get all static elements.
 * @param  {Array} layout Array of layout objects.
 * @return {Array}        Array of static layout items..
 */
function getStatics(layout) {
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
function moveElement(layout, l, x, y, isUserAction, preventCollision, compactType, cols) {
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
function moveElementAwayFromCollision(layout, collidesWith, itemToMove, isUserAction, compactType, cols) {
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
function perc(num) {
    return num * 100 + '%';
}
function setTransform({ top, left, width, height }) {
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
function setTopLeft({ top, left, width, height }) {
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
function sortLayoutItems(layout, compactType) {
    if (compactType === 'horizontal') {
        return sortLayoutItemsByColRow(layout);
    }
    else {
        return sortLayoutItemsByRowCol(layout);
    }
}
function sortLayoutItemsByRowCol(layout) {
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
function sortLayoutItemsByColRow(layout) {
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
function validateLayout(layout, contextName = 'Layout') {
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
function autoBindHandlers(el, fns) {
    fns.forEach(key => (el[key] = el[key].bind(el)));
}
function log(...args) {
    if (!DEBUG) {
        return;
    }
    // eslint-disable-next-line no-console
    console.log(...args);
}
const noop = () => { };

/** Cached result of whether the user's browser supports passive event listeners. */
let supportsPassiveEvents;
/**
 * Checks whether the user's browser supports passive event listeners.
 * See: https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
 */
function ktdSupportsPassiveEventListeners() {
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
function ktdNormalizePassiveListenerOptions(options) {
    return ktdSupportsPassiveEventListeners() ? options : !!options.capture;
}

/** Options that can be used to bind a passive event listener. */
const passiveEventListenerOptions = ktdNormalizePassiveListenerOptions({ passive: true });
/** Options that can be used to bind an active event listener. */
const activeEventListenerOptions = ktdNormalizePassiveListenerOptions({ passive: false });
let isMobile = null;
function ktdIsMobileOrTablet() {
    if (isMobile != null) {
        return isMobile;
    }
    // Generic match pattern to identify mobile or tablet devices
    const isMobileDevice = /Android|webOS|BlackBerry|Windows Phone|iPad|iPhone|iPod/i.test(navigator.userAgent);
    // Since IOS 13 is not safe to just check for the generic solution. See: https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
    const isIOSMobileDevice = /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    isMobile = isMobileDevice || isIOSMobileDevice;
    return isMobile;
}
function ktdIsMouseEvent(event) {
    return event.clientX != null;
}
function ktdIsTouchEvent(event) {
    return event.touches != null && event.touches.length != null;
}
function ktdPointerClientX(event) {
    return ktdIsMouseEvent(event) ? event.clientX : event.touches[0].clientX;
}
function ktdPointerClientY(event) {
    return ktdIsMouseEvent(event) ? event.clientY : event.touches[0].clientY;
}
function ktdPointerClient(event) {
    return {
        clientX: ktdIsMouseEvent(event) ? event.clientX : event.touches[0].clientX,
        clientY: ktdIsMouseEvent(event) ? event.clientY : event.touches[0].clientY
    };
}
/**
 * Emits when a mousedown or touchstart emits. Avoids conflicts between both events.
 * @param element, html element where to  listen the events.
 * @param touchNumber number of the touch to track the event, default to the first one.
 */
function ktdMouseOrTouchDown(element, touchNumber = 1) {
    return iif(() => ktdIsMobileOrTablet(), fromEvent(element, 'touchstart', passiveEventListenerOptions).pipe(filter((touchEvent) => touchEvent.touches.length === touchNumber)), fromEvent(element, 'mousedown', activeEventListenerOptions).pipe(filter((mouseEvent) => {
        /**
         * 0 : Left mouse button
         * 1 : Wheel button or middle button (if present)
         * 2 : Right mouse button
         */
        return mouseEvent.button === 0; // Mouse down to be only fired if is left click
    })));
}
/**
 * Emits when a 'mousemove' or a 'touchmove' event gets fired.
 * @param element, html element where to  listen the events.
 * @param touchNumber number of the touch to track the event, default to the first one.
 */
function ktdMouseOrTouchMove(element, touchNumber = 1) {
    return iif(() => ktdIsMobileOrTablet(), fromEvent(element, 'touchmove', activeEventListenerOptions).pipe(filter((touchEvent) => touchEvent.touches.length === touchNumber)), fromEvent(element, 'mousemove', activeEventListenerOptions));
}
function ktdTouchEnd(element, touchNumber = 1) {
    return merge(fromEvent(element, 'touchend').pipe(filter((touchEvent) => touchEvent.touches.length === touchNumber - 1)), fromEvent(element, 'touchcancel').pipe(filter((touchEvent) => touchEvent.touches.length === touchNumber - 1)));
}
/**
 * Emits when a there is a 'mouseup' or the touch ends.
 * @param element, html element where to  listen the events.
 * @param touchNumber number of the touch to track the event, default to the first one.
 */
function ktdMouseOrTouchEnd(element, touchNumber = 1) {
    return iif(() => ktdIsMobileOrTablet(), ktdTouchEnd(element, touchNumber), fromEvent(element, 'mouseup'));
}

/** Tracks items by id. This function is mean to be used in conjunction with the ngFor that renders the 'ktd-grid-items' */
function ktdTrackById(index, item) {
    return item.id;
}
/**
 * Call react-grid-layout utils 'compact()' function and return the compacted layout.
 * @param layout to be compacted.
 * @param compactType, type of compaction.
 * @param cols, number of columns of the grid.
 */
function ktdGridCompact(layout, compactType, cols) {
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
function ktdGetGridLayoutDiff(gridLayoutA, gridLayoutB) {
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
function ktdGridItemDragging(gridItemId, config, compactionType, draggingData) {
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
function ktdGridItemResizing(gridItemId, config, compactionType, draggingData) {
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

/**
 * Injection token that can be used to reference instances of `KtdGridDragHandle`. It serves as
 * alternative token to the actual `KtdGridDragHandle` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
const KTD_GRID_DRAG_HANDLE = new InjectionToken('KtdGridDragHandle');
/** Handle that can be used to drag a KtdGridItem instance. */
// tslint:disable-next-line:directive-class-suffix
class KtdGridDragHandle {
    constructor(element) {
        this.element = element;
    }
}
KtdGridDragHandle.decorators = [
    { type: Directive, args: [{
                selector: '[ktdGridDragHandle]',
                host: {
                    class: 'ktd-grid-drag-handle'
                },
                providers: [{ provide: KTD_GRID_DRAG_HANDLE, useExisting: KtdGridDragHandle }],
            },] }
];
KtdGridDragHandle.ctorParameters = () => [
    { type: ElementRef }
];

/**
 * Injection token that can be used to reference instances of `KtdGridResizeHandle`. It serves as
 * alternative token to the actual `KtdGridResizeHandle` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
const KTD_GRID_RESIZE_HANDLE = new InjectionToken('KtdGridResizeHandle');
/** Handle that can be used to drag a KtdGridItem instance. */
class KtdGridResizeHandle {
    constructor(element) {
        this.element = element;
    }
}
KtdGridResizeHandle.decorators = [
    { type: Directive, args: [{
                selector: '[ktdGridResizeHandle]',
                host: {
                    class: 'ktd-grid-resize-handle'
                },
                providers: [{ provide: KTD_GRID_RESIZE_HANDLE, useExisting: KtdGridResizeHandle }],
            },] }
];
KtdGridResizeHandle.ctorParameters = () => [
    { type: ElementRef }
];

const GRID_ITEM_GET_RENDER_DATA_TOKEN = new InjectionToken('GRID_ITEM_GET_RENDER_DATA_TOKEN');

/** Event options that can be used to bind an active, capturing event. */
const activeCapturingEventOptions = ktdNormalizePassiveListenerOptions({
    passive: false,
    capture: true
});
class KtdGridService {
    constructor(ngZone) {
        this.ngZone = ngZone;
        this.touchMoveSubject = new Subject();
        this.touchMove$ = this.touchMoveSubject.asObservable();
        this.registerTouchMoveSubscription();
    }
    ngOnDestroy() {
        this.touchMoveSubscription.unsubscribe();
    }
    mouseOrTouchMove$(element) {
        return iif(() => ktdIsMobileOrTablet(), this.touchMove$, fromEvent(element, 'mousemove', activeCapturingEventOptions) // TODO: Fix rxjs typings, boolean should be a good param too.
        );
    }
    registerTouchMoveSubscription() {
        // The `touchmove` event gets bound once, ahead of time, because WebKit
        // won't preventDefault on a dynamically-added `touchmove` listener.
        // See https://bugs.webkit.org/show_bug.cgi?id=184250.
        this.touchMoveSubscription = this.ngZone.runOutsideAngular(() => 
        // The event handler has to be explicitly active,
        // because newer browsers make it passive by default.
        fromEvent(document, 'touchmove', activeCapturingEventOptions) // TODO: Fix rxjs typings, boolean should be a good param too.
            .pipe(filter((touchEvent) => touchEvent.touches.length === 1))
            .subscribe((touchEvent) => this.touchMoveSubject.next(touchEvent)));
    }
}
KtdGridService.ɵprov = ɵɵdefineInjectable({ factory: function KtdGridService_Factory() { return new KtdGridService(ɵɵinject(NgZone)); }, token: KtdGridService, providedIn: "root" });
KtdGridService.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
KtdGridService.ctorParameters = () => [
    { type: NgZone }
];

/** Runs source observable outside the zone */
function ktdOutsideZone(zone) {
    return (source) => {
        return new Observable(observer => {
            return zone.runOutsideAngular(() => source.subscribe(observer));
        });
    };
}
/** Rxjs operator that makes source observable to no emit any data */
function ktdNoEmit() {
    return (source$) => {
        return source$.pipe(filter(() => false));
    };
}

/** Coerces a data-bound value (typically a string) to a boolean. */
function coerceBooleanProperty(value) {
    return value != null && `${value}` !== 'false';
}

function coerceNumberProperty(value, fallbackValue = 0) {
    return _isNumberValue(value) ? Number(value) : fallbackValue;
}
/**
 * Whether the provided value is considered a number.
 * @docs-private
 */
function _isNumberValue(value) {
    // parseFloat(value) handles most of the cases we're interested in (it treats null, empty string,
    // and other non-number values as NaN, where Number just uses 0) but it considers the string
    // '123hello' to be a valid number. Therefore we also check if Number(value) is NaN.
    return !isNaN(parseFloat(value)) && !isNaN(Number(value));
}

class KtdGridItemComponent {
    constructor(elementRef, gridService, renderer, ngZone, getItemRenderData) {
        this.elementRef = elementRef;
        this.gridService = gridService;
        this.renderer = renderer;
        this.ngZone = ngZone;
        this.getItemRenderData = getItemRenderData;
        /** CSS transition style. Note that for more performance is preferable only make transition on transform property. */
        this.transition = 'transform 500ms ease, width 500ms ease, height 500ms ease';
        this._dragStartThreshold = 0;
        this._draggable = true;
        this._draggable$ = new BehaviorSubject(this._draggable);
        this._resizable = true;
        this._resizable$ = new BehaviorSubject(this._resizable);
        this.dragStartSubject = new Subject();
        this.resizeStartSubject = new Subject();
        this.subscriptions = [];
        this.dragStart$ = this.dragStartSubject.asObservable();
        this.resizeStart$ = this.resizeStartSubject.asObservable();
    }
    /** Id of the grid item. This property is strictly compulsory. */
    get id() {
        return this._id;
    }
    set id(val) {
        this._id = val;
    }
    /** Minimum amount of pixels that the user should move before it starts the drag sequence. */
    get dragStartThreshold() { return this._dragStartThreshold; }
    set dragStartThreshold(val) {
        this._dragStartThreshold = coerceNumberProperty(val);
    }
    /** Whether the item is draggable or not. Defaults to true. */
    get draggable() {
        return this._draggable;
    }
    set draggable(val) {
        this._draggable = coerceBooleanProperty(val);
        this._draggable$.next(this._draggable);
    }
    /** Whether the item is resizable or not. Defaults to true. */
    get resizable() {
        return this._resizable;
    }
    set resizable(val) {
        this._resizable = coerceBooleanProperty(val);
        this._resizable$.next(this._resizable);
    }
    ngOnInit() {
        const gridItemRenderData = this.getItemRenderData(this.id);
        this.setStyles(gridItemRenderData);
    }
    ngAfterContentInit() {
        this.subscriptions.push(this._dragStart$().subscribe(this.dragStartSubject), this._resizeStart$().subscribe(this.resizeStartSubject));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    setStyles({ top, left, width, height }) {
        // transform is 6x times faster than top/left
        this.renderer.setStyle(this.elementRef.nativeElement, 'transform', `translateX(${left}) translateY(${top})`);
        this.renderer.setStyle(this.elementRef.nativeElement, 'display', `block`);
        this.renderer.setStyle(this.elementRef.nativeElement, 'transition', this.transition);
        if (width != null) {
            this.renderer.setStyle(this.elementRef.nativeElement, 'width', width);
        }
        if (height != null) {
            this.renderer.setStyle(this.elementRef.nativeElement, 'height', height);
        }
    }
    _dragStart$() {
        return this._draggable$.pipe(switchMap((draggable) => {
            if (!draggable) {
                return NEVER;
            }
            else {
                return this._dragHandles.changes.pipe(startWith(this._dragHandles), switchMap((dragHandles) => {
                    return iif(() => dragHandles.length > 0, merge(...dragHandles.toArray().map(dragHandle => ktdMouseOrTouchDown(dragHandle.element.nativeElement, 1))), ktdMouseOrTouchDown(this.elementRef.nativeElement, 1)).pipe(exhaustMap((startEvent) => {
                        // If the event started from an element with the native HTML drag&drop, it'll interfere
                        // with our own dragging (e.g. `img` tags do it by default). Prevent the default action
                        // to stop it from happening. Note that preventing on `dragstart` also seems to work, but
                        // it's flaky and it fails if the user drags it away quickly. Also note that we only want
                        // to do this for `mousedown` since doing the same for `touchstart` will stop any `click`
                        // events from firing on touch devices.
                        if (startEvent.target && startEvent.target.draggable && startEvent.type === 'mousedown') {
                            startEvent.preventDefault();
                        }
                        const startPointer = ktdPointerClient(startEvent);
                        return this.gridService.mouseOrTouchMove$(document).pipe(takeUntil(ktdMouseOrTouchEnd(document, 1)), ktdOutsideZone(this.ngZone), filter((moveEvent) => {
                            moveEvent.preventDefault();
                            const movePointer = ktdPointerClient(moveEvent);
                            const distanceX = Math.abs(startPointer.clientX - movePointer.clientX);
                            const distanceY = Math.abs(startPointer.clientY - movePointer.clientY);
                            // When this conditions returns true mean that we are over threshold.
                            return distanceX + distanceY >= this.dragStartThreshold;
                        }), take(1), 
                        // Return the original start event
                        map(() => startEvent));
                    }));
                }));
            }
        }));
    }
    _resizeStart$() {
        return this._resizable$.pipe(switchMap((resizable) => {
            if (!resizable) {
                // Side effect to hide the resizeElem if resize is disabled.
                this.renderer.setStyle(this.resizeElem.nativeElement, 'display', 'none');
                return NEVER;
            }
            else {
                return this._resizeHandles.changes.pipe(startWith(this._resizeHandles), switchMap((resizeHandles) => {
                    if (resizeHandles.length > 0) {
                        // Side effect to hide the resizeElem if there are resize handles.
                        this.renderer.setStyle(this.resizeElem.nativeElement, 'display', 'none');
                        return merge(...resizeHandles.toArray().map(resizeHandle => ktdMouseOrTouchDown(resizeHandle.element.nativeElement, 1)));
                    }
                    else {
                        this.renderer.setStyle(this.resizeElem.nativeElement, 'display', 'block');
                        return ktdMouseOrTouchDown(this.resizeElem.nativeElement, 1);
                    }
                }));
            }
        }));
    }
}
KtdGridItemComponent.decorators = [
    { type: Component, args: [{
                selector: 'ktd-grid-item',
                template: "<ng-content></ng-content>\n<div #resizeElem class=\"grid-item-resize-icon\"></div>\n",
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [":host{display:none;overflow:hidden;z-index:1}:host,:host div{position:absolute}:host div{-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;user-select:none;z-index:10}:host div.grid-item-resize-icon{bottom:0;color:inherit;cursor:se-resize;height:20px;right:0;width:20px}:host div.grid-item-resize-icon:after{border-bottom:2px solid;border-right:2px solid;bottom:3px;content:\"\";height:5px;position:absolute;right:3px;width:5px}.display-none{display:none!important}"]
            },] }
];
KtdGridItemComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: KtdGridService },
    { type: Renderer2 },
    { type: NgZone },
    { type: undefined, decorators: [{ type: Inject, args: [GRID_ITEM_GET_RENDER_DATA_TOKEN,] }] }
];
KtdGridItemComponent.propDecorators = {
    _dragHandles: [{ type: ContentChildren, args: [KTD_GRID_DRAG_HANDLE, { descendants: true },] }],
    _resizeHandles: [{ type: ContentChildren, args: [KTD_GRID_RESIZE_HANDLE, { descendants: true },] }],
    resizeElem: [{ type: ViewChild, args: ['resizeElem', { static: true, read: ElementRef },] }],
    transition: [{ type: Input }],
    id: [{ type: Input }],
    dragStartThreshold: [{ type: Input }],
    draggable: [{ type: Input }],
    resizable: [{ type: Input }]
};

// tslint:disable
/**
 * Client rect utilities.
 * This file is taken from Angular Material repository. This is the reason why the tslint is disabled on this case.
 * Don't enable it until some custom change is done on this file.
 */
/** Gets a mutable version of an element's bounding `ClientRect`. */
function getMutableClientRect(element) {
    const clientRect = element.getBoundingClientRect();
    // We need to clone the `clientRect` here, because all the values on it are readonly
    // and we need to be able to update them. Also we can't use a spread here, because
    // the values on a `ClientRect` aren't own properties. See:
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect#Notes
    return {
        top: clientRect.top,
        right: clientRect.right,
        bottom: clientRect.bottom,
        left: clientRect.left,
        width: clientRect.width,
        height: clientRect.height
    };
}
/**
 * Checks whether some coordinates are within a `ClientRect`.
 * @param clientRect ClientRect that is being checked.
 * @param x Coordinates along the X axis.
 * @param y Coordinates along the Y axis.
 */
function isInsideClientRect(clientRect, x, y) {
    const { top, bottom, left, right } = clientRect;
    return y >= top && y <= bottom && x >= left && x <= right;
}
/**
 * Updates the top/left positions of a `ClientRect`, as well as their bottom/right counterparts.
 * @param clientRect `ClientRect` that should be updated.
 * @param top Amount to add to the `top` position.
 * @param left Amount to add to the `left` position.
 */
function adjustClientRect(clientRect, top, left) {
    clientRect.top += top;
    clientRect.bottom = clientRect.top + clientRect.height;
    clientRect.left += left;
    clientRect.right = clientRect.left + clientRect.width;
}
/**
 * Checks whether the pointer coordinates are close to a ClientRect.
 * @param rect ClientRect to check against.
 * @param threshold Threshold around the ClientRect.
 * @param pointerX Coordinates along the X axis.
 * @param pointerY Coordinates along the Y axis.
 */
function isPointerNearClientRect(rect, threshold, pointerX, pointerY) {
    const { top, right, bottom, left, width, height } = rect;
    const xThreshold = width * threshold;
    const yThreshold = height * threshold;
    return pointerY > top - yThreshold && pointerY < bottom + yThreshold &&
        pointerX > left - xThreshold && pointerX < right + xThreshold;
}

/**
 * Proximity, as a ratio to width/height at which to start auto-scrolling.
 * The value comes from trying it out manually until it feels right.
 */
const SCROLL_PROXIMITY_THRESHOLD = 0.05;
/**
 * Increments the vertical scroll position of a node.
 * @param node Node whose scroll position should change.
 * @param amount Amount of pixels that the `node` should be scrolled.
 */
function incrementVerticalScroll(node, amount) {
    if (node === window) {
        node.scrollBy(0, amount);
    }
    else {
        // Ideally we could use `Element.scrollBy` here as well, but IE and Edge don't support it.
        node.scrollTop += amount;
    }
}
/**
 * Increments the horizontal scroll position of a node.
 * @param node Node whose scroll position should change.
 * @param amount Amount of pixels that the `node` should be scrolled.
 */
function incrementHorizontalScroll(node, amount) {
    if (node === window) {
        node.scrollBy(amount, 0);
    }
    else {
        // Ideally we could use `Element.scrollBy` here as well, but IE and Edge don't support it.
        node.scrollLeft += amount;
    }
}
/**
 * Gets whether the vertical auto-scroll direction of a node.
 * @param clientRect Dimensions of the node.
 * @param pointerY Position of the user's pointer along the y axis.
 */
function getVerticalScrollDirection(clientRect, pointerY) {
    const { top, bottom, height } = clientRect;
    const yThreshold = height * SCROLL_PROXIMITY_THRESHOLD;
    if (pointerY >= top - yThreshold && pointerY <= top + yThreshold) {
        return 1 /* UP */;
    }
    else if (pointerY >= bottom - yThreshold && pointerY <= bottom + yThreshold) {
        return 2 /* DOWN */;
    }
    return 0 /* NONE */;
}
/**
 * Gets whether the horizontal auto-scroll direction of a node.
 * @param clientRect Dimensions of the node.
 * @param pointerX Position of the user's pointer along the x axis.
 */
function getHorizontalScrollDirection(clientRect, pointerX) {
    const { left, right, width } = clientRect;
    const xThreshold = width * SCROLL_PROXIMITY_THRESHOLD;
    if (pointerX >= left - xThreshold && pointerX <= left + xThreshold) {
        return 1 /* LEFT */;
    }
    else if (pointerX >= right - xThreshold && pointerX <= right + xThreshold) {
        return 2 /* RIGHT */;
    }
    return 0 /* NONE */;
}
/**
 * Returns an observable that schedules a loop and apply scroll on the scrollNode into the specified direction/s.
 * This observable doesn't emit, it just performs the 'scroll' side effect.
 * @param scrollNode, node where the scroll would be applied.
 * @param verticalScrollDirection, vertical direction of the scroll.
 * @param horizontalScrollDirection, horizontal direction of the scroll.
 * @param scrollStep, scroll step in CSS pixels that would be applied in every loop.
 */
function scrollToDirectionInterval$(scrollNode, verticalScrollDirection, horizontalScrollDirection, scrollStep = 2) {
    return interval(0, animationFrameScheduler)
        .pipe(tap(() => {
        if (verticalScrollDirection === 1 /* UP */) {
            incrementVerticalScroll(scrollNode, -scrollStep);
        }
        else if (verticalScrollDirection === 2 /* DOWN */) {
            incrementVerticalScroll(scrollNode, scrollStep);
        }
        if (horizontalScrollDirection === 1 /* LEFT */) {
            incrementHorizontalScroll(scrollNode, -scrollStep);
        }
        else if (horizontalScrollDirection === 2 /* RIGHT */) {
            incrementHorizontalScroll(scrollNode, scrollStep);
        }
    }), ktdNoEmit());
}
/**
 * Given a source$ observable with pointer location, scroll the scrollNode if the pointer is near to it.
 * This observable doesn't emit, it just performs a 'scroll' side effect.
 * @param scrollableParent, parent node in which the scroll would be performed.
 * @param options, configuration options.
 */
function ktdScrollIfNearElementClientRect$(scrollableParent, options) {
    let scrollNode;
    let scrollableParentClientRect;
    let scrollableParentScrollWidth;
    if (scrollableParent === document) {
        scrollNode = document.defaultView;
        const { width, height } = getViewportSize();
        scrollableParentClientRect = { width, height, top: 0, right: width, bottom: height, left: 0 };
        scrollableParentScrollWidth = getDocumentScrollWidth();
    }
    else {
        scrollNode = scrollableParent;
        scrollableParentClientRect = getMutableClientRect(scrollableParent);
        scrollableParentScrollWidth = scrollableParent.scrollWidth;
    }
    /**
     * IMPORTANT: By design, only let scroll horizontal if the scrollable parent has explicitly an scroll horizontal.
     * This layout solution is not designed in mind to have any scroll horizontal, but exceptionally we allow it in this
     * specific use case.
     */
    options = options || {};
    if (options.disableHorizontal == null && scrollableParentScrollWidth <= scrollableParentClientRect.width) {
        options.disableHorizontal = true;
    }
    return (source$) => source$.pipe(map(({ pointerX, pointerY }) => {
        let verticalScrollDirection = getVerticalScrollDirection(scrollableParentClientRect, pointerY);
        let horizontalScrollDirection = getHorizontalScrollDirection(scrollableParentClientRect, pointerX);
        // Check if scroll directions are disabled.
        if (options === null || options === void 0 ? void 0 : options.disableVertical) {
            verticalScrollDirection = 0 /* NONE */;
        }
        if (options === null || options === void 0 ? void 0 : options.disableHorizontal) {
            horizontalScrollDirection = 0 /* NONE */;
        }
        return { verticalScrollDirection, horizontalScrollDirection };
    }), distinctUntilChanged((prev, actual) => {
        return prev.verticalScrollDirection === actual.verticalScrollDirection
            && prev.horizontalScrollDirection === actual.horizontalScrollDirection;
    }), switchMap(({ verticalScrollDirection, horizontalScrollDirection }) => {
        if (verticalScrollDirection || horizontalScrollDirection) {
            return scrollToDirectionInterval$(scrollNode, verticalScrollDirection, horizontalScrollDirection, options === null || options === void 0 ? void 0 : options.scrollStep);
        }
        else {
            return NEVER;
        }
    }));
}
/**
 * Emits on EVERY scroll event and returns the accumulated scroll offset relative to the initial scroll position.
 * @param scrollableParent, node in which scroll events would be listened.
 */
function ktdGetScrollTotalRelativeDifference$(scrollableParent) {
    let scrollInitialPosition;
    // Calculate initial scroll position
    if (scrollableParent === document) {
        scrollInitialPosition = getViewportScrollPosition();
    }
    else {
        scrollInitialPosition = {
            top: scrollableParent.scrollTop,
            left: scrollableParent.scrollLeft
        };
    }
    return fromEvent(scrollableParent, 'scroll', ktdNormalizePassiveListenerOptions({ capture: true })).pipe(map(() => {
        let newTop;
        let newLeft;
        if (scrollableParent === document) {
            const viewportScrollPosition = getViewportScrollPosition();
            newTop = viewportScrollPosition.top;
            newLeft = viewportScrollPosition.left;
        }
        else {
            newTop = scrollableParent.scrollTop;
            newLeft = scrollableParent.scrollLeft;
        }
        const topDifference = scrollInitialPosition.top - newTop;
        const leftDifference = scrollInitialPosition.left - newLeft;
        return { top: topDifference, left: leftDifference };
    }));
}
/** Returns the viewport's width and height. */
function getViewportSize() {
    const _window = document.defaultView || window;
    return {
        width: _window.innerWidth,
        height: _window.innerHeight
    };
}
/** Gets a ClientRect for the viewport's bounds. */
function getViewportRect() {
    // Use the document element's bounding rect rather than the window scroll properties
    // (e.g. pageYOffset, scrollY) due to in issue in Chrome and IE where window scroll
    // properties and client coordinates (boundingClientRect, clientX/Y, etc.) are in different
    // conceptual viewports. Under most circumstances these viewports are equivalent, but they
    // can disagree when the page is pinch-zoomed (on devices that support touch).
    // See https://bugs.chromium.org/p/chromium/issues/detail?id=489206#c4
    // We use the documentElement instead of the body because, by default (without a css reset)
    // browsers typically give the document body an 8px margin, which is not included in
    // getBoundingClientRect().
    const scrollPosition = getViewportScrollPosition();
    const { width, height } = getViewportSize();
    return {
        top: scrollPosition.top,
        left: scrollPosition.left,
        bottom: scrollPosition.top + height,
        right: scrollPosition.left + width,
        height,
        width,
    };
}
/** Gets the (top, left) scroll position of the viewport. */
function getViewportScrollPosition() {
    // The top-left-corner of the viewport is determined by the scroll position of the document
    // body, normally just (scrollLeft, scrollTop). However, Chrome and Firefox disagree about
    // whether `document.body` or `document.documentElement` is the scrolled element, so reading
    // `scrollTop` and `scrollLeft` is inconsistent. However, using the bounding rect of
    // `document.documentElement` works consistently, where the `top` and `left` values will
    // equal negative the scroll position.
    const windowRef = document.defaultView || window;
    const documentElement = document.documentElement;
    const documentRect = documentElement.getBoundingClientRect();
    const top = -documentRect.top || document.body.scrollTop || windowRef.scrollY ||
        documentElement.scrollTop || 0;
    const left = -documentRect.left || document.body.scrollLeft || windowRef.scrollX ||
        documentElement.scrollLeft || 0;
    return { top, left };
}
/** Returns the document scroll width */
function getDocumentScrollWidth() {
    return Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
}

function getDragResizeEventData(gridItem, layout) {
    return {
        layout,
        layoutItem: layout.find((item) => item.id === gridItem.id),
        gridItemRef: gridItem
    };
}
function layoutToRenderItems(config, width, height) {
    const { cols, rowHeight, layout } = config;
    const renderItems = {};
    for (const item of layout) {
        renderItems[item.id] = {
            id: item.id,
            top: item.y === 0 ? 0 : item.y * rowHeight,
            left: item.x * (width / cols),
            width: item.w * (width / cols),
            height: item.h * rowHeight
        };
    }
    return renderItems;
}
function getGridHeight(layout, rowHeight) {
    return layout.reduce((acc, cur) => Math.max(acc, (cur.y + cur.h) * rowHeight), 0);
}
// tslint:disable-next-line
function parseRenderItemToPixels(renderItem) {
    return {
        id: renderItem.id,
        top: `${renderItem.top}px`,
        left: `${renderItem.left}px`,
        width: `${renderItem.width}px`,
        height: `${renderItem.height}px`
    };
}
// tslint:disable-next-line:ktd-prefix-code
function __gridItemGetRenderDataFactoryFunc(gridCmp) {
    // tslint:disable-next-line:only-arrow-functions
    return function (id) {
        return parseRenderItemToPixels(gridCmp.getItemRenderData(id));
    };
}
function ktdGridItemGetRenderDataFactoryFunc(gridCmp) {
    // Workaround explained: https://github.com/ng-packagr/ng-packagr/issues/696#issuecomment-387114613
    const resultFunc = __gridItemGetRenderDataFactoryFunc(gridCmp);
    return resultFunc;
}
class KtdGridComponent {
    constructor(gridService, elementRef, renderer, ngZone) {
        this.gridService = gridService;
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.ngZone = ngZone;
        /** Emits when layout change */
        this.layoutUpdated = new EventEmitter();
        /** Emits when drag starts */
        this.dragStarted = new EventEmitter();
        /** Emits when resize starts */
        this.resizeStarted = new EventEmitter();
        /** Emits when drag ends */
        this.dragEnded = new EventEmitter();
        /** Emits when resize ends */
        this.resizeEnded = new EventEmitter();
        /**
         * Parent element that contains the scroll. If an string is provided it would search that element by id on the dom.
         * If no data provided or null autoscroll is not performed.
         */
        this.scrollableParent = null;
        this._compactOnPropsChange = true;
        this._preventCollision = false;
        this._scrollSpeed = 2;
        this._compactType = 'vertical';
        this._rowHeight = 100;
        this._cols = 6;
    }
    /** Whether or not to update the internal layout when some dependent property change. */
    get compactOnPropsChange() { return this._compactOnPropsChange; }
    set compactOnPropsChange(value) {
        this._compactOnPropsChange = coerceBooleanProperty(value);
    }
    /** If true, grid items won't change position when being dragged over. Handy when using no compaction */
    get preventCollision() { return this._preventCollision; }
    set preventCollision(value) {
        this._preventCollision = coerceBooleanProperty(value);
    }
    /** Number of CSS pixels that would be scrolled on each 'tick' when auto scroll is performed. */
    get scrollSpeed() { return this._scrollSpeed; }
    set scrollSpeed(value) {
        this._scrollSpeed = coerceNumberProperty(value, 2);
    }
    /** Type of compaction that will be applied to the layout (vertical, horizontal or free). Defaults to 'vertical' */
    get compactType() {
        return this._compactType;
    }
    set compactType(val) {
        this._compactType = val;
    }
    /** Row height in css pixels */
    get rowHeight() { return this._rowHeight; }
    set rowHeight(val) {
        this._rowHeight = Math.max(1, Math.round(coerceNumberProperty(val)));
    }
    /** Number of columns  */
    get cols() { return this._cols; }
    set cols(val) {
        this._cols = Math.max(1, Math.round(coerceNumberProperty(val)));
    }
    /** Layout of the grid. Array of all the grid items with its 'id' and position on the grid. */
    get layout() { return this._layout; }
    set layout(layout) {
        /**
         * Enhancement:
         * Only set layout if it's reference has changed and use a boolean to track whenever recalculate the layout on ngOnChanges.
         *
         * Why:
         * The normal use of this lib is having the variable layout in the outer component or in a store, assigning it whenever it changes and
         * binded in the component with it's input [layout]. In this scenario, we would always calculate one unnecessary change on the layout when
         * it is re-binded on the input.
         */
        this._layout = layout;
    }
    get config() {
        return {
            cols: this.cols,
            rowHeight: this.rowHeight,
            layout: this.layout,
            preventCollision: this.preventCollision,
        };
    }
    ngOnChanges(changes) {
        let needsCompactLayout = false;
        let needsRecalculateRenderData = false;
        // TODO: Does fist change need to be compacted by default?
        // Compact layout whenever some dependent prop changes.
        if (changes.compactType || changes.cols || changes.layout) {
            needsCompactLayout = true;
        }
        // Check if wee need to recalculate rendering data.
        if (needsCompactLayout || changes.rowHeight) {
            needsRecalculateRenderData = true;
        }
        // Only compact layout if lib user has provided it. Lib users that want to save/store always the same layout  as it is represented (compacted)
        // can use KtdCompactGrid utility and pre-compact the layout. This is the recommended behaviour for always having a the same layout on this component
        // and the ones that uses it.
        if (needsCompactLayout && this.compactOnPropsChange) {
            this.compactLayout();
        }
        if (needsRecalculateRenderData) {
            this.calculateRenderData();
        }
    }
    ngAfterContentInit() {
        this.initSubscriptions();
    }
    ngAfterContentChecked() {
        this.render();
    }
    resize() {
        this.calculateRenderData();
        this.render();
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    compactLayout() {
        this.layout = compact(this.layout, this.compactType, this.cols);
    }
    getItemsRenderData() {
        return Object.assign({}, this._gridItemsRenderData);
    }
    getItemRenderData(itemId) {
        return this._gridItemsRenderData[itemId];
    }
    calculateRenderData() {
        const clientRect = this.elementRef.nativeElement.getBoundingClientRect();
        this._gridItemsRenderData = layoutToRenderItems(this.config, clientRect.width, clientRect.height);
        this._height = getGridHeight(this.layout, this.rowHeight);
    }
    render() {
        this.renderer.setStyle(this.elementRef.nativeElement, 'height', `${this._height}px`);
        this.updateGridItemsStyles();
    }
    updateGridItemsStyles() {
        this._gridItems.forEach(item => {
            const gridItemRenderData = this._gridItemsRenderData[item.id];
            if (gridItemRenderData == null) {
                console.error(`Couldn\'t find the specified grid item for the id: ${item.id}`);
            }
            else {
                item.setStyles(parseRenderItemToPixels(gridItemRenderData));
            }
        });
    }
    initSubscriptions() {
        this.subscriptions = [
            this._gridItems.changes.pipe(startWith(this._gridItems), switchMap((gridItems) => {
                return merge(...gridItems.map((gridItem) => gridItem.dragStart$.pipe(map((event) => ({ event, gridItem, type: 'drag' })))), ...gridItems.map((gridItem) => gridItem.resizeStart$.pipe(map((event) => ({ event, gridItem, type: 'resize' }))))).pipe(exhaustMap(({ event, gridItem, type }) => {
                    // Emit drag or resize start events. Ensure that is start event is inside the zone.
                    this.ngZone.run(() => (type === 'drag' ? this.dragStarted : this.resizeStarted).emit(getDragResizeEventData(gridItem, this.layout)));
                    // Get the correct newStateFunc depending on if we are dragging or resizing
                    const calcNewStateFunc = type === 'drag' ? ktdGridItemDragging : ktdGridItemResizing;
                    // Perform drag sequence
                    return this.performDragSequence$(gridItem, event, (gridItemId, config, compactionType, draggingData) => calcNewStateFunc(gridItemId, config, compactionType, draggingData)).pipe(map((layout) => ({ layout, gridItem, type })));
                }));
            })).subscribe(({ layout, gridItem, type }) => {
                this.layout = layout;
                // Calculate new rendering data given the new layout.
                this.calculateRenderData();
                // Emit drag or resize end events.
                (type === 'drag' ? this.dragEnded : this.resizeEnded).emit(getDragResizeEventData(gridItem, layout));
                // Notify that the layout has been updated.
                this.layoutUpdated.emit(layout);
            })
        ];
    }
    /**
     * Perform a general grid drag action, from start to end. A general grid drag action basically includes creating the placeholder element and adding
     * some class animations. calcNewStateFunc needs to be provided in order to calculate the new state of the layout.
     * @param gridItem that is been dragged
     * @param pointerDownEvent event (mousedown or touchdown) where the user initiated the drag
     * @param calcNewStateFunc function that return the new layout state and the drag element position
     */
    performDragSequence$(gridItem, pointerDownEvent, calcNewStateFunc) {
        return new Observable((observer) => {
            // Retrieve grid (parent) and gridItem (draggedElem) client rects.
            const gridElemClientRect = getMutableClientRect(this.elementRef.nativeElement);
            const dragElemClientRect = getMutableClientRect(gridItem.elementRef.nativeElement);
            const scrollableParent = typeof this.scrollableParent === 'string' ? document.getElementById(this.scrollableParent) : this.scrollableParent;
            this.renderer.addClass(gridItem.elementRef.nativeElement, 'no-transitions');
            this.renderer.addClass(gridItem.elementRef.nativeElement, 'ktd-grid-item-dragging');
            // Create placeholder element. This element would represent the position where the dragged/resized element would be if the action ends
            const placeholderElement = this.renderer.createElement('div');
            placeholderElement.style.width = `${dragElemClientRect.width}px`;
            placeholderElement.style.height = `${dragElemClientRect.height}px`;
            placeholderElement.style.transform = `translateX(${dragElemClientRect.left - gridElemClientRect.left}px) translateY(${dragElemClientRect.top - gridElemClientRect.top}px)`;
            this.renderer.addClass(placeholderElement, 'ktd-grid-item-placeholder');
            this.renderer.appendChild(this.elementRef.nativeElement, placeholderElement);
            let newLayout;
            // TODO (enhancement): consider move this 'side effect' observable inside the main drag loop.
            //  - Pros are that we would not repeat subscriptions and takeUntil would shut down observables at the same time.
            //  - Cons are that moving this functionality as a side effect inside the main drag loop would be confusing.
            const scrollSubscription = this.ngZone.runOutsideAngular(() => (!scrollableParent ? NEVER : this.gridService.mouseOrTouchMove$(document).pipe(map((event) => ({
                pointerX: ktdPointerClientX(event),
                pointerY: ktdPointerClientY(event)
            })), ktdScrollIfNearElementClientRect$(scrollableParent, { scrollStep: this.scrollSpeed }))).pipe(takeUntil(ktdMouseOrTouchEnd(document))).subscribe());
            /**
             * Main subscription, it listens for 'pointer move' and 'scroll' events and recalculates the layout on each emission
             */
            const subscription = this.ngZone.runOutsideAngular(() => merge(combineLatest([
                this.gridService.mouseOrTouchMove$(document),
                ...(!scrollableParent ? [of({ top: 0, left: 0 })] : [
                    ktdGetScrollTotalRelativeDifference$(scrollableParent).pipe(startWith({ top: 0, left: 0 }) // Force first emission to allow CombineLatest to emit even no scroll event has occurred
                    )
                ])
            ])).pipe(takeUntil(ktdMouseOrTouchEnd(document))).subscribe(([pointerDragEvent, scrollDifference]) => {
                pointerDragEvent.preventDefault();
                /**
                 * Set the new layout to be the layout in which the calcNewStateFunc would be executed.
                 * NOTE: using the mutated layout is the way to go by 'react-grid-layout' utils. If we don't use the previous layout,
                 * some utilities from 'react-grid-layout' would not work as expected.
                 */
                const currentLayout = newLayout || this.layout;
                const { layout, draggedItemPos } = calcNewStateFunc(gridItem.id, {
                    layout: currentLayout,
                    rowHeight: this.rowHeight,
                    cols: this.cols,
                    preventCollision: this.preventCollision
                }, this.compactType, {
                    pointerDownEvent,
                    pointerDragEvent,
                    gridElemClientRect,
                    dragElemClientRect,
                    scrollDifference
                });
                newLayout = layout;
                this._height = getGridHeight(newLayout, this.rowHeight);
                this._gridItemsRenderData = layoutToRenderItems({
                    cols: this.cols,
                    rowHeight: this.rowHeight,
                    layout: newLayout,
                    preventCollision: this.preventCollision,
                }, gridElemClientRect.width, gridElemClientRect.height);
                const placeholderStyles = parseRenderItemToPixels(this._gridItemsRenderData[gridItem.id]);
                // Put the real final position to the placeholder element
                placeholderElement.style.width = placeholderStyles.width;
                placeholderElement.style.height = placeholderStyles.height;
                placeholderElement.style.transform = `translateX(${placeholderStyles.left}) translateY(${placeholderStyles.top})`;
                // modify the position of the dragged item to be the once we want (for example the mouse position or whatever)
                this._gridItemsRenderData[gridItem.id] = Object.assign(Object.assign({}, draggedItemPos), { id: this._gridItemsRenderData[gridItem.id].id });
                this.render();
            }, (error) => observer.error(error), () => {
                this.ngZone.run(() => {
                    // Remove drag classes
                    this.renderer.removeClass(gridItem.elementRef.nativeElement, 'no-transitions');
                    this.renderer.removeClass(gridItem.elementRef.nativeElement, 'ktd-grid-item-dragging');
                    // Remove placeholder element from the dom
                    // NOTE: If we don't put the removeChild inside the zone it would not work... This may be a bug from angular or maybe is the intended behaviour, although strange.
                    // It should work since AFAIK this action should not be done in a CD cycle.
                    this.renderer.removeChild(this.elementRef.nativeElement, placeholderElement);
                    if (newLayout) {
                        // Prune react-grid-layout compact extra properties.
                        observer.next(newLayout.map(item => ({
                            id: item.id,
                            x: item.x,
                            y: item.y,
                            w: item.w,
                            h: item.h
                        })));
                    }
                    else {
                        // TODO: Need we really to emit if there is no layout change but drag started and ended?
                        observer.next(this.layout);
                    }
                    observer.complete();
                });
            }));
            return () => {
                scrollSubscription.unsubscribe();
                subscription.unsubscribe();
            };
        });
    }
}
KtdGridComponent.decorators = [
    { type: Component, args: [{
                selector: 'ktd-grid',
                template: "<ng-content></ng-content>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [
                    {
                        provide: GRID_ITEM_GET_RENDER_DATA_TOKEN,
                        useFactory: ktdGridItemGetRenderDataFactoryFunc,
                        deps: [KtdGridComponent]
                    }
                ],
                styles: ["ktd-grid{display:block;position:relative;width:100%}ktd-grid ktd-grid-item.ktd-grid-item-dragging{z-index:1000}ktd-grid ktd-grid-item.no-transitions{transition:none!important}ktd-grid .ktd-grid-item-placeholder{background-color:#8b0000;opacity:.6;position:absolute;transition:all .15s ease;transition-property:transform;z-index:0}"]
            },] }
];
KtdGridComponent.ctorParameters = () => [
    { type: KtdGridService },
    { type: ElementRef },
    { type: Renderer2 },
    { type: NgZone }
];
KtdGridComponent.propDecorators = {
    _gridItems: [{ type: ContentChildren, args: [KtdGridItemComponent, { descendants: true },] }],
    layoutUpdated: [{ type: Output }],
    dragStarted: [{ type: Output }],
    resizeStarted: [{ type: Output }],
    dragEnded: [{ type: Output }],
    resizeEnded: [{ type: Output }],
    scrollableParent: [{ type: Input }],
    compactOnPropsChange: [{ type: Input }],
    preventCollision: [{ type: Input }],
    scrollSpeed: [{ type: Input }],
    compactType: [{ type: Input }],
    rowHeight: [{ type: Input }],
    cols: [{ type: Input }],
    layout: [{ type: Input }]
};

class KtdGridModule {
}
KtdGridModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    KtdGridComponent,
                    KtdGridItemComponent,
                    KtdGridDragHandle,
                    KtdGridResizeHandle
                ],
                exports: [
                    KtdGridComponent,
                    KtdGridItemComponent,
                    KtdGridDragHandle,
                    KtdGridResizeHandle
                ],
                providers: [
                    KtdGridService
                ],
                imports: [
                    CommonModule
                ]
            },] }
];

/*
 * Public API Surface of grid
 */

/**
 * Generated bundle index. Do not edit.
 */

export { GRID_ITEM_GET_RENDER_DATA_TOKEN, KTD_GRID_DRAG_HANDLE, KTD_GRID_RESIZE_HANDLE, KtdGridComponent, KtdGridDragHandle, KtdGridItemComponent, KtdGridModule, KtdGridResizeHandle, __gridItemGetRenderDataFactoryFunc, ktdGridCompact, ktdGridItemGetRenderDataFactoryFunc, ktdTrackById, parseRenderItemToPixels, compact as ɵa, KtdGridService as ɵb };
//# sourceMappingURL=Hugo221989-angular-grid-layout-hugo.js.map
