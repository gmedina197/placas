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
  thresholding();
  detect();
}

function uploadImage() {
  refImage = new SimpleImage(imgDOM);
  refImage.drawTo(canvas);
}

function getPercentage(number) {
  const percent = (number / 100) * 40;
  return percent - number;
}

function paintPixel(x, y) {
  ctx.fillStyle = 'rgb(255,  0, 0)';
  ctx.fillRect(x, y, 1, 1);
}

function detect() {
  const newLength = getPercentage(refImage.toArray().length);
  const arrayOfPixels = [...refImage.toArray()].slice(newLength);
  const imageMatrix = [];
  const imageDimensions = {
    w: refImage.getWidth(),
    h: refImage.getHeight()
  };

  console.log(imageDimensions)

  while (arrayOfPixels.length) {
    imageMatrix.push(arrayOfPixels.splice(0, imageDimensions.w));
  }

  const maxRange = 40;
  let possiblePlaca = [];

  for (let y = 0; y < imageMatrix.length; y += 2) {
    let scanline = [];
    let range = 0;
    let arr = [];
    let arrAux = [];

    for (let x = 0; x < imageDimensions.w; x++) {
      const pixel = imageMatrix[y][x];
      const prevPixel = imageMatrix[y][x - 1];

      const isDiff = prevPixel && !pixel.equals(prevPixel);
      if (isDiff) {
        arr[x] = -1;
      } else {
        arr[x] = pixel;
      }
    }

    for (let x = imageDimensions.w / 2; x > 0; x--) {
      const color = typeof arr[x] === "number" ? arr[x] : arr[x].getRed();

      if (color === -1) {
        if (range <= maxRange) {
          for (let j = 0; j < arrAux.length; j++) {
            paintPixel(arrAux[j].getX(), arrAux[j].getY());
            scanline.push(arrAux[j]);
          }
        } else {
          possiblePlaca.push(scanline); //referencia o array de baixo, visto que é o mesmo
          break;
        }
        arrAux = [];
        range = 0;
      } else {
        arrAux.push(arr[x]);
        range++;
      }
    }

    range = 0;
    arrAux = [];

    for (let x = (imageDimensions.w / 2) + 1; x < imageDimensions.w; x++) {
      const color = typeof arr[x] === "number" ? arr[x] : arr[x].getRed();

      if (color === -1) {
        if (range <= maxRange) {
          for (let j = 0; j < arrAux.length; j++) {
            paintPixel(arrAux[j].getX(), arrAux[j].getY());
            scanline.push(arrAux[j]);
          }
        } else {
          break;
        }
        arrAux = [];
        range = 0;
      } else {
        arrAux.push(arr[x]);
        range++;
      }
    }
  }

  for (let i = possiblePlaca.length - 1; i >= 0; i--) {
    const placaArray = possiblePlaca[i];
    
    console.log(placaArray)


  }

}

function thresholding() {
  const arrayOfPixels = refImage.toArray();
  arrayOfPixels.forEach(pixel => {
    let avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;

    if (avg >= T) {
      pixel.setAllColor(0);
    } else {
      pixel.setAllColor(255);
    }
  });

  refImage.drawTo(canvas);
}

