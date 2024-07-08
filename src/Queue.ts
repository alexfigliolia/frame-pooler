export class Queue<T> extends Array<T> {
  public clear() {
    this.length = 0;
  }

  public get size() {
    return this.length;
  }
}
