#!/usr/bin/env python3
"""
hent-lover.py: fetches the real law texts from lovdata.no and turns them into the
small JavaScript files the "Lover" (Laws) tab of Teoriprøven reads.

    python3 tools/teoriprove/lover/hent-lover.py

You only need this when a law has changed (Lovdata shows "Sist endret" at the top of
each law). It needs Python 3 with beautifulsoup4 + lxml, and network access to lovdata.no.
It rewrites the <id>.js files in this folder and downloads any missing sign pictures
into skilt/. The site itself has no build step: the .js files are committed as they are.

Norwegian laws and regulations are not protected by copyright (åndsverkloven § 14),
so copying the text is fine. We copy the text as it stands and drop only Lovdata's
footnotes (amendment history) and any § that has been repealed.
"""
import html
import json
import os
import re
import sys
import time
import urllib.request
from datetime import date

from bs4 import BeautifulSoup, NavigableString, Tag

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = "https://lovdata.no"

# The laws, in the order the tab shows them. "pages" are the Lovdata pages to read:
# small laws are one page; big regulations are read chapter by chapter (only the chapters
# that matter for a class B driver). "meta" is the page that shows "Sist endret".
LAWS = [
    {"id": "vtl", "ref": "LOV-1965-06-18-4", "meta": "/dokument/NL/lov/1965-06-18-4",
     "pages": ["/dokument/NL/lov/1965-06-18-4"]},
    {"id": "tr", "ref": "FOR-1986-03-21-747", "meta": "/dokument/SF/forskrift/1986-03-21-747",
     "pages": ["/dokument/SF/forskrift/1986-03-21-747"]},
    {"id": "skilt", "ref": "FOR-2005-10-07-1219", "meta": "/dokument/SF/forskrift/2005-10-07-1219",
     "pages": ["/dokument/SF/forskrift/2005-10-07-1219"]},
    {"id": "bruk", "ref": "FOR-1990-01-25-92", "meta": "/dokument/SF/forskrift/1990-01-25-92",
     "pages": ["/dokument/SF/forskrift/1990-01-25-92"]},
    {"id": "fk", "ref": "FOR-2004-01-19-298", "meta": "/dokument/SF/forskrift/2004-01-19-298",
     "pages": ["/dokument/SF/forskrift/2004-01-19-298/KAPITTEL_" + k for k in ("3", "4", "11")]},
    {"id": "op", "ref": "FOR-2004-10-01-1339", "meta": "/dokument/SF/forskrift/2004-10-01-1339",
     "pages": ["/dokument/SF/forskrift/2004-10-01-1339/KAPITTEL_" + k for k in ("2", "3", "8", "11", "29")]},
    {"id": "tap", "ref": "FOR-2003-12-19-1660", "meta": "/dokument/SF/forskrift/2003-12-19-1660",
     "pages": ["/dokument/SF/forskrift/2003-12-19-1660"]},
    {"id": "prikk", "ref": "FOR-2003-09-19-1164", "meta": "/dokument/SF/forskrift/2003-09-19-1164",
     "pages": ["/dokument/SF/forskrift/2003-09-19-1164"]},
]


def fetch(path, binary=False):
    """Download one page from Lovdata (politely: one at a time, with a short pause)."""
    req = urllib.request.Request(BASE + path, headers={"User-Agent": "Mozilla/5.0 (family study tool)"})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    time.sleep(0.5)
    return data if binary else data.decode("utf-8")


def esc(s):
    return html.escape(s, quote=False)


def classes(tag):
    return tag.get("class") or []


def clean(s):
    """Tidy whitespace and drop the invisible zero-width spaces Lovdata uses."""
    return re.sub(r"\s+", " ", s.replace("​", "")).strip()


# ---------- turning Lovdata's HTML into a few simple tags ----------
images = set()   # sign pictures we need to have in skilt/


SKIP = ("fotnote", "fotnoteref", "namedAnchor", "documentPart_scrollMargin", "share-paragraf", "commentWidget")


def skip(tag):
    """Bits of Lovdata's page that aren't law text: footnotes, anchors, "Del paragraf" buttons."""
    return any(c in SKIP for c in classes(tag))


