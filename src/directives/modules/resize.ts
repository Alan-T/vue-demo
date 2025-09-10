// directives/modules/resize.ts
import type { Directive, DirectiveBinding } from "vue";
import type {
  ResizeDirectiveValue,
  ResizeData,
  ResizeCallback,
  ResizeOptions,
  ResizeModifiers,
} from "../types/resize";
import {
  debounce,
  throttle,
  validateDirectiveValue,
  parseModifiers,
  isResizeObserverSupported,
  getElementSize,
} from "../utils";

/**
 * resize 指令实现
 */
const resize: Directive<HTMLElement, ResizeDirectiveValue> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<ResizeDirectiveValue>) {
    setupResizeObserver(el, binding);
  },

  updated(el: HTMLElement, binding: DirectiveBinding<ResizeDirectiveValue>) {
    // 如果回调函数或配置发生变化，重新设置
    if (binding.value !== binding.oldValue) {
      cleanup(el);
      setupResizeObserver(el, binding);
    }
  },

  beforeUnmount(el: HTMLElement) {
    cleanup(el);
  },
};

/**
 * 设置 ResizeObserver
 */
function setupResizeObserver(
  el: HTMLElement,
  binding: DirectiveBinding<ResizeDirectiveValue>
): void {
  const { value, modifiers } = binding;

  // 参数验证
  if (!validateValue(value)) {
    return;
  }

  // 解析配置
  const config = parseConfig(value, modifiers);

  // 检查 ResizeObserver 支持
  if (!isResizeObserverSupported()) {
    console.warn("当前浏览器不支持 ResizeObserver");
    return;
  }

  // 创建 ResizeObserver
  const resizeObserver = new ResizeObserver(
    (entries: ResizeObserverEntry[]) => {
      // 如果设置了 once 且已触发过，则不再执行
      if (config.once && el._resizeDirective?.hasTriggered) {
        return;
      }

      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const data: ResizeData = {
          width,
          height,
          element: el,
          entry,
          timestamp: Date.now(),
        };

        // 直接调用处理后的回调
        const processedCallback = getProcessedCallback(config);
        processedCallback(data);

        // 标记已触发
        if (config.once && el._resizeDirective) {
          el._resizeDirective.hasTriggered = true;
        }
      }
    }
  );

  // 开始观察
  resizeObserver.observe(el);

  // 立即执行（如果需要）
  if (config.immediate) {
    const size = getElementSize(el);
    const data: ResizeData = {
      width: size.width,
      height: size.height,
      element: el,
      immediate: true,
      timestamp: Date.now(),
    };
    config.callback(data);
  }

  // 存储到元素上
  el._resizeDirective = {
    observer: resizeObserver,
    hasTriggered: config.immediate || false,
    cleanup: () => {
      resizeObserver.disconnect();
    },
    // 移除循环引用的 cleanup 函数
  };
}

/**
 * 验证指令值
 */
function validateValue(value: ResizeDirectiveValue): boolean {
  if (typeof value === "function") {
    return true;
  }

  if (typeof value === "object" && value !== null) {
    const options = value as ResizeOptions;
    return validateDirectiveValue(options.callback, "function", true);
  }

  console.warn("v-resize 指令需要函数或配置对象参数");
  return false;
}

/**
 * 解析配置
 */
function parseConfig(
  value: ResizeDirectiveValue,
  modifiers: ResizeModifiers
): ResizeOptions & { once?: boolean } {
  const allowedModifiers = ["immediate", "debounce", "throttle", "once"];
  const parsedModifiers = parseModifiers(
    modifiers as Record<string, boolean>,
    allowedModifiers
  );

  if (typeof value === "function") {
    return {
      callback: value,
      immediate: parsedModifiers.immediate || false,
      debounce: parsedModifiers.debounce ? 300 : 0,
      throttle: parsedModifiers.throttle ? 100 : 0,
      once: parsedModifiers.once || false,
    };
  }

  const options = value as ResizeOptions;
  return {
    callback: options.callback,
    immediate: parsedModifiers.immediate || options.immediate || false,
    debounce: options.debounce || (parsedModifiers.debounce ? 300 : 0),
    throttle: options.throttle || (parsedModifiers.throttle ? 100 : 0),
    once: parsedModifiers.once || false,
  };
}

/**
 * 获取处理后的回调函数（添加防抖或节流）
 */
function getProcessedCallback(
  config: ResizeOptions & { once?: boolean }
): ResizeCallback {
  const { callback, debounce: debounceTime, throttle: throttleTime } = config;

  if (debounceTime && debounceTime > 0) {
    return debounce(callback, debounceTime);
  }

  if (throttleTime && throttleTime > 0) {
    return throttle(callback, throttleTime);
  }

  return callback;
}

/**
 * 清理资源
 */
function cleanup(el: HTMLElement): void {
  if (el._resizeDirective) {
    // 断开观察器
    el._resizeDirective.observer.disconnect();

    // 删除存储的指令数据
    delete el._resizeDirective;
  }
}

export default resize;
