<script setup lang="ts">
import { JSPlayground } from '../lib'

const code = 'console.log(123)'
const options = {
  theme: 'vs-dark'
}
</script>

<template>
  <JSPlayground :default-code="code" auto-run first-run :editor-options="options" />
</template>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
</style>
