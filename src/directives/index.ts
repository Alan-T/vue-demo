// directives/index.ts
import type { App } from "vue";
import type { SetupDirectivesOptions } from "./types/index";
import resize from "./modules/resize";

// 指令映射
const directiveModules: Record<string, any> = {
  resize,
};

/**
 * 注册所有指令
 * @param app Vue 应用实例
 * @param options 配置选项
 */
export function setupDirectives(
  app: App,
  options: SetupDirectivesOptions = {}
): void {
  const {
    include = [],
    exclude = [],
    debug = process.env.NODE_ENV === "development",
  } = options;

  Object.keys(directiveModules).forEach((name) => {
    // 包含列表检查
    if (include.length > 0 && !include.includes(name)) {
      return;
    }

    // 排除列表检查
    if (exclude.includes(name)) {
      return;
    }

    const directive = directiveModules[name];
    app.directive(name, directive);

    if (debug) {
      console.log(`✅ 指令 v-${name} 注册成功`);
    }
  });
}

// 默认导出
export default {
  install: setupDirectives,
};
