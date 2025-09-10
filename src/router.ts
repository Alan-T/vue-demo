import { createRouter, createWebHistory } from "vue-router";

// 路由配置
const routes = [
  {
    path: "/",
    redirect: "/hello-word", // 只做重定向，不要 component 字段
  },
  {
    path: "/hello-word",
    component: () => import("./views/HelloWorld.vue"),
  },
  {
    path: "/konva-demo",
    component: () => import("./views/konva-demo/index.vue"),
  },
  // 404 路由
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("./views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
