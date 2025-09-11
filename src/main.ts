import { createApp } from "vue";
import App from "./App.vue";
// 引入全局样式
import "./assets/styles/reset.css";
import VueKonva from "vue-konva";
import router from "./router";
import { setupDirectives } from "./directives";
//SvgIcon
import svgIcon from "./components/SvgIcon/index.vue";
import "virtual:svg-icons-register";

const app = createApp(App);
setupDirectives(app, {
  debug: true, // 开发环境显示注册日志
});
app.use(router);

// 注册全局组件
app.component("SvgIcon", svgIcon);

app.use(VueKonva);
app.mount("#app");
