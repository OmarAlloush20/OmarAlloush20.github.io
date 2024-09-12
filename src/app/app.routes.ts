import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/ui/login/login.component';
import { MainMenuComponent } from './pages/main-menu/ui/main-menu/main-menu.component';
import { authGuard } from './shared/guards/auth.guard';
import { UsersComponent } from './pages/users/ui/users.component';
import { CustomerComponent } from './pages/customer/ui/customer.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'main',
    canActivate: [authGuard],
    component: MainMenuComponent,
    children: [
        {path: 'users', component: UsersComponent},
        {path: 'customers', component: CustomerComponent},
        // {path: '',}
    ]
  },
  {
    path: '',
    redirectTo: '/main',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/main',
    pathMatch: 'full',
  },
];
