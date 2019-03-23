import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  model: any = {};

  constructor() { }

  ngOnInit() {
    this.model.username = "";
    this.model.email = "";
  }

}
