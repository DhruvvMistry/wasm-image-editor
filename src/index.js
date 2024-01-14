import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  import("@silvia-odwyer/photon").then(photon => {

    const canvasPreview = document.getElementById('canvasPreview');
    const canvasChanged = document.getElementById('canvasChanged');
    const imageInput = document.getElementById('imageInput');
    const applyChangesBtn = document.getElementById('applyChanges');
    const btnVintage = document.getElementById('btnVintage');
    const btnClear = document.getElementById('btnClear');
    const image = new Image();
    
    const handleImageChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        let img = e.target.files[0];
        let imagePreview = new Image();
        imagePreview.src = URL.createObjectURL(img);
        imagePreview.onload = () => {
          image.src = imagePreview.src;
          image.width = imagePreview.width;
          image.height = imagePreview.height;
          canvasPreview.width = image.width;
          canvasPreview.height = image.height;
          const ctxPreview = canvasPreview.getContext('2d');
          ctxPreview.drawImage(image, 0, 0);
          copyfrompreviewtocanvas();
        };
      }
    };

    const handleCanvasChange = () => {
      const ctxChanged = canvasChanged.getContext('2d');
      let img = photon.open_image(canvasChanged, ctxChanged);

      photon.pastel_pink(img);
      photon.filter(img, "liquid");
      photon.putImageData(canvasChanged, ctxChanged, img);
    };

    function copyfrompreviewtocanvas() {
      const ctxChanged = canvasChanged.getContext('2d');
      canvasChanged.width = canvasPreview.width;
      canvasChanged.height = canvasPreview.height;
      ctxChanged.drawImage(image, 0, 0);
    }

    function downloadImage(format) {
      const dataURL = canvasChanged.toDataURL(`image/${format}`);

      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `canvas_image.${format}`;
      link.click();
    }

    function clearFileUpload() {
      document.getElementById("imageInput").value = "";
      const ctxPreview = canvasPreview.getContext('2d');
      const ctxChanged = canvasChanged.getContext('2d');
      ctxPreview.clearRect(0, 0, ctxPreview.canvas.width, ctxPreview.canvas.height);
      ctxChanged.clearRect(0, 0, ctxChanged.canvas.width, ctxChanged.canvas.height);
    }

    imageInput.addEventListener('change', handleImageChange);
    applyChangesBtn.addEventListener('click', () => downloadImage("png"));
    btnVintage.addEventListener('click', handleCanvasChange);
    btnClear.addEventListener('click', clearFileUpload);
  });
});
