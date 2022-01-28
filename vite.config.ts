import path from "path"
import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import Pages from "vite-plugin-pages"
import Layouts from "vite-plugin-vue-layouts"
import IconsResolver from "unplugin-icons/resolver"
import Components from "unplugin-vue-components/vite"
import { HeadlessUiResolver } from "unplugin-vue-components/resolvers"
import Icons from "unplugin-icons/vite"
import AutoImport from "unplugin-auto-import/vite"

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
      "@/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  plugins: [
    Vue(),
    Pages(),
    Layouts(),
    Components({
      deep: true,
      directoryAsNamespace: true,
      resolvers: [IconsResolver(), HeadlessUiResolver({})],
    }),
    Icons(),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
      imports: ["vue", "vue-router"],
      dts: "src/auto-imports.d.ts",
      eslintrc: {
        enabled: false, // Default `false`
        filepath: "./.eslintrc-auto-import.json", // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
    }),
  ],
})
