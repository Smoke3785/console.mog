// Types
import type {
  LogVariantRegistry,
  CreateChildOptions,
  VariantName,
  LogParams,
  LogType,
} from "./types.ts";

// Classes
import { LogData } from "@classes/LogData/class.ts";
import { DOM } from "@classes/DOM/class.ts";
import LogStore from "@classes/LogStore.ts";

// Utils
import { createChildLog, createChildOptions } from "./utils.ts";
import * as $R from "remeda";
import { uid } from "uid";
import util from "util";

// Data
import { LINES } from "./data.ts";

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

  constructor(options: LogParams, arguments_: any[], arbitraryIndex?: number) {
    this.parent = options.parent;
    this.arguments_ = arguments_;
    this.root = this.parent.root;
    this.depth = this.parent.depth + 1;

    this.message = util.format(...arguments_);
    options.type && (this.type = options.type);
    this.uid = `${this.constructor.name}-${uid()}`;

    this.logData = new LogData(this.root, this, {
      namespace: this.root.config.namespace,
      module: this.root.config.module,
      timestamp: `${this.timestamp}`,
      treePrefix: this.treePrefix,
      data: this.message,
      type: this.type,
      raw: this.raw,
    });
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
      namespace: this.root.config.namespace,
      module: this.root.config.module,
      timestamp: `${this.timestamp}`,
      treePrefix: this.treePrefix,
      data: this.message,
      type: this.type,
      raw: this.raw,
    });
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
    arguments_: any[] | string = "",
  ): LogVariantRegistry[T] {
    if (this.parent instanceof DOM) {
      return this.parent.createChild(
        options,
        arguments_,
      ) as LogVariantRegistry[T];
    }
    return this.parent.createChild(options, arguments_);
  }

  // CHANGED: After adding a child, set the child's childIndex.
  protected addChild(child: Log) {
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
    arguments_: any[] | string = "",
  ): LogVariantRegistry[T] {
    const child = createChildLog(this, options, arguments_);
    this.addChild(child);
    return child;
  }

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
}

export class MogLog extends Log {
  constructor(options: LogParams, arguments_: any[], arbitraryIndex?: number) {
    super(options, arguments_, arbitraryIndex);
  }
}

export class RawLog extends MogLog {
  parent: DOM;

  constructor(options: LogParams, arguments_: any[], arbitraryIndex?: number) {
    super(options, arguments_, arbitraryIndex);
    this.parent = options.parent.root;
  }

  get raw(): boolean {
    return true;
  }

  get treePrefix(): string {
    return "";
  }
}

export class PowerLog extends MogLog {
  constructor(options: LogParams, arguments_: any[], arbitraryIndex?: number) {
    super(options, arguments_, arbitraryIndex);
  }

  advanceFrame() {
    // no-op here
  }
}
