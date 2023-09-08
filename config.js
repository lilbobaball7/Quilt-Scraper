const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const WEBSITE_URLS_FILE = process.env.WEBSITE_URLS_FILE;

async function loadWebsiteURLsFromFile() {
  if (!WEBSITE_URLS_FILE) {
    throw new Error(
      "WEBSITE_URLS_FILE is not specified in the environment variables."
    );
  }

  const absUrlsFilePath = path.resolve(__dirname, WEBSITE_URLS_FILE);
  try {
    const content = await fs.promises.readFile(absUrlsFilePath, "utf-8");
    return content.split("\n").filter((line) => line.trim() !== "");
  } catch (error) {
    throw new Error("Error loading website URLs from file: " + error.message);
  }
}

async function getConfig() {
  return {
    MAX_CONCURRENT_PAGES: process.env.MAX_CONCURRENT_PAGES || 1,
    ALL_WEBSITES: await loadWebsiteURLsFromFile(),
    END_PAGE: process.env.END_PAGE,
  };
}

module.exports = getConfig;