/**
 * URL canónica de una página.
 *
 * El build genera archivos (`build.format: 'file'`), así que en tiempo de build
 * `Astro.url.pathname` llega con la extensión: `/blog.html`. El sitemap y los
 * enlaces internos usan la forma limpia (`/blog`), así que hay que quitarla para
 * que canonical, og:url y los schemas apunten a la misma URL que se indexa.
 */
import { SITE } from '../config/site.config';

export function canonicalUrl(pathname: string): string {
  const clean = pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  return new URL(clean || '/', SITE.url).href;
}
