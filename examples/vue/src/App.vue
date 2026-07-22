<script setup lang="ts">
import { useTheme } from 'nokturne/vue';

const { theme, resolvedTheme, systemTheme, setTheme, toggle } = useTheme();
</script>

<template>
  <main>
    <h1>Nokturne + Vue</h1>
    <p>choice: <strong>{{ theme }}</strong></p>
    <p>resolved: <strong>{{ resolvedTheme }}</strong></p>
    <p>system: <strong>{{ systemTheme }}</strong></p>
    <div class="row">
      <button @click="setTheme('light')">Light</button>
      <button @click="setTheme('dark')">Dark</button>
      <button @click="setTheme('system')">System</button>
      <button @click="toggle">Toggle</button>
    </div>
  </main>
</template>
