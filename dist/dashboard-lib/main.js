(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "+GMm":
/*!*************************************************************!*\
  !*** ./projects/angular-grid-layout/src/lib/grid.module.ts ***!
  \*************************************************************/
/*! exports provided: KtdGridModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KtdGridModule", function() { return KtdGridModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _grid_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./grid.component */ "KyP5");
/* harmony import */ var _grid_item_grid_item_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./grid-item/grid-item.component */ "qcNg");
/* harmony import */ var _directives_drag_handle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./directives/drag-handle */ "xJKi");
/* harmony import */ var _directives_resize_handle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./directives/resize-handle */ "wesb");
/* harmony import */ var _grid_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./grid.service */ "/Jds");








class KtdGridModule {
}
KtdGridModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: KtdGridModule });
KtdGridModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function KtdGridModule_Factory(t) { return new (t || KtdGridModule)(); }, providers: [
        _grid_service__WEBPACK_IMPORTED_MODULE_6__["KtdGridService"]
    ], imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](KtdGridModule, { declarations: [_grid_component__WEBPACK_IMPORTED_MODULE_2__["KtdGridComponent"],
        _grid_item_grid_item_component__WEBPACK_IMPORTED_MODULE_3__["KtdGridItemComponent"],
        _directives_drag_handle__WEBPACK_IMPORTED_MODULE_4__["KtdGridDragHandle"],
        _directives_resize_handle__WEBPACK_IMPORTED_MODULE_5__["KtdGridResizeHandle"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"]], exports: [_grid_component__WEBPACK_IMPORTED_MODULE_2__["KtdGridComponent"],
        _grid_item_grid_item_component__WEBPACK_IMPORTED_MODULE_3__["KtdGridItemComponent"],
        _directives_drag_handle__WEBPACK_IMPORTED_MODULE_4__["KtdGridDragHandle"],
        _directives_resize_handle__WEBPACK_IMPORTED_MODULE_5__["KtdGridResizeHandle"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](KtdGridModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                declarations: [
                    _grid_component__WEBPACK_IMPORTED_MODULE_2__["KtdGridComponent"],
                    _grid_item_grid_item_component__WEBPACK_IMPORTED_MODULE_3__["KtdGridItemComponent"],
                    _directives_drag_handle__WEBPACK_IMPORTED_MODULE_4__["KtdGridDragHandle"],
                    _directives_resize_handle__WEBPACK_IMPORTED_MODULE_5__["KtdGridResizeHandle"]
                ],
                exports: [
                    _grid_component__WEBPACK_IMPORTED_MODULE_2__["KtdGridComponent"],
                    _grid_item_grid_item_component__WEBPACK_IMPORTED_MODULE_3__["KtdGridItemComponent"],
                    _directives_drag_handle__WEBPACK_IMPORTED_MODULE_4__["KtdGridDragHandle"],
                    _directives_resize_handle__WEBPACK_IMPORTED_MODULE_5__["KtdGridResizeHandle"]
                ],
                providers: [
                    _grid_service__WEBPACK_IMPORTED_MODULE_6__["KtdGridService"]
                ],
                imports: [
                    _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"]
                ]
            }]
    }], null, null); })();


/***/ }),

/***/ "/Jds":
/*!**************************************************************!*\
  !*** ./projects/angular-grid-layout/src/lib/grid.service.ts ***!
  \**************************************************************/
/*! exports provided: KtdGridService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KtdGridService", function() { return KtdGridService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _utils_passive_listeners__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/passive-listeners */ "veY6");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _utils_pointer_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/pointer.utils */ "vARK");






/** Event options that can be used to bind an active, capturing event. */
const activeCapturingEventOptions = Object(_utils_passive_listeners__WEBPACK_IMPORTED_MODULE_1__["ktdNormalizePassiveListenerOptions"])({
    passive: false,
    capture: true
});
class KtdGridService {
    constructor(ngZone) {
        this.ngZone = ngZone;
        this.touchMoveSubject = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.touchMove$ = this.touchMoveSubject.asObservable();
        this.registerTouchMoveSubscription();
    }
    ngOnDestroy() {
        this.touchMoveSubscription.unsubscribe();
    }
    mouseOrTouchMove$(element) {
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["iif"])(() => Object(_utils_pointer_utils__WEBPACK_IMPORTED_MODULE_4__["ktdIsMobileOrTablet"])(), this.touchMove$, Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["fromEvent"])(element, 'mousemove', activeCapturingEventOptions) // TODO: Fix rxjs typings, boolean should be a good param too.
        );
    }
    registerTouchMoveSubscription() {
        // The `touchmove` event gets bound once, ahead of time, because WebKit
        // won't preventDefault on a dynamically-added `touchmove` listener.
        // See https://bugs.webkit.org/show_bug.cgi?id=184250.
        this.touchMoveSubscription = this.ngZone.runOutsideAngular(() => 
        // The event handler has to be explicitly active,
        // because newer browsers make it passive by default.
        Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["fromEvent"])(document, 'touchmove', activeCapturingEventOptions) // TODO: Fix rxjs typings, boolean should be a good param too.
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["filter"])((touchEvent) => touchEvent.touches.length === 1))
            .subscribe((touchEvent) => this.touchMoveSubject.next(touchEvent)));
    }
}
KtdGridService.ɵfac = function KtdGridService_Factory(t) { return new (t || KtdGridService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"])); };
KtdGridService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: KtdGridService, factory: KtdGridService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](KtdGridService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
        args: [{ providedIn: 'root' }]
    }], function () { return [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"] }]; }, null); })();


/***/ }),

/***/ 0:
/*!*********************************************!*\
  !*** multi ./projects/demo-app/src/main.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\horlando\Documents\ANGULAR-LIBRERIAS-PROPIAS\angular-grid-layout-main\projects\demo-app\src\main.ts */"hWqd");


/***/ }),

/***/ "1K97":
/*!*************************************************!*\
  !*** ./projects/demo-app/src/app/app.module.ts ***!
  \*************************************************/
/*! exports provided: KtdAppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KtdAppModule", function() { return KtdAppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app.component */ "xA2O");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app-routing.module */ "CsN6");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/platform-browser/animations */ "R1ws");






class KtdAppModule {
}
KtdAppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({ type: KtdAppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_2__["KtdAppComponent"]] });
KtdAppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({ factory: function KtdAppModule_Factory(t) { return new (t || KtdAppModule)(); }, providers: [], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__["BrowserAnimationsModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_3__["KtdAppRoutingModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](KtdAppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_2__["KtdAppComponent"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
        _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__["BrowserAnimationsModule"],
        _app_routing_module__WEBPACK_IMPORTED_MODULE_3__["KtdAppRoutingModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](KtdAppModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"],
        args: [{
                declarations: [
                    _app_component__WEBPACK_IMPORTED_MODULE_2__["KtdAppComponent"]
                ],
                imports: [
                    _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                    _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__["BrowserAnimationsModule"],
                    _app_routing_module__WEBPACK_IMPORTED_MODULE_3__["KtdAppRoutingModule"]
                ],
                providers: [],
                bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_2__["KtdAppComponent"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "1rW2":
/*!*********************************************************************************!*\
  !*** ./projects/demo-app/src/app/real-life-example/real-life-example.module.ts ***!
  \*********************************************************************************/
/*! exports provided: KtdRealLifeExampleModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KtdRealLifeExampleModule", function() { return KtdRealLifeExampleModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _real_life_example_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./real-life-example.component */ "IUcz");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/icon */ "NFeN");
/* harmony import */ var projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! projects/angular-grid-layout/src/public-api */ "XHjT");
/* harmony import */ var _swimlane_ngx_charts__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @swimlane/ngx-charts */ "zQsl");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/card */ "Wp6s");
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/table */ "+0xr");
/* harmony import */ var _table_sorting_table_sorting_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./table-sorting/table-sorting.component */ "ocmN");
/* harmony import */ var _angular_material_sort__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/sort */ "Dh3D");













const routes = [
    { path: 'real-life-example', component: _real_life_example_component__WEBPACK_IMPORTED_MODULE_2__["KtdRealLifeExampleComponent"] },
];
class KtdRealLifeExampleModule {
}
KtdRealLifeExampleModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: KtdRealLifeExampleModule });
KtdRealLifeExampleModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function KtdRealLifeExampleModule_Factory(t) { return new (t || KtdRealLifeExampleModule)(); }, imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild(routes),
            _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__["MatIconModule"],
            projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_5__["KtdGridModule"],
            _swimlane_ngx_charts__WEBPACK_IMPORTED_MODULE_6__["NgxChartsModule"],
            _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardModule"],
            _angular_material_table__WEBPACK_IMPORTED_MODULE_8__["MatTableModule"],
            _angular_material_sort__WEBPACK_IMPORTED_MODULE_10__["MatSortModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](KtdRealLifeExampleModule, { declarations: [_real_life_example_component__WEBPACK_IMPORTED_MODULE_2__["KtdRealLifeExampleComponent"],
        _table_sorting_table_sorting_component__WEBPACK_IMPORTED_MODULE_9__["KtdTableSortingComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__["MatIconModule"],
        projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_5__["KtdGridModule"],
        _swimlane_ngx_charts__WEBPACK_IMPORTED_MODULE_6__["NgxChartsModule"],
        _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardModule"],
        _angular_material_table__WEBPACK_IMPORTED_MODULE_8__["MatTableModule"],
        _angular_material_sort__WEBPACK_IMPORTED_MODULE_10__["MatSortModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](KtdRealLifeExampleModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                declarations: [
                    _real_life_example_component__WEBPACK_IMPORTED_MODULE_2__["KtdRealLifeExampleComponent"],
                    _table_sorting_table_sorting_component__WEBPACK_IMPORTED_MODULE_9__["KtdTableSortingComponent"]
                ],
                imports: [
                    _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                    _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild(routes),
                    _angular_material_icon__WEBPACK_IMPORTED_MODULE_4__["MatIconModule"],
                    projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_5__["KtdGridModule"],
                    _swimlane_ngx_charts__WEBPACK_IMPORTED_MODULE_6__["NgxChartsModule"],
                    _angular_material_card__WEBPACK_IMPORTED_MODULE_7__["MatCardModule"],
                    _angular_material_table__WEBPACK_IMPORTED_MODULE_8__["MatTableModule"],
                    _angular_material_sort__WEBPACK_IMPORTED_MODULE_10__["MatSortModule"]
                ]
            }]
    }], null, null); })();


/***/ }),

/***/ "27ck":
/*!***********************************************************!*\
  !*** ./projects/demo-app/src/environments/environment.ts ***!
  \***********************************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "62fX":
/*!**************************************************************!*\
  !*** ./projects/angular-grid-layout/src/lib/utils/scroll.ts ***!
  \**************************************************************/
/*! exports provided: ktdScrollIfNearElementClientRect$, ktdGetScrollTotalRelativeDifference$ */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ktdScrollIfNearElementClientRect$", function() { return ktdScrollIfNearElementClientRect$; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ktdGetScrollTotalRelativeDifference$", function() { return ktdGetScrollTotalRelativeDifference$; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _passive_listeners__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./passive-listeners */ "veY6");
/* harmony import */ var _client_rect__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./client-rect */ "J3lw");
/* harmony import */ var _operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./operators */ "dck0");





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
    return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["interval"])(0, rxjs__WEBPACK_IMPORTED_MODULE_0__["animationFrameScheduler"])
        .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["tap"])(() => {
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
    }), Object(_operators__WEBPACK_IMPORTED_MODULE_4__["ktdNoEmit"])());
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
        scrollableParentClientRect = Object(_client_rect__WEBPACK_IMPORTED_MODULE_3__["getMutableClientRect"])(scrollableParent);
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
    return (source$) => source$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(({ pointerX, pointerY }) => {
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
    }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["distinctUntilChanged"])((prev, actual) => {
        return prev.verticalScrollDirection === actual.verticalScrollDirection
            && prev.horizontalScrollDirection === actual.horizontalScrollDirection;
    }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["switchMap"])(({ verticalScrollDirection, horizontalScrollDirection }) => {
        if (verticalScrollDirection || horizontalScrollDirection) {
            return scrollToDirectionInterval$(scrollNode, verticalScrollDirection, horizontalScrollDirection, options === null || options === void 0 ? void 0 : options.scrollStep);
        }
        else {
            return rxjs__WEBPACK_IMPORTED_MODULE_0__["NEVER"];
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
    return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["fromEvent"])(scrollableParent, 'scroll', Object(_passive_listeners__WEBPACK_IMPORTED_MODULE_2__["ktdNormalizePassiveListenerOptions"])({ capture: true })).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(() => {
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


/***/ }),

/***/ "90d2":
/*!*********************************************************************!*\
  !*** ./projects/demo-app/src/app/scroll-test/scroll-test.module.ts ***!
  \*********************************************************************/
/*! exports provided: KtdScrollTestModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KtdScrollTestModule", function() { return KtdScrollTestModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _scroll_test_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scroll-test.component */ "OWZb");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! projects/angular-grid-layout/src/public-api */ "XHjT");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/form-field */ "kmnG");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/input */ "qFsG");









const routes = [
    { path: 'scroll-test', component: _scroll_test_component__WEBPACK_IMPORTED_MODULE_2__["KtdScrollTestComponent"] },
];
class KtdScrollTestModule {
}
KtdScrollTestModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: KtdScrollTestModule });
KtdScrollTestModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function KtdScrollTestModule_Factory(t) { return new (t || KtdScrollTestModule)(); }, imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild(routes),
            projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_4__["KtdGridModule"],
            _angular_material_form_field__WEBPACK_IMPORTED_MODULE_5__["MatFormFieldModule"],
            _angular_material_input__WEBPACK_IMPORTED_MODULE_6__["MatInputModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](KtdScrollTestModule, { declarations: [_scroll_test_component__WEBPACK_IMPORTED_MODULE_2__["KtdScrollTestComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"], projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_4__["KtdGridModule"],
        _angular_material_form_field__WEBPACK_IMPORTED_MODULE_5__["MatFormFieldModule"],
        _angular_material_input__WEBPACK_IMPORTED_MODULE_6__["MatInputModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](KtdScrollTestModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                declarations: [
                    _scroll_test_component__WEBPACK_IMPORTED_MODULE_2__["KtdScrollTestComponent"]
                ],
                imports: [
                    _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                    _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild(routes),
                    projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_4__["KtdGridModule"],
                    _angular_material_form_field__WEBPACK_IMPORTED_MODULE_5__["MatFormFieldModule"],
                    _angular_material_input__WEBPACK_IMPORTED_MODULE_6__["MatInputModule"]
                ]
            }]
    }], null, null); })();


/***/ }),

/***/ "930P":
/*!******************************************************************!*\
  !*** ./projects/angular-grid-layout/src/lib/grid.definitions.ts ***!
  \******************************************************************/
/*! exports provided: GRID_ITEM_GET_RENDER_DATA_TOKEN */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GRID_ITEM_GET_RENDER_DATA_TOKEN", function() { return GRID_ITEM_GET_RENDER_DATA_TOKEN; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

const GRID_ITEM_GET_RENDER_DATA_TOKEN = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["InjectionToken"]('GRID_ITEM_GET_RENDER_DATA_TOKEN');


/***/ }),

/***/ "9mM0":
/*!*******************************************************************************!*\
  !*** ./projects/angular-grid-layout/src/lib/utils/react-grid-layout.utils.ts ***!
  \*******************************************************************************/
