// Types
import type { TableDataInput } from "@classes/core/LogData/types.ts";
import type {
  LogVariantRegistry,
  CreateChildOptions,
  VariantName,
  LogParams,
  LogType,
  AddCtx,
} from "./types.ts";

// Classes
import { SpinnerManager } from "@classes/core/SpinnerManager/index.ts";
import { LogData } from "@classes/core/LogData/class.ts";
import LogStore from "@classes/utilities/LogStore.ts";
import { DOM } from "@classes/core/DOM/class.ts";

// Utils
import * as $R from "remeda";
import { uid } from "uid";
import util from "util";
import {
  createChildOptions,
  centerTitleInHr,
  createChildLog,
} from "./utils.ts";

// Data
import { LINES } from "./data.ts";
import chalk from "chalk";

// FEATURE ADDITION:
// https://www.npmjs.com/package/terminal-link

export class Log {
  // ADDED: Track the child's position under its parent
  public childIndex: number = 0; // will be set by parent when added

  // Render starts as requested because it must be rendered at least once.
  // Maybe this should be set at the end of the instantiation process?
  renderRequested: boolean = true;

  children: LogStore = new LogStore(this);
  public readonly uid: string;
  readonly parent: Log | DOM;
  depth: number;
  root: DOM;

  timestamp: number = Date.now();
  type: LogType = "log";
  message: string = "";
  arguments_: any[];

  logData: LogData;

  // User-provided context data
  public additionalContext: AddCtx = {};

  constructor(options: LogParams, arguments_: any[] | any) {
    this.parent = options.parent;
    this.arguments_ = arguments_;
    this.root = this.parent.root;
    this.depth = this.parent.depth + 1;

    // If anything causes a problem, it will be this!
    this.message = util.format(...arguments_);
    options.type && (this.type = options.type);
    this.uid = `${this.constructor.name}-${uid()}`;

    this.logData = this.revalidateData();
    this.additionalContext = this.parent.tempContextForChild;
  }

  protected get siblings(): LogStore {
    const siblings = this.parent?.children.filter((child) => child !== this);
    return new LogStore(this, siblings);
  }

  protected get absoluteSiblings(): LogStore {
    return this.root.getChildrenOfDepth(this.depth);
  }

  protected getSiblingsBefore(): LogStore {
    return this.siblings.beforeOwner;
  }

  protected getSiblingsAfter(): LogStore {
    return this.siblings.afterOwner;
  }

  protected revalidateData() {
    this.logData = new LogData(this.root, this, {
      treePrefix: this.treePrefix,
      data: this.message,
      type: this.type,
      raw: this.raw,
    });

    return this.logData;
  }

  // CHANGED: Use childIndex to determine if this is the last child.
  protected get isLastChild(): boolean {
    if (this.parent instanceof DOM) return false;
    return $R.last(this.parent.children) === this;
  }

  get recursiveChildren(): LogStore {
    const children = this.children.flatMap((child) => {
      return [child, ...child.recursiveChildren];
    });

    return new LogStore(this, children);
  }

  public toString(): string {
    return this.data.toString();
  }

  getTreePrefix(): string {
    if (this.parent instanceof DOM) return "";
    const chunks: string[] = [];

    chunks.push(this.isLastChild ? LINES.LAST_CHILD : LINES.CHILD);

    let current = this.parent;
    while (current && !(current.parent instanceof DOM)) {
      chunks.unshift(current.isLastChild ? LINES.EMPTY : LINES.DIRECTORY);
      current = current.parent;
    }

    return " " + chunks.join("");
  }

  get treePrefix(): string {
    return this.getTreePrefix();
  }

  get raw(): boolean {
    return false;
  }

  get data(): LogData {
    return this.logData;
  }

  protected getDataRecursively(): LogData[] {
    const dataArray: LogData[] = [];

    dataArray.push(this.data);

    if (this.hasChildren) {
      this.children.forEach((child, index) => {
        dataArray.push(...child.getDataRecursively());
      });
    }

    return dataArray;
  }

  get hasChildren(): boolean {
    return this.children.length > 0;
  }

