import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit, AfterViewInit {
  public title: string = 'Connectez-vous';
  public isSignup: boolean = false;

  constructor(private titleService: Title) {}

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    if (this.isSignup) {
      this.title = 'Inscrivez-vous'
      this.titleService.setTitle('Inscrivez-vous');
    } else {
      this.title = 'Connectez-vous'
      this.titleService.setTitle('Connectez-vous');
    }
  }

  public login() {

  }

  public signup() {

  }

  public setSignup(bool: boolean){
    this.isSignup = bool;
  }
}