/*! exports provided: bottom, cloneLayout, cloneLayoutItem, collides, compact, compactItem, correctBounds, getLayoutItem, getFirstCollision, getAllCollisions, getStatics, moveElement, moveElementAwayFromCollision, perc, setTransform, setTopLeft, sortLayoutItems, sortLayoutItemsByRowCol, sortLayoutItemsByColRow, validateLayout, autoBindHandlers, noop */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bottom", function() { return bottom; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cloneLayout", function() { return cloneLayout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cloneLayoutItem", function() { return cloneLayoutItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "collides", function() { return collides; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "compact", function() { return compact; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "compactItem", function() { return compactItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "correctBounds", function() { return correctBounds; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLayoutItem", function() { return getLayoutItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFirstCollision", function() { return getFirstCollision; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAllCollisions", function() { return getAllCollisions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStatics", function() { return getStatics; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "moveElement", function() { return moveElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "moveElementAwayFromCollision", function() { return moveElementAwayFromCollision; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "perc", function() { return perc; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setTransform", function() { return setTransform; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setTopLeft", function() { return setTopLeft; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sortLayoutItems", function() { return sortLayoutItems; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sortLayoutItemsByRowCol", function() { return sortLayoutItemsByRowCol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sortLayoutItemsByColRow", function() { return sortLayoutItemsByColRow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateLayout", function() { return validateLayout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "autoBindHandlers", function() { return autoBindHandlers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "noop", function() { return noop; });
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


/***/ }),

/***/ "CXhs":
/*!**************************************************************************!*\
  !*** ./projects/angular-grid-layout/src/lib/coercion/number-property.ts ***!
  \**************************************************************************/
/*! exports provided: coerceNumberProperty, _isNumberValue */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "coerceNumberProperty", function() { return coerceNumberProperty; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_isNumberValue", function() { return _isNumberValue; });
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


/***/ }),

/***/ "CsN6":
/*!*********************************************************!*\
  !*** ./projects/demo-app/src/app/app-routing.module.ts ***!
  \*********************************************************/
/*! exports provided: KtdAppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KtdAppRoutingModule", function() { return KtdAppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _playground_playground_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./playground/playground.module */ "lxcd");
/* harmony import */ var _custom_handles_custom_handles_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./custom-handles/custom-handles.module */ "Ybjs");
/* harmony import */ var _real_life_example_real_life_example_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./real-life-example/real-life-example.module */ "1rW2");
/* harmony import */ var _scroll_test_scroll_test_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./scroll-test/scroll-test.module */ "90d2");








const routes = [
    {
        path: '',
        redirectTo: 'playground',
        pathMatch: 'full'
    },
    {
        path: 'custom-handles',
        redirectTo: 'custom-handles',
        pathMatch: 'full'
    },
    {
        path: 'real-life-example',
        redirectTo: 'real-life-example',
        pathMatch: 'full'
    },
    {
        path: 'scroll-test',
        redirectTo: 'scroll-test',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'playground'
    },
];
class KtdAppRoutingModule {
}
KtdAppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: KtdAppRoutingModule });
KtdAppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function KtdAppRoutingModule_Factory(t) { return new (t || KtdAppRoutingModule)(); }, imports: [[
            _playground_playground_module__WEBPACK_IMPORTED_MODULE_2__["KtdPlaygroundModule"],
            _custom_handles_custom_handles_module__WEBPACK_IMPORTED_MODULE_3__["KtdCustomHandlesModule"],
            _real_life_example_real_life_example_module__WEBPACK_IMPORTED_MODULE_4__["KtdRealLifeExampleModule"],
            _scroll_test_scroll_test_module__WEBPACK_IMPORTED_MODULE_5__["KtdScrollTestModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes, {
                enableTracing: false
            })
        ], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](KtdAppRoutingModule, { imports: [_playground_playground_module__WEBPACK_IMPORTED_MODULE_2__["KtdPlaygroundModule"],
        _custom_handles_custom_handles_module__WEBPACK_IMPORTED_MODULE_3__["KtdCustomHandlesModule"],
        _real_life_example_real_life_example_module__WEBPACK_IMPORTED_MODULE_4__["KtdRealLifeExampleModule"],
        _scroll_test_scroll_test_module__WEBPACK_IMPORTED_MODULE_5__["KtdScrollTestModule"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](KtdAppRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [
                    _playground_playground_module__WEBPACK_IMPORTED_MODULE_2__["KtdPlaygroundModule"],
                    _custom_handles_custom_handles_module__WEBPACK_IMPORTED_MODULE_3__["KtdCustomHandlesModule"],
                    _real_life_example_real_life_example_module__WEBPACK_IMPORTED_MODULE_4__["KtdRealLifeExampleModule"],
                    _scroll_test_scroll_test_module__WEBPACK_IMPORTED_MODULE_5__["KtdScrollTestModule"],
                    _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes, {
                        enableTracing: false
                    })
                ],
                exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "IUcz":
/*!************************************************************************************!*\
  !*** ./projects/demo-app/src/app/real-life-example/real-life-example.component.ts ***!
  \************************************************************************************/
/*! exports provided: KtdRealLifeExampleComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KtdRealLifeExampleComponent", function() { return KtdRealLifeExampleComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! projects/angular-grid-layout/src/public-api */ "XHjT");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _data_countries_population_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./data/countries-population.data */ "hJD3");
/* harmony import */ var _swimlane_ngx_charts__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @swimlane/ngx-charts */ "zQsl");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_grid_layout_src_lib_grid_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../angular-grid-layout/src/lib/grid.component */ "KyP5");
/* harmony import */ var _angular_grid_layout_src_lib_grid_item_grid_item_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../angular-grid-layout/src/lib/grid-item/grid-item.component */ "qcNg");
/* harmony import */ var _table_sorting_table_sorting_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./table-sorting/table-sorting.component */ "ocmN");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ "tyNb");













const _c0 = function () { return ["/playground"]; };
const _c1 = function () { return ["/custom-handles"]; };
const _c2 = function () { return ["/scroll-test"]; };
class KtdRealLifeExampleComponent {
    constructor(document) {
        this.document = document;
        this.trackById = projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_1__["ktdTrackById"];
        this.cols = 12;
        this.rowHeight = 50;
        this.compactType = 'vertical';
        this.layout = [
            { id: '0', x: 0, y: 5, w: 4, h: 10 },
            { id: '1', x: 4, y: 5, w: 4, h: 10 },
            { id: '2', x: 2, y: 0, w: 6, h: 5 },
            { id: '5', x: 8, y: 0, w: 4, h: 5 },
            { id: '3', x: 0, y: 0, w: 2, h: 5 },
            { id: '4', x: 8, y: 5, w: 4, h: 10 }
        ];
        this.layoutSizes = {};
        this.countriesPopulation = _data_countries_population_data__WEBPACK_IMPORTED_MODULE_4__["countriesPopulation"];
        this.countriesPopulationByYear = _data_countries_population_data__WEBPACK_IMPORTED_MODULE_4__["countriesPopulationByYear"];
        // options
        this.legend = true;
        this.showLabels = true;
        this.animations = true;
        this.xAxis = true;
        this.yAxis = true;
        this.showYAxisLabel = true;
        this.showXAxisLabel = true;
        this.xAxisLabel = 'Countries';
        this.yAxisLabel = 'Population';
        this.timeline = true;
        this.colorScheme = {
            domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
        };
        this.colorScheme2 = {
            domain: ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1']
        };
        this.colorSchemeGradientLinear = {
            domain: ['#4e79a7', '#f28e2c', '#e15759']
        };
    }
    ngOnInit() {
        this.resizeSubscription = Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["merge"])(Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["fromEvent"])(window, 'resize'), Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["fromEvent"])(window, 'orientationchange')).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["debounceTime"])(50)).subscribe(() => {
            this.grid.resize();
            this.calculateLayoutSizes();
        });
    }
    ngOnDestroy() {
        this.resizeSubscription.unsubscribe();
    }
    getView(gridItemId, grid) {
        const gridItemRenderData = grid.getItemRenderData(gridItemId);
        return [
            gridItemRenderData.width,
            gridItemRenderData.height
        ];
    }
    onLayoutUpdated(layout) {
        this.layout = layout;
        this.calculateLayoutSizes();
    }
    labelFormatting(c) {
        return `${(c.label)} Population`;
    }
    onSelect(id, data) {
        console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    }
    onActivate(id, data) {
        console.log('Activate', JSON.parse(JSON.stringify(data)));
    }
    onDeactivate(id, data) {
        console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    }
    /**
     * Calculates and sets the property 'this.layoutSizes' with the [width, height] of every item.
     * This is needed to set manually the [width, height] for every grid item that is a chart.
     */
    calculateLayoutSizes() {
        const gridItemsRenderData = this.grid.getItemsRenderData();
        this.layoutSizes =
            Object.keys(gridItemsRenderData)
                .reduce((acc, cur) => (Object.assign(Object.assign({}, acc), { [cur]: [gridItemsRenderData[cur].width, gridItemsRenderData[cur].height] })), {});
    }
}
KtdRealLifeExampleComponent.ɵfac = function KtdRealLifeExampleComponent_Factory(t) { return new (t || KtdRealLifeExampleComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_6__["DOCUMENT"])); };
KtdRealLifeExampleComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: KtdRealLifeExampleComponent, selectors: [["ktd-real-life-example"]], viewQuery: function KtdRealLifeExampleComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstaticViewQuery"](projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_1__["KtdGridComponent"], true);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](_swimlane_ngx_charts__WEBPACK_IMPORTED_MODULE_5__["AreaChartStackedComponent"], true);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.grid = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.areaCharts = _t);
    } }, decls: 26, vars: 49, consts: [[1, "grid-container"], [3, "cols", "rowHeight", "layout", "scrollableParent", "compactType", "layoutUpdated"], ["id", "0"], [3, "view", "scheme", "results", "gradient", "xAxis", "yAxis", "legend", "showXAxisLabel", "showYAxisLabel", "xAxisLabel", "yAxisLabel", "animations", "select"], ["id", "1"], [3, "view", "scheme", "schemeType", "results", "gradient", "xAxis", "yAxis", "legend", "legendPosition", "showXAxisLabel", "showYAxisLabel", "xAxisLabel", "yAxisLabel", "select", "activate", "deactivate"], ["id", "2"], [3, "view", "scheme", "results", "gradient", "animations", "labelFormatting", "select"], ["id", "3"], [1, "ktd-grid-img-container"], ["src", "assets/icons/katoid-icon-192x192.png"], ["id", "4", 1, "ktd-grid-item-table"], ["id", "5"], [3, "view", "scheme", "results", "gradient", "legend", "labels", "doughnut", "select", "activate", "deactivate"], [2, "margin-top", "16px"], [2, "display", "flex", "flex-direction", "column"], [3, "routerLink"]], template: function KtdRealLifeExampleComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "h1");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Angular Grid Layout - Real life example");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "ktd-grid", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("layoutUpdated", function KtdRealLifeExampleComponent_Template_ktd_grid_layoutUpdated_3_listener($event) { return ctx.onLayoutUpdated($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "ktd-grid-item", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "ngx-charts-bar-vertical-stacked", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("select", function KtdRealLifeExampleComponent_Template_ngx_charts_bar_vertical_stacked_select_5_listener($event) { return ctx.onSelect("0", $event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "ktd-grid-item", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "ngx-charts-bar-horizontal-2d", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("select", function KtdRealLifeExampleComponent_Template_ngx_charts_bar_horizontal_2d_select_7_listener($event) { return ctx.onSelect("1", $event); })("activate", function KtdRealLifeExampleComponent_Template_ngx_charts_bar_horizontal_2d_activate_7_listener($event) { return ctx.onActivate("1", $event); })("deactivate", function KtdRealLifeExampleComponent_Template_ngx_charts_bar_horizontal_2d_deactivate_7_listener($event) { return ctx.onDeactivate("1", $event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "ktd-grid-item", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "ngx-charts-tree-map", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("select", function KtdRealLifeExampleComponent_Template_ngx_charts_tree_map_select_9_listener($event) { return ctx.onSelect("2", $event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "ktd-grid-item", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](12, "img", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "ktd-grid-item", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](14, "ktd-table-sorting");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "ktd-grid-item", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "ngx-charts-pie-chart", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("select", function KtdRealLifeExampleComponent_Template_ngx_charts_pie_chart_select_16_listener($event) { return ctx.onSelect("5", $event); })("activate", function KtdRealLifeExampleComponent_Template_ngx_charts_pie_chart_activate_16_listener($event) { return ctx.onActivate("5", $event); })("deactivate", function KtdRealLifeExampleComponent_Template_ngx_charts_pie_chart_deactivate_16_listener($event) { return ctx.onDeactivate("5", $event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "h2", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "Other examples: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "a", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "Playground");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "a", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "Custom handles");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "a", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, "Scroll test");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("cols", ctx.cols)("rowHeight", ctx.rowHeight)("layout", ctx.layout)("scrollableParent", ctx.document)("compactType", ctx.compactType);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("view", ctx.layoutSizes["0"])("scheme", ctx.colorScheme2)("results", ctx.countriesPopulationByYear)("gradient", false)("xAxis", ctx.xAxis)("yAxis", ctx.yAxis)("legend", true)("showXAxisLabel", ctx.showXAxisLabel)("showYAxisLabel", ctx.showYAxisLabel)("xAxisLabel", ctx.xAxisLabel)("yAxisLabel", ctx.yAxisLabel)("animations", ctx.animations);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("view", ctx.layoutSizes["1"])("scheme", ctx.colorSchemeGradientLinear)("schemeType", "linear")("results", ctx.countriesPopulationByYear)("gradient", false)("xAxis", ctx.xAxis)("yAxis", ctx.yAxis)("legend", false)("legendPosition", "below")("showXAxisLabel", ctx.showXAxisLabel)("showYAxisLabel", ctx.showYAxisLabel)("xAxisLabel", ctx.yAxisLabel)("yAxisLabel", ctx.xAxisLabel);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("view", ctx.layoutSizes["2"])("scheme", ctx.colorScheme)("results", ctx.countriesPopulation)("gradient", false)("animations", true)("labelFormatting", ctx.labelFormatting);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("view", ctx.layoutSizes["5"])("scheme", ctx.colorScheme)("results", ctx.countriesPopulation)("gradient", false)("legend", false)("labels", ctx.showLabels)("doughnut", false);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](46, _c0));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](47, _c1));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](48, _c2));
    } }, directives: [_angular_grid_layout_src_lib_grid_component__WEBPACK_IMPORTED_MODULE_7__["KtdGridComponent"], _angular_grid_layout_src_lib_grid_item_grid_item_component__WEBPACK_IMPORTED_MODULE_8__["KtdGridItemComponent"], _swimlane_ngx_charts__WEBPACK_IMPORTED_MODULE_5__["BarVerticalStackedComponent"], _swimlane_ngx_charts__WEBPACK_IMPORTED_MODULE_5__["BarHorizontal2DComponent"], _swimlane_ngx_charts__WEBPACK_IMPORTED_MODULE_5__["TreeMapComponent"], _table_sorting_table_sorting_component__WEBPACK_IMPORTED_MODULE_9__["KtdTableSortingComponent"], _swimlane_ngx_charts__WEBPACK_IMPORTED_MODULE_5__["PieChartComponent"], _angular_router__WEBPACK_IMPORTED_MODULE_10__["RouterLinkWithHref"]], styles: ["[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n  padding: 24px;\n  box-sizing: border-box;\n}\n[_nghost-%COMP%]   .grid-container[_ngcontent-%COMP%] {\n  padding: 4px;\n  box-sizing: border-box;\n  border: 1px solid gray;\n  border-radius: 2px;\n  background: #313131;\n}\n[_nghost-%COMP%]   ktd-grid[_ngcontent-%COMP%] {\n  transition: height 500ms ease;\n}\n[_nghost-%COMP%]   ktd-grid-item[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  background: #ccc;\n  border: 1px solid black;\n  color: black;\n}\n[_nghost-%COMP%]   ktd-grid-item.ktd-grid-item-table[_ngcontent-%COMP%] {\n  padding: 16px;\n  box-sizing: border-box;\n  border: none;\n  background: transparent;\n}\n[_nghost-%COMP%]   .ktd-grid-img-container[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  background-color: #e67301;\n}\n[_nghost-%COMP%]   .ktd-grid-img-container[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: contain;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxccmVhbC1saWZlLWV4YW1wbGUuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxjQUFBO0VBQ0EsV0FBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtBQUNKO0FBQ0k7RUFDSSxZQUFBO0VBQ0Esc0JBQUE7RUFDQSxzQkFBQTtFQUNBLGtCQUFBO0VBQ0EsbUJBQUE7QUFDUjtBQUVJO0VBQ0ksNkJBQUE7QUFBUjtBQUdJO0VBQ0ksc0JBQUE7RUFDQSxnQkFBQTtFQUNBLHVCQUFBO0VBQ0EsWUFBQTtBQURSO0FBR1E7RUFDSSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxZQUFBO0VBQ0EsdUJBQUE7QUFEWjtBQUtJO0VBQ0ksV0FBQTtFQUNBLFlBQUE7RUFDQSx5QkFBQTtBQUhSO0FBS1E7RUFDSSxXQUFBO0VBQ0EsWUFBQTtFQUNBLG1CQUFBO0FBSFoiLCJmaWxlIjoicmVhbC1saWZlLWV4YW1wbGUuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgcGFkZGluZzogMjRweDtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuXG4gICAgLmdyaWQtY29udGFpbmVyIHtcbiAgICAgICAgcGFkZGluZzogNHB4O1xuICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBncmF5O1xuICAgICAgICBib3JkZXItcmFkaXVzOiAycHg7XG4gICAgICAgIGJhY2tncm91bmQ6ICMzMTMxMzE7XG4gICAgfVxuXG4gICAga3RkLWdyaWQge1xuICAgICAgICB0cmFuc2l0aW9uOiBoZWlnaHQgNTAwbXMgZWFzZTtcbiAgICB9XG5cbiAgICBrdGQtZ3JpZC1pdGVtIHtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgYmFja2dyb3VuZDogI2NjYztcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XG4gICAgICAgIGNvbG9yOiBibGFjaztcblxuICAgICAgICAmLmt0ZC1ncmlkLWl0ZW0tdGFibGUge1xuICAgICAgICAgICAgcGFkZGluZzogMTZweDtcbiAgICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC5rdGQtZ3JpZC1pbWctY29udGFpbmVyIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2U2NzMwMTtcblxuICAgICAgICBpbWcge1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgICAgICBvYmplY3QtZml0OiBjb250YWluO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](KtdRealLifeExampleComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'ktd-real-life-example',
                templateUrl: './real-life-example.component.html',
                styleUrls: ['./real-life-example.component.scss']
            }]
    }], function () { return [{ type: Document, decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"],
                args: [_angular_common__WEBPACK_IMPORTED_MODULE_6__["DOCUMENT"]]
            }] }]; }, { grid: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: [projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_1__["KtdGridComponent"], { static: true }]
        }], areaCharts: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChildren"],
            args: [_swimlane_ngx_charts__WEBPACK_IMPORTED_MODULE_5__["AreaChartStackedComponent"]]
        }] }); })();


