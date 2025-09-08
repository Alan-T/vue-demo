// directives/utils/index.ts
export * from "./event";
export * from "./dom";

/**
 * 参数验证工具
 * @param value 要验证的值
 * @param type 期望的类型
 * @param required 是否必需
 * @returns 验证结果
 */
export function validateDirectiveValue(
  value: any,
  type: string,
  required = false
): boolean {
  if (required && (value === undefined || value === null)) {
    console.warn(`指令参数是必需的`);
    return false;
  }

  if (value !== undefined && value !== null) {
    const actualType = typeof value;
    if (actualType !== type && type !== "any") {
      console.warn(`指令参数类型错误，期望 ${type}，实际 ${actualType}`);
      return false;
    }
  }

  return true;
}

/**
 * 解析指令修饰符
 * @param modifiers 修饰符对象
 * @param allowedModifiers 允许的修饰符列表
 * @returns 解析后的修饰符对象
 */
export function parseModifiers(
  modifiers: Record<string, boolean>,
  allowedModifiers: string[] = []
): Record<string, boolean> {
  const result: Record<string, boolean> = {};

  Object.keys(modifiers).forEach((modifier) => {
    if (allowedModifiers.length === 0 || allowedModifiers.includes(modifier)) {
      result[modifier] = true;
    } else {
      console.warn(`不支持的修饰符: ${modifier}`);
    }
  });

  return result;
}
