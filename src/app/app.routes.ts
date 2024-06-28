import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GoodiesComponent } from './goodies/goodies.component';
import { ProductsComponent } from './products/products.component';
import { AuthComponent } from './auth/auth.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { UsersComponent } from './dashboard/users/users.component';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { ConfirmComponent } from './confirm/confirm.component';

export const routes: Routes = [{
  path: '',
  component: HomeComponent,
  title: 'Kartennco'
}, {
  path: 'products',
  component: ProductsComponent,
  title: 'Nos produits'
}, {
  path: 'confirm',
  component: ConfirmComponent,
  title: 'Commande confirmée'
}, {
  path: 'goodie/:goodiename',
  component: GoodiesComponent,
  title: 'Personnalisez votre goodie'
}, {
  path: 'dashboard',
  component: DashboardComponent,
  title: 'Tableau de bord'
}, {
  path: 'dashboard/users',
  component: UsersComponent,
  title: 'Gestion utilisateurs'
}, {
  path: 'auth',
  component: AuthComponent,
}, {
  path: 'qui-sommes-nous',
  component: AboutComponent,
  title: 'Qui sommes-nous ?'
}, {
  path: 'contact',
  component: ContactComponent,
  title: 'Contactez-nous'
}, {
  path: 'user/:uid',
  component: UsersComponent
}, {
  path: 'cart',
  component: CartComponent
}];
