import { Injectable } from '@angular/core';
import { createThemeSignal } from 'nokturne/angular';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly theme = createThemeSignal();
  readonly state = this.theme.state;
  readonly setTheme = this.theme.setTheme;
  readonly toggle = this.theme.toggle;
}
