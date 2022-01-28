import { createRouter as _createRouter, createWebHistory } from "vue-router"
import { setupLayouts } from "virtual:generated-layouts"
import generatedRoutes from "virtual:generated-pages"

const routes = setupLayouts(generatedRoutes)

export const createRouter = () => {
  return _createRouter({
    history: createWebHistory(),
    routes,
  })
}
