const { saveToCsv } = require("./csvHandler");

async function scrapeProductPage(page, url, pageNum = 1) {
  await page.goto(`${url}?pageNum=${pageNum}`);

  console.log(`Scraping ${url} - page ${pageNum}...`);

  try {
    await page.waitForSelector(".cItemsContainer");

    const products = await page.evaluate(() => {
      const productContainers = document.querySelectorAll(
        ".cItemsContainer > div"
      );
      const products = [];

      for (const productElement of productContainers) {
        const titleElement = productElement.querySelector(".cItemTitle");
        const priceElement = productElement.querySelector(".cItemPrice");
        const itemTypeElement = productElement.querySelector(".cItemType");
        const imgElement = productElement.querySelector(".cItemImage");

        const title = titleElement.textContent.trim();
        const price = priceElement.textContent.trim();
        const itemType = itemTypeElement ? itemTypeElement.textContent.trim() : '';
        const image = imgElement.src;

        products.push({ title, price, itemType, image });
      }

      return products;
    });

    // Save products to CSV file
    await saveToCsv(products, url);
  } catch (error) {
    console.error("Error scraping:", error.message);
  }
}

async function getLastPageNumber(page, url) {
    try {
      await page.goto(`${url}`);
  
      // get second to last child because last is Next Page
      const lastPageNumber = await page.$eval(
        'a[href*="pageNum"]:nth-last-child(2)',
        (link) => {
          const href = link.getAttribute("href");
          const match = href.match(/\?pageNum=(\d+)/);
          if (match) {
            return parseInt(match[1]);
          }
          return 1; // Return 1 as the default value if no last page link is found
        }
      );
  
      return lastPageNumber;
    } catch (error) {
      throw new Error("Error getting last page number: " + error.message);
    } finally {
      await page.close(); // Close the page after getting the last page number
    }
  }

module.exports = {
  scrapeProductPage,
  getLastPageNumber
};
