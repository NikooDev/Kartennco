import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GoodiesComponent } from './goodies/goodies.component';

export const routes: Routes = [{
  path: '',
  component: GoodiesComponent,
  title: 'Personnalisez votre goodie'
}, {
  path: 'dashboard',
  component: DashboardComponent,
  title: 'Tableau de bord'
}];