/***/ }),

/***/ "J3lw":
/*!*******************************************************************!*\
  !*** ./projects/angular-grid-layout/src/lib/utils/client-rect.ts ***!
  \*******************************************************************/
/*! exports provided: getMutableClientRect, isInsideClientRect, adjustClientRect, isPointerNearClientRect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMutableClientRect", function() { return getMutableClientRect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isInsideClientRect", function() { return isInsideClientRect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "adjustClientRect", function() { return adjustClientRect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPointerNearClientRect", function() { return isPointerNearClientRect; });
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


/***/ }),

/***/ "JzQ3":
/*!***************************************************************************!*\
  !*** ./projects/angular-grid-layout/src/lib/coercion/boolean-property.ts ***!
  \***************************************************************************/
/*! exports provided: coerceBooleanProperty */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "coerceBooleanProperty", function() { return coerceBooleanProperty; });
/** Coerces a data-bound value (typically a string) to a boolean. */
function coerceBooleanProperty(value) {
    return value != null && `${value}` !== 'false';
}


/***/ }),

/***/ "KyP5":
/*!****************************************************************!*\
  !*** ./projects/angular-grid-layout/src/lib/grid.component.ts ***!
  \****************************************************************/
/*! exports provided: parseRenderItemToPixels, __gridItemGetRenderDataFactoryFunc, ktdGridItemGetRenderDataFactoryFunc, KtdGridComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseRenderItemToPixels", function() { return parseRenderItemToPixels; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__gridItemGetRenderDataFactoryFunc", function() { return __gridItemGetRenderDataFactoryFunc; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ktdGridItemGetRenderDataFactoryFunc", function() { return ktdGridItemGetRenderDataFactoryFunc; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KtdGridComponent", function() { return KtdGridComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _coercion_number_property__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./coercion/number-property */ "CXhs");
/* harmony import */ var _grid_item_grid_item_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./grid-item/grid-item.component */ "qcNg");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _utils_grid_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/grid.utils */ "byCZ");
/* harmony import */ var _utils_react_grid_layout_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/react-grid-layout.utils */ "9mM0");
/* harmony import */ var _grid_definitions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./grid.definitions */ "930P");
/* harmony import */ var _utils_pointer_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils/pointer.utils */ "vARK");
/* harmony import */ var _utils_client_rect__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./utils/client-rect */ "J3lw");
/* harmony import */ var _utils_scroll__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./utils/scroll */ "62fX");
/* harmony import */ var _coercion_boolean_property__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./coercion/boolean-property */ "JzQ3");
/* harmony import */ var _grid_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./grid.service */ "/Jds");














const _c0 = ["*"];
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
        this.layoutUpdated = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        /** Emits when drag starts */
        this.dragStarted = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        /** Emits when resize starts */
        this.resizeStarted = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        /** Emits when drag ends */
        this.dragEnded = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        /** Emits when resize ends */
        this.resizeEnded = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
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
        this._compactOnPropsChange = Object(_coercion_boolean_property__WEBPACK_IMPORTED_MODULE_11__["coerceBooleanProperty"])(value);
    }
    /** If true, grid items won't change position when being dragged over. Handy when using no compaction */
    get preventCollision() { return this._preventCollision; }
    set preventCollision(value) {
        this._preventCollision = Object(_coercion_boolean_property__WEBPACK_IMPORTED_MODULE_11__["coerceBooleanProperty"])(value);
    }
    /** Number of CSS pixels that would be scrolled on each 'tick' when auto scroll is performed. */
    get scrollSpeed() { return this._scrollSpeed; }
    set scrollSpeed(value) {
        this._scrollSpeed = Object(_coercion_number_property__WEBPACK_IMPORTED_MODULE_1__["coerceNumberProperty"])(value, 2);
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
        this._rowHeight = Math.max(1, Math.round(Object(_coercion_number_property__WEBPACK_IMPORTED_MODULE_1__["coerceNumberProperty"])(val)));
    }
    /** Number of columns  */
    get cols() { return this._cols; }
    set cols(val) {
        this._cols = Math.max(1, Math.round(Object(_coercion_number_property__WEBPACK_IMPORTED_MODULE_1__["coerceNumberProperty"])(val)));
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
        this.layout = Object(_utils_react_grid_layout_utils__WEBPACK_IMPORTED_MODULE_6__["compact"])(this.layout, this.compactType, this.cols);
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
            this._gridItems.changes.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["startWith"])(this._gridItems), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["switchMap"])((gridItems) => {
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["merge"])(...gridItems.map((gridItem) => gridItem.dragStart$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])((event) => ({ event, gridItem, type: 'drag' })))), ...gridItems.map((gridItem) => gridItem.resizeStart$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])((event) => ({ event, gridItem, type: 'resize' }))))).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["exhaustMap"])(({ event, gridItem, type }) => {
                    // Emit drag or resize start events. Ensure that is start event is inside the zone.
                    this.ngZone.run(() => (type === 'drag' ? this.dragStarted : this.resizeStarted).emit(getDragResizeEventData(gridItem, this.layout)));
                    // Get the correct newStateFunc depending on if we are dragging or resizing
                    const calcNewStateFunc = type === 'drag' ? _utils_grid_utils__WEBPACK_IMPORTED_MODULE_5__["ktdGridItemDragging"] : _utils_grid_utils__WEBPACK_IMPORTED_MODULE_5__["ktdGridItemResizing"];
                    // Perform drag sequence
                    return this.performDragSequence$(gridItem, event, (gridItemId, config, compactionType, draggingData) => calcNewStateFunc(gridItemId, config, compactionType, draggingData)).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])((layout) => ({ layout, gridItem, type })));
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
        return new rxjs__WEBPACK_IMPORTED_MODULE_3__["Observable"]((observer) => {
            // Retrieve grid (parent) and gridItem (draggedElem) client rects.
            const gridElemClientRect = Object(_utils_client_rect__WEBPACK_IMPORTED_MODULE_9__["getMutableClientRect"])(this.elementRef.nativeElement);
            const dragElemClientRect = Object(_utils_client_rect__WEBPACK_IMPORTED_MODULE_9__["getMutableClientRect"])(gridItem.elementRef.nativeElement);
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
            const scrollSubscription = this.ngZone.runOutsideAngular(() => (!scrollableParent ? rxjs__WEBPACK_IMPORTED_MODULE_3__["NEVER"] : this.gridService.mouseOrTouchMove$(document).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])((event) => ({
                pointerX: Object(_utils_pointer_utils__WEBPACK_IMPORTED_MODULE_8__["ktdPointerClientX"])(event),
                pointerY: Object(_utils_pointer_utils__WEBPACK_IMPORTED_MODULE_8__["ktdPointerClientY"])(event)
            })), Object(_utils_scroll__WEBPACK_IMPORTED_MODULE_10__["ktdScrollIfNearElementClientRect$"])(scrollableParent, { scrollStep: this.scrollSpeed }))).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(Object(_utils_pointer_utils__WEBPACK_IMPORTED_MODULE_8__["ktdMouseOrTouchEnd"])(document))).subscribe());
            /**
             * Main subscription, it listens for 'pointer move' and 'scroll' events and recalculates the layout on each emission
             */
            const subscription = this.ngZone.runOutsideAngular(() => Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["merge"])(Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["combineLatest"])([
                this.gridService.mouseOrTouchMove$(document),
                ...(!scrollableParent ? [Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])({ top: 0, left: 0 })] : [
                    Object(_utils_scroll__WEBPACK_IMPORTED_MODULE_10__["ktdGetScrollTotalRelativeDifference$"])(scrollableParent).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["startWith"])({ top: 0, left: 0 }) // Force first emission to allow CombineLatest to emit even no scroll event has occurred
                    )
                ])
            ])).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["takeUntil"])(Object(_utils_pointer_utils__WEBPACK_IMPORTED_MODULE_8__["ktdMouseOrTouchEnd"])(document))).subscribe(([pointerDragEvent, scrollDifference]) => {
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
KtdGridComponent.ɵfac = function KtdGridComponent_Factory(t) { return new (t || KtdGridComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_grid_service__WEBPACK_IMPORTED_MODULE_12__["KtdGridService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"])); };
KtdGridComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: KtdGridComponent, selectors: [["ktd-grid"]], contentQueries: function KtdGridComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontentQuery"](dirIndex, _grid_item_grid_item_component__WEBPACK_IMPORTED_MODULE_2__["KtdGridItemComponent"], true);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx._gridItems = _t);
    } }, inputs: { scrollableParent: "scrollableParent", compactOnPropsChange: "compactOnPropsChange", preventCollision: "preventCollision", scrollSpeed: "scrollSpeed", compactType: "compactType", rowHeight: "rowHeight", cols: "cols", layout: "layout" }, outputs: { layoutUpdated: "layoutUpdated", dragStarted: "dragStarted", resizeStarted: "resizeStarted", dragEnded: "dragEnded", resizeEnded: "resizeEnded" }, features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵProvidersFeature"]([
            {
                provide: _grid_definitions__WEBPACK_IMPORTED_MODULE_7__["GRID_ITEM_GET_RENDER_DATA_TOKEN"],
                useFactory: ktdGridItemGetRenderDataFactoryFunc,
                deps: [KtdGridComponent]
            }
        ]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵNgOnChangesFeature"]], ngContentSelectors: _c0, decls: 1, vars: 0, template: function KtdGridComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojectionDef"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](0);
    } }, styles: ["ktd-grid {\n  display: block;\n  position: relative;\n  width: 100%;\n}\nktd-grid ktd-grid-item.ktd-grid-item-dragging {\n  z-index: 1000;\n}\nktd-grid ktd-grid-item.no-transitions {\n  transition: none !important;\n}\nktd-grid .ktd-grid-item-placeholder {\n  position: absolute;\n  background-color: darkred;\n  opacity: 0.6;\n  z-index: 0;\n  transition-property: transform;\n  transition: all 150ms ease;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxncmlkLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksY0FBQTtFQUNBLGtCQUFBO0VBQ0EsV0FBQTtBQUNKO0FBRVE7RUFDSSxhQUFBO0FBQVo7QUFHUTtFQUNJLDJCQUFBO0FBRFo7QUFLSTtFQUNJLGtCQUFBO0VBQ0EseUJBQUE7RUFDQSxZQUFBO0VBQ0EsVUFBQTtFQUNBLDhCQUFBO0VBQ0EsMEJBQUE7QUFIUiIsImZpbGUiOiJncmlkLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsia3RkLWdyaWQge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICB3aWR0aDogMTAwJTtcblxuICAgIGt0ZC1ncmlkLWl0ZW0ge1xuICAgICAgICAmLmt0ZC1ncmlkLWl0ZW0tZHJhZ2dpbmcge1xuICAgICAgICAgICAgei1pbmRleDogMTAwMDtcbiAgICAgICAgfVxuXG4gICAgICAgICYubm8tdHJhbnNpdGlvbnMge1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogbm9uZSAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLmt0ZC1ncmlkLWl0ZW0tcGxhY2Vob2xkZXIge1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IGRhcmtyZWQ7XG4gICAgICAgIG9wYWNpdHk6IDAuNjtcbiAgICAgICAgei1pbmRleDogMDtcbiAgICAgICAgdHJhbnNpdGlvbi1wcm9wZXJ0eTogdHJhbnNmb3JtO1xuICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMTUwbXMgZWFzZTtcbiAgICB9XG59XG4iXX0= */"], encapsulation: 2, changeDetection: 0 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](KtdGridComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'ktd-grid',
                templateUrl: './grid.component.html',
                styleUrls: ['./grid.component.scss'],
                encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewEncapsulation"].None,
                changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush,
                providers: [
                    {
                        provide: _grid_definitions__WEBPACK_IMPORTED_MODULE_7__["GRID_ITEM_GET_RENDER_DATA_TOKEN"],
                        useFactory: ktdGridItemGetRenderDataFactoryFunc,
                        deps: [KtdGridComponent]
                    }
                ]
            }]
    }], function () { return [{ type: _grid_service__WEBPACK_IMPORTED_MODULE_12__["KtdGridService"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"] }]; }, { _gridItems: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ContentChildren"],
            args: [_grid_item_grid_item_component__WEBPACK_IMPORTED_MODULE_2__["KtdGridItemComponent"], { descendants: true }]
        }], layoutUpdated: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }], dragStarted: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }], resizeStarted: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }], dragEnded: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }], resizeEnded: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }], scrollableParent: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], compactOnPropsChange: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], preventCollision: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], scrollSpeed: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], compactType: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], rowHeight: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], cols: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], layout: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }] }); })();


/***/ }),

/***/ "OKna":
/*!******************************************************************************!*\
  !*** ./projects/demo-app/src/app/custom-handles/custom-handles.component.ts ***!
  \******************************************************************************/
/*! exports provided: KtdCustomHandlesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KtdCustomHandlesComponent", function() { return KtdCustomHandlesComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! projects/angular-grid-layout/src/public-api */ "XHjT");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_grid_layout_src_lib_grid_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../angular-grid-layout/src/lib/grid.component */ "KyP5");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _angular_grid_layout_src_lib_grid_item_grid_item_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../angular-grid-layout/src/lib/grid-item/grid-item.component */ "qcNg");
/* harmony import */ var _angular_grid_layout_src_lib_directives_drag_handle__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../angular-grid-layout/src/lib/directives/drag-handle */ "xJKi");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/icon */ "NFeN");
/* harmony import */ var _angular_grid_layout_src_lib_directives_resize_handle__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../angular-grid-layout/src/lib/directives/resize-handle */ "wesb");













