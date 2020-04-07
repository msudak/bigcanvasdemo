$(document).ready(function () {
  let PIXELSIZE = 2;
  let REPEATSX = 20;
  let REPEATSY = 15;

  let canvas = $("#mycanvas");
  let ctx = canvas.get(0).getContext("2d");
  let canvasWidth = DIMENSION * REPEATSX * PIXELSIZE;
  let canvasHeight = DIMENSION * REPEATSY * PIXELSIZE;
  let selectedBox = null;

  canvas.attr('width', canvasWidth);
  canvas.attr('height', canvasHeight);

  // Initialize Firebase
  let firebaseConfig = {
    apiKey: "AIzaSyA8o_azigp1r55Kf4-ksJnffY7o3WT9ZhQ",
    authDomain: "bigcanvas-f7fef.firebaseapp.com",
    databaseURL: "https://bigcanvas-f7fef.firebaseio.com",
    projectId: "bigcanvas-f7fef",
    storageBucket: "bigcanvas-f7fef.appspot.com",
    messagingSenderId: "429765921665",
    appId: "1:429765921665:web:8d5199605dbda353383680"
  };
  firebase.initializeApp(firebaseConfig);
  let db = firebase.firestore();

  db.collection('app').doc('grid').onSnapshot(function (doc) {
    let data = doc.data();
    for (let key in data) {
      let coord = key.split(",");
      let json = data[key];
      let pixelData = JSON.parse(json);
      for (let subkey in pixelData) {
        let subcoord = subkey.split(",");
        let color = pixelData[subkey];
        fillPixel(coord, subcoord, color);
      }
    }
  });

  // Draw grid.
  ctx.strokeStyle = 'rgba(0,0,0,0.25';
  for (let i = 0; i < DIMENSION * REPEATSX; ++i) {
    if (i % DIMENSION != 0) { continue; }
    x = i * PIXELSIZE;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight);
    ctx.stroke();

    y = i * PIXELSIZE;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasWidth, y);
    ctx.stroke();
  }

  // Canvas Behaviors.
  canvas.click(function (e) {
    selectBox(e);
  });
  canvas.mousemove(function (e) {
    let pixel = [Math.floor(e.offsetX / (PIXELSIZE * DIMENSION)), Math.floor(e.offsetY / (PIXELSIZE * DIMENSION))];
    if (pixel[0] < 0 || pixel[1] < 0 ||
      pixel[0] >= REPEATSX || pixel[1] >= REPEATSY) {
      return;
    }
    if (!selectedBox) {
      selectedBox = $("<div id=selectedBox></div");
      selectedBox.css({ width: DIMENSION * PIXELSIZE - 2, height: DIMENSION * PIXELSIZE - 2 });
      $("#mycanvasWrapper").prepend(selectedBox);
    }
    selectedBox.css({
      left: pixel[0] * PIXELSIZE * DIMENSION + 1,
      top: pixel[1] * PIXELSIZE * DIMENSION
    });
  });

  let SELECTED = 0;
  function selectBox(e) {
    if (SELECTED) return;
    SELECTED = 1;

    let pixel = [Math.floor(e.offsetX / (PIXELSIZE * DIMENSION)), Math.floor(e.offsetY / (PIXELSIZE * DIMENSION))];
    window.location = "draw.php?x=" + pixel[0] + "&y=" + pixel[1];
  }

  function fillPixel(coord, subcoord, color) {
    let coordX = parseInt(coord[0]);
    let coordY = parseInt(coord[1]);
    let subCoordX = parseInt(subcoord[0]);
    let subCoordY = parseInt(subcoord[1]);
    if (coordX < 0 || coordY < 0 ||
      coordX >= REPEATSX || coordY >= REPEATSY ||
      subCoordX < 0 || subCoordX >= DIMENSION ||
      subCoordY < 0 || subCoordY >= DIMENSION) {
      return;
    }

    ctx.fillStyle = color;
    let x = (coordX * DIMENSION + subCoordX) * PIXELSIZE;
    let y = (coordY * DIMENSION + subCoordY) * PIXELSIZE;
    ctx.fillRect(x, y, PIXELSIZE, PIXELSIZE);
  }
});