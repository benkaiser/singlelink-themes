const slbg = document.getElementById('user-profile-view');
const canvas = document.createElement('canvas');
canvas.setAttribute('id', 'splatterCanvas');
slbg.insertBefore(canvas, slbg.firstChild);

var ctx=canvas.getContext('2d');
var fx = document.getElementById('sound');
let w = window.innerWidth;
let h = window.innerHeight;

var xAcc = 0;
var yAcc = 5;
var screenOrientation = 0;
if (screen && screen.orientation && screen.orientation.angle) {
  screenOrientation = screen.orientation.angle;
}

// function handleOrientation(event) {
//   beta = Math.floor(Math.ceil(event.beta, -90), 90);
//   gamma = event.gamma;
//   console.log('Beta: ' + beta);
//   console.log('Gamma: ' + gamma);

//   // Do stuff with the new orientation data
// }
// window.addEventListener("deviceorientation", handleOrientation, true);

window.addEventListener('devicemotion', function(event) {
  xAcc = event.accelerationIncludingGravity.x;
  yAcc = event.accelerationIncludingGravity.y;
}, true);

function setupCanvas(canvas, w, h) {
  var dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  var ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return ctx;
}
setupCanvas(canvas, w, h);

var cntr = 0;

var objects = new Array();

// blues
// const colors = ["#415A80", "#A5D4DC", "#F2F4F8", "#D7E2E9"];
// blue and red
const colors = ["#DC474F", "#F994C0", "#FAEDF0", "#A3D0EB"];

function getColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function randomColor() {
  return rgbToHex(hslToRgb(Math.random(), 1, .75));
}

function init() {
	objects = new Array();
	for(var x = 0; x < 500; x++){
		addobj(randomColor(), Math.random() * 1.2 - 0.1, Math.random()  * 1.2 - 0.1, Math.random());
	}
}

function addobj(color, x, y, s){
	var tmp = {
		color: color,
		x: x,
		y: y,
		s: s
	}
	objects.push(tmp);
}

function update() {
  for(i in objects){
		obj = objects[i];

    const downSpeed = -xAcc * (1/18000) * obj.s;
    const acrossSpeed = yAcc * (1/18000) * obj.s;

    if (screenOrientation === 0) {
      obj.x += downSpeed;
      obj.y += acrossSpeed;
    } else if (screenOrientation === 90) {
      obj.x += acrossSpeed;
      obj.y -= downSpeed;
    } else if (screenOrientation === 270) {
      obj.x -= acrossSpeed;
      obj.y += downSpeed;
    }

    if (obj.x > 1.1) {
      obj.x = -0.1;
    }
    if (obj.x < -0.1) {
      obj.x = 1.1;
    }
    if (obj.y > 1.1) {
      obj.y = -0.1;
    }
    if (obj.y < -0.1) {
      obj.y = 1.1;
    }
	}
}

function render() {
	// wipe the canvas
	ctx.fillStyle = '#FFF';
	ctx.fillRect(0,0,10000,100000);

	for(i in objects){
		obj = objects[i];

		drawCircle(ctx, obj.color, (obj.x * w), (obj.y * h), obj.s * 5, 0, "#FFF");
	}

};

function drawCircle(ctx, fillColor, x, y, radius, strokeWidth, strokeColor){
	ctx.fillStyle = fillColor;
	ctx.beginPath();
	ctx.arc(x,y,radius,0,Math.PI*2,false);
	ctx.closePath();
	if(strokeWidth != 0){
		ctx.lineWidth = strokeWidth;
		ctx.strokeStyle=strokeColor;
		ctx.stroke();
	}
	ctx.fill();
}

var main = function () {
	var now = Date.now();
	var delta = now - then;

  update();
	render(delta);

	then = now;
};

init();
var then = Date.now();
(function animloop(){
  requestAnimationFrame(animloop);
  main();
})();


// onresize
window.addEventListener('resize', () => {
  w = document.body.clientWidth;
	h = window.innerHeight;
	setupCanvas(canvas, w, h);
});


// onresize
screen.orientation.onchange = function(e) {
  screenOrientation = e.target.angle;
  w = document.body.clientWidth;
	h = window.innerHeight;
	setupCanvas(canvas, w, h);
};


/* UTILITY FUNCTIONS */

// colour converting functions, used to create random color (see update function)
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return {r: parseInt(r * 255),g: parseInt(g * 255),b: parseInt(b * 255)};
}

function rgbToHex(x) {
    return "#" + ((1 << 24) + (x.r << 16) + (x.g << 8) + x.b).toString(16).slice(1);
}