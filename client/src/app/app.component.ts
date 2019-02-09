import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalsService } from './globals/globals.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
}
