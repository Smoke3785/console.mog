// import { ThothLogClient } from "../ThothLog/client.ts";
// import { ChalkInstance } from "chalk";

// import * as u from "@utils";

// type TimeStampClientParams = {
//   parent?: TimeStampClient;
//   log: ThothLogClient;
//   name?: string;
// };

// export class TimeStampClient {
//   private constructTime: number;
//   private endTime?: number;
//   private name: string;

//   // Recursion
//   public checkpoints: Array<TimeStampClient> = [];
//   private parent?: TimeStampClient;
//   private log: ThothLogClient;

//   constructor({ name, parent, log }: TimeStampClientParams) {
//     this.constructTime = Date.now();
//     this.name = name || log?.uid || "TimeStamp";
//     parent && (this.parent = parent);
//     this.log = log;
//   }

//   public checkpoint(): TimeStampClient {
//     const newStamp = new TimeStampClient({ parent: this, log: this.log });
//     this.checkpoints.push(newStamp);
//     return newStamp;
//   }

//   public end(): TimeStampClient {
//     this.endTime = Date.now();
//     return this;
//   }

//   get timeElapsed(): number {
//     const toCompare = (this?.parent || this).constructTime;
//     const end = this.endTime || Date.now();

//     return end - toCompare;
//   }

//   static format(time: number | TimeStampClient): string {
//     return u.formatMs(
//       time instanceof TimeStampClient ? time.timeElapsed : time
//     );
//   }

//   format(time: number | TimeStampClient): string {
//     return TimeStampClient.format(time);
//   }

//   get timeElapsedFormatted(): string {
//     return u.formatMs(this.timeElapsed);
//   }

//   static difference(start: TimeStampClient, end: TimeStampClient): number {
//     return end.constructTime - start.constructTime;
//   }

//   public getCheckpoint(name: string): TimeStampClient | undefined {
//     return this.checkpoints.find((checkpoint) => checkpoint.name === name);
//   }

//   public logTime<T extends boolean>(
//     fn: (
//       time: T extends true ? string : number,
//       chalk: ChalkInstance
//     ) => string,
//     format: T = true as T
//   ): ThothLogClient {
//     const time = format ? u.formatMs(this.timeElapsed) : this.timeElapsed;
//     return this.log.log(fn(time as any, this.log.chalk));
//   }
// }