function KtdCustomHandlesComponent_ktd_grid_item_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "ktd-grid-item", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Handle 1");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Handle 2");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "mat-icon", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "open_in_full");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const item_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("id", item_r1.id);
} }
const _c0 = function () { return ["/playground"]; };
const _c1 = function () { return ["/real-life-example"]; };
const _c2 = function () { return ["/scroll-test"]; };
class KtdCustomHandlesComponent {
    constructor(document) {
        this.document = document;
        this.trackById = projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_3__["ktdTrackById"];
        this.layout = [
            { id: '0', x: 0, y: 0, w: 3, h: 3 },
            { id: '1', x: 3, y: 0, w: 3, h: 4 },
            { id: '2', x: 6, y: 0, w: 3, h: 5 },
            { id: '3', x: 9, y: 0, w: 3, h: 6 }
        ];
    }
    ngOnInit() {
        this.resizeSubscription = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["merge"])(Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["fromEvent"])(window, 'resize'), Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["fromEvent"])(window, 'orientationchange')).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["debounceTime"])(50)).subscribe(() => {
            this.grid.resize();
        });
    }
    ngOnDestroy() {
        this.resizeSubscription.unsubscribe();
    }
    onLayoutUpdated(layout) {
        this.layout = layout;
    }
}
KtdCustomHandlesComponent.ɵfac = function KtdCustomHandlesComponent_Factory(t) { return new (t || KtdCustomHandlesComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_4__["DOCUMENT"])); };
KtdCustomHandlesComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: KtdCustomHandlesComponent, selectors: [["ktd-custom-handles"]], viewQuery: function KtdCustomHandlesComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstaticViewQuery"](projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_3__["KtdGridComponent"], true);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.grid = _t.first);
    } }, decls: 14, vars: 10, consts: [[1, "grid-container"], ["cols", "12", "rowHeight", "50", "compactType", "vertical", "compactOnPropsChange", "true", "preventCollision", "false", 3, "layout", "scrollableParent", "layoutUpdated"], ["draggable", "true", "resizable", "true", "dragStartThreshold", "0", 3, "id", 4, "ngFor", "ngForOf", "ngForTrackBy"], [2, "margin-top", "16px"], [2, "display", "flex", "flex-direction", "column"], [3, "routerLink"], ["draggable", "true", "resizable", "true", "dragStartThreshold", "0", 3, "id"], ["ktdGridDragHandle", "", 1, "handle-1"], [1, "grid-item-content"], ["ktdGridDragHandle", "", 1, "handle-2"], ["ktdGridResizeHandle", "", 1, "resize-handle-1"]], template: function KtdCustomHandlesComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "h1");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Angular Grid Layout - Custom handles");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "ktd-grid", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("layoutUpdated", function KtdCustomHandlesComponent_Template_ktd_grid_layoutUpdated_3_listener($event) { return ctx.onLayoutUpdated($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, KtdCustomHandlesComponent_ktd_grid_item_4_Template, 8, 1, "ktd-grid-item", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "h2", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Other examples: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "a", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Playground");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "a", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Real life example");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "a", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "Scroll test");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("layout", ctx.layout)("scrollableParent", ctx.document);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.layout)("ngForTrackBy", ctx.trackById);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](7, _c0));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](8, _c1));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](9, _c2));
    } }, directives: [_angular_grid_layout_src_lib_grid_component__WEBPACK_IMPORTED_MODULE_5__["KtdGridComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgForOf"], _angular_router__WEBPACK_IMPORTED_MODULE_6__["RouterLinkWithHref"], _angular_grid_layout_src_lib_grid_item_grid_item_component__WEBPACK_IMPORTED_MODULE_7__["KtdGridItemComponent"], _angular_grid_layout_src_lib_directives_drag_handle__WEBPACK_IMPORTED_MODULE_8__["KtdGridDragHandle"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_9__["MatIcon"], _angular_grid_layout_src_lib_directives_resize_handle__WEBPACK_IMPORTED_MODULE_10__["KtdGridResizeHandle"]], styles: ["[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n  padding: 24px;\n  box-sizing: border-box;\n}\n[_nghost-%COMP%]   .grid-container[_ngcontent-%COMP%] {\n  padding: 4px;\n  box-sizing: border-box;\n  border: 1px solid gray;\n  border-radius: 2px;\n  background: #313131;\n}\n[_nghost-%COMP%]   .grid-item-content[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  background: #ccc;\n  border: 1px solid black;\n  color: black;\n  width: 100%;\n  height: 100%;\n  -webkit-user-select: none;\n          user-select: none;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n[_nghost-%COMP%]   ktd-grid[_ngcontent-%COMP%] {\n  transition: height 500ms ease;\n}\n[_nghost-%COMP%]   ktd-grid-item[_ngcontent-%COMP%]   .handle-1[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 4px;\n  left: 4px;\n  border: 1px solid #121212;\n  border-radius: 2px;\n  color: #121212;\n  cursor: grab;\n}\n[_nghost-%COMP%]   ktd-grid-item[_ngcontent-%COMP%]   .handle-2[_ngcontent-%COMP%] {\n  border: 1px solid #121212;\n  border-radius: 2px;\n  color: #121212;\n  cursor: move;\n}\n[_nghost-%COMP%]   ktd-grid-item.ktd-grid-item-dragging[_ngcontent-%COMP%]   .handle-1[_ngcontent-%COMP%] {\n  cursor: grabbing;\n}\n[_nghost-%COMP%]   ktd-grid-item[_ngcontent-%COMP%]   .resize-handle-1[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 4px;\n  bottom: 4px;\n  width: 24px;\n  height: 24px;\n  cursor: se-resize;\n  border: 1px solid #121212;\n  color: #121212;\n  transform: rotate(90deg);\n}\n[_nghost-%COMP%]     .ktd-grid-item-placeholder {\n  background-color: #ffa726;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcY3VzdG9tLWhhbmRsZXMuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxjQUFBO0VBQ0EsV0FBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtBQUNKO0FBQ0k7RUFDSSxZQUFBO0VBQ0Esc0JBQUE7RUFDQSxzQkFBQTtFQUNBLGtCQUFBO0VBQ0EsbUJBQUE7QUFDUjtBQUVJO0VBQ0ksc0JBQUE7RUFDQSxnQkFBQTtFQUNBLHVCQUFBO0VBQ0EsWUFBQTtFQUNBLFdBQUE7RUFDQSxZQUFBO0VBQ0EseUJBQUE7VUFBQSxpQkFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0FBQVI7QUFHSTtFQUNJLDZCQUFBO0FBRFI7QUFLUTtFQUNJLGtCQUFBO0VBQ0EsUUFBQTtFQUNBLFNBQUE7RUFDQSx5QkFBQTtFQUNBLGtCQUFBO0VBQ0EsY0FBQTtFQUNBLFlBQUE7QUFIWjtBQU1RO0VBQ0kseUJBQUE7RUFDQSxrQkFBQTtFQUNBLGNBQUE7RUFDQSxZQUFBO0FBSlo7QUFRWTtFQUNJLGdCQUFBO0FBTmhCO0FBVVE7RUFDSSxrQkFBQTtFQUNBLFVBQUE7RUFDQSxXQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSxpQkFBQTtFQUNBLHlCQUFBO0VBQ0EsY0FBQTtFQUNBLHdCQUFBO0FBUlo7QUFjSTtFQUNJLHlCQUFBO0FBWlIiLCJmaWxlIjoiY3VzdG9tLWhhbmRsZXMuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgcGFkZGluZzogMjRweDtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuXG4gICAgLmdyaWQtY29udGFpbmVyIHtcbiAgICAgICAgcGFkZGluZzogNHB4O1xuICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBncmF5O1xuICAgICAgICBib3JkZXItcmFkaXVzOiAycHg7XG4gICAgICAgIGJhY2tncm91bmQ6ICMzMTMxMzE7XG4gICAgfVxuXG4gICAgLmdyaWQtaXRlbS1jb250ZW50IHtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgYmFja2dyb3VuZDogI2NjYztcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgYmxhY2s7XG4gICAgICAgIGNvbG9yOiBibGFjaztcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIH1cblxuICAgIGt0ZC1ncmlkIHtcbiAgICAgICAgdHJhbnNpdGlvbjogaGVpZ2h0IDUwMG1zIGVhc2U7XG4gICAgfVxuXG4gICAga3RkLWdyaWQtaXRlbSB7XG4gICAgICAgIC5oYW5kbGUtMSB7XG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgICB0b3A6IDRweDtcbiAgICAgICAgICAgIGxlZnQ6IDRweDtcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICMxMjEyMTI7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAycHg7XG4gICAgICAgICAgICBjb2xvcjogIzEyMTIxMjtcbiAgICAgICAgICAgIGN1cnNvcjogZ3JhYjtcbiAgICAgICAgfVxuXG4gICAgICAgIC5oYW5kbGUtMiB7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjMTIxMjEyO1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMnB4O1xuICAgICAgICAgICAgY29sb3I6ICMxMjEyMTI7XG4gICAgICAgICAgICBjdXJzb3I6IG1vdmU7XG4gICAgICAgIH1cblxuICAgICAgICAmLmt0ZC1ncmlkLWl0ZW0tZHJhZ2dpbmcge1xuICAgICAgICAgICAgLmhhbmRsZS0xIHtcbiAgICAgICAgICAgICAgICBjdXJzb3I6IGdyYWJiaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLnJlc2l6ZS1oYW5kbGUtMSB7XG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgICByaWdodDogNHB4O1xuICAgICAgICAgICAgYm90dG9tOiA0cHg7XG4gICAgICAgICAgICB3aWR0aDogMjRweDtcbiAgICAgICAgICAgIGhlaWdodDogMjRweDtcbiAgICAgICAgICAgIGN1cnNvcjogc2UtcmVzaXplO1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgIzEyMTIxMjtcbiAgICAgICAgICAgIGNvbG9yOiAjMTIxMjEyO1xuICAgICAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvLyBjdXN0b21pemUgcGxhY2Vob2xkZXJcbiAgICA6Om5nLWRlZXAgLmt0ZC1ncmlkLWl0ZW0tcGxhY2Vob2xkZXIge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZhNzI2O1xuICAgIH1cblxufVxuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](KtdCustomHandlesComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'ktd-custom-handles',
                templateUrl: './custom-handles.component.html',
                styleUrls: ['./custom-handles.component.scss']
            }]
    }], function () { return [{ type: Document, decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"],
                args: [_angular_common__WEBPACK_IMPORTED_MODULE_4__["DOCUMENT"]]
            }] }]; }, { grid: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: [projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_3__["KtdGridComponent"], { static: true }]
        }] }); })();


/***/ }),

/***/ "OWZb":
/*!************************************************************************!*\
  !*** ./projects/demo-app/src/app/scroll-test/scroll-test.component.ts ***!
  \************************************************************************/
/*! exports provided: KtdScrollTestComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KtdScrollTestComponent", function() { return KtdScrollTestComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! projects/angular-grid-layout/src/public-api */ "XHjT");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/cdk/coercion */ "8LU1");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/form-field */ "kmnG");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/input */ "qFsG");
/* harmony import */ var _angular_grid_layout_src_lib_grid_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../angular-grid-layout/src/lib/grid.component */ "KyP5");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _angular_grid_layout_src_lib_grid_item_grid_item_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../angular-grid-layout/src/lib/grid-item/grid-item.component */ "qcNg");













const _c0 = ["grid1"];
const _c1 = ["grid2"];
function KtdScrollTestComponent_ktd_grid_item_14_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "ktd-grid-item", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const item_r6 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("id", item_r6.id);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](item_r6.id);
} }
function KtdScrollTestComponent_ktd_grid_item_22_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "ktd-grid-item", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const item_r7 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("id", item_r7.id);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](item_r7.id);
} }
const _c2 = function () { return ["/playground"]; };
const _c3 = function () { return ["/custom-handles"]; };
const _c4 = function () { return ["/real-life-example"]; };
function generateLayout2(cols, size) {
    const rows = cols;
    const layout = [];
    let counter = 0;
    for (let i = 0; i < rows; i += size) {
        for (let j = i; j < cols; j += size) {
            layout.push({
                id: `${counter}`,
                x: j,
                y: i,
                w: size,
                h: size
            });
            counter++;
        }
    }
    return layout;
}
class KtdScrollTestComponent {
    constructor(document) {
        this.document = document;
        this.trackById = projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_1__["ktdTrackById"];
        this.cols = 12;
        this.rowHeight = 50;
        this.compactType = 'vertical';
        this.scrollSpeed = 2;
        this.layout1 = [
            { id: '0', x: 0, y: 0, w: 3, h: 3 },
            { id: '1', x: 3, y: 0, w: 3, h: 3 },
            { id: '2', x: 6, y: 0, w: 3, h: 3 },
            { id: '3', x: 9, y: 0, w: 3, h: 3 },
            { id: '4', x: 3, y: 3, w: 3, h: 3 },
            { id: '5', x: 6, y: 3, w: 3, h: 3 },
            { id: '6', x: 9, y: 3, w: 3, h: 3 },
            { id: '7', x: 3, y: 6, w: 3, h: 3 },
            { id: '8', x: 3, y: 9, w: 3, h: 3 },
            { id: '9', x: 3, y: 12, w: 3, h: 3 },
            { id: '10', x: 3, y: 15, w: 3, h: 3 },
            { id: '11', x: 3, y: 18, w: 3, h: 3 }
        ];
        this.cols2 = 36;
        this.layout2 = generateLayout2(this.cols2, 3);
    }
    ngOnInit() {
        this.resizeSubscription = Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["merge"])(Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["fromEvent"])(window, 'resize'), Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["fromEvent"])(window, 'orientationchange')).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["debounceTime"])(50)).subscribe(() => {
            this.grid1.resize();
            this.grid2.resize();
        });
    }
    ngOnDestroy() {
        this.resizeSubscription.unsubscribe();
    }
    onScrollSpeedChange(event) {
        this.scrollSpeed = Object(_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_5__["coerceNumberProperty"])(event.target.value);
    }
}
KtdScrollTestComponent.ɵfac = function KtdScrollTestComponent_Factory(t) { return new (t || KtdScrollTestComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_4__["DOCUMENT"])); };
KtdScrollTestComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: KtdScrollTestComponent, selectors: [["ktd-scroll-test"]], viewQuery: function KtdScrollTestComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstaticViewQuery"](_c0, true, projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_1__["KtdGridComponent"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstaticViewQuery"](_c1, true, projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_1__["KtdGridComponent"]);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.grid1 = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.grid2 = _t.first);
    } }, decls: 32, vars: 23, consts: [["color", "accent"], ["matInput", "", "type", "number", 3, "value", "input"], [1, "grids-container"], [1, "grid-container-1"], ["gridContainer1", ""], [3, "cols", "rowHeight", "layout", "scrollableParent", "scrollSpeed", "compactType"], ["grid1", ""], [3, "id", 4, "ngFor", "ngForOf", "ngForTrackBy"], [2, "margin-left", "32px"], [1, "grid-container-2"], ["gridContainer2", ""], ["grid2", ""], [2, "margin-top", "16px"], [2, "display", "flex", "flex-direction", "column"], [3, "routerLink"], [3, "id"], [1, "grid-item-content"]], template: function KtdScrollTestComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "h1");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Angular Grid Layout - Scroll test");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "mat-form-field", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4, "Scroll Speed");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "input", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("input", function KtdScrollTestComponent_Template_input_input_5_listener($event) { return ctx.onScrollSpeedChange($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Scroll Vertical");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 3, 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "ktd-grid", 5, 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](14, KtdScrollTestComponent_ktd_grid_item_14_Template, 3, 2, "ktd-grid-item", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "h2");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "Scroll Vertical and horizontal");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 9, 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "ktd-grid", 5, 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](22, KtdScrollTestComponent_ktd_grid_item_22_Template, 3, 2, "ktd-grid-item", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "h2", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "Other examples: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "a", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "Playground");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "a", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, "Custom handles");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "a", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, "Real life example");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](11);
        const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("value", ctx.scrollSpeed + "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("cols", ctx.cols)("rowHeight", 50)("layout", ctx.layout1)("scrollableParent", _r0)("scrollSpeed", ctx.scrollSpeed)("compactType", ctx.compactType);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.layout1)("ngForTrackBy", ctx.trackById);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("cols", ctx.cols2)("rowHeight", 50)("layout", ctx.layout2)("scrollableParent", _r3)("scrollSpeed", ctx.scrollSpeed)("compactType", ctx.compactType);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.layout2)("ngForTrackBy", ctx.trackById);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](20, _c2));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](21, _c3));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](22, _c4));
    } }, directives: [_angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__["MatFormField"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__["MatLabel"], _angular_material_input__WEBPACK_IMPORTED_MODULE_7__["MatInput"], _angular_grid_layout_src_lib_grid_component__WEBPACK_IMPORTED_MODULE_8__["KtdGridComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_4__["NgForOf"], _angular_router__WEBPACK_IMPORTED_MODULE_9__["RouterLinkWithHref"], _angular_grid_layout_src_lib_grid_item_grid_item_component__WEBPACK_IMPORTED_MODULE_10__["KtdGridItemComponent"]], styles: ["[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n  padding: 24px;\n  box-sizing: border-box;\n}\n[_nghost-%COMP%]   .grids-container[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  height: 600px;\n}\n[_nghost-%COMP%]   .grids-container[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  flex: 1;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n}\n[_nghost-%COMP%]   .grid-container-1[_ngcontent-%COMP%], [_nghost-%COMP%]   .grid-container-2[_ngcontent-%COMP%] {\n  padding: 4px;\n  box-sizing: border-box;\n  border: 1px solid gray;\n  border-radius: 2px;\n  background: #313131;\n  height: 100%;\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n[_nghost-%COMP%]   .grid-container-2[_ngcontent-%COMP%] {\n  overflow-x: auto;\n}\n[_nghost-%COMP%]   .grid-container-2[_ngcontent-%COMP%]   ktd-grid[_ngcontent-%COMP%] {\n  width: 200%;\n}\n[_nghost-%COMP%]   ktd-grid[_ngcontent-%COMP%] {\n  transition: height 500ms ease;\n}\n[_nghost-%COMP%]   ktd-grid-item[_ngcontent-%COMP%] {\n  color: #121212;\n}\n[_nghost-%COMP%]   .grid-item-content[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  background: #ccc;\n  border: 1px solid black;\n  color: black;\n  width: 100%;\n  height: 100%;\n  -webkit-user-select: none;\n          user-select: none;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcc2Nyb2xsLXRlc3QuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxjQUFBO0VBQ0EsV0FBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtBQUNKO0FBQ0k7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxhQUFBO0FBQ1I7QUFDUTtFQUNJLE9BQUE7RUFDQSxZQUFBO0VBRUEsYUFBQTtFQUNBLHNCQUFBO0FBQVo7QUFJSTtFQUNJLFlBQUE7RUFDQSxzQkFBQTtFQUNBLHNCQUFBO0VBQ0Esa0JBQUE7RUFDQSxtQkFBQTtFQUNBLFlBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0FBRlI7QUFLSTtFQUNJLGdCQUFBO0FBSFI7QUFLUTtFQUNJLFdBQUE7QUFIWjtBQU9JO0VBQ0ksNkJBQUE7QUFMUjtBQVFJO0VBQ0ksY0FBQTtBQU5SO0FBU0k7RUFDSSxzQkFBQTtFQUNBLGdCQUFBO0VBQ0EsdUJBQUE7RUFDQSxZQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSx5QkFBQTtVQUFBLGlCQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7QUFQUiIsImZpbGUiOiJzY3JvbGwtdGVzdC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIjpob3N0IHtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICB3aWR0aDogMTAwJTtcbiAgICBwYWRkaW5nOiAyNHB4O1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG5cbiAgICAuZ3JpZHMtY29udGFpbmVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgaGVpZ2h0OiA2MDBweDtcblxuICAgICAgICAmID4gKiB7XG4gICAgICAgICAgICBmbGV4OiAxO1xuICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xuXG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC5ncmlkLWNvbnRhaW5lci0xLCAuZ3JpZC1jb250YWluZXItMiB7XG4gICAgICAgIHBhZGRpbmc6IDRweDtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgZ3JheTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMnB4O1xuICAgICAgICBiYWNrZ3JvdW5kOiAjMzEzMTMxO1xuICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgIG92ZXJmbG93LXk6IGF1dG87XG4gICAgICAgIG92ZXJmbG93LXg6IGhpZGRlbjtcbiAgICB9XG5cbiAgICAuZ3JpZC1jb250YWluZXItMiB7XG4gICAgICAgIG92ZXJmbG93LXg6IGF1dG87IC8vIGxldCBhdmFpbGFibGUgc2Nyb2xsIGhvcml6b250YWwgd2l0aCBvdmVyZmxvd2luZyB4XG5cbiAgICAgICAga3RkLWdyaWQge1xuICAgICAgICAgICAgd2lkdGg6IDIwMCU7IC8vIG1ha2Uga3RkIGdyaWQgb3ZlcmZsb3cgaG9yaXpvbnRhbGx5XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBrdGQtZ3JpZCB7XG4gICAgICAgIHRyYW5zaXRpb246IGhlaWdodCA1MDBtcyBlYXNlO1xuICAgIH1cblxuICAgIGt0ZC1ncmlkLWl0ZW0ge1xuICAgICAgICBjb2xvcjogIzEyMTIxMjtcbiAgICB9XG5cbiAgICAuZ3JpZC1pdGVtLWNvbnRlbnQge1xuICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICBiYWNrZ3JvdW5kOiAjY2NjO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBibGFjaztcbiAgICAgICAgY29sb3I6IGJsYWNrO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgfVxuXG5cbn1cbiJdfQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](KtdScrollTestComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'ktd-scroll-test',
                templateUrl: './scroll-test.component.html',
                styleUrls: ['./scroll-test.component.scss']
            }]
    }], function () { return [{ type: undefined, decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"],
                args: [_angular_common__WEBPACK_IMPORTED_MODULE_4__["DOCUMENT"]]
            }] }]; }, { grid1: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['grid1', { static: true, read: projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_1__["KtdGridComponent"] }]
        }], grid2: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['grid2', { static: true, read: projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_1__["KtdGridComponent"] }]
        }] }); })();


