import { Routes } from '@angular/router';
import { TableProductsComponent } from './pages/table-products/table-products.component';
import { FormProductsComponent } from './pages/form-products/form-products.component';

export const customerRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'table',
        title: 'Productos',
        component: TableProductsComponent,
      },
      {
        path: 'form',
        title: 'Formulario',
        component: FormProductsComponent,
      },
      {
        path: '**',
        redirectTo: 'table',
      },
    ],
  },
];
