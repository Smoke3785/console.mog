// Types
import type { TableDataInput } from "@classes/core/LogData/types.ts";
import type {
  CreateChildOptions,
  VariantName,
  LogParams,
  LogType,
} from "@classes/core/Log/types.ts";

// Classes
import { SpinnerManager } from "@classes/core/SpinnerManager/index.ts";
import {
  HorizontalRule,
  TableLog,
  PowerLog,
  MogLog,
  Log,
} from "@classes/core/Log/index.ts";
import AverageArray from "@classes/utilities/AverageArray.ts";
import { LogData } from "@classes/core/LogData/class.ts";
import LogStore from "@classes/utilities/LogStore.ts";

// Data
import { domConfig } from "./data.ts";

// Logging / debug
import * as log from "./logging.ts";

// Utils
import { createChildLog, createChildOptions } from "@classes/core/Log/utils.ts";
import { Configuration } from "@classes/configuration/Configuration/index.ts";
import { memoizeDecorator } from "memoize";
import patchConsole from "patch-console";
import * as utils from "@utils";
import * as $R from "remeda";

// ===========================================================================
// DOM RENDERER
// ===----
// The original idea was to manipulate the terminal using ANSI escape codes, overwriting existing lines. This would do away with
// all the unfortunate scroll-jacking and flickering that occurs when you completely overwrite the terminal with new content.
// Unfortunately, the write-only nature of the terminal makes this difficult (impossible?) to implement. The new approach is to
// use the smart rendering strategy to render lines that *are* accessible and dumb render the rest. This is a compromise that
// should produce the same result in the majority of cases - if you're making pretty console.logs, you're probably looking
// at them. If you're making pretty logs and *not* looking at them, you're probably waiting on something and not actively
// browsing.
// ==============================-------------

export class DOM {
  static instance: DOM | null = null;

  // Metrics
  private renderTimes = new AverageArray(domConfig.RENDER_AVG_SAMPLE_SIZE);
  private framesRendered: number = 0;

  // DOM Configuration and Constants
  public readonly spinnerManager = SpinnerManager;
  public readonly uid = domConfig.STATIC_UID;
  public readonly config: Configuration;
  public readonly restore: () => void;
  public readonly parent = this;
  public readonly root = this;
  public readonly depth = 0;

  // DOM State
  private isCursorHidden: boolean = false;
  public children: Array<MogLog> = [];
  private groupStack: MogLog[] = [];

  // Render State - Flags
  private fullRenderRequested: boolean = false;
  private renderRequested: boolean = false;
  private rendering: boolean = false;

  // Render State - Config
  private renderLoopInterval: NodeJS.Timeout | null = null;
  private framerate: number = 1000 / domConfig.FRAME_RATE; // 60 FPS

  // Render State - History
  private previousLineIndex: number = 0; // Represents the last line index of the previous render

  // Memoization keys
  private terminalDataKey: number = 0;
  private dataKey: number = 0;

  private constructor(config: Configuration) {
    this.config = config;

    // Override console functionality
    this.restore = this.patchConsole();

    // Mount the DOM
    this.mount();
  }

  public singleton = DOM.singleton;
  public static singleton(config: Configuration) {
    if (!DOM.instance) {
      DOM.instance = new DOM(config);
    }

    return DOM.instance;
  }

  public setFramerate(framesPerSecond: number) {
    this.framerate = 1000 / framesPerSecond;
  }

  private renderIfNecessary() {
    setImmediate(() => {
      if (this.renderRequested && !this.rendering) {
        this.render();
      }
    });
  }

  private async startRenderLoop() {
    if (this.renderLoopInterval) {
      this.unmount();
      throw new Error("Render loop already started.");
    }

    this.renderLoopInterval = setInterval(() => {
      this.renderIfNecessary();
    }, this.framerate);
  }

  private stopRenderLoop() {
    if (this.renderLoopInterval) {
      // I'm not sure if the interval exists after an exit, but I will try to clear it anyway
      clearInterval(this.renderLoopInterval);
    }

    this.renderLoopInterval = null;
  }

  // ILIAD: TODO: I need to formalize the naming of these methods
  // inform of update request update update required update request it is gay!
  private fullRerender() {
    for (const child of this.children) {
      child.informOfUpdate();
    }
    this.informOfUpdate(true);
  }

  private hardClearConsole() {
    process.stdout.write("\x1Bc");
  }

