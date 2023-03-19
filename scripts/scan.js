//const {KneighborsClassifier } = require('sklearn-porter')
//const model = new KneighborsClassifier()
//model.load('knn_model.pkl')

let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');
inputElement.addEventListener('change', (e) => {
  imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);
imgElement.onload = function() {
  let mat = cv.imread(imgElement);
  let dst = new cv.Mat()
  cv.cvtColor(mat, dst, cv.COLOR_RGBA2GRAY, 0)
  cv.imshow('canvasOutput', dst);
  mat.delete();
  dst.delete()
};
var Module = {
  // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
  onRuntimeInitialized() {
    document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
  }
};