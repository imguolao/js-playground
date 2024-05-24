<script lang="ts" setup>
defineOptions({
  name: 'VConsole',
})

const props = defineProps<{
  logs: string[]
}>()
</script>

<template>
  <div class="vc-wrapper">
    <ol>
      <li v-for="log in props.logs" :key="log">&gt;&nbsp;{{ log }}</li>
    </ol>
  </div>
</template>

<style>
.vc-wrapper {
  height: 100%;
  width: 100%;
}

.vc-wrapper ol {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
</style>