/***/ }),

/***/ "Q0DP":
/*!************************************************************************!*\
  !*** ./projects/demo-app/$$_lazy_route_resource lazy namespace object ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "Q0DP";

/***/ }),

/***/ "XHjT":
/*!********************************************************!*\
  !*** ./projects/angular-grid-layout/src/public-api.ts ***!
  \********************************************************/
/*! exports provided: ktdGridCompact, ktdTrackById, KTD_GRID_DRAG_HANDLE, KtdGridDragHandle, KTD_GRID_RESIZE_HANDLE, KtdGridResizeHandle, KtdGridItemComponent, GRID_ITEM_GET_RENDER_DATA_TOKEN, parseRenderItemToPixels, __gridItemGetRenderDataFactoryFunc, ktdGridItemGetRenderDataFactoryFunc, KtdGridComponent, KtdGridModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_utils_grid_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/utils/grid.utils */ "byCZ");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ktdGridCompact", function() { return _lib_utils_grid_utils__WEBPACK_IMPORTED_MODULE_0__["ktdGridCompact"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ktdTrackById", function() { return _lib_utils_grid_utils__WEBPACK_IMPORTED_MODULE_0__["ktdTrackById"]; });

/* harmony import */ var _lib_directives_drag_handle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/directives/drag-handle */ "xJKi");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "KTD_GRID_DRAG_HANDLE", function() { return _lib_directives_drag_handle__WEBPACK_IMPORTED_MODULE_1__["KTD_GRID_DRAG_HANDLE"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "KtdGridDragHandle", function() { return _lib_directives_drag_handle__WEBPACK_IMPORTED_MODULE_1__["KtdGridDragHandle"]; });

/* harmony import */ var _lib_directives_resize_handle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/directives/resize-handle */ "wesb");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "KTD_GRID_RESIZE_HANDLE", function() { return _lib_directives_resize_handle__WEBPACK_IMPORTED_MODULE_2__["KTD_GRID_RESIZE_HANDLE"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "KtdGridResizeHandle", function() { return _lib_directives_resize_handle__WEBPACK_IMPORTED_MODULE_2__["KtdGridResizeHandle"]; });

/* harmony import */ var _lib_grid_item_grid_item_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/grid-item/grid-item.component */ "qcNg");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "KtdGridItemComponent", function() { return _lib_grid_item_grid_item_component__WEBPACK_IMPORTED_MODULE_3__["KtdGridItemComponent"]; });

/* harmony import */ var _lib_grid_definitions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/grid.definitions */ "930P");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GRID_ITEM_GET_RENDER_DATA_TOKEN", function() { return _lib_grid_definitions__WEBPACK_IMPORTED_MODULE_4__["GRID_ITEM_GET_RENDER_DATA_TOKEN"]; });

/* harmony import */ var _lib_grid_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lib/grid.component */ "KyP5");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "parseRenderItemToPixels", function() { return _lib_grid_component__WEBPACK_IMPORTED_MODULE_5__["parseRenderItemToPixels"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "__gridItemGetRenderDataFactoryFunc", function() { return _lib_grid_component__WEBPACK_IMPORTED_MODULE_5__["__gridItemGetRenderDataFactoryFunc"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ktdGridItemGetRenderDataFactoryFunc", function() { return _lib_grid_component__WEBPACK_IMPORTED_MODULE_5__["ktdGridItemGetRenderDataFactoryFunc"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "KtdGridComponent", function() { return _lib_grid_component__WEBPACK_IMPORTED_MODULE_5__["KtdGridComponent"]; });

/* harmony import */ var _lib_grid_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./lib/grid.module */ "+GMm");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "KtdGridModule", function() { return _lib_grid_module__WEBPACK_IMPORTED_MODULE_6__["KtdGridModule"]; });

/*
 * Public API Surface of grid
 */









/***/ }),

/***/ "Ybjs":
/*!***************************************************************************!*\
  !*** ./projects/demo-app/src/app/custom-handles/custom-handles.module.ts ***!
  \***************************************************************************/
/*! exports provided: KtdCustomHandlesModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KtdCustomHandlesModule", function() { return KtdCustomHandlesModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _custom_handles_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./custom-handles.component */ "OKna");
/* harmony import */ var projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! projects/angular-grid-layout/src/public-api */ "XHjT");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/icon */ "NFeN");








const routes = [
    { path: 'custom-handles', component: _custom_handles_component__WEBPACK_IMPORTED_MODULE_2__["KtdCustomHandlesComponent"] },
];
class KtdCustomHandlesModule {
}
KtdCustomHandlesModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: KtdCustomHandlesModule });
KtdCustomHandlesModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function KtdCustomHandlesModule_Factory(t) { return new (t || KtdCustomHandlesModule)(); }, imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterModule"].forChild(routes),
            _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__["MatIconModule"],
            projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_3__["KtdGridModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](KtdCustomHandlesModule, { declarations: [_custom_handles_component__WEBPACK_IMPORTED_MODULE_2__["KtdCustomHandlesComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterModule"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__["MatIconModule"],
        projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_3__["KtdGridModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](KtdCustomHandlesModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                declarations: [_custom_handles_component__WEBPACK_IMPORTED_MODULE_2__["KtdCustomHandlesComponent"]],
                imports: [
                    _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                    _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterModule"].forChild(routes),
                    _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__["MatIconModule"],
                    projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_3__["KtdGridModule"]
                ]
            }]
    }], null, null); })();


/***/ }),

/***/ "byCZ":
/*!******************************************************************!*\
  !*** ./projects/angular-grid-layout/src/lib/utils/grid.utils.ts ***!
  \******************************************************************/
/*! exports provided: ktdTrackById, ktdGridCompact, ktdGetGridLayoutDiff, ktdGridItemDragging, ktdGridItemResizing */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ktdTrackById", function() { return ktdTrackById; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ktdGridCompact", function() { return ktdGridCompact; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ktdGetGridLayoutDiff", function() { return ktdGetGridLayoutDiff; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ktdGridItemDragging", function() { return ktdGridItemDragging; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ktdGridItemResizing", function() { return ktdGridItemResizing; });
/* harmony import */ var _react_grid_layout_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./react-grid-layout.utils */ "9mM0");
/* harmony import */ var _pointer_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pointer.utils */ "vARK");


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
    return Object(_react_grid_layout_utils__WEBPACK_IMPORTED_MODULE_0__["compact"])(layout, compactType, cols)
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
    const clientStartX = Object(_pointer_utils__WEBPACK_IMPORTED_MODULE_1__["ktdPointerClientX"])(pointerDownEvent);
    const clientStartY = Object(_pointer_utils__WEBPACK_IMPORTED_MODULE_1__["ktdPointerClientY"])(pointerDownEvent);
    const clientX = Object(_pointer_utils__WEBPACK_IMPORTED_MODULE_1__["ktdPointerClientX"])(pointerDragEvent);
    const clientY = Object(_pointer_utils__WEBPACK_IMPORTED_MODULE_1__["ktdPointerClientY"])(pointerDragEvent);
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
    let newLayoutItems = Object(_react_grid_layout_utils__WEBPACK_IMPORTED_MODULE_0__["moveElement"])(layoutItems, draggedLayoutItem, layoutItem.x, layoutItem.y, true, config.preventCollision, compactionType, config.cols);
    newLayoutItems = Object(_react_grid_layout_utils__WEBPACK_IMPORTED_MODULE_0__["compact"])(newLayoutItems, compactionType, config.cols);
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
    const clientStartX = Object(_pointer_utils__WEBPACK_IMPORTED_MODULE_1__["ktdPointerClientX"])(pointerDownEvent);
    const clientStartY = Object(_pointer_utils__WEBPACK_IMPORTED_MODULE_1__["ktdPointerClientY"])(pointerDownEvent);
    const clientX = Object(_pointer_utils__WEBPACK_IMPORTED_MODULE_1__["ktdPointerClientX"])(pointerDragEvent);
    const clientY = Object(_pointer_utils__WEBPACK_IMPORTED_MODULE_1__["ktdPointerClientY"])(pointerDragEvent);
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
        layout: Object(_react_grid_layout_utils__WEBPACK_IMPORTED_MODULE_0__["compact"])(newLayoutItems, compactionType, config.cols),
        draggedItemPos: {
            top: dragElemClientRect.top - gridElemClientRect.top,
            left: dragElemClientRect.left - gridElemClientRect.left,
            width,
            height,
        }
    };
}
function hasCollision(layout, layoutItem) {
    return !!Object(_react_grid_layout_utils__WEBPACK_IMPORTED_MODULE_0__["getFirstCollision"])(layout, layoutItem);
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


/***/ }),

/***/ "dck0":
/*!*****************************************************************!*\
  !*** ./projects/angular-grid-layout/src/lib/utils/operators.ts ***!
  \*****************************************************************/
/*! exports provided: ktdOutsideZone, ktdNoEmit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ktdOutsideZone", function() { return ktdOutsideZone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ktdNoEmit", function() { return ktdNoEmit; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "kU1M");


/** Runs source observable outside the zone */
function ktdOutsideZone(zone) {
    return (source) => {
        return new rxjs__WEBPACK_IMPORTED_MODULE_0__["Observable"](observer => {
            return zone.runOutsideAngular(() => source.subscribe(observer));
        });
    };
}
/** Rxjs operator that makes source observable to no emit any data */
function ktdNoEmit() {
    return (source$) => {
        return source$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["filter"])(() => false));
    };
}


/***/ }),

/***/ "fggt":
/*!**********************************************************************!*\
  !*** ./projects/demo-app/src/app/playground/playground.component.ts ***!
  \**********************************************************************/
/*! exports provided: KtdPlaygroundComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KtdPlaygroundComponent", function() { return KtdPlaygroundComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! projects/angular-grid-layout/src/public-api */ "XHjT");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils */ "gkh0");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/cdk/coercion */ "8LU1");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/button */ "bTqV");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/form-field */ "kmnG");
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/select */ "d3UM");
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/core */ "FKr1");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/input */ "qFsG");
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/checkbox */ "bSwM");
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/chips */ "A5z7");
/* harmony import */ var _angular_grid_layout_src_lib_grid_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../angular-grid-layout/src/lib/grid.component */ "KyP5");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _angular_grid_layout_src_lib_grid_item_grid_item_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../../angular-grid-layout/src/lib/grid-item/grid-item.component */ "qcNg");



















