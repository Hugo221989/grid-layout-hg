import { AfterContentInit, ElementRef, NgZone, OnDestroy, OnInit, QueryList, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { KtdGridItemRenderDataTokenType } from '../grid.definitions';
import { KtdGridDragHandle } from '../directives/drag-handle';
import { KtdGridResizeHandle } from '../directives/resize-handle';
import { KtdGridService } from '../grid.service';
import { BooleanInput } from '../coercion/boolean-property';
import { NumberInput } from '../coercion/number-property';
import * as i0 from "@angular/core";
export declare class KtdGridItemComponent implements OnInit, OnDestroy, AfterContentInit {
    elementRef: ElementRef;
    private gridService;
    private renderer;
    private ngZone;
    private getItemRenderData;
    /** Elements that can be used to drag the grid item. */
    _dragHandles: QueryList<KtdGridDragHandle>;
    _resizeHandles: QueryList<KtdGridResizeHandle>;
    resizeElem: ElementRef;
    /** CSS transition style. Note that for more performance is preferable only make transition on transform property. */
    transition: string;
    dragStart$: Observable<MouseEvent | TouchEvent>;
    resizeStart$: Observable<MouseEvent | TouchEvent>;
    /** Id of the grid item. This property is strictly compulsory. */
    get id(): string;
    set id(val: string);
    private _id;
    /** Minimum amount of pixels that the user should move before it starts the drag sequence. */
    get dragStartThreshold(): number;
    set dragStartThreshold(val: number);
    private _dragStartThreshold;
    /** Whether the item is draggable or not. Defaults to true. */
    get draggable(): boolean;
    set draggable(val: boolean);
    private _draggable;
    private _draggable$;
    /** Whether the item is resizable or not. Defaults to true. */
    get resizable(): boolean;
    set resizable(val: boolean);
    private _resizable;
    private _resizable$;
    private dragStartSubject;
    private resizeStartSubject;
    private subscriptions;
    constructor(elementRef: ElementRef, gridService: KtdGridService, renderer: Renderer2, ngZone: NgZone, getItemRenderData: KtdGridItemRenderDataTokenType);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    setStyles({ top, left, width, height }: {
        top: string;
        left: string;
        width?: string;
        height?: string;
    }): void;
    private _dragStart$;
    private _resizeStart$;
    static ngAcceptInputType_draggable: BooleanInput;
    static ngAcceptInputType_resizable: BooleanInput;
    static ngAcceptInputType_dragStartThreshold: NumberInput;
    static ɵfac: i0.ɵɵFactoryDef<KtdGridItemComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<KtdGridItemComponent, "ktd-grid-item", never, { "transition": "transition"; "id": "id"; "dragStartThreshold": "dragStartThreshold"; "draggable": "draggable"; "resizable": "resizable"; }, {}, ["_dragHandles", "_resizeHandles"], ["*"]>;
}
//# sourceMappingURL=grid-item.component.d.ts.map