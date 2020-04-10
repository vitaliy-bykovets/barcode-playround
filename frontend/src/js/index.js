let productCashed;
const barcodeDecoder = document.querySelector('.barcode-decoder');
const barcodeDecoderMessage = barcodeDecoder.querySelector('.message');
const cameraBackBtn = barcodeDecoder.querySelector('#back');
const resultContainer = document.querySelector('.result');
const wardrobe = document.querySelector('.wardrobe');
const dresser = wardrobe.querySelector('.dresser');
const openWardrobeBtn = document.getElementById('openWardrobe');

window.addEventListener('load', function () {
  let selectedDeviceId;
  const codeReader = new ZXing.BrowserBarcodeReader();

  openWardrobeBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    wardrobe.classList.remove('is-hide');
    barcodeDecoder.classList.add('is-result');

    await getAndInsertProducts();
  });

  cameraBackBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    barcodeDecoder.classList.remove('is-camera', 'is-result', 'is-error', 'is-message');
    codeReader.reset();
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

        barcodeDecoder.classList.remove('is-result', 'is-error', 'is-message');
        barcodeDecoder.classList.add('is-camera');
        resultContainer.innerHTML = '';
        dresser.innerHTML = '';

        codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video').then( async (result) => {
          barcodeDecoder.classList.remove('is-camera');
          barcodeDecoder.classList.add('is-processing');

          const code = result.text;

          const response = await fetch(`api/barcode/${code}`).then((response) => response.json());

          if (!response.data.products) {
            barcodeDecoderMessage.querySelector('.message-code').textContent = code;
            barcodeDecoder.classList.add('is-message');
          } else {
            productCashed = response.data.products[0];
            insertIntoDOM(response.data, resultContainer);
          }

          codeReader.reset();

          barcodeDecoder.classList.remove('is-processing');
          barcodeDecoder.classList.add('is-result');
        }).catch((err) => {
          codeReader.reset();
          barcodeDecoder.classList.remove('is-result', 'is-processing');
          barcodeDecoder.classList.add('is-error');
          console.error('********* - 80', err)
        });
      });
    })
    .catch((err) => {
      console.error(err)
    })
});

function insertIntoDOM(data, container, isCreate = true) {

  let products = (data && data.products) || data;
  products = products.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  products.forEach((p) => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');
    const image = document.createElement('img');
    image.src = p.imgUrl || p.images[0];
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
    productDiv.appendChild(getProductBtns(p.id, isCreate));

    container.appendChild(productDiv);
  });
}

function getProductBtns(id = null, isCreate) {
  const container = document.createElement('div');
  container.className = 'product-btns';

  if (isCreate) {
    const buttonAdd = document.createElement('button');
    buttonAdd.type = 'button';
    buttonAdd.className = 'btn';
    buttonAdd.textContent = '+ Add to my Wardrobe';
    buttonAdd.onclick = addProduct;
    container.appendChild(buttonAdd);
  } else {
    const buttonDelete = document.createElement('button');
    buttonDelete.type = 'button';
    buttonDelete.className = 'btn';
    buttonDelete.textContent = 'Remove';
    buttonDelete.onclick = (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      deleteProduct(id)
        .then(async () => await getAndInsertProducts())
        .catch(() => {});
      
    };
    if (id) {
      buttonDelete.setAttribute('data-id', id);
    }

    container.appendChild(buttonDelete);
  }

  return container;
}

async function getAllProducts() {
  return await fetch(`api/product`).then((response) => response.json());
}

async function addProduct() {
  if (productCashed) {
    await fetch(`api/product`, {
      method: 'POST',
      body: JSON.stringify(productCashed)
    });
    resultContainer.innerHTML = '';
    wardrobe.classList.remove('is-hide');
    await getAndInsertProducts();
  }
}

async function deleteProduct(id) {
  await fetch(`api/product/${id}`, {
    method: 'DELETE',
  });
}

async function getAndInsertProducts() {
  dresser.innerHTML = '';
  const products = await getAllProducts();
  if (!products.data) {
    wardrobe.classList.add('is-empty');
  } else {
    wardrobe.classList.remove('is-empty');
  }

  insertIntoDOM(products.data, dresser, false);
}
