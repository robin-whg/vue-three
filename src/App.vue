<script setup lang="ts">
import { useHead } from "@vueuse/head"

useHead({
  title: "Vue Three",
  meta: [
    {
      name: "description",
      content: "Drag and Drop 3D Viewer made with ThreeJS and Vue 3 ",
    },
  ],
})
</script>

<template>
  <router-view />
</template>
