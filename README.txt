Haseeb Metla — portfolio website
================================

portfolio/
├── index.html                    page markup
├── style.css                     all styles
├── js/
│   └── main.js                   all behaviour
└── assets/
    ├── haseeb.jpg                hero photo
    ├── haseeb-sm.jpg             nav avatar + favicon
    ├── Haseeb-Metla-CV.pdf       opened by the "Download CV" buttons
    └── work/                     product screenshots used in the work cards
        ├── sarc.jpg              800x450, 16:9
        ├── powerhouse.jpg
        ├── skillmatch.jpg
        ├── soum.jpg
        ├── mobehealth.jpg
        ├── abhi-1.jpg            portrait store shots
        ├── abhi-2.jpg
        ├── eventhive-1.jpg
        └── eventhive-2.jpg

Where things are
  style.css     :root at the top holds every colour as a CSS variable
                (--accent, --bg, --ink, --deep ...). Change them there and the
                whole site follows; dark-mode values sit just below in the
                @media (prefers-color-scheme: dark) block. After that the file
                runs section by section: nav, hero, marquee, impact, profile,
                domains, work, screenshot frames, process, principles, stack,
                experience, contact, footer.

  index.html    every section is marked, e.g. <!-- ===== WORK ===== -->.
                One project is one <article class="work" data-tags="ai web">.
                --g1 / --g2 in its style attribute are that card's gradient;
                data-tags drives the filter buttons (ai / web / mobile).
                Update the counts on the filter buttons if you add a project.

  js/main.js    scroll progress bar, reveal-on-scroll, the counting numbers,
                the work filter, the email copy fallback and the animated
                hero background canvas.

Swapping a project screenshot
  Replace the file in assets/work/ keeping the same name — no code changes.
  Web shots look best at 800x450 (16:9). Store shots are portrait.

Running it locally
  Open index.html in a browser, or use VS Code's Live Server.

Putting it online (Netlify)
  Drag this whole folder onto app.netlify.com. Keep it intact — index.html
  needs style.css, js/ and assets/ beside it.

Better workflow
  Make this folder a git repo and connect it to Netlify, so every push deploys.
