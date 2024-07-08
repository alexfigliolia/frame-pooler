export class PointerQueue<T> extends Array<T> {
  private pointer = 0;

  public override shift() {
    if (this.size === 0) {
      return;
    }
    return this[this.pointer++];
  }

  public clear() {
    this.length = 0;
    this.pointer = -1;
  }

  public get size() {
    return this.length - this.pointer;
  }
}
