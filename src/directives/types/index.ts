// directives/types/index.ts
export * from "./resize";

// 指令注册相关类型
export interface DirectiveModule<T = any> {
  name: string;
  directive: import("vue").Directive<HTMLElement, T>;
}

export interface SetupDirectivesOptions {
  /** 包含的指令列表，空数组表示包含所有 */
  include?: string[];
  /** 排除的指令列表 */
  exclude?: string[];
  /** 是否开启调试模式 */
  debug?: boolean;
}
