import './style.css';
import "/node_modules/preline/dist/preline.js";

document.addEventListener('DOMContentLoaded', () => {
  import("@silvia-odwyer/photon").then(photon => {

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
        const ctxChanged = canvasChanged.getContext('2d');
        copyfrompreviewtocanvas();
        let img = photon.open_image(canvasChanged, ctxChanged);
        photon.filter(img, filter);
        photon.putImageData(canvasChanged, ctxChanged, img);
      }
    };

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


