const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/:title",
        name: "localization",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "/capteur/:title",
        name: "capteur",
        component: () => import("pages/Capteur.vue"),
      },
      {
        path: "/statistique/:title/:id/:key",
        name: "statistique",
        component: () => import("pages/statistique.vue"),
      },
      {
        path: "/Maintenance/:title",
        name: "maintenance",
        component: () => import("pages/Maintenance.vue"),
      },
      {
        path: "/utilisateurs/:title",
        name: "user",
        component: () => import("pages/User.vue"),
      },
      {
        path: "/rapport/:title",
        name: "rapport",
        component: () => import("pages/Rapport.vue"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("layouts/LoginLayout.vue"),
    children: [
      { path: "", name: "login", component: () => import("pages/Login.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("layouts/MainLayout.vue"),
  },
];

export default routes;
