// directives/types/resize.ts
export interface ResizeData {
  /** 元素宽度 */
  width: number;
  /** 元素高度 */
  height: number;
  /** 目标元素 */
  element: HTMLElement;
  /** ResizeObserver 条目 */
  entry?: ResizeObserverEntry;
  /** 是否为立即执行 */
  immediate?: boolean;
  /** 时间戳 */
  timestamp?: number;
}

export type ResizeCallback = (data: ResizeData) => void;

export interface ResizeOptions {
  /** 回调函数 */
  callback: ResizeCallback;
  /** 是否立即执行 */
  immediate?: boolean;
  /** 防抖延迟时间 */
  debounce?: number;
  /** 节流延迟时间 */
  throttle?: number;
}

export type ResizeDirectiveValue = ResizeCallback | ResizeOptions;

export interface ResizeModifiers {
  /** 立即执行修饰符 */
  immediate?: boolean;
  /** 防抖修饰符 */
  debounce?: boolean;
  /** 节流修饰符 */
  throttle?: boolean;
  /** 只执行一次修饰符 */
  once?: boolean;
}

// 扩展 HTMLElement 类型，支持自定义属性
declare global {
  interface HTMLElement {
    _resizeDirective?: {
      observer: ResizeObserver;
      cleanup: () => void;
      hasTriggered?: boolean;
      debounceTimer?: number;
      lastTime?: number;
    };
  }
}
