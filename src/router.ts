import { createRouter, createWebHistory } from "vue-router";

// 路由配置
const routes = [
  {
    path: "/",
    component: () => import("./App.vue"),
  },
  {
    path: "/hello-word",
    component: () => import("./views/HelloWorld.vue"),
  },
  // 404 路由
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("./components/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
