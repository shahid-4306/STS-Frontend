import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  styles: [
    `
      .app-shell {
        display: flex;
        min-height: 100vh;
      }
      .main {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .page-content {
        padding: 26px;
        flex: 1;
      }
    `,
  ],
  template: `
    <div class="app-shell">
      <app-sidebar></app-sidebar>
      <div class="main">
        <app-topbar></app-topbar>
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class AppShellComponent {}
