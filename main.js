const { scrapeProductPage, getLastPageNumber } = require("./scraping");
const puppeteer = require("puppeteer");
const getConfig = require("./config");

async function initBrowser() {
  try {
    browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium-browser",
    });
    return browser;
  } catch (error) {
    throw new Error("Error initializing the browser: " + error.message);
  }
}

async function main() {
  console.time("Total scraping time");

  try {
    const config = await getConfig();

    let endPage = config.END_PAGE;
    const browser = await initBrowser();

    const websites = config.ALL_WEBSITES
    for (const url of websites) {
      console.time(`Scraping time for ${url}`);
      const page = await browser.newPage();
      if (!endPage || endPage == -1) {
        endPage = await getLastPageNumber(page, url);
      }
      const scrapePromises = [];
      for (let pageNum = 1; pageNum <= endPage; pageNum++) {
        const page = await browser.newPage();
        const scrapePromise = scrapeProductPage(page, url, pageNum);
        scrapePromises.push(scrapePromise);

        // If the number of concurrent promises reaches the limit, wait for them to resolve before adding more
        if (scrapePromises.length >= config.MAX_CONCURRENT_PAGES) {
          await Promise.all(scrapePromises);
          scrapePromises.length = 0; // Clear the array to start a new batch of concurrent promises
        }
      }

      // Wait for the remaining promises to resolve
      await Promise.all(scrapePromises);
      console.timeEnd(`Scraping time for ${url}`);
    }
  } catch (error) {
    console.error("Error scraping:", error.message);
  } finally {
    // Ensure the browser is closed after all scraping tasks are done
    if (browser) {
      await browser.close();
    }
    console.timeEnd("Total scraping time");
  }
}

main();
