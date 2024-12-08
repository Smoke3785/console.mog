import { PowerLog } from "@classes/Log/index.ts";

export class SpinnerManager {
  private static spinners: Set<PowerLog> = new Set();
  private static running: boolean = false;
  private static interval: number = 100; // Update interval in milliseconds

  // Add a spinner to the manager
  public static register(spinner: PowerLog) {
    this.spinners.add(spinner);
    if (!this.running) {
      this.start();
    }
  }

  // Remove a spinner from the manager
  public static remove(spinner: PowerLog) {
    this.spinners.delete(spinner);
    if (this.spinners.size === 0) {
      this.stop();
    }
  }

  // Start the update loop
  private static start() {
    this.running = true;
    this.updateLoop();
  }

  // Stop the update loop
  private static stop() {
    this.running = false;
  }

  // Update loop to advance frames
  private static updateLoop() {
    if (!this.running) return;

    // Advance frames for all active spinners
    this.spinners.forEach((spinner) => spinner.advanceFrame());

    // Schedule the next update
    setTimeout(() => {
      this.updateLoop();
    }, this.interval);
  }
}
