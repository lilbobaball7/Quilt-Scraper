const fs = require("fs");
const path = require("path");

// Function to generate a CSV filename from the URL
function generateCsvFilename(url) {
  // Find the position of "www" and ".com" in the URL
  const wwwIndex = url.indexOf("www");
  const comIndex = url.indexOf(".com");

  // Extract the part of the URL between "www" and ".com"
  const filename = url.slice(wwwIndex + 4, comIndex);

  // Normalize the filename to remove any invalid characters
  return path.normalize(filename + ".csv");
}

async function saveToCsv(products, url) {
  try {
    let csvData = "";

    for (const product of products) {
      const productValues = Object.values(product).join(",");
      csvData += `${productValues}\n`;
    }

    const filename = generateCsvFilename(url);

    await fs.promises.appendFile(filename, csvData);
  } catch (error) {
    throw new Error("Error appending to CSV file: " + error.message);
  }
}

module.exports = {
  saveToCsv,
};