def inline(node):
    """Text with only <i>, <b>, <br>, <sup>, <sub> and sign pictures kept."""
    out = []
    for ch in node.children:
        if isinstance(ch, NavigableString):
            out.append(esc(str(ch).replace("​", "")))
            continue
        if not isinstance(ch, Tag):
            continue
        c = classes(ch)
        if skip(ch):
            continue                       # footnote markers, empty anchors, Lovdata's buttons
        n = ch.name
        if n in ("em", "i"):
            out.append("<i>" + inline(ch) + "</i>")
        elif n in ("strong", "b"):
            out.append("<b>" + inline(ch) + "</b>")
        elif n == "br":
            out.append("<br>")
        elif n in ("sup", "sub"):
            out.append("<%s>%s</%s>" % (n, inline(ch), n))
        elif n == "img":
            src = ch.get("src", "").split("?")[0]
            name = src.rsplit("/", 1)[-1]
            if name.endswith(".gif") or name.endswith(".png") or name.endswith(".jpg"):
                images.add(src)
                short = re.sub(r"^sf-\d{8}-\d+-", "", name)
                out.append('<img src="lover/skilt/%s" alt="" loading="lazy">' % short)
        elif n == "span" and "avsnittNummer" in c:
            out.append("<b>" + inline(ch) + "</b>")
        elif n in ("p", "div", "table", "ul", "ol"):
            out.append(" " + "".join(blocks(ch)) + " ")
        else:                               # <a>, <span> and anything else: keep what's inside
            out.append(inline(ch))
    return "".join(out)


def tidy(s):
    s = re.sub(r"[ \t\r\n]+", " ", s)
    s = re.sub(r"\s*<br>\s*", "<br>", s)
    return s.strip()


def blocks(node):
    """The paragraphs, lists and tables inside one § (or other part of a law)."""
    out = []
    kids = [node] if node.name in ("p", "table") else node.children
    for ch in kids:
        if isinstance(ch, NavigableString):
            t = clean(str(ch))
            if t:
                out.append("<p>%s</p>" % esc(t))
            continue
        if not isinstance(ch, Tag):
            continue
        c = classes(ch)
        if skip(ch) or "paragrafHeader" in c:
            continue
        n = ch.name
        if n == "p":
            body = tidy(inline(ch))
            if body:
                out.append("<p>%s</p>" % body)
        elif n == "table" and "listeItem" in c:
            tds = ch.find_all("td", recursive=True)
            lvl = ch.get("data-level", "1")
            num = tidy(inline(tds[0])) if len(tds) > 1 else ""
            body = tidy(inline(tds[-1]))
            out.append('<div class="li l%s"><span class="ln">%s</span><span>%s</span></div>' % (lvl, num, body))
        elif n == "table" and ("numeral" in c or "morTag_an" in c):
            body = tidy(inline(ch.find("td")))
            out.append("<p>%s</p>" % body)
        elif n == "table" and ch.find("img"):
            out.extend(sign_rows(ch))
        elif n == "table":
            rows = []
            for tr in ch.find_all("tr"):
                cells = []
                for td in tr.find_all(["td", "th"], recursive=False):
                    span = ' colspan="%s"' % td["colspan"] if td.get("colspan") else ""
                    cells.append("<td%s>%s</td>" % (span, tidy(inline(td))))
                if cells:
                    rows.append("<tr>" + "".join(cells) + "</tr>")
            if rows:
                out.append('<div class="tw"><table>%s</table></div>' % "".join(rows))
        elif n in ("h2", "h3", "h4", "h5"):
            out.append("<p><b>%s</b></p>" % tidy(inline(ch)))
        elif n in ("div", "section", "ul", "ol", "li"):
            out.extend(blocks(ch))
        else:
            body = tidy(inline(ch))
            if body:
                out.append("<p>%s</p>" % body)
    return out


