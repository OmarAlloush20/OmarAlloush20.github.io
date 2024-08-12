import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/ui/login/login.component';
import { authGuard } from './shared/guards/auth.guard';
import { MainMenuComponent } from './pages/main-menu/ui/main-menu/main-menu.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'main',
        canActivate: [authGuard],
        component: MainMenuComponent,
        // children: [
        //     {path: '',},
        //     {path: '',}
        // ]
    },
];
