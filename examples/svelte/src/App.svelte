<script lang="ts">
  import { themeStore } from 'nokturne/svelte';

  const theme = themeStore();
</script>

<main>
  <h1>Nokturne + Svelte</h1>
  <p>choice: <strong>{$theme.theme}</strong></p>
  <p>resolved: <strong>{$theme.resolvedTheme}</strong></p>
  <p>system: <strong>{$theme.systemTheme}</strong></p>
  <div class="row">
    <button onclick={() => theme.setTheme('light')}>Light</button>
    <button onclick={() => theme.setTheme('dark')}>Dark</button>
    <button onclick={() => theme.setTheme('system')}>System</button>
    <button onclick={theme.toggle}>Toggle</button>
  </div>
</main>
