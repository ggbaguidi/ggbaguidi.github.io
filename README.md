# Ahonakpon Guy Gbaguidi — Personal Website

A lightweight, single-page academic portfolio styled as a Linux terminal. It presents robotics, AI research, software engineering, and community work.

## Run locally

This site has no build step. From the project root, run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Structure

- `index.html` — biography, news, publication, projects, experience, skills, and contact
- `style.css` — responsive terminal layout and dark/light palettes
- `script.js` — terminal commands, theme, mobile navigation, section state, and BibTeX interactions
- `data/portrait.webp` — optimized profile image
- `data/Ahonakpon_Gbaguidi_CV.pdf` — current CV
- `data/fonts/` — self-hosted MathJax fonts and their license

The former page URLs remain as small redirects to their matching sections so existing links continue to work.

## Terminal commands

Use the prompt near the top of the page to enter `help`, `ls`, `pwd`, `whoami`, a section name (such as `research` or `projects`), `cat <section>.txt`, `cd <section>`, `cv`, `github`, `email`, `theme`, or `clear`. The page remains fully navigable through links without using the prompt.
