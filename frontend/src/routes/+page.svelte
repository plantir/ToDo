<script lang="ts">
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { session } from '$lib/state/session.svelte'

  $effect(() => {
    if (!session.ready) {
      return
    }
    void goto(resolve(session.isAuthenticated ? '/daily' : '/login'))
  })
</script>
