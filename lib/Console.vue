<script lang="ts" setup>
import { type LogMessage } from './utils'

defineOptions({
  name: 'VConsole',
})

const props = defineProps<{
  logs: LogMessage[]
}>()
</script>

<template>
  <div class="vc-wrapper">
    <ol>
      <li
        v-for="log in props.logs"
        class="vc-item"
        :key="log.message">
        &gt;&nbsp;
        <span
          :class="{
            ['vc-item']: true,
            ['vc-item-error']: log.type === 'error',
          }">
          {{ log.message }}
        </span>
      </li>
    </ol>
  </div>
</template>

<style>
.vc-wrapper {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow: auto;
  padding: 0 20px;
}

.vc-wrapper ol {
  margin: 0;
  padding: 0;
  list-style-type: none;
  height: 100%;
}

.vc-item {
  display: flex;
  padding: 4px 0;
  align-items: center;
}

.vc-item-error {
  color: #c85857;
}
</style>
