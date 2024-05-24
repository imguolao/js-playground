<script lang="ts" setup>
import { onMounted, ref, watch, type WatchStopHandle } from 'vue'
import { Editor, EditorProps } from '@guolao/vue-monaco-editor'
import VConsole from './Console.vue'
import { isUndefined, debounce, execCode } from './utils'

defineOptions({
  name: 'JSPlayground',
})

const props = defineProps<{
  defaultCode?: string
  editorWidth?: string
  editorOptions?: EditorProps
  consoleWidth?: string
  autoRun?: boolean
  debounceTime?: number
  firstRun?: boolean
}>()

const code = ref<string>(props?.defaultCode ?? '')
const logs = ref<string[]>([])
const updateLogs = (code: string) => (logs.value = execCode(code))
const clearLogs = () => (logs.value = [])

useAutoRunCode()
onMounted(() => {
  if (props.firstRun) {
    updateLogs(props.defaultCode ?? '')
  }
})

function useAutoRunCode() {
  const time = isUndefined(props.debounceTime) ? 300 : Math.max(0, props.debounceTime)
  const debounceRunCode = debounce(() => {
    console.log(code.value)
    updateLogs(code.value)
  }, time)

  let stop: WatchStopHandle | undefined
  watch(() => props.autoRun, () => {
    console.log(1)
    stop?.()
    if (props.autoRun) {
      stop = watch(code, debounceRunCode)
    }
  }, { immediate: true })
}
</script>

<template>
  <div class="p-wrapper">
    <div class="p-editor" :style="{ width: props.editorWidth }">
      <Editor
        v-model:value="code"
        v-bind="props.editorOptions"
        language="javascript"
      />
    </div>
    <div class="p-console" :style="{ width: props.consoleWidth }">
      <div>
        <button @click="() => updateLogs(code)">run</button>
        <button @click="clearLogs">clear</button>
      </div>
      <VConsole :logs="logs" />
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
