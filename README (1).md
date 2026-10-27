# ProofCheck

ProofCheck is a small website that helps people check suspicious messages before they trust them. You paste a job offer, a shopping deal or a payment request, and the page highlights phrases that look risky, explains why they matter, and lists what to verify next.

Everything runs in the browser. The text you paste is never sent anywhere.

## Files

- `index.html` – the page and all its content
- `style.css` – layout, colors, light and dark theme
- `script.js` – the checker (rules, scoring, report) and the theme button
- `LICENSE` – public domain, no rights reserved

## Running it

No build step and no dependencies. Open `index.html` in a browser, or upload the four files to any static host (Netlify, GitHub Pages and so on). Keep them in the same folder.

The page loads three fonts from Google Fonts (Bricolage Grotesque, Instrument Sans, IBM Plex Mono). They are open source under the SIL Open Font License. Offline, the browser falls back to system fonts and everything still works.

## How the checker works

`script.js` has a list called `RULES`. Each rule has a label, a weight, one or more regular expressions, a short explanation and a suggested check. The message is matched against every rule, overlapping matches are merged for highlighting, and the weights are added up to give one of four levels.

To add or change a signal, edit an entry in `RULES`. English and Roman Urdu patterns live side by side in the same rule.

## Limits

This is a prototype built on simple text rules. It can miss scams, and honest messages can trigger warnings. A flag means "check this", not "this is fake". It is an educational tool and does not guarantee that anything is authentic.

## License

Public domain (Unlicense). Use it, change it, sell it, no credit needed.