  protected createSibling<T extends VariantName>(
    options: CreateChildOptions<T>,
    arguments_: any[] | string = ""
  ): LogVariantRegistry[T] {
    if (this.parent instanceof DOM) {
      return this.parent
        .withContext(this.tempContextForChild)
        .createChild(options, arguments_) as LogVariantRegistry[T];
    }

    return this.parent
      .withContext(this.tempContextForChild)
      .createChild(options, arguments_);
  }

  // CHANGED: After adding a child, set the child's childIndex.
  addChild(child: Log) {
    this.children.push(child);
    this.informOfUpdate();
    return child;
  }

  informOfRerender() {
    this.renderRequested = false;
    // This doesn't need to be passed to children,
    // as they will be updated by the DOM's render method.
  }

  public update(...args: any[]) {
    this.arguments_ = args;
    this.message = util.format(...args);

    this.informOfUpdate();
  }

  // Need an API for updating the message
  // public updateType(type: LogType) {}
  // public logAgain(): void {} // Re-render the log, but as a new log. This will require a call to root.
  // public $promise() {} // Attach a promise to the log, and update the log when the promise resolves / rejects.

  informOfUpdate() {
    this.revalidateData();

    this.renderRequested = true;
    this.children.forEach((child, index) => {
      child.childIndex = index;
      child.informOfUpdate();
    });

    this.root.informOfUpdate();
  }

  protected createChild<T extends VariantName>(
    options: CreateChildOptions<T>,
    arguments_: any[] | string = ""
  ): LogVariantRegistry[T] {
    const child = createChildLog(this, options, arguments_);
    this.addChild(child);
    return child;
  }

  // =================================================
  // Logging + PowerLogging methods for each type
  // ===============-----------

  // .log
  public log(...args: any[]): MogLog {
    const options = createChildOptions("mogLog", {
      parent: this,
      type: "log",
    });

    return this.createSibling(options, args);
  }

  public _log(...args: any[]): MogLog {
    const options = createChildOptions("mogLog", {
      parent: this,
      type: "log",
    });

    return this.createChild(options, args);
  }

  public $log(message: string): PowerLog {
    const options = createChildOptions("powerLog", {
      parent: this,
      type: "log",
    });

    return this.createSibling(options, message);
  }

  public _$log(message: string): PowerLog {
    const options = createChildOptions("powerLog", {
      parent: this,
      type: "log",
    });

    return this.createChild(options, message);
  }

  private _tempContextForChild: AddCtx = {};
  get tempContextForChild(): AddCtx {
    const ctx = { ...this._tempContextForChild };
    this._tempContextForChild = {};
    return ctx;
  }

  public withContext(ctx: AddCtx): MogLog {
    this._tempContextForChild = ctx;

    return this;
  }

  // .info
  public info(...args: any[]): MogLog {
    const options = createChildOptions("mogLog", {
      parent: this,
      type: "info",
    });

    return this.createSibling(options, args);
  }

  public _info(...args: any[]): MogLog {
    const options = createChildOptions("mogLog", {
      parent: this,
      type: "info",
    });

    return this.createChild(options, args);
  }

  public $info(message: string): PowerLog {
    const options = createChildOptions("powerLog", {
      parent: this,
      type: "info",
    });

    return this.createSibling(options, message);
  }

  public _$info(message: string): PowerLog {
    const options = createChildOptions("powerLog", {
      parent: this,
      type: "info",
    });

    return this.createChild(options, message);
  }

  // .warn
  public warn(...args: any[]): MogLog {
    const options = createChildOptions("mogLog", {
      parent: this,
      type: "warn",
    });

    return this.createSibling(options, args);
  }

  public _warn(...args: any[]): MogLog {
    const options = createChildOptions("mogLog", {
      parent: this,
      type: "warn",
    });

    return this.createChild(options, args);
  }

  public $warn(message: string): PowerLog {
    const options = createChildOptions("powerLog", {
      parent: this,
      type: "warn",
    });

    return this.createSibling(options, message);
  }

