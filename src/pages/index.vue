<template>
  <suspense>
    <template #default>
      <Viewer></Viewer>
    </template>
    <template #fallback>
      <p>loading...</p>
    </template>
  </suspense>
</template>
