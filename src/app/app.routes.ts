import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'customer',
        loadChildren: () => import('./customer/customer.routes').then((m) => m.customerRoutes),
    },
    {
        path: '**',
        redirectTo: 'customer',
    }
];
