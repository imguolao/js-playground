# JS Playground

A js playground component in vue3.

## Installation

```sh
npm i @guolao/js-playground
```

## Usage

```vue
<template>
  <js-playground default-code="code" />
</template>

<script setup>
import { JSPlayground } from '@guolao/js-playground'
import '@guolao/js-playground/style.css'

const code = 'console.log(123)'
</script>
```
