import { PointerQueue } from "./PointerQueue";
import { Queue } from "./Queue";
import type { Task } from "./types";

/**
 * Frame Pooler
 *
 * A queue that distributes tasks between animation
 * frames. Designed to optimize applications using
 * heavy or concurrent usage of request animation
 * frame
 *
 * ```typescript
 * const Pool = new FramePooler(100);
 *
 * Pool.run((time: number) => {
 *  // run expensive DOM update
 * });
 * ```
 */
export class FramePooler {
  public maxStackSize: number;
  public readonly queue: Queue<Task>;
  private currentFrame: number | null = null;
  constructor(maxStackSize = Infinity) {
    this.maxStackSize = maxStackSize;
    if (maxStackSize === Infinity) {
      this.queue = new Queue<Task>();
    } else {
      this.queue = new PointerQueue<Task>();
    }
  }

  /**
   * Run
   *
   * Executes a task using your Pooler instance
   * Your task will be executed in the next
   * available animation frame
   */
  public run(task: Task) {
    this.queue.push(task);
    this.execute();
  }

  private execute() {
    if (this.currentFrame !== null) {
      return;
    }
    this.currentFrame = requestAnimationFrame(time => {
      const now = performance.now();
      for (let i = 0; i < this.maxStackSize && this.queue.size; i++) {
        const then = performance.now();
        if (then - now >= 16) {
          break;
        }
        void this.queue.shift()?.(time);
      }
      this.onPool();
    });
  }

  private onPool() {
    this.currentFrame = null;
    if (!this.queue.size) {
      return this.queue.clear();
    }
    this.execute();
  }
}
