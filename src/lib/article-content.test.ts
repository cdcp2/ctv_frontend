import { describe, expect, it } from 'vitest';
import { formatArticleContent } from './article-content';

describe('formatArticleContent', () => {
  it('renders blank-line-separated paragraphs and preserves single line breaks', () => {
    expect(formatArticleContent('Primer párrafo.\nSegunda línea.\n\nSegundo párrafo.'))
      .toBe('<p>Primer párrafo.<br>Segunda línea.</p>\n<p>Segundo párrafo.</p>');
  });

  it('normalizes Windows and old Mac line endings and whitespace-only blank lines', () => {
    expect(formatArticleContent('  Primero\r\n \t\r\n\r\nSegundo\rTercero  '))
      .toBe('<p>Primero</p>\n<p>Segundo<br>Tercero</p>');
  });

  it('escapes plain text before inserting it as HTML', () => {
    expect(formatArticleContent('5 < 10 & 20 > 15; "texto" y \'cita\''))
      .toBe('<p>5 &lt; 10 &amp; 20 &gt; 15; &quot;texto&quot; y &#39;cita&#39;</p>');
  });

  it.each([
    '<p>Primero</p>\n\n<p>Segundo <strong>destacado</strong></p>',
    'Primero<br />Segundo',
    '<h2>Título</h2><ul><li>Elemento</li></ul>',
    '<p class="intro">Texto <a href="/">enlazado</a></p>',
  ])('preserves existing HTML: %s', (html) => {
    expect(formatArticleContent(html)).toBe(html);
  });

  it('handles a single paragraph and empty content', () => {
    expect(formatArticleContent('Un párrafo.')).toBe('<p>Un párrafo.</p>');
    expect(formatArticleContent(' \r\n\t ')).toBe('');
  });
});
