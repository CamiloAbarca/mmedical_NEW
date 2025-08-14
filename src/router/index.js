// camiloabarca/mmedical_new/mmedical_NEW-25387d354f645fea5b2688780011d61eba68a948/src/router/index.js
import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import DashboardLayout from "../components/DashboardLayout.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/login", component: Login },
  {
    path: "/",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", redirect: "dashboard" },
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("../views/Dashboard.vue"),
      },
      {
        path: "clientes",
        name: "Clientes",
        component: () => import("../views/Clientes.vue"),
      },
      {
        path: "equipos",
        name: "Equipos",
        component: () => import("../views/Equipos.vue"),
      },
      {
        path: "usuarios",
        name: "Usuarios",
        component: () => import("../views/Usuarios.vue"),
        meta: { requiresAuth: true, requiresSuper: true },
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const isSuperUser = user && user.tipo === "super";

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    next("/login");
  } else if (to.path === "/login" && isAuthenticated) {
    next("/dashboard");
  } else if (
    to.matched.some((record) => record.meta.requiresSuper) &&
    !isSuperUser
  ) {
    next("/dashboard"); // Redirige a dashboard si no es 'super'
  } else {
    next();
  }
});

export default router;
