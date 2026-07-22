import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main>
      <h1>Nokturne + Angular</h1>
      <p>choice: <strong>{{ theme.state().theme }}</strong></p>
      <p>resolved: <strong>{{ theme.state().resolvedTheme }}</strong></p>
      <p>system: <strong>{{ theme.state().systemTheme }}</strong></p>
      <div class="row">
        <button (click)="theme.setTheme('light')">Light</button>
        <button (click)="theme.setTheme('dark')">Dark</button>
        <button (click)="theme.setTheme('system')">System</button>
        <button (click)="theme.toggle()">Toggle</button>
      </div>
    </main>
  `,
})
export class App {
  protected readonly theme = inject(ThemeService);
}
