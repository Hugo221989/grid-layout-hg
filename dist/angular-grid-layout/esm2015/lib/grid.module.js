import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KtdGridComponent } from './grid.component';
import { KtdGridItemComponent } from './grid-item/grid-item.component';
import { KtdGridDragHandle } from './directives/drag-handle';
import { KtdGridResizeHandle } from './directives/resize-handle';
import { KtdGridService } from './grid.service';
import * as i0 from "@angular/core";
export class KtdGridModule {
}
KtdGridModule.ɵmod = i0.ɵɵdefineNgModule({ type: KtdGridModule });
KtdGridModule.ɵinj = i0.ɵɵdefineInjector({ factory: function KtdGridModule_Factory(t) { return new (t || KtdGridModule)(); }, providers: [
        KtdGridService
    ], imports: [[
            CommonModule
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(KtdGridModule, { declarations: [KtdGridComponent,
        KtdGridItemComponent,
        KtdGridDragHandle,
        KtdGridResizeHandle], imports: [CommonModule], exports: [KtdGridComponent,
        KtdGridItemComponent,
        KtdGridDragHandle,
        KtdGridResizeHandle] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(KtdGridModule, [{
        type: NgModule,
        args: [{
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
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1ncmlkLWxheW91dC9zcmMvIiwic291cmNlcyI6WyJsaWIvZ3JpZC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDcEQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDdkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDN0QsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDakUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGdCQUFnQixDQUFDOztBQXNCaEQsTUFBTSxPQUFPLGFBQWE7O2lEQUFiLGFBQWE7eUdBQWIsYUFBYSxtQkFQWDtRQUNQLGNBQWM7S0FDakIsWUFDUTtZQUNMLFlBQVk7U0FDZjt3RkFFUSxhQUFhLG1CQWxCbEIsZ0JBQWdCO1FBQ2hCLG9CQUFvQjtRQUNwQixpQkFBaUI7UUFDakIsbUJBQW1CLGFBWW5CLFlBQVksYUFUWixnQkFBZ0I7UUFDaEIsb0JBQW9CO1FBQ3BCLGlCQUFpQjtRQUNqQixtQkFBbUI7a0RBU2QsYUFBYTtjQXBCekIsUUFBUTtlQUFDO2dCQUNOLFlBQVksRUFBRTtvQkFDVixnQkFBZ0I7b0JBQ2hCLG9CQUFvQjtvQkFDcEIsaUJBQWlCO29CQUNqQixtQkFBbUI7aUJBQ3RCO2dCQUNELE9BQU8sRUFBRTtvQkFDTCxnQkFBZ0I7b0JBQ2hCLG9CQUFvQjtvQkFDcEIsaUJBQWlCO29CQUNqQixtQkFBbUI7aUJBQ3RCO2dCQUNELFNBQVMsRUFBRTtvQkFDUCxjQUFjO2lCQUNqQjtnQkFDRCxPQUFPLEVBQUU7b0JBQ0wsWUFBWTtpQkFDZjthQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBLdGRHcmlkQ29tcG9uZW50IH0gZnJvbSAnLi9ncmlkLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBLdGRHcmlkSXRlbUNvbXBvbmVudCB9IGZyb20gJy4vZ3JpZC1pdGVtL2dyaWQtaXRlbS5jb21wb25lbnQnO1xuaW1wb3J0IHsgS3RkR3JpZERyYWdIYW5kbGUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvZHJhZy1oYW5kbGUnO1xuaW1wb3J0IHsgS3RkR3JpZFJlc2l6ZUhhbmRsZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9yZXNpemUtaGFuZGxlJztcbmltcG9ydCB7IEt0ZEdyaWRTZXJ2aWNlIH0gZnJvbSAnLi9ncmlkLnNlcnZpY2UnO1xuXG5ATmdNb2R1bGUoe1xuICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICBLdGRHcmlkQ29tcG9uZW50LFxuICAgICAgICBLdGRHcmlkSXRlbUNvbXBvbmVudCxcbiAgICAgICAgS3RkR3JpZERyYWdIYW5kbGUsXG4gICAgICAgIEt0ZEdyaWRSZXNpemVIYW5kbGVcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgS3RkR3JpZENvbXBvbmVudCxcbiAgICAgICAgS3RkR3JpZEl0ZW1Db21wb25lbnQsXG4gICAgICAgIEt0ZEdyaWREcmFnSGFuZGxlLFxuICAgICAgICBLdGRHcmlkUmVzaXplSGFuZGxlXG4gICAgXSxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgS3RkR3JpZFNlcnZpY2VcbiAgICBdLFxuICAgIGltcG9ydHM6IFtcbiAgICAgICAgQ29tbW9uTW9kdWxlXG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBLdGRHcmlkTW9kdWxlIHt9XG4iXX0=