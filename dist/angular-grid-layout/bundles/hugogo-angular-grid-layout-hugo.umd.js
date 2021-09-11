(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs'), require('rxjs/operators'), require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('hugogo/angular-grid-layout-hugo', ['exports', 'rxjs', 'rxjs/operators', '@angular/core', '@angular/common'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.hugogo = global.hugogo || {}, global.hugogo['angular-grid-layout-hugo'] = {}), global.rxjs, global.rxjs.operators, global.ng.core, global.ng.common));
}(this, (function (exports, rxjs, operators, i0, common) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    /**
     * IMPORTANT:
     * This utils are taken from the project: https://github.com/STRML/react-grid-layout.
     * The code should be as less modified as possible for easy maintenance.
     */
    var DEBUG = false;
    /**
     * Return the bottom coordinate of the layout.
     *
     * @param  {Array} layout Layout array.
     * @return {Number}       Bottom coordinate.
     */
    function bottom(layout) {
        var max = 0, bottomY;
        for (var i = 0, len = layout.length; i < len; i++) {
            bottomY = layout[i].y + layout[i].h;
            if (bottomY > max) {
                max = bottomY;
            }
        }
        return max;
    }
    function cloneLayout(layout) {
        var newLayout = Array(layout.length);
        for (var i = 0, len = layout.length; i < len; i++) {
            newLayout[i] = cloneLayoutItem(layout[i]);
        }
        return newLayout;
    }
    // Fast path to cloning, since this is monomorphic
    /** NOTE: This code has been modified from the original source */
    function cloneLayoutItem(layoutItem) {
        var clonedLayoutItem = {
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
        var compareWith = getStatics(layout);
        // We go through the items by row and column.
        var sorted = sortLayoutItems(layout, compactType);
        // Holding for new items.
        var out = Array(layout.length);
        for (var i = 0, len = sorted.length; i < len; i++) {
            var l = cloneLayoutItem(sorted[i]);
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
    var heightWidth = { x: 'w', y: 'h' };
    /**
     * Before moving item down, it will check if the movement will cause collisions and move those items down before.
     */
    function resolveCompactionCollision(layout, item, moveToCoord, axis) {
        var sizeProp = heightWidth[axis];
        item[axis] += 1;
        var itemIndex = layout
            .map(function (layoutItem) {
            return layoutItem.id;
        })
            .indexOf(item.id);
        // Go through each item we collide with.
        for (var i = itemIndex + 1; i < layout.length; i++) {
            var otherItem = layout[i];
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
        var compactV = compactType === 'vertical';
        var compactH = compactType === 'horizontal';
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
        var collides;
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
        var collidesWith = getStatics(layout);
        for (var i = 0, len = layout.length; i < len; i++) {
            var l = layout[i];
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
        for (var i = 0, len = layout.length; i < len; i++) {
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
        for (var i = 0, len = layout.length; i < len; i++) {
            if (collides(layout[i], layoutItem)) {
                return layout[i];
            }
        }
        return null;
    }
    function getAllCollisions(layout, layoutItem) {
        return layout.filter(function (l) { return collides(l, layoutItem); });
    }
    /**
     * Get all static elements.
     * @param  {Array} layout Array of layout objects.
     * @return {Array}        Array of static layout items..
     */
    function getStatics(layout) {
        return layout.filter(function (l) { return l.static; });
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
        log("Moving element " + l.id + " to [" + String(x) + "," + String(y) + "] from [" + l.x + "," + l.y + "]");
        var oldX = l.x;
        var oldY = l.y;
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
        var sorted = sortLayoutItems(layout, compactType);
        var movingUp = compactType === 'vertical' && typeof y === 'number'
            ? oldY >= y
            : compactType === 'horizontal' && typeof x === 'number'
                ? oldX >= x
                : false;
        if (movingUp) {
            sorted = sorted.reverse();
        }
        var collisions = getAllCollisions(sorted, l);
        // There was a collision; abort
        if (preventCollision && collisions.length) {
            log("Collision prevented on " + l.id + ", reverting.");
            l.x = oldX;
            l.y = oldY;
            l.moved = false;
            return layout;
        }
        // Move each item that collides away from this element.
        for (var i = 0, len = collisions.length; i < len; i++) {
            var collision = collisions[i];
            log("Resolving collision between " + l.id + " at [" + l.x + "," + l.y + "] and " + collision.id + " at [" + collision.x + "," + collision.y + "]");
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
        var compactH = compactType === 'horizontal';
        // Compact vertically if not set to horizontal
        var compactV = compactType !== 'horizontal';
        var preventCollision = collidesWith.static; // we're already colliding (not for static items)
        // If there is enough space above the collision to put this element, move it there.
        // We only do this on the main collision as this can get funky in cascades and cause
        // unwanted swapping behavior.
        if (isUserAction) {
            // Reset isUserAction flag because we're not in the main collision anymore.
            isUserAction = false;
            // Make a mock item so we don't modify the item here, only modify in moveElement.
            var fakeItem = {
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
                log("Doing reverse collision on " + itemToMove.id + " up to [" + fakeItem.x + "," + fakeItem.y + "].");
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
    function setTransform(_a) {
        var top = _a.top, left = _a.left, width = _a.width, height = _a.height;
        // Replace unitless items with px
        var translate = "translate(" + left + "px," + top + "px)";
        return {
            transform: translate,
            WebkitTransform: translate,
            MozTransform: translate,
            msTransform: translate,
            OTransform: translate,
            width: width + "px",
            height: height + "px",
            position: 'absolute',
        };
    }
    function setTopLeft(_a) {
        var top = _a.top, left = _a.left, width = _a.width, height = _a.height;
        return {
            top: top + "px",
            left: left + "px",
            width: width + "px",
            height: height + "px",
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
    function validateLayout(layout, contextName) {
        if (contextName === void 0) { contextName = 'Layout'; }
        var subProps = ['x', 'y', 'w', 'h'];
        if (!Array.isArray(layout)) {
            throw new Error(contextName + ' must be an array!');
        }
        for (var i = 0, len = layout.length; i < len; i++) {
            var item = layout[i];
            for (var j = 0; j < subProps.length; j++) {
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
        fns.forEach(function (key) { return (el[key] = el[key].bind(el)); });
    }
    function log() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!DEBUG) {
            return;
        }
        // eslint-disable-next-line no-console
        console.log.apply(console, __spread(args));
    }
    var noop = function () { };

    /** Cached result of whether the user's browser supports passive event listeners. */
    var supportsPassiveEvents;
    /**
     * Checks whether the user's browser supports passive event listeners.
     * See: https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
     */
    function ktdSupportsPassiveEventListeners() {
        if (supportsPassiveEvents == null && typeof window !== 'undefined') {
            try {
                window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
                    get: function () { return supportsPassiveEvents = true; }
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
    var passiveEventListenerOptions = ktdNormalizePassiveListenerOptions({ passive: true });
    /** Options that can be used to bind an active event listener. */
    var activeEventListenerOptions = ktdNormalizePassiveListenerOptions({ passive: false });
    var isMobile = null;
    function ktdIsMobileOrTablet() {
        if (isMobile != null) {
            return isMobile;
        }
        // Generic match pattern to identify mobile or tablet devices
        var isMobileDevice = /Android|webOS|BlackBerry|Windows Phone|iPad|iPhone|iPod/i.test(navigator.userAgent);
        // Since IOS 13 is not safe to just check for the generic solution. See: https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
        var isIOSMobileDevice = /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
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
    function ktdMouseOrTouchDown(element, touchNumber) {
        if (touchNumber === void 0) { touchNumber = 1; }
        return rxjs.iif(function () { return ktdIsMobileOrTablet(); }, rxjs.fromEvent(element, 'touchstart', passiveEventListenerOptions).pipe(operators.filter(function (touchEvent) { return touchEvent.touches.length === touchNumber; })), rxjs.fromEvent(element, 'mousedown', activeEventListenerOptions).pipe(operators.filter(function (mouseEvent) {
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
    function ktdMouseOrTouchMove(element, touchNumber) {
        if (touchNumber === void 0) { touchNumber = 1; }
        return rxjs.iif(function () { return ktdIsMobileOrTablet(); }, rxjs.fromEvent(element, 'touchmove', activeEventListenerOptions).pipe(operators.filter(function (touchEvent) { return touchEvent.touches.length === touchNumber; })), rxjs.fromEvent(element, 'mousemove', activeEventListenerOptions));
    }
    function ktdTouchEnd(element, touchNumber) {
        if (touchNumber === void 0) { touchNumber = 1; }
        return rxjs.merge(rxjs.fromEvent(element, 'touchend').pipe(operators.filter(function (touchEvent) { return touchEvent.touches.length === touchNumber - 1; })), rxjs.fromEvent(element, 'touchcancel').pipe(operators.filter(function (touchEvent) { return touchEvent.touches.length === touchNumber - 1; })));
    }
    /**
     * Emits when a there is a 'mouseup' or the touch ends.
     * @param element, html element where to  listen the events.
     * @param touchNumber number of the touch to track the event, default to the first one.
     */
    function ktdMouseOrTouchEnd(element, touchNumber) {
        if (touchNumber === void 0) { touchNumber = 1; }
        return rxjs.iif(function () { return ktdIsMobileOrTablet(); }, ktdTouchEnd(element, touchNumber), rxjs.fromEvent(element, 'mouseup'));
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
            .map(function (item) { return ({ id: item.id, x: item.x, y: item.y, w: item.w, h: item.h }); });
    }
    function screenXPosToGridValue(screenXPos, cols, width) {
        return Math.round((screenXPos * cols) / width);
    }
    function screenYPosToGridValue(screenYPos, rowHeight, height) {
        return Math.round(screenYPos / rowHeight);
    }
    /** Returns a Dictionary where the key is the id and the value is the change applied to that item. If no changes Dictionary is empty. */
    function ktdGetGridLayoutDiff(gridLayoutA, gridLayoutB) {
        var diff = {};
        gridLayoutA.forEach(function (itemA) {
            var itemB = gridLayoutB.find(function (_itemB) { return _itemB.id === itemA.id; });
            if (itemB != null) {
                var posChanged = itemA.x !== itemB.x || itemA.y !== itemB.y;
                var sizeChanged = itemA.w !== itemB.w || itemA.h !== itemB.h;
                var change = posChanged && sizeChanged ? 'moveresize' : posChanged ? 'move' : sizeChanged ? 'resize' : null;
                if (change) {
                    diff[itemB.id] = { change: change };
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
        var pointerDownEvent = draggingData.pointerDownEvent, pointerDragEvent = draggingData.pointerDragEvent, gridElemClientRect = draggingData.gridElemClientRect, dragElemClientRect = draggingData.dragElemClientRect, scrollDifference = draggingData.scrollDifference;
        var draggingElemPrevItem = config.layout.find(function (item) { return item.id === gridItemId; });
        var clientStartX = ktdPointerClientX(pointerDownEvent);
        var clientStartY = ktdPointerClientY(pointerDownEvent);
        var clientX = ktdPointerClientX(pointerDragEvent);
        var clientY = ktdPointerClientY(pointerDragEvent);
        var offsetX = clientStartX - dragElemClientRect.left;
        var offsetY = clientStartY - dragElemClientRect.top;
        // Grid element positions taking into account the possible scroll total difference from the beginning.
        var gridElementLeftPosition = gridElemClientRect.left + scrollDifference.left;
        var gridElementTopPosition = gridElemClientRect.top + scrollDifference.top;
        // Calculate position relative to the grid element.
        var gridRelXPos = clientX - gridElementLeftPosition - offsetX;
        var gridRelYPos = clientY - gridElementTopPosition - offsetY;
        // Get layout item position
        var layoutItem = Object.assign(Object.assign({}, draggingElemPrevItem), { x: screenXPosToGridValue(gridRelXPos, config.cols, gridElemClientRect.width), y: screenYPosToGridValue(gridRelYPos, config.rowHeight, gridElemClientRect.height) });
        // Correct the values if they overflow, since 'moveElement' function doesn't do it
        layoutItem.x = Math.max(0, layoutItem.x);
        layoutItem.y = Math.max(0, layoutItem.y);
        if (layoutItem.x + layoutItem.w > config.cols) {
            layoutItem.x = Math.max(0, config.cols - layoutItem.w);
        }
        // Parse to LayoutItem array data in order to use 'react.grid-layout' utils
        var layoutItems = config.layout;
        var draggedLayoutItem = layoutItems.find(function (item) { return item.id === gridItemId; });
        var newLayoutItems = moveElement(layoutItems, draggedLayoutItem, layoutItem.x, layoutItem.y, true, config.preventCollision, compactionType, config.cols);
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
        var pointerDownEvent = draggingData.pointerDownEvent, pointerDragEvent = draggingData.pointerDragEvent, gridElemClientRect = draggingData.gridElemClientRect, dragElemClientRect = draggingData.dragElemClientRect, scrollDifference = draggingData.scrollDifference;
        var clientStartX = ktdPointerClientX(pointerDownEvent);
        var clientStartY = ktdPointerClientY(pointerDownEvent);
        var clientX = ktdPointerClientX(pointerDragEvent);
        var clientY = ktdPointerClientY(pointerDragEvent);
        // Get the difference between the mouseDown and the position 'right' of the resize element.
        var resizeElemOffsetX = dragElemClientRect.width - (clientStartX - dragElemClientRect.left);
        var resizeElemOffsetY = dragElemClientRect.height - (clientStartY - dragElemClientRect.top);
        var draggingElemPrevItem = config.layout.find(function (item) { return item.id === gridItemId; });
        var width = clientX + resizeElemOffsetX - (dragElemClientRect.left + scrollDifference.left);
        var height = clientY + resizeElemOffsetY - (dragElemClientRect.top + scrollDifference.top);
        // Get layout item grid position
        var layoutItem = Object.assign(Object.assign({}, draggingElemPrevItem), { w: screenXPosToGridValue(width, config.cols, gridElemClientRect.width), h: screenYPosToGridValue(height, config.rowHeight, gridElemClientRect.height) });
        layoutItem.w = Math.max(1, layoutItem.w);
        layoutItem.h = Math.max(1, layoutItem.h);
        if (layoutItem.x + layoutItem.w > config.cols) {
            layoutItem.w = Math.max(1, config.cols - layoutItem.x);
        }
        if (config.preventCollision) {
            var maxW = layoutItem.w;
            var maxH = layoutItem.h;
            var colliding = hasCollision(config.layout, layoutItem);
            var shrunkDimension = void 0;
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
        var newLayoutItems = config.layout.map(function (item) {
            return item.id === gridItemId ? layoutItem : item;
        });
        return {
            layout: compact(newLayoutItems, compactionType, config.cols),
            draggedItemPos: {
                top: dragElemClientRect.top - gridElemClientRect.top,
                left: dragElemClientRect.left - gridElemClientRect.left,
                width: width,
                height: height,
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
    var KTD_GRID_DRAG_HANDLE = new i0.InjectionToken('KtdGridDragHandle');
    /** Handle that can be used to drag a KtdGridItem instance. */
    // tslint:disable-next-line:directive-class-suffix
    var KtdGridDragHandle = /** @class */ (function () {
        function KtdGridDragHandle(element) {
            this.element = element;
        }
        return KtdGridDragHandle;
    }());
    KtdGridDragHandle.decorators = [
        { type: i0.Directive, args: [{
                    selector: '[ktdGridDragHandle]',
                    host: {
                        class: 'ktd-grid-drag-handle'
                    },
                    providers: [{ provide: KTD_GRID_DRAG_HANDLE, useExisting: KtdGridDragHandle }],
                },] }
    ];
    KtdGridDragHandle.ctorParameters = function () { return [
        { type: i0.ElementRef }
    ]; };

    /**
     * Injection token that can be used to reference instances of `KtdGridResizeHandle`. It serves as
     * alternative token to the actual `KtdGridResizeHandle` class which could cause unnecessary
     * retention of the class and its directive metadata.
     */
    var KTD_GRID_RESIZE_HANDLE = new i0.InjectionToken('KtdGridResizeHandle');
    /** Handle that can be used to drag a KtdGridItem instance. */
    var KtdGridResizeHandle = /** @class */ (function () {
        function KtdGridResizeHandle(element) {
            this.element = element;
        }
        return KtdGridResizeHandle;
    }());
    KtdGridResizeHandle.decorators = [
        { type: i0.Directive, args: [{
                    selector: '[ktdGridResizeHandle]',
                    host: {
                        class: 'ktd-grid-resize-handle'
                    },
                    providers: [{ provide: KTD_GRID_RESIZE_HANDLE, useExisting: KtdGridResizeHandle }],
                },] }
    ];
    KtdGridResizeHandle.ctorParameters = function () { return [
        { type: i0.ElementRef }
    ]; };

    var GRID_ITEM_GET_RENDER_DATA_TOKEN = new i0.InjectionToken('GRID_ITEM_GET_RENDER_DATA_TOKEN');

    /** Event options that can be used to bind an active, capturing event. */
    var activeCapturingEventOptions = ktdNormalizePassiveListenerOptions({
        passive: false,
        capture: true
    });
    var KtdGridService = /** @class */ (function () {
        function KtdGridService(ngZone) {
            this.ngZone = ngZone;
            this.touchMoveSubject = new rxjs.Subject();
            this.touchMove$ = this.touchMoveSubject.asObservable();
            this.registerTouchMoveSubscription();
        }
        KtdGridService.prototype.ngOnDestroy = function () {
            this.touchMoveSubscription.unsubscribe();
        };
        KtdGridService.prototype.mouseOrTouchMove$ = function (element) {
            return rxjs.iif(function () { return ktdIsMobileOrTablet(); }, this.touchMove$, rxjs.fromEvent(element, 'mousemove', activeCapturingEventOptions) // TODO: Fix rxjs typings, boolean should be a good param too.
            );
        };
        KtdGridService.prototype.registerTouchMoveSubscription = function () {
            var _this = this;
            // The `touchmove` event gets bound once, ahead of time, because WebKit
            // won't preventDefault on a dynamically-added `touchmove` listener.
            // See https://bugs.webkit.org/show_bug.cgi?id=184250.
            this.touchMoveSubscription = this.ngZone.runOutsideAngular(function () {
                // The event handler has to be explicitly active,
                // because newer browsers make it passive by default.
                return rxjs.fromEvent(document, 'touchmove', activeCapturingEventOptions) // TODO: Fix rxjs typings, boolean should be a good param too.
                    .pipe(operators.filter(function (touchEvent) { return touchEvent.touches.length === 1; }))
                    .subscribe(function (touchEvent) { return _this.touchMoveSubject.next(touchEvent); });
            });
        };
        return KtdGridService;
    }());
    KtdGridService.ɵprov = i0.ɵɵdefineInjectable({ factory: function KtdGridService_Factory() { return new KtdGridService(i0.ɵɵinject(i0.NgZone)); }, token: KtdGridService, providedIn: "root" });
    KtdGridService.decorators = [
        { type: i0.Injectable, args: [{ providedIn: 'root' },] }
    ];
    KtdGridService.ctorParameters = function () { return [
        { type: i0.NgZone }
    ]; };

    /** Runs source observable outside the zone */
    function ktdOutsideZone(zone) {
        return function (source) {
            return new rxjs.Observable(function (observer) {
                return zone.runOutsideAngular(function () { return source.subscribe(observer); });
            });
        };
    }
    /** Rxjs operator that makes source observable to no emit any data */
    function ktdNoEmit() {
        return function (source$) {
            return source$.pipe(operators.filter(function () { return false; }));
        };
    }

    /** Coerces a data-bound value (typically a string) to a boolean. */
    function coerceBooleanProperty(value) {
        return value != null && "" + value !== 'false';
    }

    function coerceNumberProperty(value, fallbackValue) {
        if (fallbackValue === void 0) { fallbackValue = 0; }
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

    var KtdGridItemComponent = /** @class */ (function () {
        function KtdGridItemComponent(elementRef, gridService, renderer, ngZone, getItemRenderData) {
            this.elementRef = elementRef;
            this.gridService = gridService;
            this.renderer = renderer;
            this.ngZone = ngZone;
            this.getItemRenderData = getItemRenderData;
            /** CSS transition style. Note that for more performance is preferable only make transition on transform property. */
            this.transition = 'transform 500ms ease, width 500ms ease, height 500ms ease';
            this._dragStartThreshold = 0;
            this._draggable = true;
            this._draggable$ = new rxjs.BehaviorSubject(this._draggable);
            this._resizable = true;
            this._resizable$ = new rxjs.BehaviorSubject(this._resizable);
            this.dragStartSubject = new rxjs.Subject();
            this.resizeStartSubject = new rxjs.Subject();
            this.subscriptions = [];
            this.dragStart$ = this.dragStartSubject.asObservable();
            this.resizeStart$ = this.resizeStartSubject.asObservable();
        }
        Object.defineProperty(KtdGridItemComponent.prototype, "id", {
            /** Id of the grid item. This property is strictly compulsory. */
            get: function () {
                return this._id;
            },
            set: function (val) {
                this._id = val;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(KtdGridItemComponent.prototype, "dragStartThreshold", {
            /** Minimum amount of pixels that the user should move before it starts the drag sequence. */
            get: function () { return this._dragStartThreshold; },
            set: function (val) {
                this._dragStartThreshold = coerceNumberProperty(val);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(KtdGridItemComponent.prototype, "draggable", {
            /** Whether the item is draggable or not. Defaults to true. */
            get: function () {
                return this._draggable;
            },
            set: function (val) {
                this._draggable = coerceBooleanProperty(val);
                this._draggable$.next(this._draggable);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(KtdGridItemComponent.prototype, "resizable", {
            /** Whether the item is resizable or not. Defaults to true. */
            get: function () {
                return this._resizable;
            },
            set: function (val) {
                this._resizable = coerceBooleanProperty(val);
                this._resizable$.next(this._resizable);
            },
            enumerable: false,
            configurable: true
        });
        KtdGridItemComponent.prototype.ngOnInit = function () {
            var gridItemRenderData = this.getItemRenderData(this.id);
            this.setStyles(gridItemRenderData);
        };
        KtdGridItemComponent.prototype.ngAfterContentInit = function () {
            this.subscriptions.push(this._dragStart$().subscribe(this.dragStartSubject), this._resizeStart$().subscribe(this.resizeStartSubject));
        };
        KtdGridItemComponent.prototype.ngOnDestroy = function () {
            this.subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
        };
        KtdGridItemComponent.prototype.setStyles = function (_a) {
            var top = _a.top, left = _a.left, width = _a.width, height = _a.height;
            // transform is 6x times faster than top/left
            this.renderer.setStyle(this.elementRef.nativeElement, 'transform', "translateX(" + left + ") translateY(" + top + ")");
            this.renderer.setStyle(this.elementRef.nativeElement, 'display', "block");
            this.renderer.setStyle(this.elementRef.nativeElement, 'transition', this.transition);
            if (width != null) {
                this.renderer.setStyle(this.elementRef.nativeElement, 'width', width);
            }
            if (height != null) {
                this.renderer.setStyle(this.elementRef.nativeElement, 'height', height);
            }
        };
        KtdGridItemComponent.prototype._dragStart$ = function () {
            var _this = this;
            return this._draggable$.pipe(operators.switchMap(function (draggable) {
                if (!draggable) {
                    return rxjs.NEVER;
                }
                else {
                    return _this._dragHandles.changes.pipe(operators.startWith(_this._dragHandles), operators.switchMap(function (dragHandles) {
                        return rxjs.iif(function () { return dragHandles.length > 0; }, rxjs.merge.apply(void 0, __spread(dragHandles.toArray().map(function (dragHandle) { return ktdMouseOrTouchDown(dragHandle.element.nativeElement, 1); }))), ktdMouseOrTouchDown(_this.elementRef.nativeElement, 1)).pipe(operators.exhaustMap(function (startEvent) {
                            // If the event started from an element with the native HTML drag&drop, it'll interfere
                            // with our own dragging (e.g. `img` tags do it by default). Prevent the default action
                            // to stop it from happening. Note that preventing on `dragstart` also seems to work, but
                            // it's flaky and it fails if the user drags it away quickly. Also note that we only want
                            // to do this for `mousedown` since doing the same for `touchstart` will stop any `click`
                            // events from firing on touch devices.
                            if (startEvent.target && startEvent.target.draggable && startEvent.type === 'mousedown') {
                                startEvent.preventDefault();
                            }
                            var startPointer = ktdPointerClient(startEvent);
                            return _this.gridService.mouseOrTouchMove$(document).pipe(operators.takeUntil(ktdMouseOrTouchEnd(document, 1)), ktdOutsideZone(_this.ngZone), operators.filter(function (moveEvent) {
                                moveEvent.preventDefault();
                                var movePointer = ktdPointerClient(moveEvent);
                                var distanceX = Math.abs(startPointer.clientX - movePointer.clientX);
                                var distanceY = Math.abs(startPointer.clientY - movePointer.clientY);
                                // When this conditions returns true mean that we are over threshold.
                                return distanceX + distanceY >= _this.dragStartThreshold;
                            }), operators.take(1), 
                            // Return the original start event
                            operators.map(function () { return startEvent; }));
                        }));
                    }));
                }
            }));
        };
        KtdGridItemComponent.prototype._resizeStart$ = function () {
            var _this = this;
            return this._resizable$.pipe(operators.switchMap(function (resizable) {
                if (!resizable) {
                    // Side effect to hide the resizeElem if resize is disabled.
                    _this.renderer.setStyle(_this.resizeElem.nativeElement, 'display', 'none');
                    return rxjs.NEVER;
                }
                else {
                    return _this._resizeHandles.changes.pipe(operators.startWith(_this._resizeHandles), operators.switchMap(function (resizeHandles) {
                        if (resizeHandles.length > 0) {
                            // Side effect to hide the resizeElem if there are resize handles.
                            _this.renderer.setStyle(_this.resizeElem.nativeElement, 'display', 'none');
                            return rxjs.merge.apply(void 0, __spread(resizeHandles.toArray().map(function (resizeHandle) { return ktdMouseOrTouchDown(resizeHandle.element.nativeElement, 1); })));
                        }
                        else {
                            _this.renderer.setStyle(_this.resizeElem.nativeElement, 'display', 'block');
                            return ktdMouseOrTouchDown(_this.resizeElem.nativeElement, 1);
                        }
                    }));
                }
            }));
        };
        return KtdGridItemComponent;
    }());
    KtdGridItemComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'ktd-grid-item',
                    template: "<ng-content></ng-content>\n<div #resizeElem class=\"grid-item-resize-icon\"></div>\n",
                    changeDetection: i0.ChangeDetectionStrategy.OnPush,
                    styles: [":host{display:none;overflow:hidden;z-index:1}:host,:host div{position:absolute}:host div{-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;user-select:none;z-index:10}:host div.grid-item-resize-icon{bottom:0;color:inherit;cursor:se-resize;height:20px;right:0;width:20px}:host div.grid-item-resize-icon:after{border-bottom:2px solid;border-right:2px solid;bottom:3px;content:\"\";height:5px;position:absolute;right:3px;width:5px}.display-none{display:none!important}"]
                },] }
    ];
    KtdGridItemComponent.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: KtdGridService },
        { type: i0.Renderer2 },
        { type: i0.NgZone },
        { type: undefined, decorators: [{ type: i0.Inject, args: [GRID_ITEM_GET_RENDER_DATA_TOKEN,] }] }
    ]; };
    KtdGridItemComponent.propDecorators = {
        _dragHandles: [{ type: i0.ContentChildren, args: [KTD_GRID_DRAG_HANDLE, { descendants: true },] }],
        _resizeHandles: [{ type: i0.ContentChildren, args: [KTD_GRID_RESIZE_HANDLE, { descendants: true },] }],
        resizeElem: [{ type: i0.ViewChild, args: ['resizeElem', { static: true, read: i0.ElementRef },] }],
        transition: [{ type: i0.Input }],
        id: [{ type: i0.Input }],
        dragStartThreshold: [{ type: i0.Input }],
        draggable: [{ type: i0.Input }],
        resizable: [{ type: i0.Input }]
    };

    // tslint:disable
    /**
     * Client rect utilities.
     * This file is taken from Angular Material repository. This is the reason why the tslint is disabled on this case.
     * Don't enable it until some custom change is done on this file.
     */
    /** Gets a mutable version of an element's bounding `ClientRect`. */
    function getMutableClientRect(element) {
        var clientRect = element.getBoundingClientRect();
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
        var top = clientRect.top, bottom = clientRect.bottom, left = clientRect.left, right = clientRect.right;
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
        var top = rect.top, right = rect.right, bottom = rect.bottom, left = rect.left, width = rect.width, height = rect.height;
        var xThreshold = width * threshold;
        var yThreshold = height * threshold;
        return pointerY > top - yThreshold && pointerY < bottom + yThreshold &&
            pointerX > left - xThreshold && pointerX < right + xThreshold;
    }

    /**
     * Proximity, as a ratio to width/height at which to start auto-scrolling.
     * The value comes from trying it out manually until it feels right.
     */
    var SCROLL_PROXIMITY_THRESHOLD = 0.05;
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
        var top = clientRect.top, bottom = clientRect.bottom, height = clientRect.height;
        var yThreshold = height * SCROLL_PROXIMITY_THRESHOLD;
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
        var left = clientRect.left, right = clientRect.right, width = clientRect.width;
        var xThreshold = width * SCROLL_PROXIMITY_THRESHOLD;
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
    function scrollToDirectionInterval$(scrollNode, verticalScrollDirection, horizontalScrollDirection, scrollStep) {
        if (scrollStep === void 0) { scrollStep = 2; }
        return rxjs.interval(0, rxjs.animationFrameScheduler)
            .pipe(operators.tap(function () {
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
        var scrollNode;
        var scrollableParentClientRect;
        var scrollableParentScrollWidth;
        if (scrollableParent === document) {
            scrollNode = document.defaultView;
            var _a = getViewportSize(), width = _a.width, height = _a.height;
            scrollableParentClientRect = { width: width, height: height, top: 0, right: width, bottom: height, left: 0 };
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
        return function (source$) { return source$.pipe(operators.map(function (_a) {
            var pointerX = _a.pointerX, pointerY = _a.pointerY;
            var verticalScrollDirection = getVerticalScrollDirection(scrollableParentClientRect, pointerY);
            var horizontalScrollDirection = getHorizontalScrollDirection(scrollableParentClientRect, pointerX);
            // Check if scroll directions are disabled.
            if (options === null || options === void 0 ? void 0 : options.disableVertical) {
                verticalScrollDirection = 0 /* NONE */;
            }
            if (options === null || options === void 0 ? void 0 : options.disableHorizontal) {
                horizontalScrollDirection = 0 /* NONE */;
            }
            return { verticalScrollDirection: verticalScrollDirection, horizontalScrollDirection: horizontalScrollDirection };
        }), operators.distinctUntilChanged(function (prev, actual) {
            return prev.verticalScrollDirection === actual.verticalScrollDirection
                && prev.horizontalScrollDirection === actual.horizontalScrollDirection;
        }), operators.switchMap(function (_a) {
            var verticalScrollDirection = _a.verticalScrollDirection, horizontalScrollDirection = _a.horizontalScrollDirection;
            if (verticalScrollDirection || horizontalScrollDirection) {
                return scrollToDirectionInterval$(scrollNode, verticalScrollDirection, horizontalScrollDirection, options === null || options === void 0 ? void 0 : options.scrollStep);
            }
            else {
                return rxjs.NEVER;
            }
        })); };
    }
    /**
     * Emits on EVERY scroll event and returns the accumulated scroll offset relative to the initial scroll position.
     * @param scrollableParent, node in which scroll events would be listened.
     */
    function ktdGetScrollTotalRelativeDifference$(scrollableParent) {
        var scrollInitialPosition;
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
        return rxjs.fromEvent(scrollableParent, 'scroll', ktdNormalizePassiveListenerOptions({ capture: true })).pipe(operators.map(function () {
            var newTop;
            var newLeft;
            if (scrollableParent === document) {
                var viewportScrollPosition = getViewportScrollPosition();
                newTop = viewportScrollPosition.top;
                newLeft = viewportScrollPosition.left;
            }
            else {
                newTop = scrollableParent.scrollTop;
                newLeft = scrollableParent.scrollLeft;
            }
            var topDifference = scrollInitialPosition.top - newTop;
            var leftDifference = scrollInitialPosition.left - newLeft;
            return { top: topDifference, left: leftDifference };
        }));
    }
    /** Returns the viewport's width and height. */
    function getViewportSize() {
        var _window = document.defaultView || window;
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
        var scrollPosition = getViewportScrollPosition();
        var _a = getViewportSize(), width = _a.width, height = _a.height;
        return {
            top: scrollPosition.top,
            left: scrollPosition.left,
            bottom: scrollPosition.top + height,
            right: scrollPosition.left + width,
            height: height,
            width: width,
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
        var windowRef = document.defaultView || window;
        var documentElement = document.documentElement;
        var documentRect = documentElement.getBoundingClientRect();
        var top = -documentRect.top || document.body.scrollTop || windowRef.scrollY ||
            documentElement.scrollTop || 0;
        var left = -documentRect.left || document.body.scrollLeft || windowRef.scrollX ||
            documentElement.scrollLeft || 0;
        return { top: top, left: left };
    }
    /** Returns the document scroll width */
    function getDocumentScrollWidth() {
        return Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
    }

    function getDragResizeEventData(gridItem, layout) {
        return {
            layout: layout,
            layoutItem: layout.find(function (item) { return item.id === gridItem.id; }),
            gridItemRef: gridItem
        };
    }
    function layoutToRenderItems(config, width, height) {
        var e_1, _a;
        var cols = config.cols, rowHeight = config.rowHeight, layout = config.layout;
        var renderItems = {};
        try {
            for (var layout_1 = __values(layout), layout_1_1 = layout_1.next(); !layout_1_1.done; layout_1_1 = layout_1.next()) {
                var item = layout_1_1.value;
                renderItems[item.id] = {
                    id: item.id,
                    top: item.y === 0 ? 0 : item.y * rowHeight,
                    left: item.x * (width / cols),
                    width: item.w * (width / cols),
                    height: item.h * rowHeight
                };
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (layout_1_1 && !layout_1_1.done && (_a = layout_1.return)) _a.call(layout_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return renderItems;
    }
    function getGridHeight(layout, rowHeight) {
        return layout.reduce(function (acc, cur) { return Math.max(acc, (cur.y + cur.h) * rowHeight); }, 0);
    }
    // tslint:disable-next-line
    function parseRenderItemToPixels(renderItem) {
        return {
            id: renderItem.id,
            top: renderItem.top + "px",
            left: renderItem.left + "px",
            width: renderItem.width + "px",
            height: renderItem.height + "px"
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
        var resultFunc = __gridItemGetRenderDataFactoryFunc(gridCmp);
        return resultFunc;
    }
    var KtdGridComponent = /** @class */ (function () {
        function KtdGridComponent(gridService, elementRef, renderer, ngZone) {
            this.gridService = gridService;
            this.elementRef = elementRef;
            this.renderer = renderer;
            this.ngZone = ngZone;
            /** Emits when layout change */
            this.layoutUpdated = new i0.EventEmitter();
            /** Emits when drag starts */
            this.dragStarted = new i0.EventEmitter();
            /** Emits when resize starts */
            this.resizeStarted = new i0.EventEmitter();
            /** Emits when drag ends */
            this.dragEnded = new i0.EventEmitter();
            /** Emits when resize ends */
            this.resizeEnded = new i0.EventEmitter();
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
        Object.defineProperty(KtdGridComponent.prototype, "compactOnPropsChange", {
            /** Whether or not to update the internal layout when some dependent property change. */
            get: function () { return this._compactOnPropsChange; },
            set: function (value) {
                this._compactOnPropsChange = coerceBooleanProperty(value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(KtdGridComponent.prototype, "preventCollision", {
            /** If true, grid items won't change position when being dragged over. Handy when using no compaction */
            get: function () { return this._preventCollision; },
            set: function (value) {
                this._preventCollision = coerceBooleanProperty(value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(KtdGridComponent.prototype, "scrollSpeed", {
            /** Number of CSS pixels that would be scrolled on each 'tick' when auto scroll is performed. */
            get: function () { return this._scrollSpeed; },
            set: function (value) {
                this._scrollSpeed = coerceNumberProperty(value, 2);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(KtdGridComponent.prototype, "compactType", {
            /** Type of compaction that will be applied to the layout (vertical, horizontal or free). Defaults to 'vertical' */
            get: function () {
                return this._compactType;
            },
            set: function (val) {
                this._compactType = val;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(KtdGridComponent.prototype, "rowHeight", {
            /** Row height in css pixels */
            get: function () { return this._rowHeight; },
            set: function (val) {
                this._rowHeight = Math.max(1, Math.round(coerceNumberProperty(val)));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(KtdGridComponent.prototype, "cols", {
            /** Number of columns  */
            get: function () { return this._cols; },
            set: function (val) {
                this._cols = Math.max(1, Math.round(coerceNumberProperty(val)));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(KtdGridComponent.prototype, "layout", {
            /** Layout of the grid. Array of all the grid items with its 'id' and position on the grid. */
            get: function () { return this._layout; },
            set: function (layout) {
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
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(KtdGridComponent.prototype, "config", {
            get: function () {
                return {
                    cols: this.cols,
                    rowHeight: this.rowHeight,
                    layout: this.layout,
                    preventCollision: this.preventCollision,
                };
            },
            enumerable: false,
            configurable: true
        });
        KtdGridComponent.prototype.ngOnChanges = function (changes) {
            var needsCompactLayout = false;
            var needsRecalculateRenderData = false;
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
        };
        KtdGridComponent.prototype.ngAfterContentInit = function () {
            this.initSubscriptions();
        };
        KtdGridComponent.prototype.ngAfterContentChecked = function () {
            this.render();
        };
        KtdGridComponent.prototype.resize = function () {
            this.calculateRenderData();
            this.render();
        };
        KtdGridComponent.prototype.ngOnDestroy = function () {
            this.subscriptions.forEach(function (sub) { return sub.unsubscribe(); });
        };
        KtdGridComponent.prototype.compactLayout = function () {
            this.layout = compact(this.layout, this.compactType, this.cols);
        };
        KtdGridComponent.prototype.getItemsRenderData = function () {
            return Object.assign({}, this._gridItemsRenderData);
        };
        KtdGridComponent.prototype.getItemRenderData = function (itemId) {
            return this._gridItemsRenderData[itemId];
        };
        KtdGridComponent.prototype.calculateRenderData = function () {
            var clientRect = this.elementRef.nativeElement.getBoundingClientRect();
            this._gridItemsRenderData = layoutToRenderItems(this.config, clientRect.width, clientRect.height);
            this._height = getGridHeight(this.layout, this.rowHeight);
        };
        KtdGridComponent.prototype.render = function () {
            this.renderer.setStyle(this.elementRef.nativeElement, 'height', this._height + "px");
            this.updateGridItemsStyles();
        };
        KtdGridComponent.prototype.updateGridItemsStyles = function () {
            var _this = this;
            this._gridItems.forEach(function (item) {
                var gridItemRenderData = _this._gridItemsRenderData[item.id];
                if (gridItemRenderData == null) {
                    console.error("Couldn't find the specified grid item for the id: " + item.id);
                }
                else {
                    item.setStyles(parseRenderItemToPixels(gridItemRenderData));
                }
            });
        };
        KtdGridComponent.prototype.initSubscriptions = function () {
            var _this = this;
            this.subscriptions = [
                this._gridItems.changes.pipe(operators.startWith(this._gridItems), operators.switchMap(function (gridItems) {
                    return rxjs.merge.apply(void 0, __spread(gridItems.map(function (gridItem) { return gridItem.dragStart$.pipe(operators.map(function (event) { return ({ event: event, gridItem: gridItem, type: 'drag' }); })); }), gridItems.map(function (gridItem) { return gridItem.resizeStart$.pipe(operators.map(function (event) { return ({ event: event, gridItem: gridItem, type: 'resize' }); })); }))).pipe(operators.exhaustMap(function (_a) {
                        var event = _a.event, gridItem = _a.gridItem, type = _a.type;
                        // Emit drag or resize start events. Ensure that is start event is inside the zone.
                        _this.ngZone.run(function () { return (type === 'drag' ? _this.dragStarted : _this.resizeStarted).emit(getDragResizeEventData(gridItem, _this.layout)); });
                        // Get the correct newStateFunc depending on if we are dragging or resizing
                        var calcNewStateFunc = type === 'drag' ? ktdGridItemDragging : ktdGridItemResizing;
                        // Perform drag sequence
                        return _this.performDragSequence$(gridItem, event, function (gridItemId, config, compactionType, draggingData) { return calcNewStateFunc(gridItemId, config, compactionType, draggingData); }).pipe(operators.map(function (layout) { return ({ layout: layout, gridItem: gridItem, type: type }); }));
                    }));
                })).subscribe(function (_a) {
                    var layout = _a.layout, gridItem = _a.gridItem, type = _a.type;
                    _this.layout = layout;
                    // Calculate new rendering data given the new layout.
                    _this.calculateRenderData();
                    // Emit drag or resize end events.
                    (type === 'drag' ? _this.dragEnded : _this.resizeEnded).emit(getDragResizeEventData(gridItem, layout));
                    // Notify that the layout has been updated.
                    _this.layoutUpdated.emit(layout);
                })
            ];
        };
        /**
         * Perform a general grid drag action, from start to end. A general grid drag action basically includes creating the placeholder element and adding
         * some class animations. calcNewStateFunc needs to be provided in order to calculate the new state of the layout.
         * @param gridItem that is been dragged
         * @param pointerDownEvent event (mousedown or touchdown) where the user initiated the drag
         * @param calcNewStateFunc function that return the new layout state and the drag element position
         */
        KtdGridComponent.prototype.performDragSequence$ = function (gridItem, pointerDownEvent, calcNewStateFunc) {
            var _this = this;
            return new rxjs.Observable(function (observer) {
                // Retrieve grid (parent) and gridItem (draggedElem) client rects.
                var gridElemClientRect = getMutableClientRect(_this.elementRef.nativeElement);
                var dragElemClientRect = getMutableClientRect(gridItem.elementRef.nativeElement);
                var scrollableParent = typeof _this.scrollableParent === 'string' ? document.getElementById(_this.scrollableParent) : _this.scrollableParent;
                _this.renderer.addClass(gridItem.elementRef.nativeElement, 'no-transitions');
                _this.renderer.addClass(gridItem.elementRef.nativeElement, 'ktd-grid-item-dragging');
                // Create placeholder element. This element would represent the position where the dragged/resized element would be if the action ends
                var placeholderElement = _this.renderer.createElement('div');
                placeholderElement.style.width = dragElemClientRect.width + "px";
                placeholderElement.style.height = dragElemClientRect.height + "px";
                placeholderElement.style.transform = "translateX(" + (dragElemClientRect.left - gridElemClientRect.left) + "px) translateY(" + (dragElemClientRect.top - gridElemClientRect.top) + "px)";
                _this.renderer.addClass(placeholderElement, 'ktd-grid-item-placeholder');
                _this.renderer.appendChild(_this.elementRef.nativeElement, placeholderElement);
                var newLayout;
                // TODO (enhancement): consider move this 'side effect' observable inside the main drag loop.
                //  - Pros are that we would not repeat subscriptions and takeUntil would shut down observables at the same time.
                //  - Cons are that moving this functionality as a side effect inside the main drag loop would be confusing.
                var scrollSubscription = _this.ngZone.runOutsideAngular(function () { return (!scrollableParent ? rxjs.NEVER : _this.gridService.mouseOrTouchMove$(document).pipe(operators.map(function (event) { return ({
                    pointerX: ktdPointerClientX(event),
                    pointerY: ktdPointerClientY(event)
                }); }), ktdScrollIfNearElementClientRect$(scrollableParent, { scrollStep: _this.scrollSpeed }))).pipe(operators.takeUntil(ktdMouseOrTouchEnd(document))).subscribe(); });
                /**
                 * Main subscription, it listens for 'pointer move' and 'scroll' events and recalculates the layout on each emission
                 */
                var subscription = _this.ngZone.runOutsideAngular(function () { return rxjs.merge(rxjs.combineLatest(__spread([
                    _this.gridService.mouseOrTouchMove$(document)
                ], (!scrollableParent ? [rxjs.of({ top: 0, left: 0 })] : [
                    ktdGetScrollTotalRelativeDifference$(scrollableParent).pipe(operators.startWith({ top: 0, left: 0 }) // Force first emission to allow CombineLatest to emit even no scroll event has occurred
                    )
                ])))).pipe(operators.takeUntil(ktdMouseOrTouchEnd(document))).subscribe(function (_a) {
                    var _b = __read(_a, 2), pointerDragEvent = _b[0], scrollDifference = _b[1];
                    pointerDragEvent.preventDefault();
                    /**
                     * Set the new layout to be the layout in which the calcNewStateFunc would be executed.
                     * NOTE: using the mutated layout is the way to go by 'react-grid-layout' utils. If we don't use the previous layout,
                     * some utilities from 'react-grid-layout' would not work as expected.
                     */
                    var currentLayout = newLayout || _this.layout;
                    var _c = calcNewStateFunc(gridItem.id, {
                        layout: currentLayout,
                        rowHeight: _this.rowHeight,
                        cols: _this.cols,
                        preventCollision: _this.preventCollision
                    }, _this.compactType, {
                        pointerDownEvent: pointerDownEvent,
                        pointerDragEvent: pointerDragEvent,
                        gridElemClientRect: gridElemClientRect,
                        dragElemClientRect: dragElemClientRect,
                        scrollDifference: scrollDifference
                    }), layout = _c.layout, draggedItemPos = _c.draggedItemPos;
                    newLayout = layout;
                    _this._height = getGridHeight(newLayout, _this.rowHeight);
                    _this._gridItemsRenderData = layoutToRenderItems({
                        cols: _this.cols,
                        rowHeight: _this.rowHeight,
                        layout: newLayout,
                        preventCollision: _this.preventCollision,
                    }, gridElemClientRect.width, gridElemClientRect.height);
                    var placeholderStyles = parseRenderItemToPixels(_this._gridItemsRenderData[gridItem.id]);
                    // Put the real final position to the placeholder element
                    placeholderElement.style.width = placeholderStyles.width;
                    placeholderElement.style.height = placeholderStyles.height;
                    placeholderElement.style.transform = "translateX(" + placeholderStyles.left + ") translateY(" + placeholderStyles.top + ")";
                    // modify the position of the dragged item to be the once we want (for example the mouse position or whatever)
                    _this._gridItemsRenderData[gridItem.id] = Object.assign(Object.assign({}, draggedItemPos), { id: _this._gridItemsRenderData[gridItem.id].id });
                    _this.render();
                }, function (error) { return observer.error(error); }, function () {
                    _this.ngZone.run(function () {
                        // Remove drag classes
                        _this.renderer.removeClass(gridItem.elementRef.nativeElement, 'no-transitions');
                        _this.renderer.removeClass(gridItem.elementRef.nativeElement, 'ktd-grid-item-dragging');
                        // Remove placeholder element from the dom
                        // NOTE: If we don't put the removeChild inside the zone it would not work... This may be a bug from angular or maybe is the intended behaviour, although strange.
                        // It should work since AFAIK this action should not be done in a CD cycle.
                        _this.renderer.removeChild(_this.elementRef.nativeElement, placeholderElement);
                        if (newLayout) {
                            // Prune react-grid-layout compact extra properties.
                            observer.next(newLayout.map(function (item) { return ({
                                id: item.id,
                                x: item.x,
                                y: item.y,
                                w: item.w,
                                h: item.h
                            }); }));
                        }
                        else {
                            // TODO: Need we really to emit if there is no layout change but drag started and ended?
                            observer.next(_this.layout);
                        }
                        observer.complete();
                    });
                }); });
                return function () {
                    scrollSubscription.unsubscribe();
                    subscription.unsubscribe();
                };
            });
        };
        return KtdGridComponent;
    }());
    KtdGridComponent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'ktd-grid',
                    template: "<ng-content></ng-content>\n",
                    encapsulation: i0.ViewEncapsulation.None,
                    changeDetection: i0.ChangeDetectionStrategy.OnPush,
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
    KtdGridComponent.ctorParameters = function () { return [
        { type: KtdGridService },
        { type: i0.ElementRef },
        { type: i0.Renderer2 },
        { type: i0.NgZone }
    ]; };
    KtdGridComponent.propDecorators = {
        _gridItems: [{ type: i0.ContentChildren, args: [KtdGridItemComponent, { descendants: true },] }],
        layoutUpdated: [{ type: i0.Output }],
        dragStarted: [{ type: i0.Output }],
        resizeStarted: [{ type: i0.Output }],
        dragEnded: [{ type: i0.Output }],
        resizeEnded: [{ type: i0.Output }],
        scrollableParent: [{ type: i0.Input }],
        compactOnPropsChange: [{ type: i0.Input }],
        preventCollision: [{ type: i0.Input }],
        scrollSpeed: [{ type: i0.Input }],
        compactType: [{ type: i0.Input }],
        rowHeight: [{ type: i0.Input }],
        cols: [{ type: i0.Input }],
        layout: [{ type: i0.Input }]
    };

    var KtdGridModule = /** @class */ (function () {
        function KtdGridModule() {
        }
        return KtdGridModule;
    }());
    KtdGridModule.decorators = [
        { type: i0.NgModule, args: [{
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
                        common.CommonModule
                    ]
                },] }
    ];

    /*
     * Public API Surface of grid
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.GRID_ITEM_GET_RENDER_DATA_TOKEN = GRID_ITEM_GET_RENDER_DATA_TOKEN;
    exports.KTD_GRID_DRAG_HANDLE = KTD_GRID_DRAG_HANDLE;
    exports.KTD_GRID_RESIZE_HANDLE = KTD_GRID_RESIZE_HANDLE;
    exports.KtdGridComponent = KtdGridComponent;
    exports.KtdGridDragHandle = KtdGridDragHandle;
    exports.KtdGridItemComponent = KtdGridItemComponent;
    exports.KtdGridModule = KtdGridModule;
    exports.KtdGridResizeHandle = KtdGridResizeHandle;
    exports.__gridItemGetRenderDataFactoryFunc = __gridItemGetRenderDataFactoryFunc;
    exports.ktdGridCompact = ktdGridCompact;
    exports.ktdGridItemGetRenderDataFactoryFunc = ktdGridItemGetRenderDataFactoryFunc;
    exports.ktdTrackById = ktdTrackById;
    exports.parseRenderItemToPixels = parseRenderItemToPixels;
    exports.ɵa = compact;
    exports.ɵb = KtdGridService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=hugogo-angular-grid-layout-hugo.umd.js.map
