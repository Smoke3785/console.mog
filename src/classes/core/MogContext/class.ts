// Types
import type { PipeMiddleware } from "@classes/core/DOM/types.ts";
import type { Writable } from "stream";

// Classes
import { MogContextInput } from "@classes/configuration/Configuration/types.ts";
import { Configuration } from "@classes/configuration/Configuration/index.ts";
import { DOM } from "@classes/core/DOM/class.ts";
import Toolkit from "@classes/Toolkit/class.ts";
import {
  PromiseLog,
  TableLog,
  PowerLog,
  MogLog,
  AddCtx,
} from "@classes/core/Log/index.ts";

// Utils
import chalk from "chalk"; // This will be deprecated once the toolkit is fully implemented

export type MogContextConfigObject = MogContextInput & {};
export class MogContext implements Console {
  public static toolkit = Toolkit.getInstance();
  public toolkit = MogContext.toolkit;

  public prototype: MogContext = this;
  public Console = console.Console;

  public configuration: Configuration;
  private originalConsole: Console;
  private DOM: DOM;

  public static Console = console.Console;

  // Utility re-exports
  public readonly chalk = chalk;

  constructor(
    thothConfigObject: MogContextConfigObject = {},
    originalConsole: Console = console
  ) {
    this.configuration = new Configuration(thothConfigObject, this);
    this.originalConsole = originalConsole;

    // This can be useful when piping to a stream
    if (this.configuration.forceColor) {
      process.env.FORCE_COLOR = "3";
    }

    this.DOM = DOM.singleton(this.configuration);
  }

  // Expose certain private data from the engine.
  public get context() {
    return {};
  }

  public unmount() {
    this.DOM.unmount();
  }

  // NOTE: TODO: This entire system needs to be typed properly
  public withContext(ctx: AddCtx): MogContext {
    this.DOM.withContext(ctx);
    return this;
  }

  public get pipe() {
    return this.DOM.pipe;
  }

  public createPipe(middleware: PipeMiddleware) {
    return this.DOM.createPipe(this, middleware);
  }

  // =================================================
  // Logging + PowerLogging methods for each type
  // ===============-----------

  // .log

  log(...args: any[]): MogLog {
    return this.DOM.log(this, "log", ...args);
  }

  _log(...args: any[]): MogLog {
    return this.DOM._log(this, "log", ...args);
  }

  $log(...args: any[]): PowerLog {
    return this.DOM.$log(this, "log", ...args);
  }

  _$log(...args: any[]): MogLog {
    return this.DOM._$log(this, "log", ...args);
  }

  // .info

  info(...args: any[]): MogLog {
    return this.DOM.log(this, "info", ...args);
  }

  _info(...args: any[]): MogLog {
    return this.DOM._log(this, "info", ...args);
  }

  $info(...args: any[]): PowerLog {
    return this.DOM.$log(this, "info", ...args);
  }

  _$info(...args: any[]): MogLog {
    return this.DOM._$log(this, "info", ...args);
  }

  // .warn

  warn(...args: any[]): MogLog {
    return this.DOM.log(this, "warn", ...args);
  }

  _warn(...args: any[]): MogLog {
    return this.DOM._log(this, "warn", ...args);
  }

  $warn(...args: any[]): PowerLog {
    return this.DOM.$log(this, "warn", ...args);
  }

  _$warn(...args: any[]): MogLog {
    return this.DOM._$log(this, "warn", ...args);
  }

  // .error

  error(...args: any[]): MogLog {
    return this.DOM.log(this, "error", ...args);
  }

  _error(...args: any[]): MogLog {
    return this.DOM._log(this, "error", ...args);
  }

  $error(...args: any[]): PowerLog {
    return this.DOM.$log(this, "error", ...args);
  }

  _$error(...args: any[]): MogLog {
    return this.DOM._$log(this, "error", ...args);
  }

  // .debug

  debug(...args: any[]): MogLog {
    return this.DOM.log(this, "debug", ...args);
  }

  _debug(...args: any[]): MogLog {
    return this.DOM._log(this, "debug", ...args);
  }

  $debug(...args: any[]): PowerLog {
    return this.DOM.$log(this, "debug", ...args);
  }

  _$debug(...args: any[]): MogLog {
    return this.DOM._$log(this, "debug", ...args);
  }

  newline(n: number = 1): MogContext {
    this.DOM.newline(n);
    return this;
  }

  promise<T>(promise: Promise<T>, label?: string): PromiseLog<T> {
    return this.DOM.promise<T>(this, promise, label);
  }

  hr(title?: string, char?: string): MogContext {
    this.DOM.hr(this, title, char);
    return this;
  }

  // =================================================
  // Simple proxy methods I have yet to implement
  // ===============-----------
  clear(): MogContext {
    this.DOM.clear();
    return this;
  }

  assert(condition?: boolean, ...data: any[]): void {
    this.originalConsole.assert(condition, ...data);
  }

  count(label?: string): void {
    this.originalConsole.count(label);
  }

  countReset(label?: string): void {
    this.originalConsole.countReset(label);
  }

  dir(item?: any, options?: any): void {
    this.originalConsole.dir(item, options);
  }

  dirxml(...data: any[]): void {
    this.originalConsole.dirxml(...data);
  }

  // =================================================
  // Groups seem like an uglier version of console._log(). Can I just use that?
  // ===============-----------
  group(label?: string): MogLog {
    return this.DOM.group(this, label);
  }

  groupCollapsed(label?: string): MogLog {
    return this.DOM.group(this, label);
  }

  groupEnd(): MogContext {
    return this;
  }

  // =================================================
  // Table methods
  // ===============-----------

  // arrayTable(
  //   headers: string[],
  //   tabularData: any[],
  //   styles: any = {}
  // ): TableLog {
  //   return this.DOM.table({
  //     headers: headers,
  //     data: tabularData,
  //     styles: styles,
  //     type: "array",
  //   });
  // }

  table(tabularData?: any, styles: any = {}): TableLog {
    return this.DOM.table(this, {
      headers: undefined,
      data: tabularData,
      type: "unknown",
      styles: styles,
    });
  }

  time(label?: string): void {
    this.originalConsole.time(label);
  }

  timeLog(label?: string, ...data: any[]): void {
    this.originalConsole.timeLog(label, ...data);
  }

  timeEnd(label?: string): void {
    this.originalConsole.timeEnd(label);
  }

  trace(...data: any[]): void {
    this.originalConsole.trace(...data);
  }

  profile(reportName?: string): void {
    this.originalConsole.profile(reportName);
  }

  profileEnd(reportName?: string): void {
    this.originalConsole.profileEnd(reportName);
  }

  timeStamp(label?: string): void {
    this.originalConsole.timeStamp(label);
  }
}
