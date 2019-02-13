import { Component } from '@angular/core';
import { GlobalsService } from '../globals/globals.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(protected globals: GlobalsService) {}
}
