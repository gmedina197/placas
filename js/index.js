const imgDOM = document.getElementById("picField");
const canvas = document.getElementById("canvas");
let refImage;

function uploadImage() {
    refImage = new SimpleImage(imgDOM);
    refImage.drawTo(canvas);
}

function run() {
    grayScaleMatrix();

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
