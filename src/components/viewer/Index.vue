<script setup lang="ts">
import { useViewer } from "~/composables"

const canvas = ref<HTMLCanvasElement>()

onMounted(() => {
  if (canvas.value === undefined) return
  init(canvas.value)
})

function init(canvas: HTMLCanvasElement) {
  useViewer(canvas)
}
</script>

<template>
  <canvas ref="canvas" class="h-screen w-screen bg-red-300"></canvas>
</template>
