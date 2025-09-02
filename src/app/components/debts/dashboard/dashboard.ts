import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Summary } from '../summary/summary';
import { List } from '../list/list';

@Component({
  selector: 'app-dashboard',
  imports: [Header, Summary, List],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
