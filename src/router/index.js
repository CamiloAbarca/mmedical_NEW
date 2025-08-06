import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Clientes from "../views/Clientes.vue";
import Equipos from "../views/Equipos.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/clientes",
    component: Clientes,
    meta: { requiresAuth: true },
  },
  {
    path: "/equipos",
    component: Equipos,
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

// ✅ Protección real usando token JWT
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    // No autenticado y quiere entrar a ruta protegida
    next("/");
  } else {
    next(); // continúa normalmente
  }
});

export default router;
