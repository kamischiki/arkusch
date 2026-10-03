#!/usr/bin/env python3
"""
Bakes all text from i18n/*.js into the HTML so crawlers see real content without running JS.
Run in the site root (re-run after every change to an HTML file or i18n/*.js):

    python3 prerender.py https://kamischiki.github.io/arkusch      # your final public URL, no trailing slash

What it does
- index.html, privacy-*.html, imprint.html: English text written into the markup (JS still translates as before)
- de/ and uk/: full static copies in German / Ukrainian, with hreflang + canonical tags
- App Store button gets its real href; Free/PRO lists are written out
- imprint.html: noindex, and the e-mail is built by JS again (not plain text in the HTML)
- sitemap.xml and robots.txt
It is idempotent: running it twice gives the same result.
"""
import html as H, json, os, re, sys

if len(sys.argv) < 2:
    sys.exit(__doc__)
BASE = sys.argv[1].rstrip("/")
LANGS = ["en", "de", "uk"]
DIRS = {"en": "", "de": "de/", "uk": "uk/"}
PAGES = ["index.html", "privacy-app.html", "privacy-site.html", "imprint.html"]
NOINDEX = {"imprint.html"}


def read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()


def write(p, s):
    os.makedirs(os.path.dirname(p) or ".", exist_ok=True)
    with open(p, "w", encoding="utf-8", newline="\n") as f:
        f.write(s)


def load_strings(lang):
    out = {}
    for f in (f"i18n/{lang}.js", f"i18n/legal-{lang}.js"):
        for line in read(f).splitlines():
            m = re.match(r'\s*"([^"]+)"\s*:\s*(".*")\s*,?\s*$', line)
            if m:
                out[m.group(1)] = json.loads(m.group(2))
    return out


STR = {l: load_strings(l) for l in LANGS}


def t(key, lang):
    v = STR[lang].get(key)
    return v if v is not None else STR["en"].get(key)


cfg = read("js/config.js")
URLS = {s: (re.search(s + r'\s*:\s*\{\s*url:\s*"([^"]*)"', cfg) or [None, ""])[1] for s in ("ios", "mac")}


EMAIL = (re.search(r'contactEmail:\s*"([^"]*)"', cfg) or [None, ""])[1]


def url(file, lang):
    return f"{BASE}/{DIRS[lang]}" + ("" if file == "index.html" else file)


# ---- tag helpers -----------------------------------------------------------
def get_attr(tag, n):
    m = re.search(rf'\s{n}="([^"]*)"', tag)
    return m.group(1) if m else None


def set_attr(tag, n, v):
    if get_attr(tag, n) is not None:
        return re.sub(rf'(\s{n}=")[^"]*(")', lambda m: m.group(1) + v + m.group(2), tag, count=1)
    return tag[:-1] + f' {n}="{v}">'


def del_attr(tag, n):
    return re.sub(rf'\s{n}="[^"]*"', "", tag, count=1)


# ---- steps -----------------------------------------------------------------
def fix_to_top(h):
    m = re.search(r'(<ul class="plan__list" id="plan-free">.*?</ul>)\s*(<div class="container to-top-row">.*?</div>)\s*(</section>)', h, flags=re.S)
    if not m:
        return h
    row = m.group(2)
    h = h[:m.start()] + m.group(1) + "\n          " + m.group(3) + h[m.end():]
    return re.sub(r'(<p class="plans__note"[^>]*>.*?</p>\s*</div>\s*</section>)', lambda k: k.group(1) + "\n      " + row, h, count=1, flags=re.S)


def stores(h):
    def f(m):
        tag, s = m.group(0), m.group(1)
        cls = [c for c in (get_attr(tag, "class") or "").split() if c != "btn--soon"]
        if URLS.get(s):
            tag = set_attr(tag, "href", URLS[s])
            tag = del_attr(tag, "aria-disabled")
            tag = set_attr(tag, "data-i18n", f"cta.{s}")
        else:
            tag = del_attr(tag, "href")
            tag = set_attr(tag, "aria-disabled", "true")
            tag = set_attr(tag, "data-i18n", f"cta.{s}.soon")
            cls.append("btn--soon")
        return set_attr(tag, "class", " ".join(cls))

    h = re.sub(r'<a\b[^>]*\bdata-store="(\w+)"[^>]*>', f, h)
    if URLS["mac"]:
        h = re.sub(r'<(\w+)([^>]*data-show-if-mac-soon)(?![^>]*\bhidden)([^>]*)>', r"<\1\2\3 hidden>", h)
    return h


def plans(h):
    items = re.findall(r'key:\s*"(\w+)",\s*tier:\s*"(\w+)"', read("js/plans.js"))
    for tier in ("free", "pro"):
        lis = "".join(
            f'<li><strong data-i18n="pl.{k}.t"></strong><span data-i18n="pl.{k}.d"></span></li>'
            for k, tr in items if tr == tier)
        h = re.sub(rf'(<ul class="plan__list" id="plan-{tier}">).*?(</ul>)',
                   lambda m: m.group(1) + lis + m.group(2), h, flags=re.S)
    return h


