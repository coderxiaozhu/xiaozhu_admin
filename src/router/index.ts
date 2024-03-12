import * as VueRouter from "vue-router";
import login from "@/views/login/login.vue";
import layout from "@/views/main/layout.vue";

const routes = [
  {
    path: "/",
    component: layout,
    children: [
      {
        path: '/user',
        component: () => import('@/views/main/user/user.vue')
      }
    ]
  },
  {
    path: "/login",
    component: login,
  },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

export default router;
