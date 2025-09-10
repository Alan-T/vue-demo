import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";

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
  // hash模式
  history: createWebHashHistory(),
  // history模式
  //history: createWebHistory(),
  routes,
});

export default router;
