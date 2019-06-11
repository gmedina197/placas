const imgDOM = document.getElementById("picField");
const canvas = document.getElementById("canvas");
const minor = document.getElementById('37');
const major = document.getElementById('185');
const form = document.getElementById('form');

const setValueT = () => minor.checked ? 37 : 185;
let T = setValueT();

let refImage;

function uploadImage() {
	refImage = new SimpleImage(imgDOM);
	refImage.drawTo(canvas);
}

function run() {
	grayScaleMatrix();
	thresholding();
	histogram();
}

function histogram() {
	const arrayOfPixels = refImage.toArray();

	arrayOfPixels.forEach(pixel => {
		

	});
}

function grayScaleMatrix() {
	const arrayOfPixels = refImage.toArray();

	arrayOfPixels.forEach(pixel => {
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

form.addEventListener('change', () => T = setValueT());
