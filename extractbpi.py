import asyncio
import csv
import json
from pydantic import BaseModel, Field
from typing import List, Optional
from crawl4ai import (
    AsyncWebCrawler,
    BrowserConfig,
    CacheMode,
    CrawlerRunConfig,
    LLMExtractionStrategy,
    LLMConfig,
)

# -------------------- CONFIG --------------------
LLM_MODEL = "ollama/mistral"  # use the local Ollama mistral model
API_TOKEN = "none"  # no token needed for local Ollama
TARGET_URL = "https://www.bpifrance.fr/"
CSS_SELECTOR = "article, section, div, ul, li"

SCRAPER_INSTRUCTIONS = (
    "À partir du contenu de cette page web, extrais toutes les informations disponibles correspondant aux catégories suivantes : "
    "- Secteur (NAF/APE) : Domaine d’activité de l’entreprise\n"
    "- Produits / services : Nom et description des offres principales\n"
    "- Clients ou partenaires majeurs : Noms et rôles\n"
    "- Actualités/projets en cours : Titre, résumé, date, lien\n"
    "- Chiffre d'affaires estimé (CA estimé)\n"
    "- Effectif : Nombre d’employés\n"
    "- Localisation : Pays, régions ou villes\n"
    "- Profil LinkedIn du responsable client\n"
    "- Historique de la relation avec Talan (si disponible)\n"
    "- Concurrents de Talan sur ce projet (noms)\n"
    "Fournis les données sous forme structurée, même s’il manque certains champs."
)

# -------------------- DATA MODEL --------------------


class CompanyInfo(BaseModel):
    secteur: Optional[str] = Field(None, description="Secteur (NAF/APE)")
    produits_services: Optional[str] = Field(
        None, description="Produits / services")
    clients_partners: Optional[str] = Field(
        None, description="Clients ou partenaires majeurs")
    actualites_projets: Optional[str] = Field(
        None, description="Actualités/projets en cours")
    ca_estime: Optional[str] = Field(None, description="CA estimé")
    effectif: Optional[str] = Field(None, description="Effectif")
    localisation: Optional[str] = Field(
        None, description="Localisation (pays / régions)")
    linkedin_responsable: Optional[str] = Field(
        None, description="Profil LinkedIn responsable client")
    historique_talan: Optional[str] = Field(
        None, description="Historique relation avec Talan (si CRM)")
    concurrents_talan: Optional[str] = Field(
        None, description="Concurrent de Talan sur ce projet")

# -------------------- UTILS --------------------


def save_data_to_csv(records: list, data_struct: BaseModel, filename: str):
    if not records:
        print("No records to save.")
        return
    fieldnames = list(data_struct.model_fields.keys())
    with open(filename, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        for record in records:
            clean_record = {k: v for k, v in record.items() if k in fieldnames}
            writer.writerow(clean_record)
    print(f"✅ Saved {len(records)} records to '{filename}'.")

# -------------------- MAIN --------------------


async def scrape_company():
    browser_config = BrowserConfig(
        browser_type="chromium", headless=True, verbose=True)

    llm_strategy = LLMExtractionStrategy(
        llm_config=LLMConfig(provider=LLM_MODEL, api_token=API_TOKEN),
        schema=json.dumps(CompanyInfo.model_json_schema()),
        extraction_type="schema",
        instruction=SCRAPER_INSTRUCTIONS,
        input_format="markdown",
        chunk_token_threshold=400,
        overlap_rate=0.1,
        verbose=True,
    )

    async with AsyncWebCrawler(config=browser_config) as crawler:
        print(f"🔍 Crawling {TARGET_URL} ...")
        result = await crawler.arun(
            url=TARGET_URL,
            config=CrawlerRunConfig(
                cache_mode=CacheMode.BYPASS,
                extraction_strategy=llm_strategy,
                css_selector=CSS_SELECTOR,
                session_id="company_info_session",
            ),
        )

        if not result.success or not result.extracted_content:
            print(f"❌ Error: {result.error_message}")
            return

        try:
            extracted_data = json.loads(result.extracted_content)
            print("✅ Extracted Data:\n", json.dumps(
                extracted_data, indent=2, ensure_ascii=False))
            save_data_to_csv([extracted_data], CompanyInfo, "company_info.csv")
        except Exception as e:
            print(f"⚠️ JSON decoding failed: {e}")

# -------------------- RUN --------------------

if __name__ == "__main__":
    asyncio.run(scrape_company())
