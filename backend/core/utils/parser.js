const puppeteer = require('puppeteer');

async function scrape(url) {
  console.log('********* - 4', url)
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/usr/bin/google-chrome',
    args: ['--user-data-dir=/home/imac/.config/google-chrome']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 780 });
  await page.setRequestInterception(true);

  // clear from images, styles and fonts
  page.on('request', (req) => {
    if (req.resourceType() === 'image' || req.resourceType() === 'stylesheet' || req.resourceType() === 'font') {
      req.abort();
    }
    else {
      req.continue();
    }
  });

  await page.goto(url).catch((err) => console.error('********* - 21', err));
  await page.waitFor(1000000);
  await page.screenshot({path: 'google.png'});

  // const data = await page.evaluate(() => {
  //   console.log('********* - 23', document);
  //   const cl = document.querySelectorAll('a');
  //   console.log('********* - 26', cl)
  //
  //   return document;

    // const bodyContainer = document.getElementById('body-container');
    // const images = bodyContainer.getElementById('images');
    // const productMetaDataContainer = document.querySelector('.product-content-background');
    // console.log('********* - 35', bodyContainer)
    //
    // return {
    //   // name: bodyContainer.querySelector('.product-details > h4').textContent,
    //   // category: bodyContainer.querySelector('.product-details > .row > .col-md-12 > .row:nth-child(2) .product-text').textContent,
    //   // manufacturer: bodyContainer.querySelector('.product-details > .row > .col-md-12 > .row:nth-child(3) .product-text').textContent,
    //   // attributes: productMetaDataContainer.querySelector('.row:nth-child(2) .product-text').textContent,
    //   // description: querySelector('.row:nth-child(1) .product-text').textContent,
    //   // imgUrl: images.firstChild.src,
    // }
  // });

  await browser.close();

  return { data: 'test' };
}


module.exports = scrape;