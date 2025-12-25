/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {createSpinner, type Spinner as NanoSpinner} from 'nanospinner';
import { colors } from './color';
import { isTTY } from './tty';

export class Spinner {
  private readonly spinner?: NanoSpinner;

  /** When false, only fail messages will be displayed. */
  enabled = true;
  readonly #isTTY = isTTY();

  constructor(text?: string) {
    if (this.#isTTY) {
      this.spinner = createSpinner(text === undefined ? text : undefined, {
      });
    }
  }

  set text(text: string) {
    if (this.spinner) {
      this.spinner.update({text});
    }
  }

  get isSpinning(): boolean {
    return this.spinner?.isSpinning() === true || !this.#isTTY;
  }

  succeed(text?: string): void {
    if (this.enabled && this.spinner) {
      this.spinner.success(text);
    }
  }

  fail(text?: string): void {
    if (this.spinner) {
      this.spinner.error(text && colors.redBright(text));
    }
  }

  stop(): void {
    if (this.spinner) {
      this.spinner.stop();
    }
  }

  start(text?: string): void {
    if (this.enabled && this.spinner) {
      this.spinner.start(text);
    }
  }
}
