import { bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';
import { BootstrapComponent } from './app/bootstrap/bootstrap.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(BootstrapComponent, appConfig)
  .catch((err) => console.error(err));
