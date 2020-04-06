const puppeteer = require('puppeteer');

async function scrape(url) {
  const browser = await puppeteer.launch({headless: true});
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

  await page.goto(url);

  const data = await getDataFromPage(page);

  browser.close();

  return data;
}

async function getDataFromPage(page) {
  return await page.evaluate(() => {

    const bodyContainer = document.getElementById('body-container');
    const images = bodyContainer.getElementById('images');
    const productMetaDataContainer = document.querySelector('.product-content-background');

    return {
      name: bodyContainer.querySelector('.product-details > h4').textContent,
      category: bodyContainer.querySelector('.product-details > .row > .col-md-12 > .row:nth-child(2) .product-text').textContent,
      manufacturer: bodyContainer.querySelector('.product-details > .row > .col-md-12 > .row:nth-child(3) .product-text').textContent,
      attributes: productMetaDataContainer.querySelector('.row:nth-child(2) .product-text').textContent,
      description: querySelector('.row:nth-child(1) .product-text').textContent,
      imgUrl: images.firstChild.src,
    }
  });
}


module.exports = scrape;