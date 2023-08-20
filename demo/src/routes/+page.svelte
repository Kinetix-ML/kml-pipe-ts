<script lang="ts">
  import { onMount } from "svelte";

  onMount(async () => {
    let {KMLPipeline} = await import("kml-pipe-ts")
    let pipe = new KMLPipeline("project", 1, "key");
    await pipe.initialize()
  })
</script>
<h1>Welcome to KML Pipe TS</h1>
<p>This is a test webapp for the kml-pipe-ts package. You should edit +page.svelte (this file) then open the developer console here as you develop on kml-pipe-ts.</p>
