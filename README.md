# Shane Musseau | Motion Design Portfolio

Static portfolio site. Plain HTML, CSS and JavaScript, no build step and no Figma dependency. Hosted free on GitHub Pages.

## Pages
- `index.html`: Home (hero, featured work, services)
- `work.html`: Project carousel plus Recent Projects grid
- `about.html`: Bio, skills, stats, values
- `testimonials.html`: LinkedIn recommendations
- `contact.html`: Contact form and info

## Editing
- **Text:** open the page's `.html` file and change the words.
- **Add a project:** copy one `<article class="slide">` block in `work.html` and swap the YouTube ID (the part after `youtu.be/`) in all three places. Add a matching tile under `class="recent"`. Thumbnails load from YouTube automatically.
- **Styling:** `assets/styles.css`. Brand colors are at the top (`--cyan`, `--blue`, `--purple`).
- **About photo:** replace `assets/about.jpg`.

## Contact form
GitHub Pages has no server, so the form opens the visitor's email app with the message filled in. To get submissions delivered straight to your inbox, sign up at formspree.io and set the form's `action` to your Formspree URL.

## Turning on GitHub Pages
Settings > Pages > Source: **Deploy from a branch** > Branch: `main`, folder `/ (root)` > Save. The site goes live at `https://muso-ventures.github.io/portfolio/` in a minute or two.