  /**
   * Recursively collect lines from all nodes in a stable reverse order.
   */
  private collectLogData(lineCount: number = 1000): LogData[] {
    const lines: LogData[] = [];

    // Recursive function to traverse the tree and collect lines in reverse order
    const traverse = (node: DOM | Log) => {
      // Traverse children in reverse order
      for (let i = node.children.length - 1; i >= 0; i--) {
        const rNode = node.children[i];
        if (rNode) traverse(rNode);
        if (lines.length >= lineCount) return; // Stop if we reach the line count
      }

      // If this is a Log (not the root DOM), add its own line
      if (node instanceof Log) {
        lines.push(node.data);
      }

      // Stop if we reach the line count
      if (lines.length >= lineCount) return;
    };

    // Traverse the top-level children in reverse order
    for (let i = this.children.length - 1; i >= 0; i--) {
      const rNode = this.children[i];
      if (rNode) traverse(rNode);
      if (lines.length >= lineCount) break; // Stop if we reach the line count
    }

    // Return collected lines in the correct order (reverse back)
    return lines.reverse();
  }

  @memoizeDecorator()
  private memoizedTotalLinesConsumed(dataKey: number): number {
    return this.collectLogData().reduce((acc, log) => {
      return acc + log.linesConsumed;
    }, 0);
  }

  get totalLinesConsumed(): number {
    return this.collectLogData().reduce((acc, log) => {
      return acc + log.linesConsumed;
    }, 0);
  }

  private get isFirstRender(): boolean {
    return this.framesRendered === 0;
  }

  private throwAndUnmount(data: any) {
    this.unmount();
    this.hardClearConsole();
    throw new Error(data);
  }

  private writeData(data: string): void {
    process.stdout.write(data);
  }

  // ======================
  // Render Lifecycle
  // ===--------

  private initiateRender(): void {
    this.rendering = true;
  }

  private finalizeRender(full: boolean, renderStartTime: number): void {
    // Metrics
    this.renderTimes.push(performance.now() - renderStartTime);
    this.framesRendered++;

    // Reset render flags
    full && (this.fullRenderRequested = false);
    this.renderRequested = false;
    this.rendering = false;
    return;
  }

  private dumbRender(hardClear: boolean = false): void {
    const dataToRender = this.collectLogData();
    const chunks = $R.chunk(dataToRender, 999);

    let buffer = "";

    // Is there a way we can buffer this to minimize nonsense?
    for (const data of dataToRender) {
      buffer += data.toString() + "\n";
      data.log.informOfRerender();
    }

    // Clear and write as close to each other as possible
    if (hardClear) this.hardClearConsole();
    this.writeData(buffer);
  }

