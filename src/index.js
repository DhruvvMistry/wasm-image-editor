import "./style.css";
import "/node_modules/preline/dist/preline.js";
import Compressor from "compressorjs";

var historyStack = [];
var historyIndex = -1;

document.addEventListener("DOMContentLoaded", () => {
  import("@silvia-odwyer/photon").then((photon) => {
    const filterArray = [
      "no_filter",
      "grayscale",
      "oceanic",
      "islands",
      "marine",
      "seagreen",
      "flagblue",
      "liquid",
      "diamante",
      "radio",
      "twenties",
      "rosetint",
      "mauve",
      "bluechrome",
      "vintage",
      "perfume",
      "serenity",
      "cali",
      "dramatic",
      "duotone_horizon",
      "duotone_lilac",
      "duotone_ochre",
      "duotone_violette",
      "firenze",
      "golden",
      "lix",
      "lofi",
      "neue",
      "obsidian",
      "pastel_pink",
      "ryo",
    ];

    const RGBManipulationsArray = [
      "inc_red_channel",
      "inc_blue_channel",
      "inc_green_channel",
      "dec_red_channel",
      "dec_blue_channel",
      "dec_green_channel",
      "swap_rg_channels",
      "swap_rb_channels",
      "swap_gb_channels",
      "remove_red_channel",
      "remove_green_channel",
      "remove_blue_channel",
    ];

    var filtersUl = document.getElementById("filters");
    var channelManipulationsUl = document.getElementById(
      "channelManipulations",
    );

    filterArray.forEach((filter) => {
      const filterHtml = `<label for="filters-radio-${filter}"
      class="inline-flex items-center gap-x-2.5 py-3 px-4 text-sm font-medium bg-white border text-indigo-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ms-px sm:mt-0 sm:first:rounded-se-none sm:first:rounded-es-lg sm:last:rounded-es-none sm:last:rounded-se-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white">
      <div class="relative flex items-start w-full">
        <div class="flex items-center h-5">
          <input id="filters-radio-${filter}" name="filters-radio" value="${filter}" x-disabled="!file"
            type="radio"
            class="border-indigo-200 rounded-full disabled:opacity-50 dark:bg-gray-800 dark:border-indigo-700 dark:checked:bg-indigo-500 dark:checked:border-indigo-500 dark:focus:ring-indigo-gray-800">
        </div>
        <label for="filters-radio-${filter}"
          class="ms-3 block w-full text-sm text-indigo-600 dark:text-indigo-500">
          ${filter.replace("_", " ")}
        </label>
      </div>
    </label>`;
      filtersUl.innerHTML += filterHtml;
    });
    RGBManipulationsArray.forEach((filter) => {
      const filterHtml = `<label
      class="inline-flex items-center gap-x-2.5 py-3 px-4 text-sm font-medium bg-white border text-indigo-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ms-px sm:mt-0 sm:first:rounded-se-none sm:first:rounded-es-lg sm:last:rounded-es-none sm:last:rounded-se-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white">
      <div class="relative flex items-start w-full">
        <div class="flex items-center h-5">
          <a name="chm-a" id="${filter}" href="javascript:void(0);" x-disabled="!file">
              ${filter.replace("_", " ")}
            </a>
        </div>
      </div>
    </label>`;
      channelManipulationsUl.innerHTML += filterHtml;
    });

    const canvasPreview = document.getElementById("canvasPreview");
    const canvasChanged = document.getElementById("canvasChanged");
    const canvasDownload = document.getElementById("canvasDownload");
    const imageInput = document.getElementById("imageInput");
    const inputImageQuality = document.getElementById("inputImageQuality");
    const btnClear = document.getElementById("btnClear");
    const btnUndo = document.getElementById("btnUndo");
    const btnRedo = document.getElementById("btnRedo");
    const filters_radio = document.getElementsByName("filters-radio");
    const chm_a = document.getElementsByName("chm-a");

    function hasImage() {
      var ctxPreview = canvasPreview.getContext("2d");
      var imageData = ctxPreview.getImageData(
        0,
        0,
        canvasPreview.width,
        canvasPreview.height,
      ).data;
      for (var i = 0; i < imageData.length; i += 4) {
        if (imageData[i + 3] !== 0) {
          return true;
        }
      }
      return false;
    }

    imageInput.addEventListener("change", function () {
      if (imageInput.files.length > 0) {
        filters_radio.forEach(function (radio) {
          radio.disabled = false;
        });
      } else {
        filters_radio.forEach(function (radio) {
          radio.disabled = true;
        });
      }
    });

    filters_radio.forEach(function (radio) {
      radio.addEventListener("change", function () {
        var selectedValue;
        filters_radio.forEach(function (radio) {
          if (radio.checked) {
            selectedValue = radio.value;
          }
        });

        handleCanvasChangeFilter(selectedValue);
      });
    });

    chm_a.forEach(function (a) {
      a.addEventListener("click", function (event) {
        handleCanvasChange(event.target.id);
      });
    });

    const handleImageChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        let img = e.target.files[0];
        let imagePreview = new Image();
        imagePreview.src = URL.createObjectURL(img);
        imagePreview.onload = () => {
          const imageWidth = imagePreview.width;
          const imageHeight = imagePreview.height;

          const ctxPreview = canvasPreview.getContext("2d");
          canvasPreview.width = imageWidth;
          canvasPreview.height = imageHeight;
          ctxPreview.drawImage(imagePreview, 0, 0, imageWidth, imageHeight);

          copycanvas(canvasPreview, canvasChanged);
          historyStack.push(canvasChanged);
          historyIndex++;
          showHistory();
        };
      }
    };

    const handleCanvasChangeFilter = (filter) => {
      if (hasImage()) {
        try {
          checkStackPostionBeforeChange();
          const canvasPrev =
            historyStack[historyIndex > 0 ? historyIndex - 1 : 0];
          const ctxCanvasPrev = canvasPrev.getContext("2d");
          let img = photon.open_image(canvasPrev, ctxCanvasPrev);
          switch (filter) {
            case "oceanic":
            case "islands":
            case "marine":
            case "seagreen":
            case "flagblue":
            case "liquid":
            case "diamante":
            case "radio":
            case "twenties":
            case "rosetint":
            case "mauve":
            case "bluechrome":
            case "vintage":
            case "perfume":
            case "serenity":
              photon.filter(img, filter);
              break;
            case "cali":
              photon.cali(img);
            case "dramatic":
              photon.dramatic(img);
            case "duotone_horizon":
              photon.duotone_horizon(img);
            case "duotone_lilac":
              photon.duotone_lilac(img);
            case "duotone_ochre":
              photon.duotone_ochre(img);
            case "duotone_violette":
              photon.duotone_violette(img);
            case "firenze":
              photon.firenze(img);
            case "golden":
              photon.golden(img);
            case "lix":
              photon.lix(img);
            case "lofi":
              photon.lofi(img);
            case "neue":
              photon.neue(img);
            case "obsidian":
              photon.obsidian(img);
            case "pastel_pink":
              photon.pastel_pink(img);
            case "ryo":
              photon.ryo(img);
            case "grayscale":
              photon.grayscale(img);
              break;
            case "no_filter":
            default:
              break;
          }
          const ctxChanged = canvasChanged.getContext("2d");
          photon.putImageData(canvasChanged, ctxChanged, img);
          if (historyIndex > 0) {
            historyStack[historyIndex] = canvasChanged;
          } else {
            historyStack.push(canvasChanged);
            historyIndex++;
          }
          console.log(historyStack);
          showHistory();
        } catch (error) {
          console.log(error);
        }
      }
    };

    const handleCanvasChange = (filter) => {
      if (hasImage()) {
        try {
          checkStackPostionBeforeChange();
          const canvasPrev = historyStack[historyIndex];
          const ctxCanvasPrev = canvasPrev.getContext("2d");
          let img = photon.open_image(canvasPrev, ctxCanvasPrev);
          switch (filter) {
            case "inc_red_channel":
              photon.alter_red_channel(img, 100);
              break;
            case "inc_blue_channel":
              photon.alter_channel(img, 2, 100);
              break;
            case "inc_green_channel":
              photon.alter_channel(img, 1, 100);
              break;
            case "dec_red_channel":
              photon.alter_channel(img, 0, -50);
              break;
            case "dec_blue_channel":
              photon.alter_channel(img, 2, -100);
              break;
            case "dec_green_channel":
              photon.alter_channel(img, 1, -100);
              break;
            case "swap_rg_channels":
              photon.swap_channels(img, 0, 1);
              break;
            case "swap_rb_channels":
              photon.swap_channels(img, 0, 2);
              break;
            case "swap_gb_channels":
              photon.swap_channels(img, 1, 2);
              break;
            case "remove_red_channel":
              photon.remove_red_channel(img, 250);
              break;
            case "remove_green_channel":
              photon.remove_green_channel(img, 250);
              break;
            case "remove_blue_channel":
              photon.remove_blue_channel(img, 250);
              break;
          }
          const ctxChanged = canvasChanged.getContext("2d");
          photon.putImageData(canvasChanged, ctxChanged, img);
          historyStack.push(canvasChanged);
          historyIndex++;
        } catch (error) {
          console.log(error);
        }
      }
    };

    // not working when copying from history while undoing or redoing . please find solution
    function copycanvas(fromCanvas, toCanvas) {
      const ctxtoCanvas = toCanvas.getContext("2d");
      toCanvas.width = fromCanvas.width;
      toCanvas.height = fromCanvas.height;
      ctxtoCanvas.drawImage(
        fromCanvas,
        0,
        0,
        fromCanvas.width,
        fromCanvas.height,
        0,
        0,
        toCanvas.width,
        toCanvas.height,
      );
    }

    function downloadImage(format) {
      copycanvas(canvasChanged, canvasDownload);
      var quality = +inputImageQuality.value / 100;
      canvasDownload.toBlob((blob) => {
        new Compressor(blob, {
          quality: quality,
          mimeType: "image/jpeg",
          convertTypes: ["image/jpeg", "image/webp", "image/png", "image/jpg"],
          success(result) {
            convertToDesiredTypeAndDownloadImage(result, format);
          },
        });
      });
    }

    function convertToDesiredTypeAndDownloadImage(image, format) {
      var ext = format;
      format = format === "jpg" ? "jpeg" : format;
      new Compressor(image, {
        mimeType: "image/" + format,
        convertTypes: ["image/jpeg"],
        success(result) {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(result);
          link.download = `image.${ext}`;
          link.click();
        },
      });
    }

    inputImageQuality.oninput = () => {
      const quality = inputImageQuality.value;
      document.getElementById("imageQuality").innerHTML = quality;
    };

    function clearFileUpload() {
      document.getElementById("imageInput").value = "";
      const ctxPreview = canvasPreview.getContext("2d");
      const ctxChanged = canvasChanged.getContext("2d");
      ctxPreview.clearRect(
        0,
        0,
        ctxPreview.canvas.width,
        ctxPreview.canvas.height,
      );
      ctxChanged.clearRect(
        0,
        0,
        ctxChanged.canvas.width,
        ctxChanged.canvas.height,
      );
      historyStack = [];
      historyIndex = -1;
    }

    function undo() {
      if (historyIndex > 0) {
        historyIndex--;
        copycanvas(historyStack[historyIndex], canvasChanged);
      }
    }

    function redo() {
      if (historyIndex < historyStack.length - 1) {
        historyIndex++;
        copycanvas(historyStack[historyIndex], canvasChanged);
      }
    }

    function checkStackPostionBeforeChange() {
      if (historyIndex >= 0 && historyIndex < historyStack.length - 1) {
        historyStack.splice(
          historyIndex + 1,
          historyStack.length - historyIndex,
        );
      }
    }

    function showHistory() {
      var history = document.getElementById("history");
      history.style.display = "block";

      historyStack.forEach((canvas) => {
        var img = document.createElement("img");
        img.src = canvas.toDataURL();
        history.appendChild(img);
      });
    }

    imageInput.addEventListener("change", handleImageChange);
    btnClear.addEventListener("click", clearFileUpload);
    btnUndo.addEventListener("click", undo);
    btnRedo.addEventListener("click", redo);
    document.getElementById("downloadPNG").addEventListener("click", () => {
      downloadImage("png");
    });
    document.getElementById("downloadJPG").addEventListener("click", () => {
      downloadImage("jpg");
    });
    document.getElementById("downloadJPEG").addEventListener("click", () => {
      downloadImage("jpeg");
    });
    document.getElementById("downloadWEBP").addEventListener("click", () => {
      downloadImage("webp");
    });
  });
});
