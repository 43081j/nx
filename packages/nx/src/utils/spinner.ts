import { createSpinner, type Spinner } from 'nanospinner';
import { isCI } from './is-ci';

export const SHOULD_SHOW_SPINNERS = process.stdout.isTTY && !isCI();

class SpinnerManager {
  #spinner!: Spinner;
  #prefix: string | undefined;

  start(text?: string, prefix?: string): SpinnerManager {
    if (!SHOULD_SHOW_SPINNERS) {
      return this;
    }
    if (prefix !== undefined) {
      this.#prefix = prefix;
    }
    if (this.#spinner) {
      this.#spinner.start(text);
      this.#spinner.update({text: this.#prefix});
    } else {
      this.#createSpinner(text);
    }
    this.#spinner.start();
    return this;
  }

  succeed(text?: string) {
    this.#spinner?.success(text);
  }

  stop() {
    this.#spinner?.stop();
  }

  fail(text?: string) {
    this.#spinner?.error(text);
  }

  updateText(text?: string) {
    if (this.#spinner) {
      this.#spinner.update({ text });
    } else if (SHOULD_SHOW_SPINNERS) {
      this.#createSpinner(text);
    }
  }

  isSpinning() {
    return this.#spinner?.isSpinning ?? false;
  }

  #createSpinner(text?: string) {
    this.#spinner = createSpinner(this.#prefix);
    this.#spinner.start(text);
  }
}

export const globalSpinner = new SpinnerManager();
