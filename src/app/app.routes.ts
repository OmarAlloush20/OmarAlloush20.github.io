import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/ui/login/login.component';
import { MainMenuComponent } from './features/main-menu/ui/main-menu/main-menu.component';
import { authGuard } from './shared/guards/auth.guard';
import { UsersComponent } from './features/users/ui/users.component';
import { CustomerComponent } from './features/customer/ui/customer.component';
import { AgentsComponent } from './features/agents/ui/agents.component';
import { FinancialsComponent } from './features/financials/ui/financials.component';
import { PaymentVouchersComponent } from './features/financials/ui/payment-voucher/payment-voucher.component';
import { ReceiptVouchersComponent } from './features/financials/ui/receipt-voucher/receipt-voucher.component';
import { LocationComponent } from './features/location/ui/location.component';
import { TripsComponent } from './features/trips/ui/trips.component';

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
        path: 'trips',
        component: TripsComponent,
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
