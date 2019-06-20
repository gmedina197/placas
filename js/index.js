const imgDOM = document.getElementById("picField");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const minor = document.getElementById('37');
const major = document.getElementById('185');
const form = document.getElementById('form');

const placaWidth = {
	a1: 125,
	a: 81,
	b: 200
};

const placaHeight = {
	a: 35,
	b: 60
};

const setValueT = () => minor.checked ? 37 : 185;

let T = setValueT();
let refImage;

//Event listeners
form.addEventListener('change', () => T = setValueT());

//functions
function run() {
	grayScaleMatrix();
	thresholding();
	detect();
}

function uploadImage() {
	refImage = new SimpleImage(imgDOM);
	refImage.drawTo(canvas);
}

function getPercentage(number) {
	return ((number / 100) * 40) - number;
}

function detect() {
	const newLength = getPercentage(refImage.toArray().length);
	const arrayOfPixels = [...refImage.toArray()]/* .slice(newLength) */;
	const imageDimensions = {
		w: refImage.getWidth(),
		h: refImage.getHeight()
	};

	console.log(imageDimensions)

	let possiblePlaca = [];

	let scanlines = [...Array(placaHeight.b / 2)]/* .map(() => {
		return new Array();
	});*/

	let maxRange = 30;
	let range = 0;

	for (let index = 0; index < arrayOfPixels.length; index++) {
		if (index % imageDimensions.w === 0) {
			index += imageDimensions.w;
			continue;
		}

		const prevPixel = arrayOfPixels[index - 1];
		const pixel = arrayOfPixels[index];
		const color = pixel.getRed();

		possiblePlaca.push(pixel);

		if (prevPixel && !prevPixel.equals(pixel)) {
			range = 0;
		} else {
			range++;
		}

		if (range > maxRange) {
			if (placaWidth.a <= possiblePlaca.length <= placaWidth.b) {
				//scanlines.push(possiblePlaca);
				console.log(possiblePlaca)

				ctx.beginPath();
				ctx.strokeStyle = 'rgb(255, 0, 0)';
				ctx.moveTo(possiblePlaca[0].getX(), possiblePlaca[0].getY());
				ctx.lineTo(possiblePlaca[30].getX(), possiblePlaca[30].getY());
				ctx.stroke();
				
				
				break;
			} else {
				possiblePlaca = [];
			}
		}
	}


	/* const white = arr.filter(color => color === 255).length;
	const black = arr.filter(color => color === 0).length;
	const diff = (Math.abs(white - black));

	console.log(arr)
	console.log({ white, black, diff, total: arr.length }); */

}

function grayScaleMatrix() {
	const arrayOfPixels = refImage.toArray();
	arrayOfPixels.forEach((pixel, index) => {
		//if (index >= (arrayOfPixels.length - newLength)) {
		let avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;

		pixel.setRed(avg);
		pixel.setGreen(avg);
		pixel.setBlue(avg);
	});

	refImage.drawTo(canvas);
}

function thresholding() {
	const arrayOfPixels = refImage.toArray();
	arrayOfPixels.forEach(pixel => {
		const avg = pixel.getRed();

		if (avg >= T) {
			pixel.setRed(0);
			pixel.setGreen(0);
			pixel.setBlue(0)
		} else {
			pixel.setRed(255);
			pixel.setGreen(255);
			pixel.setBlue(255)
		}
	});

	refImage.drawTo(canvas);
}

