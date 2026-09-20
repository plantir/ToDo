<script lang="ts">
  import '../app.css'
  import { onMount } from 'svelte'
  import { session } from '$lib/state/session.svelte'

  let { children } = $props()

  onMount(() => {
    void session.bootstrap()
  })
</script>

{@render children()}
