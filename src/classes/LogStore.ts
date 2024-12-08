import { Log } from "@classes/Log/index.ts";
import { DOM } from "@classes/DOM/class.ts";

export default class LogStore extends Array<Log> {
  owner: Log | DOM;

  constructor(owner: Log | DOM, values: Log[] = []) {
    super();
    this.owner = owner;
    this.push(...values);
  }

  get afterOwner(): LogStore {
    if (this.owner instanceof DOM) {
      return new LogStore(this.owner, []);
    }
    const index = this.indexOf(this.owner);
    return new LogStore(this.owner, this.slice(index + 1));
  }

  get beforeOwner(): LogStore {
    if (this.owner instanceof DOM) {
      return new LogStore(this.owner, []);
    }
    const index = this.indexOf(this.owner);
    return new LogStore(this.owner, this.slice(0, index));
  }
}
