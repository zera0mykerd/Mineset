import os
import re
from googletrans import Translator

ALLOWED_TAGS = {
    'p', 'ol', 'ul', 'li', 'a',
    'b', 'i', 'strong', 'em', 'span',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
}

FORBIDDEN_TAGS = {
    'script', 'style', 'code', 'pre',
    'object', 'param', 'meta', 'link', 'head'
}

TAG_RE = re.compile(r'<!--.*?-->|<![^>]*>|<\?[^>]*\?>|</?[a-zA-Z0-9:-]+(?:\s+[^<>]*?)?>', re.DOTALL)

def translate_text(text, translator, src='en', dest='it'):
    if not text or not text.strip():
        return text
    leading = re.match(r'^\s*', text).group(0)
    trailing = re.search(r'\s*$', text).group(0)
    core = text[len(leading):len(text)-len(trailing)]
    if not core:
        return text
    try:
        translated = translator.translate(core, src=src, dest=dest).text
        return leading + translated + trailing
    except Exception as e:
        print(f"Errore traduzione: {e} | Testo lasciato invariato: {core[:80]!r}")
        return text

def process_html(html, src='en', dest='it'):
    translator = Translator()
    out = []
    pos = 0
    stack = []

    def current_allowed():
        if any(t in FORBIDDEN_TAGS for t in stack):
            return False
        return any(t in ALLOWED_TAGS for t in stack)

    for m in TAG_RE.finditer(html):
        text_segment = html[pos:m.start()]
        if text_segment:
            if current_allowed():
                out.append(translate_text(text_segment, translator, src, dest))
            else:
                out.append(text_segment)

        tag = m.group(0)
        out.append(tag)

        if tag.startswith('<!--') or tag.startswith('<?') or tag.startswith('<!'):
            pass
        else:
            closing = tag.startswith('</')
            name_match = re.match(r'</?\s*([a-zA-Z0-9:-]+)', tag)
            if name_match:
                name = name_match.group(1).lower()
                void_like = {'br','hr','img','input','meta','link','area','base','col','embed','param','source','track','wbr'}
                self_closing = tag.endswith('/>') or name in void_like
                if not closing and not self_closing:
                    stack.append(name)
                elif closing:
                    for i in range(len(stack)-1, -1, -1):
                        if stack[i] == name:
                            del stack[i:]
                            break
        pos = m.end()

    tail = html[pos:]
    if tail:
        if any(t in FORBIDDEN_TAGS for t in stack):
            out.append(tail)
        elif any(t in ALLOWED_TAGS for t in stack):
            out.append(translate_text(tail, translator, src, dest))
        else:
            out.append(tail)

    return ''.join(out)

def translate_folder(folder):
    for fname in os.listdir(folder):
        if not fname.lower().endswith('.html'):
            continue
        file_path = os.path.join(folder, fname)
        print(f"Traduzione e sovrascrittura: {fname}")
        with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
            html = f.read()
        translated = process_html(html, src='en', dest='it')
        with open(file_path, 'w', encoding='utf-8', newline='') as f:
            f.write(translated)

if __name__ == '__main__':
    current_dir = os.path.dirname(os.path.abspath(__file__))
    translate_folder(current_dir)
