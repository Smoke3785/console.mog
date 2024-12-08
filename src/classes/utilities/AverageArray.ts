export class QueueArray<T> extends Array<T> {
  private maxLength: number;

  constructor(length: number, ...initialValues: T[]) {
    super();
    this.maxLength = length;
    this.push(...initialValues);
  }

  push(...items: T[]): number {
    // Number of items to push
    const n = Math.min(this.maxLength, items.length);

    // Remove n items from the front of the array
    if (this.length + n > this.maxLength) {
      this.splice(0, this.length + n - this.maxLength);
    }

    return super.push(...items.slice(-n));
  }
}

export class AverageArray extends QueueArray<number> {
  constructor(length: number) {
    super(length, 0);
  }

  average(precision: number = 2): number {
    const value = this.reduce((acc, val) => acc + val, 0) / this.length;
    return Number(value.toFixed(precision));
  }
}

export default AverageArray;
