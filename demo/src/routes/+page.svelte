<script lang="ts">
  import type { KMLPipeline } from "kml-pipe-ts";
  import { onMount } from "svelte";

  let pipe: KMLPipeline;
  let videoSource: HTMLVideoElement;
  let canvas: HTMLCanvasElement;
  let loading: boolean;
  let processing: boolean = false;
  let outputs = [];
  let lastTime = Date.now();
  let curTime = Date.now();
  let running = true;

  onMount(async () => {
    await loadDemoPipe()
    await startWebcam();
  })

  const runInference = async () => {
    if (!processing && running) {
      processing = true;
      console.log(canvas);
      canvas.getContext('2d')?.clearRect(0, 0, videoSource.clientWidth, videoSource.clientHeight);
      outputs = await pipe.execute([videoSource, canvas]);
      console.log(outputs);
      processing = false;
      lastTime = curTime;
      curTime = Date.now();
      videoSource.requestVideoFrameCallback(runInference);
    }
  };

  const loadDemoPipe = async () => {
    const { KMLPipeline } = await import('kml-pipe-ts');
    //console.log(KEY);
    pipe = new KMLPipeline("VR Pong", 1, "261e97fd-18b1-4a3c-8cc1-b94a421c11bf")
    await pipe.initialize();
  };

  const startWebcam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {width: 1280, height: 800} });
    videoSource.srcObject = stream;
    await videoSource.play();
    loading = false;
    canvas.height = videoSource.clientHeight;
    canvas.width = videoSource.clientWidth;
    videoSource.width = videoSource.clientWidth
    videoSource.height = videoSource.clientHeight
    videoSource.requestVideoFrameCallback(runInference);
  };
</script>
<style>
    .container {
        width: 50vw;
        overflow: hidden;
        position: relative;
    }
    video {
        width: 100%;
    }

    canvas {
        position: absolute;
        z-index: 10;
        top: 0;
        left: 0;
    }
</style>
<h1>Welcome to KML Pipe TS</h1>
<p>This is a test webapp for the kml-pipe-ts package. You should edit +page.svelte (this file) then open the developer console here as you develop on kml-pipe-ts.</p>
<button on:click={() => running = !running}>{running ? "Pause" : "Play"}</button>
<div>
<div class="container">
    <video
    id="webcam"
    autoplay
    class="rounded-lg shadow-lg w-full h-full object-fill"
    bind:this={videoSource}
    />
    <canvas
    id="canvas"
    class="absolute z-10 top-0 left-0 overflow-hidden"
    bind:this={canvas}
    />
</div>
<div>
    <p>{JSON.stringify(outputs)}</p>
</div>
</div>