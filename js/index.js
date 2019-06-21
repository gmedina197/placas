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
	const percent = (number / 100) * 40;
	return [percent, percent - number];
}

function detect() {
	const [percent, newLength] = getPercentage(refImage.toArray().length);
	const arrayOfPixels = [...refImage.toArray()]/* .slice(newLength) */;
	const imageMatrix = [];
	const imageDimensions = {
		w: refImage.getWidth(),
		h: refImage.getHeight()
	};

	while (arrayOfPixels.length) {
		imageMatrix.push(arrayOfPixels.splice(0, imageDimensions.w));
	}

	let possiblePlaca = [];
	const maxRange = 40;

	for (let y = 0; y < imageDimensions.h; y += 2) {
		let scanline = [];
		let addTo = false;
		let range = 0;

		for (let x = 0; x < imageDimensions.w; x++) {
			const pixel = imageMatrix[y][x];
			const prevPixel = imageMatrix[y][x - 1];

			const isDiff = prevPixel && !pixel.equals(prevPixel);
			if (isDiff && range < maxRange/*  || addTo */) {
				addTo = true;
				range = 0;
			} else {
				addTo = false;
				range++;
			}

			if (addTo) {
				scanline.push(pixel);
			}
		}

		if (scanline.length > 0) {
			//possiblePlaca.push(scanline);
			ctx.beginPath();
			ctx.strokeStyle = 'rgb(255, 0, 0)';
			ctx.moveTo(scanline[0].getX(), scanline[0].getY());
			ctx.lineTo(
				scanline[scanline.length - 1].getX(),
				scanline[scanline.length - 1].getY()
			);
			ctx.stroke();
		}
	}

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