def sign_rows(table):
    """Lovdata shows the signs as a wide table (pictures in some columns, name + meaning in
    another). We turn each row into one line: the pictures on the left, the words on the right,
    with the sign's name (the text before the first line break) in bold. Reads well on a phone."""
    out = []
    for tr in table.find_all("tr"):
        pics, words = [], []
        for td in tr.find_all(["td", "th"], recursive=False):
            body = tidy(inline(td))
            if not body:
                continue
            if "<img" in body:
                pics.append('<span class="sc">%s</span>' % body.replace("<br>", "<span>", 1) + ("</span>" if "<br>" in body else ""))
            else:
                words.append(body)
        if not pics and not words:
            continue
        text = "<br>".join(words)
        if text:
            first, sep, rest = text.partition("<br>")
            text = "<b>%s</b>%s%s" % (first, sep, rest)
        out.append('<div class="sg"><div class="sgi">%s</div><div class="sgt">%s</div></div>' % ("".join(pics), text))
    return out


def walk(node, parts, depth):
    """Go through the law in order: chapter headings and §§."""
    for ch in node.children:
        if not isinstance(ch, Tag):
            continue
        c = classes(ch)
        if "kapittel" in c:
            head = ch.find(["h2", "h3", "h4"], recursive=False)
            if head:
                parts.append(["h", depth, clean(head.get_text(""))])
            walk(ch, parts, depth + 1)
        elif "paragraf" in c:
            num = clean(ch.find(class_="paragrafValue").get_text("")).rstrip(".")
            tit = ch.find(class_="paragrafTittel")
            tit = clean(tit.get_text("")) if tit else ""
            if tit.startswith("(Opphevet") or tit.startswith("(Opphevd"):
                continue                     # repealed: nothing left to learn
            body = "".join(blocks(ch))
            if re.fullmatch(r"<p>\(Opphevet[^<]*\)</p>", body):
                continue
            parts.append(["p", num, tit, body])
        elif ch.name == "div":
            walk(ch, parts, depth)
        elif ch.name in ("p", "table") and "morTag_mf" not in c and "fotnote" not in c:
            body = "".join(blocks(ch))
            if body.strip():
                parts.append(["t", body])    # text that sits between §§ (e.g. in an appendix)


def build(law):
    meta = BeautifulSoup(fetch(law["meta"]), "lxml")
    title = clean(meta.find("title").get_text()).replace(" - Lovdata", "")
    endret = meta.find(id="metaField_endret")
    endret = clean(endret.get_text(" ")) if endret else ""
    endret = re.sub(r"\s*Endrer$", "", endret)
    parts = []
    for path in law["pages"]:
        soup = meta if path == law["meta"] else BeautifulSoup(fetch(path), "lxml")
        walk(soup.find(id="documentBody"), parts, 1)
    return {"id": law["id"], "title": title, "ref": law["ref"], "url": BASE + law["meta"],
            "endret": endret, "hentet": date.today().isoformat(), "parts": parts}


def main():
    only = sys.argv[1:]
    for law in LAWS:
        if only and law["id"] not in only:
            continue
        data = build(law)
        n = sum(1 for p in data["parts"] if p[0] == "p")
        path = os.path.join(HERE, law["id"] + ".js")
        with open(path, "w", encoding="utf-8") as f:
            f.write("/* %s (%s), copied from lovdata.no on %s.\n   Sist endret: %s.\n"
                    "   Made by hent-lover.py: don't edit by hand, run that script again instead. */\n"
                    % (data["title"], data["ref"], data["hentet"], data["endret"] or "?"))
            f.write("window.LOV=window.LOV||{};\nLOV[%s]=" % json.dumps(law["id"]))
            f.write(json.dumps(data, ensure_ascii=False, separators=(",", ":")))
            f.write(";\n")
        print("%-6s %4d §§  %7d bytes  %s" % (law["id"], n, os.path.getsize(path), data["title"]))
    # sign pictures (only the skiltforskriften has them)
    os.makedirs(os.path.join(HERE, "skilt"), exist_ok=True)
    got = 0
    for src in sorted(images):
        short = re.sub(r"^sf-\d{8}-\d+-", "", src.rsplit("/", 1)[-1])
        dest = os.path.join(HERE, "skilt", short)
        if not os.path.exists(dest):
            with open(dest, "wb") as f:
                f.write(fetch(src, binary=True))
            got += 1
    print("sign pictures: %d used, %d downloaded" % (len(images), got))


if __name__ == "__main__":
    main()
