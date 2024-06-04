<script lang="ts" setup>
import { onMounted, ref, watch, type WatchStopHandle } from 'vue'
import { Editor, EditorProps } from '@guolao/vue-monaco-editor'
import VConsole from './Console.vue'
import { type LogMessage, isUndefined, debounce, execCode } from './utils'

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
const logs = ref<LogMessage[]>([])
const clearLogs = () => (logs.value = [])
const updateLogs = (code: string) => {
  clearLogs()
  execCode(code, log => logs.value.push(log))
}

useAutoRunCode()
onMounted(() => {
  if (props.firstRun) {
    updateLogs(props.defaultCode ?? '')
  }
})

function useAutoRunCode() {
  const time = isUndefined(props.debounceTime) ? 300 : Math.max(0, props.debounceTime)
  const debounceRunCode = debounce(() => {
    updateLogs(code.value)
  }, time)

  let stop: WatchStopHandle | undefined
  watch(() => props.autoRun, () => {
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
      <VConsole :logs="logs" />
      <div class="p-operation">
        <button @click="() => updateLogs(code)">RUN</button>
        <button @click="clearLogs">CLEAR</button>
      </div>
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
  display: flex;
  flex-direction: column;
}

.p-operation {
  border-top: 1px solid #e0e0e0;
  padding: 10px 0;
  margin-top: 10px;
}

.p-operation button {
  appearance: none;
  box-sizing: border-box;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0 16px;
  height: 32px;
  background-color: #fff;
  color: #4e4e4e;
  cursor: pointer;
  margin-left: 10px;
}

.p-operation button:hover {
  background-color: #cdcdcd;
}
</style>
