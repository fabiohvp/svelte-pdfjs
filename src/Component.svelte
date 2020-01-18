<script context="module">
  let workerSrc = "/pdfjs/pdf.worker.min.js";

  export function setWorkerSrc(src) {
    workerSrc = src;
  }
</script>

<script>
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import pdfjs from "pdfjs-dist";
  import pdfjsViewer from "pdfjs-dist/web/pdf_viewer.js";
  import "pdfjs-dist/web/pdf_viewer.css";

  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

  const dispatch = createEventDispatcher();

  export let src;
  export let scale = "page-width";
  export let cMapSrc = "/pdfjs/cmaps";
  export let cMapPacked = true;

  export let pdfViewerOptions = {};
  export let documentOptions = {
    cMapUrl: cMapSrc,
    cMapPacked
  };

  let containerRef;
  let pdfViewer;

  function load(src) {
    // (Optionally) enable hyperlinks within PDF files.
    const pdfLinkService = new pdfjsViewer.PDFLinkService();

    pdfViewer = new pdfjsViewer.PDFViewer({
      container: containerRef,
      linkService: pdfLinkService,
      ...pdfViewerOptions
    });

    pdfLinkService.setViewer(pdfViewer);

    // Loading document.
    const loadingTask = pdfjs.getDocument({
      src,
      ...documentOptions
    });

    loadingTask.promise.then(function(pdfDocument) {
      // Document loaded, specifying document for the viewer and the (optional) linkService.
      pdfViewer.setDocument(pdfDocument);
      pdfLinkService.setDocument(pdfDocument, null);
    });
  }

  $: if (containerRef && src) {
    load(src);
  }

  function pagesInit() {
    if (pdfViewer) {
      // We can use pdfViewer now, e.g. let's change default scale.
      pdfViewer.currentScaleValue = scale;
      dispatch("load", pdfViewer);
    }
  }

  onMount(async () => {
    //load(src);
    document.addEventListener("pagesinit", pagesInit);
  });

  onDestroy(async () => {
    document.removeEventListener("pagesinit", pagesInit);
  });
</script>

<div class="w-full h-full" bind:this={containerRef}>
  <div class="pdfViewer" />
</div>
