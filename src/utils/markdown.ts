export function basicMarkdownToHtml(markdown: string): string {
  // Very small, no-dependency renderer for our blog drafts.
  // Supports: #/##/### headings, paragraphs, bold, italics, links, inline code,
  // fenced code blocks, unordered lists, tables (simple), and horizontal rules.
  // Not intended to be exhaustive; just enough for our content set.
  let md = markdown.trim();

  // Extract only the article section if the draft has sections (e.g., "B) ARTICLE")
  // Fall back to full content if not found.
  const articleStart = md.indexOf('# B) ARTICLE');
  if (articleStart >= 0) {
    md = md.slice(articleStart);
  }

  // Normalize newlines
  md = md.replace(/\r\n/g, '\n');

  // Code fences ```lang ... ```
  md = md.replace(/```(\w+)?\n([\s\S]*?)```/g, (_m, lang, code) => {
    const safeCode = escapeHtml(code);
    const languageClass = lang ? ` class="language-${lang}"` : '';
    return `<pre><code${languageClass}>${safeCode}</code></pre>`;
  });

  // Tables (very simple: header | header\n---|---\nrow|row)
  md = md.replace(
    /(^|\n)\|(.+)\|\n\|([-\s|:]+)\|\n([\s\S]*?)(?=\n\n|$)/g,
    (_m, prefix, headerRow, _divider, body) => {
      const headers = headerRow.split('|').map((h) => h.trim());
      const rows = body
        .trim()
        .split('\n')
        .map((r) => r.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim()));
      let html = `${prefix}<table><thead><tr>`;
      html += headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('');
      html += `</tr></thead><tbody>`;
      html += rows.map((cols) => `<tr>${cols.map((c) => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('');
      html += `</tbody></table>`;
      return html;
    }
  );

  // Headings
  md = md.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  md = md.replace(/^## (.*)$/gm, '<h2>$1</h2>');
  md = md.replace(/^# (.*)$/gm, '<h1>$1</h1>');

  // Horizontal rules
  md = md.replace(/(^|\n)---(\n|$)/g, '$1<hr />$2');

  // Unordered lists
  md = md.replace(/(^|\n)- (.*)(?:(\n- .*)*)/g, (m) => {
    const items = m
      .trim()
      .split('\n')
      .map((l) => l.replace(/^- /, '').trim())
      .map((item) => `<li>${inline(item)}</li>`)
      .join('');
    return `<ul>${items}</ul>`;
  });

  // Bold, italics, inline code, links
  function inline(text: string): string {
    let t = text;
    t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/\*(.+?)\*/g, '<em>$1</em>');
    t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
    t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, url) => {
      const safeUrl = escapeAttr(url);
      return `<a href="${safeUrl}" target="_blank" rel="noopener">${label}</a>`;
    });
    return t;
  }

  // Paragraphs (lines that are not HTML blocks)
  const lines = md.split('\n');
  const out: string[] = [];
  let buf: string[] = [];
  const flush = () => {
    if (buf.length) {
      const paragraph = buf.join(' ').trim();
      if (paragraph) out.push(`<p>${inline(paragraph)}</p>`);
      buf = [];
    }
  };
  for (const line of lines) {
    if (/^\s*$/.test(line)) {
      flush();
      continue;
    }
    if (/^\s*<(h\d|ul|ol|pre|table|hr)/.test(line)) {
      flush();
      out.push(line);
    } else if (/^#/.test(line)) {
      flush();
      out.push(line); // already converted headings
    } else if (/^\s*- /.test(line)) {
      flush();
      out.push(line); // will have been transformed above
    } else {
      buf.push(line);
    }
  }
  flush();

  // Final pass: remove any leftover heading markers that slipped through
  return out.join('\n').replace(/^# /gm, '');
}

export function extractMetaFromDraft(raw: string) {
  // Extract Title (first H1/H2 after ARTICLE), Slug, and Last Updated if present
  const titleMatch =
    raw.match(/^##\s+(.+?)\s*$/m) ||
    raw.match(/^#\s+(.+?)\s*$/m);
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled';
  const slugMatch = raw.match(/^\*\*Slug:\*\*\s*([^\s]+)\s*$/m);
  const slug = slugMatch ? slugMatch[1].trim() : title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const updatedMatch =
    raw.match(/^\*\*Last Updated:\*\*\s*([0-9-]+)\s*$/m) ||
    raw.match(/Last updated:\s*(.+)$/i);
  const updated = updatedMatch ? updatedMatch[1].trim() : '';
  // Excerpt: first paragraph after title
  const articleIdx = raw.indexOf('# B) ARTICLE');
  const after = articleIdx >= 0 ? raw.slice(articleIdx) : raw;
  const paraMatch = after.split('\n').slice(1).join('\n').match(/\n\n([^#\n][\s\S]*?)\n\n/);
  const excerpt = paraMatch ? paraMatch[1].trim().slice(0, 220) : '';
  // JSON-LD block
  const jsonLdMatch = raw.match(/```json\n([\s\S]*?)\n```/m);
  let jsonLd = '';
  if (jsonLdMatch) {
    try {
      jsonLd = JSON.stringify(JSON.parse(jsonLdMatch[1]));
    } catch {
      jsonLd = '';
    }
  }
  return { title, slug, updated, excerpt, jsonLd };
}

function escapeHtml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escapeAttr(str: string) {
  return str.replace(/"/g, '&quot;');
}


