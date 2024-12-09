// Classes
import { Prefix } from "@classes/core/Prefix/index.ts";

export class MfgStamp extends Prefix {
  constructor() {
    super({
      name: "www.iliad.dev",
      color: "#00ace0",
      value: "◭ ",
    });
  }
}

export const mfgStamp = new MfgStamp();
