# VoltFix Electronics - Sales & Service Website

Internship project: a responsive front end for an electronics sales and repair shop
that promises a technician at the customer's door within 30 minutes, within 20 km.

Built with plain HTML5, CSS3 and JavaScript. No frameworks, no build step.

## Files

| File         | Purpose                                          |
|--------------|--------------------------------------------------|
| `index.html` | Page structure and content                       |
| `style.css`  | All styling, colours are variables in `:root`    |
| `script.js`  | Menu, product filter, distance check, form logic |
| `images/`    | Put your own photos here (optional)              |

## How to run

Open `index.html` in any browser, or use the VS Code Live Server extension.

## How to change things

- **Shop name, phone, WhatsApp, radius:** edit the `SHOP` object at the top of `script.js`.
- **Images:** change the `src` of any `<img>` in `index.html`. Use a web link, or save a photo
  in `images/` and write `src="images/my-photo.jpg"`.
- **Colours:** edit the variables in `:root` at the top of `style.css`.
- **Products:** copy one `<article class="product-card">` block and edit it.

## Features

- Responsive layout (mobile, tablet, desktop) with mobile menu
- Hero banner and category cards with changeable images
- Product filter by category and WhatsApp enquiry button
- 20 km service-area checker
- Booking form with validation (rejects addresses beyond 20 km)
- Accessible: keyboard focus, skip link, reduced-motion support

## Publish on GitHub Pages

1. Push these files to a repository.
2. Go to Settings > Pages, choose the `main` branch and `/ (root)`.
3. Your site goes live at `https://<username>.github.io/<repo-name>/`.
