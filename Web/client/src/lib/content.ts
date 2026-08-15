import type { ComponentType, SVGProps } from 'react';
import { IconHome, IconClean, IconToy, IconPen } from '../components/Icons';

export interface Category {
  label: string;
  tone: 'blue' | 'orange' | 'lemon' | 'pink';
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  description: string;
}

/**
 * I quattro reparti del negozio. Stanno qui e non dentro una pagina perché li
 * usano sia la home sia la pagina Concept: importarli da una pagina caricata in
 * lazy annullerebbe il code splitting.
 */
export const CATEGORIES: Category[] = [
  {
    label: 'Casalinghi',
    tone: 'blue',
    Icon: IconHome,
    description:
      'Contenitori, utensili da cucina, tessili e organizzazione: le cose che servono davvero, senza spendere una fortuna.',
  },
  {
    label: 'Pulizia',
    tone: 'orange',
    Icon: IconClean,
    description:
      'Detergenti, spugne, scope e tutto il necessario per la casa, con i formati convenienti di ogni giorno.',
  },
  {
    label: 'Giocattoli',
    tone: 'lemon',
    Icon: IconToy,
    description:
      'Giochi, passatempi e piccoli regali per bambini: la parte del negozio che mette di buonumore.',
  },
  {
    label: 'Cartoleria',
    tone: 'pink',
    Icon: IconPen,
    description: 'Quaderni, penne, materiale creativo e articoli per la scuola e per l’ufficio.',
  },
];
