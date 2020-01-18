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
      url: src,
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

<style>
  /* Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

  .pdfjs-container {
    width: 100%;
    height: 100%;
  }

  .pdfjs-container :global(.textLayer) {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    opacity: 0.2;
    line-height: 1;
  }

  .pdfjs-container :global(.textLayer > span) {
    color: transparent;
    position: absolute;
    white-space: pre;
    cursor: text;
    -webkit-transform-origin: 0% 0%;
    transform-origin: 0% 0%;
  }

  .pdfjs-container :global(.textLayer .highlight) {
    margin: -1px;
    padding: 1px;

    background-color: rgb(180, 0, 170);
    border-radius: 4px;
  }

  .pdfjs-container :global(.textLayer .highlight.begin) {
    border-radius: 4px 0px 0px 4px;
  }

  .pdfjs-container :global(.textLayer .highlight.end) {
    border-radius: 0px 4px 4px 0px;
  }

  .pdfjs-container :global(.textLayer .highlight.middle) {
    border-radius: 0px;
  }

  .pdfjs-container :global(.textLayer .highlight.selected) {
    background-color: rgb(0, 100, 0);
  }

  .pdfjs-container :global(.textLayer ::-moz-selection) {
    background: rgb(0, 0, 255);
  }

  .pdfjs-container :global(.textLayer ::selection) {
    background: rgb(0, 0, 255);
  }

  .pdfjs-container :global(.textLayer .endOfContent) {
    display: block;
    position: absolute;
    left: 0px;
    top: 100%;
    right: 0px;
    bottom: 0px;
    z-index: -1;
    cursor: default;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .pdfjs-container :global(.textLayer .endOfContent.active) {
    top: 0px;
  }

  .pdfjs-container :global(.annotationLayer section) {
    position: absolute;
  }

  .pdfjs-container :global(.annotationLayer .linkAnnotation > a),
  .pdfjs-container
    :global(.annotationLayer .buttonWidgetAnnotation.pushButton > a) {
    position: absolute;
    font-size: 1em;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .pdfjs-container :global(.annotationLayer .linkAnnotation > a:hover),
  .pdfjs-container
    :global(.annotationLayer .buttonWidgetAnnotation.pushButton > a:hover) {
    opacity: 0.2;
    background: #ff0;
    box-shadow: 0px 2px 10px #ff0;
  }

  .pdfjs-container :global(.annotationLayer .textAnnotation img) {
    position: absolute;
    cursor: pointer;
  }

  .pdfjs-container :global(.annotationLayer .textWidgetAnnotation input),
  .pdfjs-container :global(.annotationLayer .textWidgetAnnotation textarea),
  .pdfjs-container :global(.annotationLayer .choiceWidgetAnnotation select),
  .pdfjs-container
    :global(.annotationLayer .buttonWidgetAnnotation.checkBox input),
  .pdfjs-container
    :global(.annotationLayer .buttonWidgetAnnotation.radioButton input) {
    background-color: rgba(0, 54, 255, 0.13);
    border: 1px solid transparent;
    box-sizing: border-box;
    font-size: 9px;
    height: 100%;
    margin: 0;
    padding: 0 3px;
    vertical-align: top;
    width: 100%;
  }

  .pdfjs-container
    :global(.annotationLayer .choiceWidgetAnnotation select option) {
    padding: 0;
  }

  .pdfjs-container
    :global(.annotationLayer .buttonWidgetAnnotation.radioButton input) {
    border-radius: 50%;
  }

  .pdfjs-container :global(.annotationLayer .textWidgetAnnotation textarea) {
    font: message-box;
    font-size: 9px;
    resize: none;
  }

  .pdfjs-container
    :global(.annotationLayer .textWidgetAnnotation input[disabled]),
  .pdfjs-container
    :global(.annotationLayer .textWidgetAnnotation textarea[disabled]),
  .pdfjs-container
    :global(.annotationLayer .choiceWidgetAnnotation select[disabled]),
  .pdfjs-container
    :global(.annotationLayer .buttonWidgetAnnotation.checkBox input[disabled]),
  .pdfjs-container
    :global(.annotationLayer
      .buttonWidgetAnnotation.radioButton
      input[disabled]) {
    background: none;
    border: 1px solid transparent;
    cursor: not-allowed;
  }

  .pdfjs-container :global(.annotationLayer .textWidgetAnnotation input:hover),
  .pdfjs-container
    :global(.annotationLayer .textWidgetAnnotation textarea:hover),
  .pdfjs-container
    :global(.annotationLayer .choiceWidgetAnnotation select:hover),
  .pdfjs-container
    :global(.annotationLayer .buttonWidgetAnnotation.checkBox input:hover),
  .pdfjs-container
    :global(.annotationLayer .buttonWidgetAnnotation.radioButton input:hover) {
    border: 1px solid #000;
  }

  .pdfjs-container :global(.annotationLayer .textWidgetAnnotation input:focus),
  .pdfjs-container
    :global(.annotationLayer .textWidgetAnnotation textarea:focus),
  .pdfjs-container
    :global(.annotationLayer .choiceWidgetAnnotation select:focus) {
    background: none;
    border: 1px solid transparent;
  }

  .pdfjs-container
    :global(.annotationLayer
      .buttonWidgetAnnotation.checkBox
      input:checked:before),
  .pdfjs-container
    :global(.annotationLayer
      .buttonWidgetAnnotation.checkBox
      input:checked:after),
  .pdfjs-container
    :global(.annotationLayer
      .buttonWidgetAnnotation.radioButton
      input:checked:before) {
    background-color: #000;
    content: "";
    display: block;
    position: absolute;
  }

  .pdfjs-container
    :global(.annotationLayer
      .buttonWidgetAnnotation.checkBox
      input:checked:before),
  .pdfjs-container
    :global(.annotationLayer
      .buttonWidgetAnnotation.checkBox
      input:checked:after) {
    height: 80%;
    left: 45%;
    width: 1px;
  }

  .pdfjs-container
    :global(.annotationLayer
      .buttonWidgetAnnotation.checkBox
      input:checked:before) {
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
  }

  .pdfjs-container
    :global(.annotationLayer
      .buttonWidgetAnnotation.checkBox
      input:checked:after) {
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }

  .pdfjs-container
    :global(.annotationLayer
      .buttonWidgetAnnotation.radioButton
      input:checked:before) {
    border-radius: 50%;
    height: 50%;
    left: 30%;
    top: 20%;
    width: 50%;
  }

  .pdfjs-container :global(.annotationLayer .textWidgetAnnotation input.comb) {
    font-family: monospace;
    padding-left: 2px;
    padding-right: 0;
  }

  .pdfjs-container
    :global(.annotationLayer .textWidgetAnnotation input.comb:focus) {
    /*
   * Letter spacing is placed on the right side of each character. Hence, the
   * letter spacing of the last character may be placed outside the visible
   * area, causing horizontal scrolling. We avoid this by extending the width
   * when the element has focus and revert this when it loses focus.
   */
    width: 115%;
  }

  .pdfjs-container
    :global(.annotationLayer .buttonWidgetAnnotation.checkBox input),
  .pdfjs-container
    :global(.annotationLayer .buttonWidgetAnnotation.radioButton input) {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    padding: 0;
  }

  .pdfjs-container :global(.annotationLayer .popupWrapper) {
    position: absolute;
    width: 20em;
  }

  .pdfjs-container :global(.annotationLayer .popup) {
    position: absolute;
    z-index: 200;
    max-width: 20em;
    background-color: #ffff99;
    box-shadow: 0px 2px 5px #888;
    border-radius: 2px;
    padding: 6px;
    margin-left: 5px;
    cursor: pointer;
    font: message-box;
    font-size: 9px;
    word-wrap: break-word;
  }

  .pdfjs-container :global(.annotationLayer .popup > *) {
    font-size: 9px;
  }

  .pdfjs-container :global(.annotationLayer .popup h1) {
    display: inline-block;
  }

  .pdfjs-container :global(.annotationLayer .popup span) {
    display: inline-block;
    margin-left: 5px;
  }

  .pdfjs-container :global(.annotationLayer .popup p) {
    border-top: 1px solid #333;
    margin-top: 2px;
    padding-top: 2px;
  }

  .pdfjs-container :global(.annotationLayer .highlightAnnotation),
  .pdfjs-container :global(.annotationLayer .underlineAnnotation),
  .pdfjs-container :global(.annotationLayer .squigglyAnnotation),
  .pdfjs-container :global(.annotationLayer .strikeoutAnnotation),
  .pdfjs-container :global(.annotationLayer .freeTextAnnotation),
  .pdfjs-container :global(.annotationLayer .lineAnnotation svg line),
  .pdfjs-container :global(.annotationLayer .squareAnnotation svg rect),
  .pdfjs-container :global(.annotationLayer .circleAnnotation svg ellipse),
  .pdfjs-container :global(.annotationLayer .polylineAnnotation svg polyline),
  .pdfjs-container :global(.annotationLayer .polygonAnnotation svg polygon),
  .pdfjs-container :global(.annotationLayer .caretAnnotation),
  .pdfjs-container :global(.annotationLayer .inkAnnotation svg polyline),
  .pdfjs-container :global(.annotationLayer .stampAnnotation),
  .pdfjs-container :global(.annotationLayer .fileAttachmentAnnotation) {
    cursor: pointer;
  }

  .pdfjs-container :global(.pdfViewer .canvasWrapper) {
    overflow: hidden;
  }

  .pdfjs-container :global(.pdfViewer .page) {
    direction: ltr;
    width: 816px;
    height: 1056px;
    position: relative;
    overflow: visible;
    background-clip: content-box;
    background-color: white;
  }

  .pdfjs-container :global(.pdfViewer.removePageBorders .page) {
    margin: 0px auto 10px auto;
    border: none;
  }

  .pdfjs-container :global(.pdfViewer.singlePageView) {
    display: inline-block;
  }

  .pdfjs-container :global(.pdfViewer.singlePageView .page) {
    margin: 0;
    border: none;
  }

  .pdfjs-container :global(.pdfViewer.scrollHorizontal),
  .pdfjs-container :global(.pdfViewer.scrollWrapped),
  .pdfjs-container :global(.spread) {
    margin-left: 3.5px;
    margin-right: 3.5px;
    text-align: center;
  }

  .pdfjs-container :global(.pdfViewer.scrollHorizontal),
  .pdfjs-container :global(.spread) {
    white-space: nowrap;
  }

  .pdfjs-container :global(.pdfViewer.removePageBorders),
  .pdfjs-container :global(.pdfViewer.scrollHorizontal .spread),
  .pdfjs-container :global(.pdfViewer.scrollWrapped .spread) {
    margin-left: 0;
    margin-right: 0;
  }

  .pdfjs-container :global(.spread .page),
  .pdfjs-container :global(.pdfViewer.scrollHorizontal .page),
  .pdfjs-container :global(.pdfViewer.scrollWrapped .page),
  .pdfjs-container :global(.pdfViewer.scrollHorizontal .spread),
  .pdfjs-container :global(.pdfViewer.scrollWrapped .spread) {
    display: inline-block;
    vertical-align: middle;
  }

  .pdfjs-container :global(.spread .page),
  .pdfjs-container :global(.pdfViewer.scrollHorizontal .page),
  .pdfjs-container :global(.pdfViewer.scrollWrapped .page) {
    margin-left: -3.5px;
    margin-right: -3.5px;
  }

  .pdfjs-container :global(.pdfViewer.removePageBorders .spread .page),
  .pdfjs-container :global(.pdfViewer.removePageBorders.scrollHorizontal .page),
  .pdfjs-container :global(.pdfViewer.removePageBorders.scrollWrapped .page) {
    margin-left: 5px;
    margin-right: 5px;
  }

  .pdfjs-container :global(.pdfViewer .page canvas) {
    margin: 0;
    display: block;
  }

  .pdfjs-container :global(.pdfViewer .page canvas[hidden]) {
    display: none;
  }

  .pdfjs-container :global(.pdfViewer .page .loadingIcon) {
    position: absolute;
    display: block;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    /* background: url("images/loading-icon.gif") center no-repeat; */
  }

  .pdfjs-container :global(.pdfPresentationMode .pdfViewer) {
    margin-left: 0;
    margin-right: 0;
  }

  .pdfjs-container :global(.pdfPresentationMode .pdfViewer .page),
  .pdfjs-container :global(.pdfPresentationMode .pdfViewer .spread) {
    display: block;
  }

  .pdfjs-container :global(.pdfPresentationMode .pdfViewer .page),
  .pdfjs-container
    :global(.pdfPresentationMode .pdfViewer.removePageBorders .page) {
    margin-left: auto;
    margin-right: auto;
  }

  .pdfjs-container
    :global(.pdfPresentationMode:-ms-fullscreen .pdfViewer .page) {
    margin-bottom: 100% !important;
  }

  .pdfjs-container
    :global(.pdfPresentationMode:-webkit-full-screen .pdfViewer .page) {
    margin-bottom: 100%;
    border: 0;
  }

  .pdfjs-container
    :global(.pdfPresentationMode:-moz-full-screen .pdfViewer .page) {
    margin-bottom: 100%;
    border: 0;
  }

  .pdfjs-container :global(.pdfPresentationMode:fullscreen .pdfViewer .page) {
    margin-bottom: 100%;
    border: 0;
  }
</style>

<div class={'pdfjs-container ' + $$props.class} bind:this={containerRef}>
  <div class="pdfViewer" />
</div>