function KtdPlaygroundComponent_mat_option_35_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "mat-option", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const transition_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("value", transition_r2.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](transition_r2.name);
} }
function KtdPlaygroundComponent_ktd_grid_item_55_div_3_Template(rf, ctx) { if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("mousedown", function KtdPlaygroundComponent_ktd_grid_item_55_div_3_Template_div_mousedown_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6); const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2); return ctx_r5.stopEventPropagation($event); })("click", function KtdPlaygroundComponent_ktd_grid_item_55_div_3_Template_div_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6); const item_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit; const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r7.removeItem(item_r3.id); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function KtdPlaygroundComponent_ktd_grid_item_55_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "ktd-grid-item", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, KtdPlaygroundComponent_ktd_grid_item_55_div_3_Template, 1, 0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const item_r3 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("id", item_r3.id)("transition", ctx_r1.currentTransition)("dragStartThreshold", ctx_r1.dragStartThreshold)("draggable", !ctx_r1.disableDrag)("resizable", !ctx_r1.disableResize);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](item_r3.id);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx_r1.disableRemove);
} }
const _c0 = function () { return ["/custom-handles"]; };
const _c1 = function () { return ["/real-life-example"]; };
const _c2 = function () { return ["/scroll-test"]; };
class KtdPlaygroundComponent {
    constructor(ngZone, elementRef, document) {
        this.ngZone = ngZone;
        this.elementRef = elementRef;
        this.document = document;
        this.trackById = projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_3__["ktdTrackById"];
        this.cols = 12;
        this.rowHeight = 50;
        this.compactType = 'vertical';
        this.layout = [
            { id: '0', x: 5, y: 0, w: 2, h: 3 },
            { id: '1', x: 2, y: 2, w: 1, h: 2 },
            { id: '2', x: 3, y: 7, w: 1, h: 2 },
            { id: '3', x: 2, y: 0, w: 3, h: 2 },
            { id: '4', x: 5, y: 3, w: 2, h: 3 },
            { id: '5', x: 0, y: 4, w: 1, h: 3 },
            { id: '6', x: 9, y: 0, w: 2, h: 4 },
            { id: '7', x: 9, y: 4, w: 2, h: 2 },
            { id: '8', x: 3, y: 2, w: 2, h: 5 },
            { id: '9', x: 7, y: 0, w: 1, h: 3 },
            { id: '10', x: 2, y: 4, w: 1, h: 4 },
            { id: '11', x: 0, y: 0, w: 2, h: 4 }
        ];
        this.transitions = [
            { name: 'ease', value: 'transform 500ms ease, width 500ms ease, height 500ms ease' },
            { name: 'ease-out', value: 'transform 500ms ease-out, width 500ms ease-out, height 500ms ease-out' },
            { name: 'linear', value: 'transform 500ms linear, width 500ms linear, height 500ms linear' },
            {
                name: 'overflowing',
                value: 'transform 500ms cubic-bezier(.28,.49,.79,1.35), width 500ms cubic-bezier(.28,.49,.79,1.35), height 500ms cubic-bezier(.28,.49,.79,1.35)'
            },
            { name: 'fast', value: 'transform 200ms ease, width 200ms linear, height 200ms linear' },
            { name: 'slow-motion', value: 'transform 1000ms linear, width 1000ms linear, height 1000ms linear' },
            { name: 'transform-only', value: 'transform 500ms ease' },
        ];
        this.currentTransition = this.transitions[0].value;
        this.dragStartThreshold = 0;
        this.autoScroll = true;
        this.disableDrag = false;
        this.disableResize = false;
        this.disableRemove = false;
        this.autoResize = true;
        this.preventCollision = false;
        this.isDragging = false;
        this.isResizing = false;
        // this.ngZone.onUnstable.subscribe(() => console.log('UnStable'));
    }
    ngOnInit() {
        this.resizeSubscription = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["merge"])(Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["fromEvent"])(window, 'resize'), Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["fromEvent"])(window, 'orientationchange')).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["debounceTime"])(50), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["filter"])(() => this.autoResize)).subscribe(() => {
            this.grid.resize();
        });
    }
    ngOnDestroy() {
        this.resizeSubscription.unsubscribe();
    }
    onDragStarted(event) {
        this.isDragging = true;
    }
    onResizeStarted(event) {
        this.isResizing = true;
    }
    onDragEnded(event) {
        this.isDragging = false;
    }
    onResizeEnded(event) {
        this.isResizing = false;
    }
    onLayoutUpdated(layout) {
        console.log('on layout updated', layout);
        this.layout = layout;
    }
    onCompactTypeChange(change) {
        console.log('onCompactTypeChange', change);
        this.compactType = change.value;
    }
    onTransitionChange(change) {
        console.log('onTransitionChange', change);
        this.currentTransition = change.value;
    }
    onAutoScrollChange(checked) {
        this.autoScroll = checked;
    }
    onDisableDragChange(checked) {
        this.disableDrag = checked;
    }
    onDisableResizeChange(checked) {
        this.disableResize = checked;
    }
    onDisableRemoveChange(checked) {
        this.disableRemove = checked;
    }
    onAutoResizeChange(checked) {
        this.autoResize = checked;
    }
    onPreventCollisionChange(checked) {
        this.preventCollision = checked;
    }
    onColsChange(event) {
        this.cols = Object(_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_6__["coerceNumberProperty"])(event.target.value);
    }
    onRowHeightChange(event) {
        this.rowHeight = Object(_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_6__["coerceNumberProperty"])(event.target.value);
    }
    onDragStartThresholdChange(event) {
        this.dragStartThreshold = Object(_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_6__["coerceNumberProperty"])(event.target.value);
    }
    generateLayout() {
        const layout = [];
        for (let i = 0; i < this.cols; i++) {
            const y = Math.ceil(Math.random() * 4) + 1;
            layout.push({
                x: Math.round(Math.random() * (Math.floor((this.cols / 2) - 1))) * 2,
                y: Math.floor(i / 6) * y,
                w: 2,
                h: y,
                id: i.toString()
                // static: Math.random() < 0.05
            });
        }
        console.log('layout', layout);
        this.layout = layout;
    }
    /** Adds a grid item to the layout */
    addItemToLayout() {
        const maxId = this.layout.reduce((acc, cur) => Math.max(acc, parseInt(cur.id, 10)), -1);
        const nextId = maxId + 1;
        const newLayoutItem = {
            id: nextId.toString(),
            x: 0,
            y: 0,
            w: 2,
            h: 2
        };
        // Important: Don't mutate the array, create new instance. This way notifies the Grid component that the layout has changed.
        this.layout = [
            newLayoutItem,
            ...this.layout
        ];
    }
    /**
     * Fired when a mousedown happens on the remove grid item button.
     * Stops the event from propagating an causing the drag to start.
     * We don't want to drag when mousedown is fired on remove icon button.
     */
    stopEventPropagation(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    /** Removes the item from the layout */
    removeItem(id) {
        // Important: Don't mutate the array. Let Angular know that the layout has changed creating a new reference.
        this.layout = Object(_utils__WEBPACK_IMPORTED_MODULE_4__["ktdArrayRemoveItem"])(this.layout, (item) => item.id === id);
    }
}
KtdPlaygroundComponent.ɵfac = function KtdPlaygroundComponent_Factory(t) { return new (t || KtdPlaygroundComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_5__["DOCUMENT"])); };
KtdPlaygroundComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: KtdPlaygroundComponent, selectors: [["ktd-playground"]], viewQuery: function KtdPlaygroundComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstaticViewQuery"](projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_3__["KtdGridComponent"], true);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.grid = _t.first);
    } }, decls: 65, vars: 31, consts: [[1, "playground-container"], [1, "layout-json"], [1, "controls-container"], ["mat-raised-button", "", 3, "click"], ["color", "accent"], [3, "value", "selectionChange"], [3, "value"], ["color", "accent", 2, "width", "64px"], ["matInput", "", "type", "number", 3, "value", "input"], ["color", "accent", 2, "width", "128px"], [3, "value", 4, "ngFor", "ngForOf"], ["color", "accent", 3, "checked", "change"], ["color", "accent", 3, "selected"], [1, "grid-container"], ["scrollSpeed", "4", 3, "cols", "rowHeight", "layout", "compactType", "preventCollision", "scrollableParent", "dragStarted", "resizeStarted", "dragEnded", "resizeEnded", "layoutUpdated"], [3, "id", "transition", "dragStartThreshold", "draggable", "resizable", 4, "ngFor", "ngForOf", "ngForTrackBy"], [2, "margin-top", "16px"], [2, "display", "flex", "flex-direction", "column"], [3, "routerLink"], [3, "id", "transition", "dragStartThreshold", "draggable", "resizable"], [1, "grid-item-content"], ["class", "grid-item-remove-handle", 3, "mousedown", "click", 4, "ngIf"], [1, "grid-item-remove-handle", 3, "mousedown", "click"]], template: function KtdPlaygroundComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "h1");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Angular Grid Layout - Playground");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function KtdPlaygroundComponent_Template_button_click_5_listener() { return ctx.generateLayout(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Generate layout");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function KtdPlaygroundComponent_Template_button_click_7_listener() { return ctx.addItemToLayout(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Add item");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "mat-form-field", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Compact type");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "mat-select", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("selectionChange", function KtdPlaygroundComponent_Template_mat_select_selectionChange_12_listener($event) { return ctx.onCompactTypeChange($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "mat-option", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, "vertical");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "mat-option", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, "horizontal");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "mat-option", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18, "-");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "mat-form-field", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "Columns");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("input", function KtdPlaygroundComponent_Template_input_input_22_listener($event) { return ctx.onColsChange($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "mat-form-field", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, "Row height");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("input", function KtdPlaygroundComponent_Template_input_input_26_listener($event) { return ctx.onRowHeightChange($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "mat-form-field", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, "Drag Threshold");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "input", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("input", function KtdPlaygroundComponent_Template_input_input_30_listener($event) { return ctx.onDragStartThresholdChange($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "mat-form-field", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33, "Transition type");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "mat-select", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("selectionChange", function KtdPlaygroundComponent_Template_mat_select_selectionChange_34_listener($event) { return ctx.onTransitionChange($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](35, KtdPlaygroundComponent_mat_option_35_Template, 2, 2, "mat-option", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "mat-checkbox", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function KtdPlaygroundComponent_Template_mat_checkbox_change_36_listener($event) { return ctx.onAutoScrollChange($event.checked); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](37, " Auto scroll ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "mat-checkbox", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function KtdPlaygroundComponent_Template_mat_checkbox_change_38_listener($event) { return ctx.onDisableDragChange($event.checked); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](39, " Disable drag ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "mat-checkbox", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function KtdPlaygroundComponent_Template_mat_checkbox_change_40_listener($event) { return ctx.onDisableResizeChange($event.checked); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](41, " Disable resize ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](42, "mat-checkbox", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function KtdPlaygroundComponent_Template_mat_checkbox_change_42_listener($event) { return ctx.onDisableRemoveChange($event.checked); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](43, " Disable remove ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "mat-checkbox", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function KtdPlaygroundComponent_Template_mat_checkbox_change_44_listener($event) { return ctx.onAutoResizeChange($event.checked); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](45, " Auto resize ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "mat-checkbox", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function KtdPlaygroundComponent_Template_mat_checkbox_change_46_listener($event) { return ctx.onPreventCollisionChange($event.checked); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](47, " Prevent Collision ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](48, "mat-chip-list");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](49, "mat-chip", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](50, "isDragging");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "mat-chip", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](52, "isResizing");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "ktd-grid", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("dragStarted", function KtdPlaygroundComponent_Template_ktd_grid_dragStarted_54_listener($event) { return ctx.onDragStarted($event); })("resizeStarted", function KtdPlaygroundComponent_Template_ktd_grid_resizeStarted_54_listener($event) { return ctx.onResizeStarted($event); })("dragEnded", function KtdPlaygroundComponent_Template_ktd_grid_dragEnded_54_listener($event) { return ctx.onDragEnded($event); })("resizeEnded", function KtdPlaygroundComponent_Template_ktd_grid_resizeEnded_54_listener($event) { return ctx.onResizeEnded($event); })("layoutUpdated", function KtdPlaygroundComponent_Template_ktd_grid_layoutUpdated_54_listener($event) { return ctx.onLayoutUpdated($event); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](55, KtdPlaygroundComponent_ktd_grid_item_55_Template, 4, 7, "ktd-grid-item", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "h2", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](57, "Other examples: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](58, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](59, "a", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](60, "Custom handles");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](61, "a", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](62, "Real life example");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](63, "a", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](64, "Scroll test");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("value", ctx.compactType);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("value", "vertical");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("value", "horizontal");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("value", "none");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("value", ctx.cols + "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("value", ctx.rowHeight + "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("value", ctx.dragStartThreshold + "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("value", ctx.currentTransition);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.transitions);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("checked", ctx.autoScroll);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("checked", ctx.disableDrag);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("checked", ctx.disableResize);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("checked", ctx.disableRemove);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("checked", ctx.autoResize);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("checked", ctx.preventCollision);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("selected", ctx.isDragging);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("selected", ctx.isResizing);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("cols", ctx.cols)("rowHeight", ctx.rowHeight)("layout", ctx.layout)("compactType", ctx.compactType)("preventCollision", ctx.preventCollision)("scrollableParent", ctx.autoScroll ? ctx.document : null);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.layout)("ngForTrackBy", ctx.trackById);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](28, _c0));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](29, _c1));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](30, _c2));
    } }, directives: [_angular_material_button__WEBPACK_IMPORTED_MODULE_7__["MatButton"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__["MatFormField"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_8__["MatLabel"], _angular_material_select__WEBPACK_IMPORTED_MODULE_9__["MatSelect"], _angular_material_core__WEBPACK_IMPORTED_MODULE_10__["MatOption"], _angular_material_input__WEBPACK_IMPORTED_MODULE_11__["MatInput"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgForOf"], _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_12__["MatCheckbox"], _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__["MatChipList"], _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__["MatChip"], _angular_grid_layout_src_lib_grid_component__WEBPACK_IMPORTED_MODULE_14__["KtdGridComponent"], _angular_router__WEBPACK_IMPORTED_MODULE_15__["RouterLinkWithHref"], _angular_grid_layout_src_lib_grid_item_grid_item_component__WEBPACK_IMPORTED_MODULE_16__["KtdGridItemComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"]], styles: ["[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n  padding: 24px;\n  box-sizing: border-box;\n}\n[_nghost-%COMP%]   .playground-container[_ngcontent-%COMP%] {\n  width: 100%;\n}\n[_nghost-%COMP%]   .controls-container[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  margin-bottom: 16px;\n}\n[_nghost-%COMP%]   .controls-container[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  margin: 8px 24px 8px 0;\n}\n[_nghost-%COMP%]   .grid-container[_ngcontent-%COMP%] {\n  padding: 4px;\n  box-sizing: border-box;\n  border: 1px solid gray;\n  border-radius: 2px;\n  background: #313131;\n}\n[_nghost-%COMP%]   ktd-grid-item[_ngcontent-%COMP%] {\n  color: #121212;\n}\n[_nghost-%COMP%]   ktd-grid[_ngcontent-%COMP%] {\n  transition: height 500ms ease;\n}\n[_nghost-%COMP%]   .grid-item-content[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  background: #ccc;\n  border: 1px solid;\n  width: 100%;\n  height: 100%;\n  -webkit-user-select: none;\n          user-select: none;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n[_nghost-%COMP%]   .grid-item-remove-handle[_ngcontent-%COMP%] {\n  position: absolute;\n  cursor: pointer;\n  display: flex;\n  justify-content: center;\n  width: 20px;\n  height: 20px;\n  top: 0;\n  right: 0;\n}\n[_nghost-%COMP%]   .grid-item-remove-handle[_ngcontent-%COMP%]::after {\n  content: \"x\";\n  color: #121212;\n  font-size: 16px;\n  font-weight: 300;\n  font-family: Arial, sans-serif;\n}\n[_nghost-%COMP%]   ktd-grid-item[_ngcontent-%COMP%] {\n  cursor: grab;\n}\n[_nghost-%COMP%]   ktd-grid-item.ktd-grid-item-dragging[_ngcontent-%COMP%] {\n  cursor: grabbing;\n}\n[_nghost-%COMP%]   mat-chip-list[_ngcontent-%COMP%], [_nghost-%COMP%]   mat-chip[_ngcontent-%COMP%] {\n  pointer-events: none;\n  -webkit-user-select: none;\n          user-select: none;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxccGxheWdyb3VuZC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGNBQUE7RUFDQSxXQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0FBQ0o7QUFDSTtFQUNJLFdBQUE7QUFDUjtBQUVJO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsZUFBQTtFQUNBLG1CQUFBO0FBQVI7QUFFUTtFQUNJLHNCQUFBO0FBQVo7QUFJSTtFQUNJLFlBQUE7RUFDQSxzQkFBQTtFQUNBLHNCQUFBO0VBQ0Esa0JBQUE7RUFDQSxtQkFBQTtBQUZSO0FBS0k7RUFDSSxjQUFBO0FBSFI7QUFNSTtFQUNJLDZCQUFBO0FBSlI7QUFPSTtFQUNJLHNCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxpQkFBQTtFQUNBLFdBQUE7RUFDQSxZQUFBO0VBQ0EseUJBQUE7VUFBQSxpQkFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0FBTFI7QUFRSTtFQUNJLGtCQUFBO0VBQ0EsZUFBQTtFQUNBLGFBQUE7RUFDQSx1QkFBQTtFQUNBLFdBQUE7RUFDQSxZQUFBO0VBQ0EsTUFBQTtFQUNBLFFBQUE7QUFOUjtBQVFRO0VBQ0ksWUFBQTtFQUNBLGNBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSw4QkFBQTtBQU5aO0FBV0k7RUFDSSxZQUFBO0FBVFI7QUFXUTtFQUNJLGdCQUFBO0FBVFo7QUFhSTtFQUNJLG9CQUFBO0VBQ0EseUJBQUE7VUFBQSxpQkFBQTtBQVhSIiwiZmlsZSI6InBsYXlncm91bmQuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgcGFkZGluZzogMjRweDtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuXG4gICAgLnBsYXlncm91bmQtY29udGFpbmVyIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuXG4gICAgLmNvbnRyb2xzLWNvbnRhaW5lciB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGZsZXgtd3JhcDogd3JhcDtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMTZweDtcblxuICAgICAgICAmID4gKiB7XG4gICAgICAgICAgICBtYXJnaW46IDhweCAyNHB4IDhweCAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLmdyaWQtY29udGFpbmVyIHtcbiAgICAgICAgcGFkZGluZzogNHB4O1xuICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBncmF5O1xuICAgICAgICBib3JkZXItcmFkaXVzOiAycHg7XG4gICAgICAgIGJhY2tncm91bmQ6ICMzMTMxMzE7XG4gICAgfVxuXG4gICAga3RkLWdyaWQtaXRlbSB7XG4gICAgICAgIGNvbG9yOiAjMTIxMjEyO1xuICAgIH1cblxuICAgIGt0ZC1ncmlkIHtcbiAgICAgICAgdHJhbnNpdGlvbjogaGVpZ2h0IDUwMG1zIGVhc2U7XG4gICAgfVxuXG4gICAgLmdyaWQtaXRlbS1jb250ZW50IHtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgYmFja2dyb3VuZDogI2NjYztcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQ7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICB9XG5cbiAgICAuZ3JpZC1pdGVtLXJlbW92ZS1oYW5kbGUge1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIHdpZHRoOiAyMHB4O1xuICAgICAgICBoZWlnaHQ6IDIwcHg7XG4gICAgICAgIHRvcDogMDtcbiAgICAgICAgcmlnaHQ6IDA7XG5cbiAgICAgICAgJjo6YWZ0ZXIge1xuICAgICAgICAgICAgY29udGVudDogJ3gnO1xuICAgICAgICAgICAgY29sb3I6ICMxMjEyMTI7XG4gICAgICAgICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICAgICAgICBmb250LXdlaWdodDogMzAwO1xuICAgICAgICAgICAgZm9udC1mYW1pbHk6IEFyaWFsLCBzYW5zLXNlcmlmO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWRkIGN1c3RvbSBkcmFnIG1vdXNlIHN0eWxlc1xuICAgIGt0ZC1ncmlkLWl0ZW0ge1xuICAgICAgICBjdXJzb3I6IGdyYWI7XG5cbiAgICAgICAgJi5rdGQtZ3JpZC1pdGVtLWRyYWdnaW5nIHtcbiAgICAgICAgICAgIGN1cnNvcjogZ3JhYmJpbmc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtYXQtY2hpcC1saXN0LCBtYXQtY2hpcCB7XG4gICAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgICAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgICB9XG5cblxufVxuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](KtdPlaygroundComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'ktd-playground',
                templateUrl: './playground.component.html',
                styleUrls: ['./playground.component.scss']
            }]
    }], function () { return [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] }, { type: Document, decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"],
                args: [_angular_common__WEBPACK_IMPORTED_MODULE_5__["DOCUMENT"]]
            }] }]; }, { grid: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: [projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_3__["KtdGridComponent"], { static: true }]
        }] }); })();