  public _$warn(message: string): PowerLog {
    const options = createChildOptions("powerLog", {
      parent: this,
      type: "warn",
    });

    return this.createChild(options, message);
  }

  // .error
  public error(...args: any[]): MogLog {
    const options = createChildOptions("mogLog", {
      parent: this,
      type: "error",
    });

    return this.createSibling(options, args);
  }

  public _error(...args: any[]): MogLog {
    const options = createChildOptions("mogLog", {
      parent: this,
      type: "error",
    });

    return this.createChild(options, args);
  }

  public $error(message: string): PowerLog {
    const options = createChildOptions("powerLog", {
      parent: this,
      type: "error",
    });

    return this.createSibling(options, message);
  }

  public _$error(message: string): PowerLog {
    const options = createChildOptions("powerLog", {
      parent: this,
      type: "error",
    });

    return this.createChild(options, message);
  }

  // .debug
  public debug(...args: any[]): MogLog {
    const options = createChildOptions("mogLog", {
      parent: this,
      type: "debug",
    });

    return this.createSibling(options, args);
  }

  public _debug(...args: any[]): MogLog {
    const options = createChildOptions("mogLog", {
      parent: this,
      type: "debug",
    });

    return this.createChild(options, args);
  }

  public $debug(message: string): PowerLog {
    const options = createChildOptions("powerLog", {
      parent: this,
      type: "debug",
    });

    return this.createSibling(options, message);
  }

  public _$debug(message: string): PowerLog {
    const options = createChildOptions("powerLog", {
      parent: this,
      type: "debug",
    });

    return this.createChild(options, message);
  }

  // Not sure if this should be a _promise;
  public promise<T>(promise: Promise<T>, label?: string): PromiseLog<T> {
    const promiseLog = new PromiseLog<T>(promise, { parent: this }, label);
    this.addChild(promiseLog);
    return promiseLog;
  }

  // Important note: Currently this won't do anything for nested logs.
  // This seems paradigmatically correct, but it isn't intuitive.
  public newline(n: number = 1): Log {
    this.root.newline(n);
    return this;
  }

  public hr(title?: string, char?: string) {
    this.root.hr(title, char);
    return this;
  }
}

export class MogLog extends Log {
  constructor(options: LogParams, arguments_: any[] | any) {
    super(options, arguments_);
  }
}

export class RawLog extends MogLog {
  parent: DOM;

  constructor(options: LogParams, arguments_: any[] | any) {
    super(options, arguments_);
    this.parent = options.parent.root;
  }

  get raw(): boolean {
    return true;
  }

  get treePrefix(): string {
    return "";
  }
}

type HorizontalRuleOptions = LogParams & {
  character?: string;
  title?: string;
};

export class HorizontalRule extends RawLog {
  private character: string;
  private title?: string;

  constructor({ title, character = "-", ...options }: HorizontalRuleOptions) {
    super(options, centerTitleInHr(character, title));

    this.character = character;
    this.title = title;

    this.revalidateData();
    this.listenForResize();
  }

  private listenForResize() {
    // This needs to defer render, currently it's lagging behind and causing a double render.
    process.stdout.on("resize", () => {
      this.revalidateData();
      this.informOfUpdate();
    });
  }

  private get hrString(): string {
    return centerTitleInHr(this.character, this.title);
  }

  protected revalidateData(): LogData {
    this.logData = new LogData(this.root, this, {
      treePrefix: this.treePrefix,
      data: this.hrString,
      type: this.type,
      raw: this.raw,
    });

    return this.logData;
  }
}

const frames: string[] = ["⣯", "⣟", "⡿", "⢿", "⣻", "⣽", "⣾", "⣷"];
export class PowerLog extends Log {
  readonly interval = 100; // Spinner update interval

  private _resolved: boolean = false;
  private frameIndex: number = 1;
  private _message: string;

  protected readonly animSpace = "";

  constructor(options: LogParams, message: string) {
    super(options, message);
    this._message = message;

    // Register this spinner with a central manager
    SpinnerManager.register(this);

    options.additionalContext &&
      (this.additionalContext = options.additionalContext);
  }

