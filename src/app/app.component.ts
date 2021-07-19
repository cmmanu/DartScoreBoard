import { Component} from '@angular/core';
import { PanePropertiesModel } from '@syncfusion/ej2-angular-layouts';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  public paneSettings: PanePropertiesModel[] = [
    {collapsible: false , size : '75%'},
     {collapsible : true ,  size : '25%'}
     ];



}
