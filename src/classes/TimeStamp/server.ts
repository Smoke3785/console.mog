// import { ThothLog } from "../ThothLog/server.tsx";
// import { ChalkInstance } from "chalk";

// import * as u from "@utils";

// type TimeStampParams = {
//   parent?: TimeStamp;
//   name?: string;
//   log: ThothLog;
// };

// export class TimeStamp {
//   private constructTime: number;
//   private endTime?: number;
//   private name: string;

//   // Recursion
//   public checkpoints: Array<TimeStamp> = [];
//   private parent?: TimeStamp;
//   private log: ThothLog;

//   constructor({ name, parent, log }: TimeStampParams) {
//     this.constructTime = Date.now();
//     this.name = name || log?.uid || "TimeStamp";
//     parent && (this.parent = parent);
//     this.log = log;
//   }

//   public checkpoint(): TimeStamp {
//     const newStamp = new TimeStamp({ parent: this, log: this.log });
//     this.checkpoints.push(newStamp);
//     return newStamp;
//   }

//   public end(): TimeStamp {
//     this.endTime = Date.now();
//     return this;
//   }

//   get timeElapsed(): number {
//     const toCompare = (this?.parent || this).constructTime;
//     const end = this.endTime || Date.now();

//     return end - toCompare;
//   }

//   static format(time: number | TimeStamp): string {
//     return u.formatMs(time instanceof TimeStamp ? time.timeElapsed : time);
//   }

//   format(time: number | TimeStamp): string {
//     return TimeStamp.format(time);
//   }

//   get timeElapsedFormatted(): string {
//     return u.formatMs(this.timeElapsed);
//   }

//   static difference(start: TimeStamp, end: TimeStamp): number {
//     return end.constructTime - start.constructTime;
//   }

//   public getCheckpoint(name: string): TimeStamp | undefined {
//     return this.checkpoints.find((checkpoint) => checkpoint.name === name);
//   }

//   public logTime<T extends boolean>(
//     fn: (
//       time: T extends true ? string : number,
//       chalk: ChalkInstance
//     ) => string,
//     format: T = true as T
//   ): ThothLog {
//     const time = format ? u.formatMs(this.timeElapsed) : this.timeElapsed;
//     return this.log.log(fn(time as any, this.log.chalk));
//   }
// }
