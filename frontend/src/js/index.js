
window.addEventListener('load', function () {
  let selectedDeviceId;
  const codeReader = new ZXing.BrowserBarcodeReader();
  const btnContainer = document.querySelector('.button-container');
  const cameraContainer = document.getElementById('camera-container');

  console.log('ZXing code reader initialized');
  codeReader.getVideoInputDevices()
    .then((videoInputDevices) => {
      const sourceSelect = document.getElementById('sourceSelect');
      console.log('********* - 9', videoInputDevices);
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
        cameraContainer.classList.add('is-show');
        btnContainer.classList.add('is-hide');

        codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video').then((result) => {
          console.log(result);
          document.getElementById('result').textContent = result.text;
          fetch(`api/barcodes/${result.text}`).then((response) => {
            console.log('line: 38 ---->', response);
          })
        }).catch((err) => {
          console.error(err);
          document.getElementById('result').textContent = err;
        });
        console.log(`Started continous decode from camera with id ${selectedDeviceId}`)
      });

      document.getElementById('resetButton').addEventListener('click', () => {
        document.getElementById('result').textContent = '';
        codeReader.reset();
        console.log('Reset.');
      });

    })
    .catch((err) => {
      console.error(err)
    })
})