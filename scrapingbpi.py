from urllib.parse import urljoin
import logging
import json
from crawl4ai import AsyncWebCrawler, CacheMode, BrowserConfig, CrawlerRunConfig
import nest_asyncio
import asyncio

# Apply nest_asyncio for environments like Jupyter
nest_asyncio.apply()

# Set up logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Function to clean extracted text


def clean_text(text):
    return ' '.join(text.strip().split()) if text else "Not found"


# Define extraction strategies for requested data points
EXTRACTION_STRATEGIES = [
    {
        "name": "Secteur (NAF/APE)",
        "css_selector": "div.company-info .sector, .industry",  # Adjust based on website
        "post_process": clean_text
    },
    {
        "name": "Produits / services",
        "css_selector": "div.products-services, .offerings",  # Adjust based on website
        "post_process": clean_text
    },
    {
        "name": "Clients ou partenaires majeurs",
        "css_selector": "div.clients, .partners",  # Adjust based on website
        "post_process": clean_text
    },
    {
        "name": "Actualités/projets en cours",
        "css_selector": "div.news, .projects",  # Adjust based on website
        "post_process": clean_text
    },
    {
        "name": "CA estimé",
        "css_selector": "div.financials .revenue",  # Adjust based on website
        "post_process": clean_text
    },
    {
        "name": "Effectif",
        "css_selector": "div.company-info .employees",  # Adjust based on website
        "post_process": clean_text
    },
    {
        "name": "Localisation (pays / régions)",
        "css_selector": "div.contact .location, .address",  # Adjust based on website
        "post_process": clean_text
    },
    {
        "name": "Profil LinkedIn responsable client",
        "css_selector": "a[href*='linkedin.com']",  # Extract LinkedIn link
        "post_process": lambda x: urljoin("https://www.talan.com", x) if x else "Not found"
    },
    {
        "name": "Historique relation avec Talan",
        "css_selector": "div.crm-data .talan-relation",  # Adjust based on website
        "post_process": clean_text
    },
    {
        "name": "Concurrent de Talan sur ce projet",
        "css_selector": "div.competitors .talan-competitor",  # Adjust based on website
        "post_process": clean_text
    }
]


async def main():
    # Initialize data dictionary
    data = {strategy["name"]: "Not found" for strategy in EXTRACTION_STRATEGIES}

    # Create an instance of AsyncWebCrawler
    async with AsyncWebCrawler() as crawler:
        try:
            # Run the crawler on the target URL with extraction strategies
            result = await crawler.arun(
                url="https://www.talan.com/global/fr",
                bypass_cache=True,  # Equivalent to CacheMode.BYPASS
                headless=True,      # Run browser in headless mode
                wait_until="networkidle",  # Wait until network is idle
                timeout=60000,      # Timeout in milliseconds (60 seconds)
                extraction_strategies=EXTRACTION_STRATEGIES
            )

            # Process extracted content
            for item in result.extracted_content:
                data[item["name"]] = item["content"] if item["content"] else "Not found"

            # Log and save results
            logger.info("Scraping completed successfully")
            with open('company_data.json', 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=4)

            # Print the extracted content
            print(json.dumps(data, indent=4, ensure_ascii=False))

        except Exception as e:
            logger.error(
                f"Error scraping https://www.talan.com/global/fr: {e}")
            data["error"] = f"Failed to scrape website: {e}"
            print(json.dumps(data, indent=4, ensure_ascii=False))

# Run the async main function
if __name__ == "__main__":
    asyncio.run(main())
