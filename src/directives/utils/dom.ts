// directives/utils/dom.ts
/**
 * 获取元素的计算样式
 * @param element 目标元素
 * @param property CSS 属性名
 * @returns 样式值
 */
export function getComputedStyle(
  element: HTMLElement,
  property: string
): string {
  return window.getComputedStyle(element, null).getPropertyValue(property);
}

/**
 * 设置元素样式
 * @param element 目标元素
 * @param styles 样式对象
 */
export function setStyles(
  element: HTMLElement,
  styles: Partial<CSSStyleDeclaration>
): void {
  Object.keys(styles).forEach((property) => {
    const value = styles[property as keyof CSSStyleDeclaration];
    if (value !== undefined) {
      (element.style as any)[property] = value;
    }
  });
}

/**
 * 检查是否支持 ResizeObserver
 * @returns 是否支持
 */
export function isResizeObserverSupported(): boolean {
  return typeof ResizeObserver !== "undefined";
}

/**
 * 获取元素尺寸
 * @param element 目标元素
 * @returns 尺寸对象
 */
export function getElementSize(element: HTMLElement): {
  width: number;
  height: number;
} {
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
  };
}
