<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Editor } from '@guolao/vue-monaco-editor'
import { createConsoleProxy } from './proxy'

defineOptions({
  name: 'JSPlayground',
})

const props = defineProps<{
  defaultCode?: string
  editorWidth?: string
  consoleWidth?: string;
}>()

const code = ref(props?.defaultCode ?? '')

onMounted(() => {
  // ssr
  createConsoleProxy()
})
</script>

<template>
  <div class="p-wrapper">
    <div class="p-editor" :style="{ width: props.editorWidth }">
      <Editor v-model:value="code" language="javascript" />
    </div>
    <div class="p-console" :style="{ width: props.consoleWidth }">
      {{ code }}
    </div>
  </div>
</template>

<style>
.p-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
}

.p-editor {
  height: 100%;
  width: 50%;
}

.p-console {
  height: 100%;
  width: 50%;
}
</style>
