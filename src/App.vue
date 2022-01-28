<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { useHead } from "@vueuse/head"

useHead({
  title: "Vute Template",
  meta: [{ name: "description", content: "Template for Vue Projects" }],
})
</script>

<template>
  <router-view />
</template>
