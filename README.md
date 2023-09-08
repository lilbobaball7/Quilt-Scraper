# Quilt - web scraping fabric

Quilt is a simple web scraping tool built with Node.js that allows you to extract data from multiple websites that use "Website Design by Like Sew" concurrently and save the results to CSV files. It uses Puppeteer for web scraping and can be easily configured to scrape data from a list of websites. 


## Setup
1. Install npm
2. Run: `npm init -y`
3. If you encounter issues with Puppeteer dependencies run: `sudo apt-get install chromium-browser`

## Run 
To start scraping data from websites using Quilt, follow these steps:

1. Define the list of website URLs you want to scrape in a text file. Each URL should be on a new line in the file. Set the path to this file in the `.env` file by assigning the `WEBSITE_URLS_FILE` variable. The websites probably have to end in `fabric.htm`. 

2. Optionally, you can set the `MAX_CONCURRENT_PAGES` variable in the `.env` file to control the number of pages to be scraped concurrently. The default value is 5. `END_PAGE` can be set to set the number of pages to scrape for each website. If it is -1 then it will try to find the last page and keep scraping until it hits the last page.

3. Run the main scraping script with the following command: `node main.js`

4. The script will start scraping the websites one by one, and the progress will be displayed in the console. Once the process is completed, the scraped data will be saved to separate CSV files for each website.
