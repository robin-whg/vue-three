<script setup lang="ts">
import { useViewer } from "~/composables"

const canvas = ref<HTMLCanvasElement>()

onMounted(async () => {
  if (canvas.value === undefined) return
  await init(canvas.value)
})

async function init(canvas: HTMLCanvasElement) {
  useViewer(canvas)
  // await viewer?.loadHdrLighting(
  //   "https://firebasestorage.googleapis.com/v0/b/gs-waermesysteme.appspot.com/o/hdrs%2Fadams_place_bridge_1k.hdr?alt=media&token=6a191c00-e0eb-452c-a6e4-2aacab14fefc"
  // )
}
</script>

<template>
  <canvas ref="canvas" class="h-screen w-screen"></canvas>
</template>
