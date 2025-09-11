/// <reference types="vite/client" />

declare module "virtual:svg-icons-register" {
  const component: any;
  export default component;
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
