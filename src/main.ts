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
// 处理从 GitHub Pages 404 重定向
const handleGitHubPagesRedirect = () => {
  const redirectPath = sessionStorage.getItem("redirectPath");
  if (redirectPath) {
    sessionStorage.removeItem("redirectPath");
    router.replace(redirectPath);
  }
};
app.use(VueKonva);
app.mount("#app");

// 在路由准备好后处理重定向
router.isReady().then(() => {
  handleGitHubPagesRedirect();
});
