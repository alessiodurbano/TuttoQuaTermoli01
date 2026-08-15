import { useEffect } from 'react';

/**
 * Aggiorna title e meta description a ogni cambio pagina. Sostituisce il
 * classico <head> statico di un sito multipagina senza aggiungere dipendenze.
 */
export function useDocumentMeta(title: string, description?: string): void {
  useEffect(() => {
    document.title = title;

    if (!description) return;
    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = 'description';
      document.head.appendChild(tag);
    }
    tag.content = description;
  }, [title, description]);
}
