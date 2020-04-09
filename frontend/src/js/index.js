let productCashed;
window.addEventListener('load', function () {
  let selectedDeviceId;
  const codeReader = new ZXing.BrowserBarcodeReader();
  const barcodeDecoder = document.querySelector('.barcode-decoder');
  const resultContainer = document.querySelector('.result');
  const wardrobe = document.querySelector('.wardrobe');
  const openWardrobeBtn = document.getElementById('openWardrobe');

  openWardrobeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    wardrobe.classList.remove('is-hide');
    barcodeDecoder.classList.add('is-result');
  });

  codeReader.getVideoInputDevices()
    .then((videoInputDevices) => {
      const sourceSelect = document.getElementById('sourceSelect');

      selectedDeviceId = videoInputDevices[0].deviceId;
      if (videoInputDevices.length > 1) {
        videoInputDevices.forEach((element) => {
          const sourceOption = document.createElement('option');
          sourceOption.text = element.label;
          sourceOption.value = element.deviceId;
          sourceSelect.appendChild(sourceOption);
        });

        sourceSelect.onchange = () => {
          selectedDeviceId = sourceSelect.value;
        };

        const sourceSelectPanel = document.getElementById('sourceSelectPanel');
        sourceSelectPanel.style.display = 'block';
      }

      document.getElementById('startButton').addEventListener('click', () => {

        barcodeDecoder.classList.remove('is-result');
        barcodeDecoder.classList.add('is-camera');
        resultContainer.innerHTML = '';

        codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video').then( async (result) => {
          barcodeDecoder.classList.remove('is-camera');
          barcodeDecoder.classList.add('is-processing');

          const response = await fetch(`api/barcode/${result.text}`).then((response) => response.json());
          productCashed = response.data;
          insertIntoDOM(response.data, resultContainer);
          codeReader.reset();

          barcodeDecoder.classList.remove('is-processing');
          barcodeDecoder.classList.add('is-result');
        }).catch((err) => {
          console.error(err);
          document.getElementById('result').textContent = err;
        });
      });
    })
    .catch((err) => {
      console.error(err)
    })
});

function insertIntoDOM(data, container) {

  const products = data.products;

  products.forEach((p) => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');
    const image = document.createElement('img');
    image.src = p.images[0];
    imageContainer.appendChild(image);

    const productInfo = document.createElement('div');
    productInfo.className = 'info';

    const productName = document.createElement('h1');
    productName.className = 'name';
    productName.textContent = p.product_name;
    productInfo.appendChild(productName);

    const barcode = document.createElement('p');
    barcode.textContent = p.barcode_number;
    barcode.className = 'barcode';
    productInfo.appendChild(barcode);

    const brand = document.createElement('p');
    brand.textContent = p.brand;
    brand.className = 'brand';
    productInfo.appendChild(brand);

    const category = document.createElement('div');
    category.textContent = p.category;
    category.className = 'category';
    productInfo.appendChild(category);

    const description = document.createElement('div');
    description.textContent = p.description;
    description.className = 'description';
    productInfo.appendChild(description);

    const attributes = document.createElement('div');
    attributes.className = 'attributes';

    const getAttribute = (name, prod) => {
      const attr = document.createElement('p');
      attr.className = name;
      attr.textContent = `${name.toUpperCase()}: ${prod[name]}`;
      return attr;
    };

    if (p.size) {
      attributes.appendChild(getAttribute('size', p));
    }

    if (p.color) {
      attributes.appendChild(getAttribute('color', p));
    }

    if (p.height) {
      attributes.appendChild(getAttribute('height', p));
    }

    if (p.length) {
      attributes.appendChild(getAttribute('length', p));
    }

    if (p.weight) {
      attributes.appendChild(getAttribute('weight', p));
    }

    if (p.width) {
      attributes.appendChild(getAttribute('width', p));
    }

    productInfo.appendChild(attributes);

    productDiv.appendChild(imageContainer);
    productDiv.appendChild(productInfo);
    productDiv.appendChild(getProductBtns());

    container.appendChild(productDiv);
  });
}

function getProductBtns() {
  const container = document.createElement('div');
  container.className = 'product-btns';

  const buttonAdd = document.createElement('button');
  buttonAdd.type = 'button';
  buttonAdd.className = 'btn';
  buttonAdd.textContent = '+ Add to my Wardrobe';
  buttonAdd.onclick = addProduct;

  const buttonDelete = document.createElement('button');
  buttonDelete.type = 'button';
  buttonDelete.className = 'btn';
  buttonDelete.textContent = 'Remove';
  buttonDelete.onclick = deleteProduct;

  container.appendChild(buttonAdd);
  container.appendChild(buttonDelete);

  return container;
}

async function addProduct() {
  if (productCashed) {
    await fetch(`api/barcode`, {
      method: 'POST',
      body: JSON.stringify(productCashed)
    });

  }
}

async function deleteProduct(id) {
  console.log('********* - 184', id)
  // await fetch(`api/barcode/${id}`, {
  //   method: 'DELETE',
  //   body: JSON.stringify(productCashed)
  // });
}