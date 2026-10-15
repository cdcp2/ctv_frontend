/** Keep legacy HTML intact; format textarea content only when it has no HTML tags. */
export function formatArticleContent(content: string): string {
  if (/<\/?[a-z][a-z0-9-]*(?:\s[^<>]*?)?\s*\/?>/i.test(content)) {
    return content;
  }

  const text = content.replace(/\r\n?/g, '\n').trim();
  if (!text) return '';

  return text
    .split(/\n[\t ]*\n(?:[\t ]*\n)*/)
    .map((paragraph) => {
      const escaped = paragraph
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      return `<p>${escaped.replace(/\n/g, '<br>')}</p>`;
    })
    .join('\n');
}
