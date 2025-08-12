import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import DashboardLayout from "../components/DashboardLayout.vue"; // Importa el nuevo layout

Vue.use(VueRouter);

const routes = [
  // Ruta para el login, no tiene layout
  { path: "/login", component: Login },

  // Agrupa todas las rutas protegidas bajo un solo layout
  {
    path: "/", // Esta ruta base ahora carga el DashboardLayout
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", redirect: "dashboard" }, // Redirige la ruta base a dashboard si está autenticado
      {
        path: "dashboard", // Nota: sin el '/' inicial
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
      // NUEVA RUTA PARA USUARIOS
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
  base: "/control/",
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
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
