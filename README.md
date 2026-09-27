# BioDiscovery Lab

A lightweight bioinformatics research and discovery web app for exploring genes, prioritizing targets, and identifying potential therapeutic leads.

## Features

- Paste or upload a list of genes or biomarkers
- Match genes to a biological discovery catalog
- View disease areas, pathways, target classes, and lead molecules
- Prioritize likely therapeutic targets with an evidence-based score
- Use built-in sample data to test the platform immediately

## Run locally

Open the project folder and start a local web server:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000/
```

## Files

- `index.html` – app layout
- `styles.css` – styling
- `app.js` – analysis logic
- `sample-data.csv` – example data

## Typical use cases

- Target discovery for omics studies
- Prioritizing biomarker lists by therapeutic relevance
- Reviewing pathways and candidate compounds
- Building a prototype research dashboard for bioinformatics teams

## Notes

This is a working prototype designed to demonstrate a real research workflow in a simple, accessible interface. It is intended for local use and further extension.
