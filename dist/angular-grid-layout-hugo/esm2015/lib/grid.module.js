import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KtdGridComponent } from './grid.component';
import { KtdGridItemComponent } from './grid-item/grid-item.component';
import { KtdGridDragHandle } from './directives/drag-handle';
import { KtdGridResizeHandle } from './directives/resize-handle';
import { KtdGridService } from './grid.service';
export class KtdGridModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1ncmlkLWxheW91dC1odWdvL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9ncmlkLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNwRCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUN2RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUNqRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFzQmhELE1BQU0sT0FBTyxhQUFhOzs7WUFwQnpCLFFBQVEsU0FBQztnQkFDTixZQUFZLEVBQUU7b0JBQ1YsZ0JBQWdCO29CQUNoQixvQkFBb0I7b0JBQ3BCLGlCQUFpQjtvQkFDakIsbUJBQW1CO2lCQUN0QjtnQkFDRCxPQUFPLEVBQUU7b0JBQ0wsZ0JBQWdCO29CQUNoQixvQkFBb0I7b0JBQ3BCLGlCQUFpQjtvQkFDakIsbUJBQW1CO2lCQUN0QjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1AsY0FBYztpQkFDakI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNMLFlBQVk7aUJBQ2Y7YUFDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgS3RkR3JpZENvbXBvbmVudCB9IGZyb20gJy4vZ3JpZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgS3RkR3JpZEl0ZW1Db21wb25lbnQgfSBmcm9tICcuL2dyaWQtaXRlbS9ncmlkLWl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7IEt0ZEdyaWREcmFnSGFuZGxlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2RyYWctaGFuZGxlJztcbmltcG9ydCB7IEt0ZEdyaWRSZXNpemVIYW5kbGUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvcmVzaXplLWhhbmRsZSc7XG5pbXBvcnQgeyBLdGRHcmlkU2VydmljZSB9IGZyb20gJy4vZ3JpZC5zZXJ2aWNlJztcblxuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgS3RkR3JpZENvbXBvbmVudCxcbiAgICAgICAgS3RkR3JpZEl0ZW1Db21wb25lbnQsXG4gICAgICAgIEt0ZEdyaWREcmFnSGFuZGxlLFxuICAgICAgICBLdGRHcmlkUmVzaXplSGFuZGxlXG4gICAgXSxcbiAgICBleHBvcnRzOiBbXG4gICAgICAgIEt0ZEdyaWRDb21wb25lbnQsXG4gICAgICAgIEt0ZEdyaWRJdGVtQ29tcG9uZW50LFxuICAgICAgICBLdGRHcmlkRHJhZ0hhbmRsZSxcbiAgICAgICAgS3RkR3JpZFJlc2l6ZUhhbmRsZVxuICAgIF0sXG4gICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIEt0ZEdyaWRTZXJ2aWNlXG4gICAgXSxcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIENvbW1vbk1vZHVsZVxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgS3RkR3JpZE1vZHVsZSB7fVxuIl19