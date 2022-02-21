import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {SidenavAction} from "../../shared/misc/sidebar-content-enum";
import {SystemConfigService} from "../../service/system-config.service";

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent {

  @Output() newSidenavAction = new EventEmitter<SidenavAction>();
  action = SidenavAction;
  subMenuOpened = false;
  subMenuOpened2 = false;

  constructor(private systemConfigService:SystemConfigService) {console.log("sidebar"); }

  setAction( action: SidenavAction) {
    console.log("event");
    this.newSidenavAction.emit(action);
  }

  toggleSubMenu() : void {
    this.subMenuOpened = !this.subMenuOpened;
  }

  toggleSubMenu2() : void {
    this.subMenuOpened2 = !this.subMenuOpened2;
  }
  hasData() : boolean {
    return this.systemConfigService.dataHasBeenRead;
  }
}