  protected revalidateData(): LogData {
    const dataWithFrame = this.resolved
      ? this._message
      : `${this.getCurrentFrame()}${this.animSpace}${this._message}`;
    this.logData = new LogData(this.root, this, {
      data: dataWithFrame, // Prepend the spinner's frame
      treePrefix: this.treePrefix,
      type: this.type,
      raw: this.raw,
    });

    return this.logData;
  }

  private get config() {
    return this.root.config.spinnerOptions;
  }

  private getCurrentFrame(): string {
    const colorFn = this.config.defaultSpinnerColor;
    const index = this.frameIndex % frames.length;
    return `${colorFn(frames[index])} `;
  }

  get resolved() {
    return this._resolved;
  }

  set resolved(value: boolean) {
    this._resolved = value;
    if (value) this.informOfUpdate();
  }

  private nextFrame() {
    this.frameIndex++;
    this.revalidateData();
    this.informOfUpdate();
  }

  public update(message: string): PowerLog {
    this._message = message;

    this.revalidateData();
    this.informOfUpdate();
    return this;
  }

  public succeed(message?: string): PowerLog {
    return this.update(
      `${chalk.green(`✔${this.animSpace}`)} ${message || this._message}`
    );
  }

  public fail(message?: string): PowerLog {
    return this.update(
      `${chalk.red(`✖${this.animSpace}`)} ${message || this._message}`
    );
  }

  public resolve(message?: string) {
    this.resolved = true; // Mark as resolved
    if (message) {
      this._message = message; // Optionally update the message
    }

    SpinnerManager.remove(this);
    this.revalidateData();
    this.informOfUpdate();
  }

  // Update frame index for rendering
  public advanceFrame() {
    // utils.log("Advancing frame", this.getCurrentFrame(), this.resolved);
    if (!this.resolved) {
      this.nextFrame();
    }
  }
}

export class PromiseLog<T = any> extends PowerLog {
  protected thenCallback?: (log: PromiseLog, value: T) => void;
  protected catchCallback?: (log: PromiseLog, error: any) => void;
  protected finallyCallback?: (log: PromiseLog, ...args: any[]) => void;

  protected hookedPromise: Promise<T>;

  constructor(promise: Promise<T>, options: LogParams, message?: string) {
    super(options, message || "Awaiting promise...");

    this.hookedPromise = this.hookPromise(promise);
  }

  public then(callback: (log: PromiseLog, value: T) => void): PromiseLog<T> {
    this.thenCallback = callback;
    return this;
  }

  public catch(callback: (log: PromiseLog, error: any) => void): PromiseLog<T> {
    this.catchCallback = callback;
    return this;
  }

  public report(prefix: string = ""): PromiseLog<T> {
    // By default, add a space after the prefix.
    if (prefix && !prefix.endsWith(" ")) prefix += " ";

    this.thenCallback = (log, value) => {
      log.succeed(`${prefix}${value}`);
    };

    this.catchCallback = (log, error) => {
      log.fail(`${prefix}${error}`);
    };

    this.hookPromise(this.hookedPromise);

    return this;
  }

  public finally(
    callback: (log: PromiseLog, ...args: any[]) => void
  ): PromiseLog<T> {
    this.finallyCallback = callback;
    return this;
  }

  private hookPromise(promise: Promise<T>): Promise<T> {
    promise
      .then((value: T) => {
        if (this.thenCallback) this.thenCallback(this, value);
        return value;
      })
      .catch((error) => {
        if (this.catchCallback) this.catchCallback(this, error);
        return undefined;
      })
      .finally(() => {
        if (this.finallyCallback) this.finallyCallback(this);
        this.resolve();
      });

    return promise;
  }
}

export class TableLog extends MogLog {
  tableData: TableDataInput;
  constructor(options: LogParams, tableData: TableDataInput) {
    super(options, "");

    this.tableData = tableData;
    this.revalidateData();
  }

  protected revalidateData(): LogData {
    this.logData = new LogData(this.root, this, {
      treePrefix: this.treePrefix,
      data: this.message,
      raw: this.raw,
      type: "table",
    });

    return this.logData;
  }
}
