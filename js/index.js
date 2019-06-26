const imgDOM = document.getElementById("picField");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const minor = document.getElementById('37');
const major = document.getElementById('185');
const form = document.getElementById('form');

const placaWidth = {
  a1: 125,
  a: 65,
  b: 200
};

const placaHeight = {
  a: 35,
  b: 60
};

const setValueT = () => minor.checked ? 37 : 185;

let T = setValueT();
let refImage, originalImage;

//Event listeners
form.addEventListener('change', () => T = setValueT());

//functions
function run() {
  thresholding();
  detect();
}

function uploadImage() {
  refImage = new SimpleImage(imgDOM);
  originalImage = new SimpleImage(imgDOM);
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
            //paintPixel(arrAux[j].getX(), arrAux[j].getY());
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

    scanline.reverse();
    range = 0;
    arrAux = [];

    for (let x = (imageDimensions.w / 2) + 1; x < imageDimensions.w; x++) {
      const color = typeof arr[x] === "number" ? arr[x] : arr[x].getRed();

      if (color === -1) {
        if (range <= maxRange) {
          for (let j = 0; j < arrAux.length; j++) {
            //paintPixel(arrAux[j].getX(), arrAux[j].getY());

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

    if (scanline.length > placaWidth.a && y < (imageMatrix.length / 100) * 80) {
      const newScanline = scanline.filter(pixel => {
        const between = 140 < pixel.getX() && pixel.getX() < 340;
        if (between) {
          //paintPixel(pixel.getX(), pixel.getY());
          return true;
        } else {
          return false;
        }
      });

      possiblePlaca.push(newScanline); //referencia o array de baixo, visto que é o mesmo
    } else {
      possiblePlaca.push([]);
    }
  }
  console.log(possiblePlaca)
  let count = 0;
  const minCount = 7;
  for (let i = possiblePlaca.length - 1; i >= 0; i--) {
    const arrPixels = possiblePlaca[i];

    if (arrPixels.length === 0) {
      if (count < minCount) {
        possiblePlaca.splice(i, count + 1);
      }
      count = 0;
    } else {
      count++;
    }

    if (count >= minCount) {
      break;
    }
  }


  let placa = [];
  for (let i = possiblePlaca.length - 1; i >= 0; i--) {
    const arrPixels = possiblePlaca[i];

    if (arrPixels.length === 0) {
      break;
    } else {
      placa.push(arrPixels);
    }
  }

  placa.reverse();


  const media = placa.reduce((acumm, atual) => acumm + atual.length, 30) / placa.length;

  originalImage.drawTo(canvas);

  ctx.strokeStyle = 'rgb(255,  0, 0)';
  ctx.strokeRect(placa[0][0].getX() - 10, placa[0][0].getY() - 10, media + 25, (placa.length * 2) + 20);

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

