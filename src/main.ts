import { createApp } from "vue";
import App from "./App.vue";
// 引入全局样式
import "./assets/styles/reset.css";
import VueKonva from "vue-konva";
import router from "./router";
import { setupDirectives } from "./directives";

const app = createApp(App);
setupDirectives(app, {
  debug: true, // 开发环境显示注册日志
});
app.use(router);
app.use(VueKonva);
app.mount("#app");
