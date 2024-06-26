import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgClass, NgForOf } from '@angular/common';
import { homeIcon, userIcon } from '../utils/icons';

interface LinksType {
  url: string,
  title: string,
  active: boolean,
  icon: SafeHtml
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgForOf, NgClass],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  public links: LinksType[] = [];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.links.push({
      url: '/dashboard',
      title: 'Tableau de bord',
      active: true,
      icon: this.sanitizer.bypassSecurityTrustHtml(homeIcon)
    }, {
      url: '/dashboard/users',
      title: 'Gestion utilisateurs',
      active: false,
      icon: this.sanitizer.bypassSecurityTrustHtml(userIcon)
    })
  }
}
