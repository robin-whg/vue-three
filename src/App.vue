<script setup lang="ts">
import { useHead } from "@vueuse/head"
import { useDark } from "@vueuse/core"

useHead({
  title: "Vue Three",
  meta: [
    {
      name: "description",
      content: "Drag and Drop 3D Viewer made with ThreeJS and Vue 3",
    },
  ],
})

useDark()
</script>

<template>
  <router-view />
</template>
