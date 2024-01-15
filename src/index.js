import './style.css';
import "/node_modules/preline/dist/preline.js";

document.addEventListener('DOMContentLoaded', () => {
  import("@silvia-odwyer/photon").then(photon => {

    const filterArray = ["no_filter", "oceanic", "islands", "marine", "seagreen", "flagblue", "liquid", "diamante", "radio", "twenties", "rosetint", "mauve", "bluechrome", "vintage", "perfume", "serenity", "cali", "dramatic", "duotone_horizon", "duotone_lilac", "duotone_ochre", "duotone_violette", "firenze", "golden", "lix", "lofi", "neue", "obsidian", "pastel_pink", "ryo"];

    var filtersUl = document.getElementById('filters');

    filterArray.forEach(filter => {
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
    })

    const canvasPreview = document.getElementById('canvasPreview');
    const canvasChanged = document.getElementById('canvasChanged');
    const imageInput = document.getElementById('imageInput');
    const btnClear = document.getElementById('btnClear');
    const filters_radio = document.getElementsByName("filters-radio");
    const image = new Image();
    var imageWidth;
    var imageHeight;

    function hasImage() {
      var ctxPreview = canvasPreview.getContext('2d');
      var imageData = ctxPreview.getImageData(0, 0, canvasPreview.width, canvasPreview.height).data;
      for (var i = 0; i < imageData.length; i += 4) {
        if (imageData[i + 3] !== 0) {
          return true;
        }
      }
      return false;
    }

    imageInput.addEventListener('change', function () {
      if (imageInput.files.length > 0) {
        filters_radio.forEach(function (radio) {
          radio.disabled = false;
        })
      } else {
        filters_radio.forEach(function (radio) {
          radio.disabled = true;
        })
      }
    });

    filters_radio.forEach(function (radio) {
      radio.addEventListener('change', function () {
        var selectedValue;
        filters_radio.forEach(function (radio) {
          if (radio.checked) {
            selectedValue = radio.value;
          }
        });

        handleCanvasChange(selectedValue);
      });
    });

    const handleImageChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        let img = e.target.files[0];
        let imagePreview = new Image();
        imagePreview.src = URL.createObjectURL(img);
        imagePreview.onload = () => {
          imageWidth = imagePreview.width;
          imageHeight = imagePreview.height;
          // Calculate scaled dimensions based on max width and height
          const maxWidth = 655;
          const maxHeight = 470;
          let scaledWidth, scaledHeight;

          if (imageWidth > imageHeight) {
            // Image is wider than it is tall
            scaledWidth = maxWidth;
            scaledHeight = scaledWidth * (imageHeight / imageWidth);
          } else {
            // Image is taller than it is wide
            scaledHeight = maxHeight;
            scaledWidth = scaledHeight * (imageWidth / imageHeight);
          }

          // Set canvas and image dimensions
          canvasPreview.width = scaledWidth;
          canvasPreview.height = scaledHeight;
          image.src = imagePreview.src;
          image.width = scaledWidth;
          image.height = scaledHeight;

          // Draw image onto canvas
          const ctxPreview = canvasPreview.getContext('2d');
          ctxPreview.drawImage(image, 0, 0, imageWidth, imageHeight, 0, 0, scaledWidth, scaledHeight);

          copyfrompreviewtocanvas();
        };
      }
    };

    const handleCanvasChange = (filter) => {
      if (hasImage()) {
        try {
          const ctxChanged = canvasChanged.getContext('2d');
          copyfrompreviewtocanvas();
          let img = photon.open_image(canvasChanged, ctxChanged);
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
            case "no_filter":
            default:
              break;
          }
          photon.putImageData(canvasChanged, ctxChanged, img);
        } catch (error) {
          console.log(error);
        }
      };
    }

    function copyfrompreviewtocanvas() {
      const ctxChanged = canvasChanged.getContext('2d');
      canvasChanged.width = canvasPreview.width;
      canvasChanged.height = canvasPreview.height;
      ctxChanged.drawImage(image, 0, 0, imageWidth, imageHeight, 0, 0, canvasPreview.width, canvasPreview.height);
    }

    function clearFileUpload() {
      document.getElementById("imageInput").value = "";
      const ctxPreview = canvasPreview.getContext('2d');
      const ctxChanged = canvasChanged.getContext('2d');
      ctxPreview.clearRect(0, 0, ctxPreview.canvas.width, ctxPreview.canvas.height);
      ctxChanged.clearRect(0, 0, ctxChanged.canvas.width, ctxChanged.canvas.height);
    }

    imageInput.addEventListener('change', handleImageChange);
    btnClear.addEventListener('click', clearFileUpload);
  });
});