/***/ }),

/***/ "gkh0":
/*!********************************************!*\
  !*** ./projects/demo-app/src/app/utils.ts ***!
  \********************************************/
/*! exports provided: ktdArrayRemoveItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ktdArrayRemoveItem", function() { return ktdArrayRemoveItem; });
/**
 * Removes and item from an array. Returns a new array instance (it doesn't mutate the source array).
 * @param array source array to be returned without the element to remove
 * @param condition function that will return true for the item that we want to remove
 */
function ktdArrayRemoveItem(array, condition) {
    const arrayCopy = [...array];
    const index = array.findIndex((item) => condition(item));
    if (index > -1) {
        arrayCopy.splice(index, 1);
    }
    return arrayCopy;
}


/***/ }),

/***/ "hJD3":
/*!***************************************************************************************!*\
  !*** ./projects/demo-app/src/app/real-life-example/data/countries-population.data.ts ***!
  \***************************************************************************************/
/*! exports provided: countriesPopulation, countriesPopulationByYear */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "countriesPopulation", function() { return countriesPopulation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "countriesPopulationByYear", function() { return countriesPopulationByYear; });
const countriesPopulation = [
    {
        name: 'Germany',
        value: 8940000
    },
    {
        name: 'USA',
        value: 5000000
    },
    {
        name: 'France',
        value: 7200000
    },
    {
        name: 'Italy',
        value: 4500000
    },
    {
        name: 'Spain',
        value: 5730000
    }, {
        name: 'UK',
        value: 8200000
    }
];
const countriesPopulationByYear = [
    {
        name: 'Germany',
        series: [
            {
                name: '1990',
                value: 62000000
            },
            {
                name: '2010',
                value: 73000000
            },
            {
                name: '2011',
                value: 89400000
            }
        ]
    },
    {
        name: 'USA',
        series: [
            {
                name: '1990',
                value: 250000000
            },
            {
                name: '2010',
                value: 309000000
            },
            {
                name: '2011',
                value: 311000000
            }
        ]
    },
    {
        name: 'France',
        series: [
            {
                name: '1990',
                value: 58000000
            },
            {
                name: '2010',
                value: 50000020
            },
            {
                name: '2011',
                value: 58000000
            }
        ]
    },
    {
        name: 'UK',
        series: [
            {
                name: '1990',
                value: 57000000
            },
            {
                name: '2010',
                value: 62000000
            }
        ]
    }
];


/***/ }),

/***/ "hWqd":
/*!***************************************!*\
  !*** ./projects/demo-app/src/main.ts ***!
  \***************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ "27ck");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "1K97");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["KtdAppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ "lxcd":
/*!*******************************************************************!*\
  !*** ./projects/demo-app/src/app/playground/playground.module.ts ***!
  \*******************************************************************/
/*! exports provided: KtdPlaygroundModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KtdPlaygroundModule", function() { return KtdPlaygroundModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _playground_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./playground.component */ "fggt");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! projects/angular-grid-layout/src/public-api */ "XHjT");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/button */ "bTqV");
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/select */ "d3UM");
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/checkbox */ "bSwM");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/input */ "qFsG");
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/chips */ "A5z7");












const routes = [
    { path: 'playground', component: _playground_component__WEBPACK_IMPORTED_MODULE_2__["KtdPlaygroundComponent"] },
];
class KtdPlaygroundModule {
}
KtdPlaygroundModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: KtdPlaygroundModule });
KtdPlaygroundModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function KtdPlaygroundModule_Factory(t) { return new (t || KtdPlaygroundModule)(); }, imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild(routes),
            projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_4__["KtdGridModule"],
            _angular_material_button__WEBPACK_IMPORTED_MODULE_5__["MatButtonModule"],
            _angular_material_select__WEBPACK_IMPORTED_MODULE_6__["MatSelectModule"],
            _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_7__["MatCheckboxModule"],
            _angular_material_input__WEBPACK_IMPORTED_MODULE_8__["MatInputModule"],
            _angular_material_chips__WEBPACK_IMPORTED_MODULE_9__["MatChipsModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](KtdPlaygroundModule, { declarations: [_playground_component__WEBPACK_IMPORTED_MODULE_2__["KtdPlaygroundComponent"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"], projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_4__["KtdGridModule"],
        _angular_material_button__WEBPACK_IMPORTED_MODULE_5__["MatButtonModule"],
        _angular_material_select__WEBPACK_IMPORTED_MODULE_6__["MatSelectModule"],
        _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_7__["MatCheckboxModule"],
        _angular_material_input__WEBPACK_IMPORTED_MODULE_8__["MatInputModule"],
        _angular_material_chips__WEBPACK_IMPORTED_MODULE_9__["MatChipsModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](KtdPlaygroundModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                declarations: [_playground_component__WEBPACK_IMPORTED_MODULE_2__["KtdPlaygroundComponent"]],
                imports: [
                    _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                    _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild(routes),
                    projects_angular_grid_layout_src_public_api__WEBPACK_IMPORTED_MODULE_4__["KtdGridModule"],
                    _angular_material_button__WEBPACK_IMPORTED_MODULE_5__["MatButtonModule"],
                    _angular_material_select__WEBPACK_IMPORTED_MODULE_6__["MatSelectModule"],
                    _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_7__["MatCheckboxModule"],
                    _angular_material_input__WEBPACK_IMPORTED_MODULE_8__["MatInputModule"],
                    _angular_material_chips__WEBPACK_IMPORTED_MODULE_9__["MatChipsModule"]
                ]
            }]
    }], null, null); })();


/***/ }),

/***/ "ocmN":
/*!**********************************************************************************************!*\
  !*** ./projects/demo-app/src/app/real-life-example/table-sorting/table-sorting.component.ts ***!
  \**********************************************************************************************/
/*! exports provided: KtdTableSortingComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KtdTableSortingComponent", function() { return KtdTableSortingComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_material_sort__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/sort */ "Dh3D");
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/table */ "+0xr");






function KtdTableSortingComponent_th_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "th", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " No. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function KtdTableSortingComponent_td_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "td", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const element_r10 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", element_r10.position, " ");
} }
function KtdTableSortingComponent_th_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "th", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " Name ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function KtdTableSortingComponent_td_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "td", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const element_r11 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", element_r11.name, " ");
} }
function KtdTableSortingComponent_th_8_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "th", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " Weight ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function KtdTableSortingComponent_td_9_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "td", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const element_r12 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", element_r12.weight, " ");
} }
function KtdTableSortingComponent_th_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "th", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " Symbol ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function KtdTableSortingComponent_td_12_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "td", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const element_r13 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", element_r13.symbol, " ");
} }
function KtdTableSortingComponent_tr_13_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "tr", 11);
} }
function KtdTableSortingComponent_tr_14_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "tr", 12);
} }
const ELEMENT_DATA = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
/**
 * @title Table with sorting
 */
class KtdTableSortingComponent {
    constructor() {
        this.displayedColumns = ['position', 'name', 'weight', 'symbol'];
        this.dataSource = new _angular_material_table__WEBPACK_IMPORTED_MODULE_2__["MatTableDataSource"](ELEMENT_DATA);
    }
    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }
}
KtdTableSortingComponent.ɵfac = function KtdTableSortingComponent_Factory(t) { return new (t || KtdTableSortingComponent)(); };
KtdTableSortingComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: KtdTableSortingComponent, selectors: [["ktd-table-sorting"]], viewQuery: function KtdTableSortingComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](_angular_material_sort__WEBPACK_IMPORTED_MODULE_1__["MatSort"], true);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.sort = _t.first);
    } }, decls: 15, vars: 3, consts: [["mat-table", "", "matSort", "", 1, "mat-elevation-z8", 3, "dataSource"], ["matColumnDef", "position"], ["mat-header-cell", "", "mat-sort-header", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "name"], ["matColumnDef", "weight"], ["matColumnDef", "symbol"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", "", "mat-sort-header", ""], ["mat-cell", ""], ["mat-header-row", ""], ["mat-row", ""]], template: function KtdTableSortingComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "table", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](1, 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, KtdTableSortingComponent_th_2_Template, 2, 0, "th", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, KtdTableSortingComponent_td_3_Template, 2, 1, "td", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](4, 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, KtdTableSortingComponent_th_5_Template, 2, 0, "th", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](6, KtdTableSortingComponent_td_6_Template, 2, 1, "td", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](7, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](8, KtdTableSortingComponent_th_8_Template, 2, 0, "th", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](9, KtdTableSortingComponent_td_9_Template, 2, 1, "td", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](10, 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](11, KtdTableSortingComponent_th_11_Template, 2, 0, "th", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](12, KtdTableSortingComponent_td_12_Template, 2, 1, "td", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](13, KtdTableSortingComponent_tr_13_Template, 1, 0, "tr", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](14, KtdTableSortingComponent_tr_14_Template, 1, 0, "tr", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("dataSource", ctx.dataSource);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("matHeaderRowDef", ctx.displayedColumns);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("matRowDefColumns", ctx.displayedColumns);
    } }, directives: [_angular_material_table__WEBPACK_IMPORTED_MODULE_2__["MatTable"], _angular_material_sort__WEBPACK_IMPORTED_MODULE_1__["MatSort"], _angular_material_table__WEBPACK_IMPORTED_MODULE_2__["MatColumnDef"], _angular_material_table__WEBPACK_IMPORTED_MODULE_2__["MatHeaderCellDef"], _angular_material_table__WEBPACK_IMPORTED_MODULE_2__["MatCellDef"], _angular_material_table__WEBPACK_IMPORTED_MODULE_2__["MatHeaderRowDef"], _angular_material_table__WEBPACK_IMPORTED_MODULE_2__["MatRowDef"], _angular_material_table__WEBPACK_IMPORTED_MODULE_2__["MatHeaderCell"], _angular_material_sort__WEBPACK_IMPORTED_MODULE_1__["MatSortHeader"], _angular_material_table__WEBPACK_IMPORTED_MODULE_2__["MatCell"], _angular_material_table__WEBPACK_IMPORTED_MODULE_2__["MatHeaderRow"], _angular_material_table__WEBPACK_IMPORTED_MODULE_2__["MatRow"]], styles: ["[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 100%;\n  overflow-y: auto;\n}\n\ntable[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\nth.mat-sort-header-sorted[_ngcontent-%COMP%] {\n  color: black;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcLi5cXHRhYmxlLXNvcnRpbmcuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxjQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSxnQkFBQTtBQUNKOztBQUVBO0VBQ0ksV0FBQTtBQUNKOztBQUVBO0VBQ0ksWUFBQTtBQUNKIiwiZmlsZSI6InRhYmxlLXNvcnRpbmcuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIG92ZXJmbG93LXk6IGF1dG87XG59XG5cbnRhYmxlIHtcbiAgICB3aWR0aDogMTAwJTtcbn1cblxudGgubWF0LXNvcnQtaGVhZGVyLXNvcnRlZCB7XG4gICAgY29sb3I6IGJsYWNrO1xufVxuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](KtdTableSortingComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'ktd-table-sorting',
                styleUrls: ['table-sorting.component.scss'],
                templateUrl: 'table-sorting.component.html',
            }]
    }], null, { sort: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: [_angular_material_sort__WEBPACK_IMPORTED_MODULE_1__["MatSort"]]
        }] }); })();


/***/ }),

/***/ "qcNg":
/*!*******************************************************************************!*\
  !*** ./projects/angular-grid-layout/src/lib/grid-item/grid-item.component.ts ***!
  \*******************************************************************************/
/*! exports provided: KtdGridItemComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KtdGridItemComponent", function() { return KtdGridItemComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _utils_pointer_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/pointer.utils */ "vARK");
/* harmony import */ var _grid_definitions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../grid.definitions */ "930P");
/* harmony import */ var _directives_drag_handle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../directives/drag-handle */ "xJKi");
/* harmony import */ var _directives_resize_handle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../directives/resize-handle */ "wesb");
/* harmony import */ var _utils_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/operators */ "dck0");
/* harmony import */ var _coercion_boolean_property__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../coercion/boolean-property */ "JzQ3");
/* harmony import */ var _coercion_number_property__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../coercion/number-property */ "CXhs");
/* harmony import */ var _grid_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../grid.service */ "/Jds");