  /**
   * Render the entire tree by collecting data in a stable, top-down order.
   */
  private render(specialKey?: string) {
    this.initiateRender();

    const full = this.isFirstRender || this.fullRenderRequested;
    const tHeight = process.stdout.rows;

    // Metrics
    const renderStartTime = performance.now();
    log.render(this.framesRendered, this.renderTimes);

    if (full || specialKey === "final") {
      this.dumbRender(true);
      return this.finalizeRender(full, renderStartTime);
    }

    // This holds the calculated data for each log node
    const dataToRender: LogData[] = this.collectLogData();
    let cursorIndex = 0; // 1-based index;
    let buffer = "\x1B[H"; // Move cursor to home position

    // Calculate values we will need to determine render position / strategy
    const totalLinesConsumed = this.memoizedTotalLinesConsumed(this.dataKey);
    const eTotalLinesConsumed = Math.max(totalLinesConsumed, tHeight);
    const lineVisibilityThreshold = eTotalLinesConsumed - tHeight;

    // Track state of main render loop
    let renderComplete = false;
    let renderAttempts = 0;

    // Log tuah on that thang
    log.renderData(
      lineVisibilityThreshold,
      dataToRender.length,
      tHeight,
      eTotalLinesConsumed,
      totalLinesConsumed
    );

    // Re-try render until all data is rendered
    render: while (!renderComplete) {
      renderAttempts++;

      if (renderAttempts > 100) {
        this.unmount();
        return this.throwAndUnmount(
          `Recursive render occurred more than 100 times. Exiting.`
        );
      }

      renderData: for (let data of dataToRender) {
        const requiresRender = data.log.renderRequested;

        // Calculate values we'll need to determine render position / strategy
        const dataStartIndex = cursorIndex - lineVisibilityThreshold;
        const visibleLinesNo = dataStartIndex + data.linesConsumed;
        const allLinesVisible = visibleLinesNo > 0;

        // Skip rendering if the data is unchanged
        if (!requiresRender) {
          cursorIndex += data.linesConsumed;
          continue;
        }

        // If there are lines that require rendering, but they are out of view, we cannot manipulate them with ANSI codes :
        if (!allLinesVisible) {
          this.dumbRender(true); // Dumb render the entire DOM
          data.log.informOfRerender(); // Then inform the log that it has been rendered to avoid re-rendering

          cursorIndex += data.linesConsumed;
          continue; // Then move on to the next data chunk
        }

        // =======------ * * * * * ------======= //
        //  This is where smart render comes in  //
        // =======------ * * * * * ------======= //
        for (let [lineIndex, line] of Object.entries(data.lines)) {
          const lineCursorIndex = dataStartIndex + Number(lineIndex);

          log.smartRender(line, lineCursorIndex);

          // ILIAD: NOTE: TODO: There is a bug here - if the smart-rendered line is at or near the top of the screen, silly things happen.
          // Adjusting the lineCursorIndex by -1 fixes this, but that causes silly things most of the time.
          // I suspect this is related to the fact that there is one blank space at the bottom of the screen...

          // Additional note: This could be related to my math for calculating if the line is visible or not.
          // Additional note: lineCursorIndex works when there is more lines than the terminal height, but lineCursorIndex + 1 works when there are fewer lines than the terminal height.
          // This smells like Math.abs...

          // This largely solves the problem, but I'm still puzzled by why it is necessary.
          const mod = Number(totalLinesConsumed <= tHeight);

          // There is still a bit of flickering when the terminal height is 1. Maybe I
          // should add a special case for that and just dumb render the whole thing.

          // On that note, I should also quit rendering if tHeight is zero because there's no need.

          buffer += `\x1B[${lineCursorIndex + mod};1H`; // Move cursor to line (1-based)
          buffer += "\x1B[2K"; // Clear the entire line
          buffer += line;
        }

        // Inform the log that it has been rendered - probably a better way to this.
        // Benchmarking will be necessary.
        data.log.informOfRerender();

        cursorIndex += data.linesConsumed;
        continue;
      }

      // Escape the render loop
      renderComplete = true;
    }

    finalBufferWrite: {
      // Clear trailing lines if the new content is shorter
      // Unsure if this needs to be adjusted on full render
      for (let i = cursorIndex; i < this.previousLineIndex; i++) {
        buffer += `\x1B[${i + 1};1H\x1B[2K`;
      }

      // Move cursor below the last rendered line, but also ensure we don't go beyond terminal height
      buffer += `\x1B[${Math.min(cursorIndex + 1, tHeight)};1H`;

      // Store the last line index for the next render
      this.previousLineIndex = cursorIndex;

      // Write all updates at once
      process.stdout.write(buffer);
    }

    // Finalize
    this.finalizeRender(full, renderStartTime);
  }

  /**
   * Informs the DOM that a render is required.
   * @param full boolean - If true, a full render is requested.
   */
  public informOfUpdate(full: boolean = false) {
    full && (this.fullRenderRequested = true);
    this.renderRequested = true;
    this.dataKey++;
  }

  public requestFullRender = this.fullRerender;
  public requestRender = this.informOfUpdate;

  /**
   * Hide the cursor to prevent flickering during updates.
   */
  private hideCursor() {
    process.stdout.write("\x1B[?25l");
    this.isCursorHidden = true;
  }

  /**
   * Show the cursor again. Call this when exiting the application.
   */
  public showCursor() {
    if (!this.isCursorHidden) return;

    process.stdout.write("\x1B[?25h");
    this.isCursorHidden = false;
  }

  private patchConsole() {
    return patchConsole((stream: any, data: any) => {
      // Remove trailing newline, it causes problems with the rendering
      if (data.endsWith("\n")) data = data.slice(0, -1);

      const method = this.config.overrideConsole ? "log" : "rawLog";
      const logger = this[method];

      if (stream === "stdout") {
        logger("debug", data);
        this.log("debug", data);
        log.log(data);
      }

      if (stream === "stderr") {
        logger("error", data);
        this.log("error", data);
        log.log(data);
      }
    });
  }

