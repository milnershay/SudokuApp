
function find_cont(image){
    let gray = new cv.Mat()
    let bfilter = new cv.Mat()
    let blur = new cv.Mat()
    let thresh = new cv.Mat()
    cv.cvtColor(image, gray, cv.COLOR_BGR2GRAY);
    cv.bilateralFilter(gray, bfilter, 13, 20, 20);
    cv.GaussianBlur(bfilter, blur, new cv.Size(3, 3), 5);
    cv.adaptiveThreshold(blur, thresh, 255, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY, 9, 9);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(thresh, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
    gray.delete()
    bfilter.delete()
    blur.delete()
    return [contours, thresh, hierarchy];
}


function get_board(img, conts, hierarchy) {
    let sortable_conts = []
    for (let i =0; i< conts.size(); ++i){
        let cnt = conts.get(i)
        let area = cv.contourArea(cnt, false)
        sortable_conts.push({areaSize: area, index: i})
    }
    sortable_conts = sortable_conts.sort((item1, item2) => {return (item1.areaSize > item2.areaSize) ? -1 : (item1.areaSize < item2.areaSize) ? 1 : 0}).slice(0,15)
    let location = new cv.Mat()
    for (let i = 0; i < 15; i++) {
        let approx = new cv.Mat();
        let cnt = conts.get(sortable_conts[i].index)
        cv.approxPolyDP(cnt, approx, 100, true);
        if (approx.rows == 4 && sortable_conts[i].areaSize >= 100000 && sortable_conts[i].areaSize <= 300000 ) {
            approx.copyTo(location)
        } 
    }
    
    let result = new cv.Mat();
    let game = new cv.Mat()

    let corner1 = new cv.Point(location.data32S[0], location.data32S[1]);
    let corner2 = new cv.Point(location.data32S[2], location.data32S[3]);
    let corner3 = new cv.Point(location.data32S[4], location.data32S[5]);
    let corner4 = new cv.Point(location.data32S[6], location.data32S[7]);

    let cornerArray = [{ corner: corner1 }, { corner: corner2 }, { corner: corner3 }, { corner: corner4 }];

    cornerArray.sort((item1, item2) => { return (item1.corner.y < item2.corner.y) ? -1 : (item1.corner.y > item2.corner.y) ? 1 : 0; }).slice(0, 5);

    let tl = cornerArray[0].corner.x < cornerArray[1].corner.x ? cornerArray[0] : cornerArray[1];
    let tr = cornerArray[0].corner.x > cornerArray[1].corner.x ? cornerArray[0] : cornerArray[1];
    let bl = cornerArray[2].corner.x < cornerArray[3].corner.x ? cornerArray[2] : cornerArray[3];
    let br = cornerArray[2].corner.x > cornerArray[3].corner.x ? cornerArray[2] : cornerArray[3];

    let widthBottom = Math.hypot(br.corner.x - bl.corner.x, br.corner.y - bl.corner.y);
    let widthTop = Math.hypot(tr.corner.x - tl.corner.x, tr.corner.y - tl.corner.y);
    let theWidth = (widthBottom > widthTop) ? widthBottom : widthTop;
    let heightRight = Math.hypot(tr.corner.x - br.corner.x, tr.corner.y - br.corner.y);
    let heightLeft = Math.hypot(tl.corner.x - bl.corner.x, tr.corner.y - bl.corner.y);
    let theHeight = (heightRight > heightLeft) ? heightRight : heightLeft;

    let finalDestCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, theWidth - 1, 0, theWidth - 1, theHeight - 1, 0, theHeight - 1]); //
    let srcCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [tl.corner.x, tl.corner.y, tr.corner.x, tr.corner.y, br.corner.x, br.corner.y, bl.corner.x, bl.corner.y]);
    let dsize = new cv.Size(theWidth, theHeight);
    let M = cv.getPerspectiveTransform(srcCoords, finalDestCoords)
    cv.warpPerspective(img, result, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

    return [result];
}

let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');
inputElement.addEventListener('change', (e) => {
  imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);
imgElement.onload = function() {
  let img = cv.imread(imgElement);
  let a = []
  a = find_cont(img)

  let board = []
  board = get_board(img, a[0], a[2])
  cv.imshow('canvasOutput', board[0])
  console.log("Finished")
  
  img.delete();

};
var Module = {
  // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
  onRuntimeInitialized() {
    document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
  }
};