const _c0 = ["resizeElem"];
const _c1 = ["*"];
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
        this._draggable$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](this._draggable);
        this._resizable = true;
        this._resizable$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](this._resizable);
        this.dragStartSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        this.resizeStartSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
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
        this._dragStartThreshold = Object(_coercion_number_property__WEBPACK_IMPORTED_MODULE_9__["coerceNumberProperty"])(val);
    }
    /** Whether the item is draggable or not. Defaults to true. */
    get draggable() {
        return this._draggable;
    }
    set draggable(val) {
        this._draggable = Object(_coercion_boolean_property__WEBPACK_IMPORTED_MODULE_8__["coerceBooleanProperty"])(val);
        this._draggable$.next(this._draggable);
    }
    /** Whether the item is resizable or not. Defaults to true. */
    get resizable() {
        return this._resizable;
    }
    set resizable(val) {
        this._resizable = Object(_coercion_boolean_property__WEBPACK_IMPORTED_MODULE_8__["coerceBooleanProperty"])(val);
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
        return this._draggable$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["switchMap"])((draggable) => {
            if (!draggable) {
                return rxjs__WEBPACK_IMPORTED_MODULE_1__["NEVER"];
            }
            else {
                return this._dragHandles.changes.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["startWith"])(this._dragHandles), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["switchMap"])((dragHandles) => {
                    return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["iif"])(() => dragHandles.length > 0, Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["merge"])(...dragHandles.toArray().map(dragHandle => Object(_utils_pointer_utils__WEBPACK_IMPORTED_MODULE_3__["ktdMouseOrTouchDown"])(dragHandle.element.nativeElement, 1))), Object(_utils_pointer_utils__WEBPACK_IMPORTED_MODULE_3__["ktdMouseOrTouchDown"])(this.elementRef.nativeElement, 1)).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["exhaustMap"])((startEvent) => {
                        // If the event started from an element with the native HTML drag&drop, it'll interfere
                        // with our own dragging (e.g. `img` tags do it by default). Prevent the default action
                        // to stop it from happening. Note that preventing on `dragstart` also seems to work, but
                        // it's flaky and it fails if the user drags it away quickly. Also note that we only want
                        // to do this for `mousedown` since doing the same for `touchstart` will stop any `click`
                        // events from firing on touch devices.
                        if (startEvent.target && startEvent.target.draggable && startEvent.type === 'mousedown') {
                            startEvent.preventDefault();
                        }
                        const startPointer = Object(_utils_pointer_utils__WEBPACK_IMPORTED_MODULE_3__["ktdPointerClient"])(startEvent);
                        return this.gridService.mouseOrTouchMove$(document).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(Object(_utils_pointer_utils__WEBPACK_IMPORTED_MODULE_3__["ktdMouseOrTouchEnd"])(document, 1)), Object(_utils_operators__WEBPACK_IMPORTED_MODULE_7__["ktdOutsideZone"])(this.ngZone), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["filter"])((moveEvent) => {
                            moveEvent.preventDefault();
                            const movePointer = Object(_utils_pointer_utils__WEBPACK_IMPORTED_MODULE_3__["ktdPointerClient"])(moveEvent);
                            const distanceX = Math.abs(startPointer.clientX - movePointer.clientX);
                            const distanceY = Math.abs(startPointer.clientY - movePointer.clientY);
                            // When this conditions returns true mean that we are over threshold.
                            return distanceX + distanceY >= this.dragStartThreshold;
                        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1), 
                        // Return the original start event
                        Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(() => startEvent));
                    }));
                }));
            }
        }));
    }
    _resizeStart$() {
        return this._resizable$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["switchMap"])((resizable) => {
            if (!resizable) {
                // Side effect to hide the resizeElem if resize is disabled.
                this.renderer.setStyle(this.resizeElem.nativeElement, 'display', 'none');
                return rxjs__WEBPACK_IMPORTED_MODULE_1__["NEVER"];
            }
            else {
                return this._resizeHandles.changes.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["startWith"])(this._resizeHandles), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["switchMap"])((resizeHandles) => {
                    if (resizeHandles.length > 0) {
                        // Side effect to hide the resizeElem if there are resize handles.
                        this.renderer.setStyle(this.resizeElem.nativeElement, 'display', 'none');
                        return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["merge"])(...resizeHandles.toArray().map(resizeHandle => Object(_utils_pointer_utils__WEBPACK_IMPORTED_MODULE_3__["ktdMouseOrTouchDown"])(resizeHandle.element.nativeElement, 1)));
                    }
                    else {
                        this.renderer.setStyle(this.resizeElem.nativeElement, 'display', 'block');
                        return Object(_utils_pointer_utils__WEBPACK_IMPORTED_MODULE_3__["ktdMouseOrTouchDown"])(this.resizeElem.nativeElement, 1);
                    }
                }));
            }
        }));
    }
}
KtdGridItemComponent.ɵfac = function KtdGridItemComponent_Factory(t) { return new (t || KtdGridItemComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_grid_service__WEBPACK_IMPORTED_MODULE_10__["KtdGridService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_grid_definitions__WEBPACK_IMPORTED_MODULE_4__["GRID_ITEM_GET_RENDER_DATA_TOKEN"])); };
KtdGridItemComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: KtdGridItemComponent, selectors: [["ktd-grid-item"]], contentQueries: function KtdGridItemComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontentQuery"](dirIndex, _directives_drag_handle__WEBPACK_IMPORTED_MODULE_5__["KTD_GRID_DRAG_HANDLE"], true);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontentQuery"](dirIndex, _directives_resize_handle__WEBPACK_IMPORTED_MODULE_6__["KTD_GRID_RESIZE_HANDLE"], true);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx._dragHandles = _t);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx._resizeHandles = _t);
    } }, viewQuery: function KtdGridItemComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstaticViewQuery"](_c0, true, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.resizeElem = _t.first);
    } }, inputs: { transition: "transition", id: "id", dragStartThreshold: "dragStartThreshold", draggable: "draggable", resizable: "resizable" }, ngContentSelectors: _c1, decls: 3, vars: 0, consts: [[1, "grid-item-resize-icon"], ["resizeElem", ""]], template: function KtdGridItemComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojectionDef"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "div", 0, 1);
    } }, styles: ["[_nghost-%COMP%] {\n  display: none;\n  position: absolute;\n  z-index: 1;\n  overflow: hidden;\n}\n[_nghost-%COMP%]   div[_ngcontent-%COMP%] {\n  position: absolute;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  z-index: 10;\n}\n[_nghost-%COMP%]   div.grid-item-resize-icon[_ngcontent-%COMP%] {\n  cursor: se-resize;\n  width: 20px;\n  height: 20px;\n  bottom: 0;\n  right: 0;\n  color: inherit;\n}\n[_nghost-%COMP%]   div.grid-item-resize-icon[_ngcontent-%COMP%]::after {\n  content: \"\";\n  position: absolute;\n  right: 3px;\n  bottom: 3px;\n  width: 5px;\n  height: 5px;\n  border-right: 2px solid;\n  border-bottom: 2px solid;\n}\n.display-none[_ngcontent-%COMP%] {\n  display: none !important;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcZ3JpZC1pdGVtLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBRUksYUFBQTtFQUNBLGtCQUFBO0VBQ0EsVUFBQTtFQUNBLGdCQUFBO0FBQUo7QUFFSTtFQUNJLGtCQUFBO0VBQ0EseUJBQUE7S0FBQSxzQkFBQTtNQUFBLHFCQUFBO1VBQUEsaUJBQUE7RUFDQSxXQUFBO0FBQVI7QUFFUTtFQUNJLGlCQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSxTQUFBO0VBQ0EsUUFBQTtFQUNBLGNBQUE7QUFBWjtBQUVZO0VBQ0ksV0FBQTtFQUNBLGtCQUFBO0VBQ0EsVUFBQTtFQUNBLFdBQUE7RUFDQSxVQUFBO0VBQ0EsV0FBQTtFQUNBLHVCQUFBO0VBQ0Esd0JBQUE7QUFBaEI7QUFNQTtFQUNJLHdCQUFBO0FBSEoiLCJmaWxlIjoiZ3JpZC1pdGVtLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3Qge1xuICAgIC8vIFRoaXMgZGlzcGxheSBub25lIGlzIHVzZWQgYXMgYSAnaGFjaycgdG8gaGlkZSB0aGlzIGVsZW1lbnQgdW50aWwgJ3NvbWVvbmUnIGNhbGxzIHRoZSBmdW5jdGlvbiBzZXRTdHlsZXMoKS5cbiAgICBkaXNwbGF5OiBub25lO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB6LWluZGV4OiAxO1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG5cbiAgICBkaXYge1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgICAgICB6LWluZGV4OiAxMDtcblxuICAgICAgICAmLmdyaWQtaXRlbS1yZXNpemUtaWNvbiB7XG4gICAgICAgICAgICBjdXJzb3I6IHNlLXJlc2l6ZTtcbiAgICAgICAgICAgIHdpZHRoOiAyMHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiAyMHB4O1xuICAgICAgICAgICAgYm90dG9tOiAwO1xuICAgICAgICAgICAgcmlnaHQ6IDA7XG4gICAgICAgICAgICBjb2xvcjogaW5oZXJpdDtcblxuICAgICAgICAgICAgJjo6YWZ0ZXIge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiXCI7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgICAgICAgIHJpZ2h0OiAzcHg7XG4gICAgICAgICAgICAgICAgYm90dG9tOiAzcHg7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDVweDtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDVweDtcbiAgICAgICAgICAgICAgICBib3JkZXItcmlnaHQ6IDJweCBzb2xpZDtcbiAgICAgICAgICAgICAgICBib3JkZXItYm90dG9tOiAycHggc29saWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi5kaXNwbGF5LW5vbmUge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbn1cbiJdfQ== */"], changeDetection: 0 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](KtdGridItemComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'ktd-grid-item',
                templateUrl: './grid-item.component.html',
                styleUrls: ['./grid-item.component.scss'],
                changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
            }]
    }], function () { return [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] }, { type: _grid_service__WEBPACK_IMPORTED_MODULE_10__["KtdGridService"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"] }, { type: undefined, decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"],
                args: [_grid_definitions__WEBPACK_IMPORTED_MODULE_4__["GRID_ITEM_GET_RENDER_DATA_TOKEN"]]
            }] }]; }, { _dragHandles: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ContentChildren"],
            args: [_directives_drag_handle__WEBPACK_IMPORTED_MODULE_5__["KTD_GRID_DRAG_HANDLE"], { descendants: true }]
        }], _resizeHandles: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ContentChildren"],
            args: [_directives_resize_handle__WEBPACK_IMPORTED_MODULE_6__["KTD_GRID_RESIZE_HANDLE"], { descendants: true }]
        }], resizeElem: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['resizeElem', { static: true, read: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] }]
        }], transition: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], id: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], dragStartThreshold: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], draggable: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], resizable: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }] }); })();


/***/ }),

/***/ "vARK":
/*!*********************************************************************!*\
  !*** ./projects/angular-grid-layout/src/lib/utils/pointer.utils.ts ***!
  \*********************************************************************/
/*! exports provided: ktdIsMobileOrTablet, ktdIsMouseEvent, ktdIsTouchEvent, ktdPointerClientX, ktdPointerClientY, ktdPointerClient, ktdMouseOrTouchDown, ktdMouseOrTouchMove, ktdTouchEnd, ktdMouseOrTouchEnd */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ktdIsMobileOrTablet", function() { return ktdIsMobileOrTablet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ktdIsMouseEvent", function() { return ktdIsMouseEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ktdIsTouchEvent", function() { return ktdIsTouchEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ktdPointerClientX", function() { return ktdPointerClientX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ktdPointerClientY", function() { return ktdPointerClientY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ktdPointerClient", function() { return ktdPointerClient; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ktdMouseOrTouchDown", function() { return ktdMouseOrTouchDown; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ktdMouseOrTouchMove", function() { return ktdMouseOrTouchMove; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ktdTouchEnd", function() { return ktdTouchEnd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ktdMouseOrTouchEnd", function() { return ktdMouseOrTouchEnd; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _passive_listeners__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./passive-listeners */ "veY6");



/** Options that can be used to bind a passive event listener. */
const passiveEventListenerOptions = Object(_passive_listeners__WEBPACK_IMPORTED_MODULE_2__["ktdNormalizePassiveListenerOptions"])({ passive: true });
/** Options that can be used to bind an active event listener. */
const activeEventListenerOptions = Object(_passive_listeners__WEBPACK_IMPORTED_MODULE_2__["ktdNormalizePassiveListenerOptions"])({ passive: false });
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
    return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["iif"])(() => ktdIsMobileOrTablet(), Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["fromEvent"])(element, 'touchstart', passiveEventListenerOptions).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["filter"])((touchEvent) => touchEvent.touches.length === touchNumber)), Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["fromEvent"])(element, 'mousedown', activeEventListenerOptions).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["filter"])((mouseEvent) => {
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
    return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["iif"])(() => ktdIsMobileOrTablet(), Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["fromEvent"])(element, 'touchmove', activeEventListenerOptions).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["filter"])((touchEvent) => touchEvent.touches.length === touchNumber)), Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["fromEvent"])(element, 'mousemove', activeEventListenerOptions));
}
function ktdTouchEnd(element, touchNumber = 1) {
    return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["merge"])(Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["fromEvent"])(element, 'touchend').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["filter"])((touchEvent) => touchEvent.touches.length === touchNumber - 1)), Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["fromEvent"])(element, 'touchcancel').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["filter"])((touchEvent) => touchEvent.touches.length === touchNumber - 1)));
}
/**
 * Emits when a there is a 'mouseup' or the touch ends.
 * @param element, html element where to  listen the events.
 * @param touchNumber number of the touch to track the event, default to the first one.
 */
function ktdMouseOrTouchEnd(element, touchNumber = 1) {
    return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["iif"])(() => ktdIsMobileOrTablet(), ktdTouchEnd(element, touchNumber), Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["fromEvent"])(element, 'mouseup'));
}


/***/ }),

/***/ "veY6":
/*!*************************************************************************!*\
  !*** ./projects/angular-grid-layout/src/lib/utils/passive-listeners.ts ***!
  \*************************************************************************/
/*! exports provided: ktdSupportsPassiveEventListeners, ktdNormalizePassiveListenerOptions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ktdSupportsPassiveEventListeners", function() { return ktdSupportsPassiveEventListeners; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ktdNormalizePassiveListenerOptions", function() { return ktdNormalizePassiveListenerOptions; });
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


/***/ }),

/***/ "wesb":
/*!**************************************************************************!*\
  !*** ./projects/angular-grid-layout/src/lib/directives/resize-handle.ts ***!
  \**************************************************************************/
/*! exports provided: KTD_GRID_RESIZE_HANDLE, KtdGridResizeHandle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KTD_GRID_RESIZE_HANDLE", function() { return KTD_GRID_RESIZE_HANDLE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KtdGridResizeHandle", function() { return KtdGridResizeHandle; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");


/**
 * Injection token that can be used to reference instances of `KtdGridResizeHandle`. It serves as
 * alternative token to the actual `KtdGridResizeHandle` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
const KTD_GRID_RESIZE_HANDLE = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["InjectionToken"]('KtdGridResizeHandle');
/** Handle that can be used to drag a KtdGridItem instance. */
class KtdGridResizeHandle {
    constructor(element) {
        this.element = element;
    }
}
KtdGridResizeHandle.ɵfac = function KtdGridResizeHandle_Factory(t) { return new (t || KtdGridResizeHandle)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])); };
KtdGridResizeHandle.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({ type: KtdGridResizeHandle, selectors: [["", "ktdGridResizeHandle", ""]], hostAttrs: [1, "ktd-grid-resize-handle"], features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵProvidersFeature"]([{ provide: KTD_GRID_RESIZE_HANDLE, useExisting: KtdGridResizeHandle }])] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](KtdGridResizeHandle, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"],
        args: [{
                selector: '[ktdGridResizeHandle]',
                host: {
                    class: 'ktd-grid-resize-handle'
                },
                providers: [{ provide: KTD_GRID_RESIZE_HANDLE, useExisting: KtdGridResizeHandle }],
            }]
    }], function () { return [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] }]; }, null); })();


/***/ }),

/***/ "xA2O":
/*!****************************************************!*\
  !*** ./projects/demo-app/src/app/app.component.ts ***!
  \****************************************************/
/*! exports provided: KtdAppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KtdAppComponent", function() { return KtdAppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");



class KtdAppComponent {
    constructor() {
    }
}
KtdAppComponent.ɵfac = function KtdAppComponent_Factory(t) { return new (t || KtdAppComponent)(); };
KtdAppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: KtdAppComponent, selectors: [["ktd-root"]], decls: 1, vars: 0, template: function KtdAppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "router-outlet");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterOutlet"]], styles: ["[_nghost-%COMP%] {\n  width: 100%;\n  display: block;\n  background: #121212;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxhcHAuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxXQUFBO0VBQ0EsY0FBQTtFQUNBLG1CQUFBO0FBQ0oiLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3Qge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIGJhY2tncm91bmQ6ICMxMjEyMTI7XG59XG4iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](KtdAppComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'ktd-root',
                templateUrl: './app.component.html',
                styleUrls: ['./app.component.scss']
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "xJKi":
/*!************************************************************************!*\
  !*** ./projects/angular-grid-layout/src/lib/directives/drag-handle.ts ***!
  \************************************************************************/
/*! exports provided: KTD_GRID_DRAG_HANDLE, KtdGridDragHandle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KTD_GRID_DRAG_HANDLE", function() { return KTD_GRID_DRAG_HANDLE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KtdGridDragHandle", function() { return KtdGridDragHandle; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");


/**
 * Injection token that can be used to reference instances of `KtdGridDragHandle`. It serves as
 * alternative token to the actual `KtdGridDragHandle` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
const KTD_GRID_DRAG_HANDLE = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["InjectionToken"]('KtdGridDragHandle');
/** Handle that can be used to drag a KtdGridItem instance. */
// tslint:disable-next-line:directive-class-suffix
class KtdGridDragHandle {
    constructor(element) {
        this.element = element;
    }
}
KtdGridDragHandle.ɵfac = function KtdGridDragHandle_Factory(t) { return new (t || KtdGridDragHandle)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])); };
KtdGridDragHandle.ɵdir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({ type: KtdGridDragHandle, selectors: [["", "ktdGridDragHandle", ""]], hostAttrs: [1, "ktd-grid-drag-handle"], features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵProvidersFeature"]([{ provide: KTD_GRID_DRAG_HANDLE, useExisting: KtdGridDragHandle }])] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](KtdGridDragHandle, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"],
        args: [{
                selector: '[ktdGridDragHandle]',
                host: {
                    class: 'ktd-grid-drag-handle'
                },
                providers: [{ provide: KTD_GRID_DRAG_HANDLE, useExisting: KtdGridDragHandle }],
            }]
    }], function () { return [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] }]; }, null); })();


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map