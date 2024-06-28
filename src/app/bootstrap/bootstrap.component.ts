import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-bootstrap',
  standalone: true,
  imports: [
    RouterOutlet,
    NgOptimizedImage,
    DashboardComponent,
    SidebarComponent
  ],
  templateUrl: './bootstrap.component.html',
  styleUrl: './bootstrap.component.scss'
})
export class BootstrapComponent implements OnInit {
  ngOnInit() {

  }
}
