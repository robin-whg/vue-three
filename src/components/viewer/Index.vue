<script setup lang="ts">
import { useViewer } from "~/composables"

const container = ref<HTMLDivElement>()

const viewer = useViewer()

onMounted(() => {
  if (!container.value) return
  viewer.mount(container.value)
})

try {
  await viewer.loadGLTFFile("url")
} catch (error) {
  console.error(error)
}
</script>

<template>
  <ViewerNavbar></ViewerNavbar>
  <div
    ref="container"
    class="h-screen w-screen cursor-grab active:cursor-grabbing"
  ></div>
</template>