  // =============================
  // NODE-TREE TRAVERSAL METHODS
  // =============------
  get recursiveChildren(): LogStore {
    const children = this.children.flatMap((child) => {
      return child.recursiveChildren; // This can probably be memoized // NOTE: TODO: Memoize this
    });

    return new LogStore(this, children);
  }

  private addChild<T extends Log>(child: T): T {
    this.children.push(child);
    this.informOfUpdate(); // Re-render the tree
    return child;
  }

  public getChildrenOfDepth(depth: number): LogStore {
    const absChildren = this.recursiveChildren.filter((child) => {
      return child.depth === depth;
    });

    return new LogStore(this, absChildren);
  }

  // ===================
  // LIFECYCLE METHODS
  // ======----

  private mount() {
    this.hardClearConsole();
    this.hideCursor();

    this.listenForEvents();
    this.startRenderLoop();
  }

  private unmount(err?: Error) {
    this.showCursor();

    // NOTE: TODO: This doesn't seem to work. The goal is to log the final render so that the
    // final state of the terminal remains for examination.
    this.render("final");
    this.stopRenderLoop();
    this.restore();

    process.stdout.write("\x1B[?1049l");

    if (err) console.error(err);
    process.exit(1);
  }

  private handleResize(): void {
    this.terminalDataKey++;
    this.requestFullRender();
  }

  private listenForEvents() {
    // Error handling
    process.on("uncaughtException", (err) => {
      this.unmount(err);
    });

    // Graceful exit
    process.on("exit", () => {
      this.unmount();
    });

    process.on("SIGINT", () => {
      this.unmount();
    });

    // Resize handling
    process.stdout.on("resize", () => {
      this.handleResize();
    });
  }

  // ======================
  // API FOR LOGGING
  // =====-----
  get logParams(): LogParams {
    return {
      parent: this,
    };
  }

  public createChild<T extends VariantName>(
    options: CreateChildOptions<T>,
    arguments_: any[] | string = ""
  ) {
    const child = createChildLog(this, options, arguments_);
    this.addChild(child);

    return child;
  }

  public rawLog(type: "debug" | "error" = "debug", data: any) {
    const options = createChildOptions("rawLog", {
      parent: this,
      type: type,
    });

    const log = createChildLog(this, options, data);
    return this.addChild(log);
  }

  public clear() {
    this.groupStack = [];
    this.children = [];

    this.informOfUpdate(true);
  }

  private getRootOrGroup(): MogLog | DOM {
    return $R.last(this.groupStack) || this;
  }

  // Important note: Currently this won't do anything for nested logs.
  // This seems paradigmatically correct, but it isn't intuitive.
  public newline(n: number = 1) {
    const lineNo = Math.max(n - 1, 0); // This method is going to print at least one line no matter what is passed.
    this.rawLog("debug", "\n".repeat(lineNo));
  }

  public hr() {
    const hrLog = new HorizontalRule({
      parent: this,
    });

    return this.addChild(hrLog);
  }

  public table(tableDataInput: TableDataInput) {
    const tableLog = new TableLog({ parent: this }, tableDataInput);
    return this.addChild(tableLog);
  }

  public group(label: string = "") {
    const groupLabel = this.log("log", label);
    this.groupStack.push(groupLabel);

    return groupLabel;
  }

  public groupEnd(): void {
    this.groupStack.pop();
    return;
  }

  public $log(level: LogType = "log", message: string = ""): PowerLog {
    const parent = this.getRootOrGroup();

    handleGrouping: {
      if (level === "table") break handleGrouping;
      if (parent instanceof MogLog) {
        return parent[`_$${level}`](message);
      }
    }
    const options = createChildOptions("powerLog", {
      parent: this.getRootOrGroup(),
      type: "log",
    });

    const log = createChildLog(this, options, message);
    return this.addChild(log);
  }

  public log(level: LogType = "log", ...args: any[]) {
    const parent = this.getRootOrGroup();

    handleGrouping: {
      if (level === "table") break handleGrouping;

      if (parent instanceof MogLog) {
        return parent[`_${level}`](...args);
      }
    }

    const options = createChildOptions("mogLog", {
      type: level,
      parent,
    });

    const log = createChildLog(this, options, args);
    return this.addChild(log);
  }

  public _log(level: LogType = "log", ...args: any[]) {
    return this.log(level, ...args);
  }

  public _$log(level: LogType = "log", message: string = "") {
    return this.$log(level, message);
  }
}
