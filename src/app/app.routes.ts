import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/ui/login/login.component';
import { MainMenuComponent } from './pages/main-menu/ui/main-menu/main-menu.component';
import { authGuard } from './shared/guards/auth.guard';
import { UsersComponent } from './pages/users/ui/users.component';
import { CustomerComponent } from './pages/customer/ui/customer.component';
import { AgentsComponent } from './pages/agents/ui/agents.component';
import { FinancialsComponent } from './pages/financials/ui/financials.component';
import { PaymentVouchersComponent } from './pages/financials/ui/payment-voucher/payment-voucher.component';
import { ReceiptVouchersComponent } from './pages/financials/ui/receipt-voucher/receipt-voucher.component';
import { LocationComponent } from './pages/location/ui/location.component';

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
      { path: 'users', component: UsersComponent },
      { path: 'customers', component: CustomerComponent },
      { path: 'agents', component: AgentsComponent },
      {
        path: 'location',
        component: LocationComponent,
      },
      {
        path: 'financials',
        component: FinancialsComponent,
        children: [
          { path: '', redirectTo: 'paymentVoucher', pathMatch: 'full' },
          { path: 'paymentVoucher', component: PaymentVouchersComponent },
          { path: 'receiptVoucher', component: ReceiptVouchersComponent },
        ],
      },
      // {path: '',}
    ],
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
