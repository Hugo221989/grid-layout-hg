import { AfterContentChecked, AfterContentInit, ElementRef, EventEmitter, NgZone, OnChanges, OnDestroy, QueryList, Renderer2, SimpleChanges } from '@angular/core';
import { NumberInput } from './coercion/number-property';
import { KtdGridItemComponent } from './grid-item/grid-item.component';
import { KtdGridCfg, KtdGridCompactType, KtdGridItemRenderData, KtdGridLayout, KtdGridLayoutItem } from './grid.definitions';
import { KtdDictionary } from '../types';
import { KtdGridService } from './grid.service';
import { BooleanInput } from './coercion/boolean-property';
import * as i0 from "@angular/core";
interface KtdDragResizeEvent {
    layout: KtdGridLayout;
    layoutItem: KtdGridLayoutItem;
    gridItemRef: KtdGridItemComponent;
}
export declare type KtdDragStart = KtdDragResizeEvent;
export declare type KtdResizeStart = KtdDragResizeEvent;
export declare type KtdDragEnd = KtdDragResizeEvent;
export declare type KtdResizeEnd = KtdDragResizeEvent;
export declare function parseRenderItemToPixels(renderItem: KtdGridItemRenderData<number>): KtdGridItemRenderData<string>;
export declare function __gridItemGetRenderDataFactoryFunc(gridCmp: KtdGridComponent): (id: string) => KtdGridItemRenderData<string>;
export declare function ktdGridItemGetRenderDataFactoryFunc(gridCmp: KtdGridComponent): (id: string) => KtdGridItemRenderData<string>;
export declare class KtdGridComponent implements OnChanges, AfterContentInit, AfterContentChecked, OnDestroy {
    private gridService;
    private elementRef;
    private renderer;
    private ngZone;
    /** Query list of grid items that are being rendered. */
    _gridItems: QueryList<KtdGridItemComponent>;
    /** Emits when layout change */
    layoutUpdated: EventEmitter<KtdGridLayout>;
    /** Emits when drag starts */
    dragStarted: EventEmitter<KtdDragStart>;
    /** Emits when resize starts */
    resizeStarted: EventEmitter<KtdResizeStart>;
    /** Emits when drag ends */
    dragEnded: EventEmitter<KtdDragEnd>;
    /** Emits when resize ends */
    resizeEnded: EventEmitter<KtdResizeEnd>;
    /**
     * Parent element that contains the scroll. If an string is provided it would search that element by id on the dom.
     * If no data provided or null autoscroll is not performed.
     */
    scrollableParent: HTMLElement | Document | string | null;
    /** Whether or not to update the internal layout when some dependent property change. */
    get compactOnPropsChange(): boolean;
    set compactOnPropsChange(value: boolean);
    private _compactOnPropsChange;
    /** If true, grid items won't change position when being dragged over. Handy when using no compaction */
    get preventCollision(): boolean;
    set preventCollision(value: boolean);
    private _preventCollision;
    /** Number of CSS pixels that would be scrolled on each 'tick' when auto scroll is performed. */
    get scrollSpeed(): number;
    set scrollSpeed(value: number);
    private _scrollSpeed;
    /** Type of compaction that will be applied to the layout (vertical, horizontal or free). Defaults to 'vertical' */
    get compactType(): KtdGridCompactType;
    set compactType(val: KtdGridCompactType);
    private _compactType;
    /** Row height in css pixels */
    get rowHeight(): number;
    set rowHeight(val: number);
    private _rowHeight;
    /** Number of columns  */
    get cols(): number;
    set cols(val: number);
    private _cols;
    /** Layout of the grid. Array of all the grid items with its 'id' and position on the grid. */
    get layout(): KtdGridLayout;
    set layout(layout: KtdGridLayout);
    private _layout;
    get config(): KtdGridCfg;
    /** Total height of the grid */
    private _height;
    private _gridItemsRenderData;
    private subscriptions;
    constructor(gridService: KtdGridService, elementRef: ElementRef, renderer: Renderer2, ngZone: NgZone);
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterContentInit(): void;
    ngAfterContentChecked(): void;
    resize(): void;
    ngOnDestroy(): void;
    compactLayout(): void;
    getItemsRenderData(): KtdDictionary<KtdGridItemRenderData<number>>;
    getItemRenderData(itemId: string): KtdGridItemRenderData<number>;
    calculateRenderData(): void;
    render(): void;
    private updateGridItemsStyles;
    private initSubscriptions;
    /**
     * Perform a general grid drag action, from start to end. A general grid drag action basically includes creating the placeholder element and adding
     * some class animations. calcNewStateFunc needs to be provided in order to calculate the new state of the layout.
     * @param gridItem that is been dragged
     * @param pointerDownEvent event (mousedown or touchdown) where the user initiated the drag
     * @param calcNewStateFunc function that return the new layout state and the drag element position
     */
    private performDragSequence$;
    static ngAcceptInputType_cols: NumberInput;
    static ngAcceptInputType_rowHeight: NumberInput;
    static ngAcceptInputType_scrollSpeed: NumberInput;
    static ngAcceptInputType_compactOnPropsChange: BooleanInput;
    static ngAcceptInputType_preventCollision: BooleanInput;
    static ɵfac: i0.ɵɵFactoryDef<KtdGridComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<KtdGridComponent, "ktd-grid", never, { "scrollableParent": "scrollableParent"; "compactOnPropsChange": "compactOnPropsChange"; "preventCollision": "preventCollision"; "scrollSpeed": "scrollSpeed"; "compactType": "compactType"; "rowHeight": "rowHeight"; "cols": "cols"; "layout": "layout"; }, { "layoutUpdated": "layoutUpdated"; "dragStarted": "dragStarted"; "resizeStarted": "resizeStarted"; "dragEnded": "dragEnded"; "resizeEnded": "resizeEnded"; }, ["_gridItems"], ["*"]>;
}
export {};
//# sourceMappingURL=grid.component.d.ts.map