import { useEffect } from 'react';

type Props = {
  shortname: string;
  url: string;
  identifier: string;
  title: string;
};

declare global {
  interface Window {
    DISQUS?: {
      reset: (opts: { reload: boolean; config?: () => void }) => void;
    };
    disqus_config?: () => void;
  }
}

export default function DisqusThread({ shortname, url, identifier, title }: Props) {
  useEffect(() => {
    if (!shortname) return;

    window.disqus_config = function () {
      this.page.url = url;
      this.page.identifier = identifier;
      this.page.title = title;
    };

    const embedId = 'dsq-embed-scr';
    // Si ya existe DISQUS, reseteamos con la nueva config
    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config: window.disqus_config,
      });
      return;
    }

    // Insertamos el script de Disqus
    const existing = document.getElementById(embedId);
    if (existing) existing.remove();
    const s = document.createElement('script');
    s.src = `https://${shortname}.disqus.com/embed.js`;
    s.id = embedId;
    s.setAttribute('data-timestamp', `${Date.now()}`);
    s.async = true;
    (document.body || document.head).appendChild(s);
  }, [shortname, url, identifier, title]);

  return <div id="disqus_thread" />;
}
