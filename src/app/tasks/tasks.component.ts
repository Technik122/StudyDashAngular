import { Component } from '@angular/core';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatExpansionPanelHeader } from "@angular/material/expansion";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent {
  panelOpenState = false;
}