def fill(h, lang):
    def text(m):
        v = t(m.group(3), lang)
        if v is None:
            return m.group(0)
        return f"<{m.group(1)}{m.group(2)}>{H.escape(v, quote=False)}</{m.group(1)}>"

    h = re.sub(r'<(\w+)(\s[^>]*?\bdata-i18n="([^"]+)"[^>]*)>(.*?)</\1>', text, h, flags=re.S)

    def attrs(m):
        tag = m.group(0)
        for a, real in (("data-i18n-alt", "alt"), ("data-i18n-aria", "aria-label")):
            k = get_attr(tag, a)
            if k and t(k, lang) is not None:
                tag = set_attr(tag, real, H.escape(t(k, lang), quote=True))
        return tag

    return re.sub(r'<[a-z0-9]+\b[^>]*\bdata-i18n-(?:alt|aria)="[^"]*"[^>]*>', attrs, h)


def head(h, file, lang):
    key = (re.search(r'data-title-key="([^"]+)"', h) or [None, "meta.title"])[1]
    h = re.sub(r"<title>.*?</title>", lambda m: f"<title>{H.escape(t(key, lang), quote=False)}</title>", h, flags=re.S)
    h = re.sub(r'(<meta name="description" content=")[^"]*(")',
               lambda m: m.group(1) + H.escape(t("meta.description", lang)) + m.group(2), h)
    if file == "index.html":
        og_desc = t("hero.line1", lang) + " " + t("hero.line2", lang)
        h = re.sub(r'(property="og:title" content=")[^"]*(")', lambda m: m.group(1) + H.escape(t("meta.title", lang)) + m.group(2), h)
        h = re.sub(r'(property="og:description" content=")[^"]*(")', lambda m: m.group(1) + H.escape(og_desc) + m.group(2), h)
        h = re.sub(r'(property="og:image" content=")[^"]*(")', lambda m: m.group(1) + f"{BASE}/images/brand/og-image.jpg" + m.group(2), h)

    h = re.sub(r"\s*<!-- seo:start -->.*?<!-- seo:end -->", "", h, flags=re.S)
    b = ["<!-- seo:start -->", f'<link rel="canonical" href="{url(file, lang)}">']
    if file in NOINDEX:
        b.append('<meta name="robots" content="noindex,follow">')
    else:
        for l in LANGS:
            b.append(f'<link rel="alternate" hreflang="{l}" href="{url(file, l)}">')
        b.append(f'<link rel="alternate" hreflang="x-default" href="{url(file, "en")}">')
    if file == "index.html":
        b += [f'<meta property="og:url" content="{url(file, lang)}">',
              f'<meta property="og:locale" content="{ {"en": "en_US", "de": "de_DE", "uk": "uk_UA"}[lang] }">',
              f'<meta name="twitter:image" content="{BASE}/images/brand/og-image.jpg">']
        ld = {"@context": "https://schema.org", "@type": "SoftwareApplication", "name": "Arkusch",
              "applicationCategory": "LifestyleApplication", "operatingSystem": "iOS, iPadOS, macOS",
              "description": t("meta.description", lang), "url": url(file, lang), "inLanguage": lang,
              "image": f"{BASE}/images/brand/og-image.jpg",
              "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR"},
              "author": {"@type": "Person", "name": "Hanna Kamyshanska"}}
        if URLS["ios"]:
            ld["downloadUrl"] = URLS["ios"]
        b.append('<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False).replace("</", "<\\/") + "</script>")
    b.append("<!-- seo:end -->")
    return h.replace("</head>", "  " + "\n  ".join(b) + "\n</head>", 1)


def render(src, file, lang):
    h = src
    if file == "imprint.html" and EMAIL:  # imprint: e-mail stays visible as plain text (legal requirement)
        h = re.sub(r'<a (?:data-email-link href="#"|href="mailto:[^"]+")></a>|<a href="mailto:[^"]+">[^<]*</a>',
                   f'<a href="mailto:{EMAIL}">{EMAIL}</a>', h)
    if file == "index.html":
        h = fix_to_top(h)
        h = plans(h)
    h = stores(h)
    h = fill(h, lang)
    h = head(h, file, lang)
    extra = "" if lang == "en" else f' data-page-lang="{lang}"'
    h = re.sub(r"<html[^>]*>", f'<html lang="{lang}"{extra}>', h, count=1)
    if lang != "en":
        h = re.sub(r'\b(src|href)="(images|css|js|i18n|fonts|videos)/', r'\1="../\2/', h)
    return h


for file in PAGES:
    src = read(file)
    for lang in LANGS:
        write(DIRS[lang] + file, render(src, file, lang))

rows = []
for file in (p for p in PAGES if p not in NOINDEX):
    for lang in LANGS:
        alts = "".join(f'<xhtml:link rel="alternate" hreflang="{a}" href="{url(file, a)}"/>' for a in LANGS)
        alts += f'<xhtml:link rel="alternate" hreflang="x-default" href="{url(file, "en")}"/>'
        rows.append(f"  <url><loc>{url(file, lang)}</loc>{alts}</url>")
write("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n'
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
      + "\n".join(rows) + "\n</urlset>\n")
write("robots.txt", f"User-agent: *\nAllow: /\n\nSitemap: {BASE}/sitemap.xml\n")
print("done:", ", ".join(PAGES), "+ de/ uk/ sitemap.xml robots.txt")
