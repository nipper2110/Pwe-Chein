import { useEffect } from 'react'

const SITE = 'ပွဲချိန်'
const DEFAULT_TITLE = `${SITE} — Live Football Scores & Stats`

/** Create the <meta> tag if it does not exist yet, then set its content. */
function setMeta(attr: 'name' | 'property', key: string, content: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

interface PageMeta {
  /** Page name, e.g. "Liverpool vs PSV". The site name is added automatically. */
  title?: string
  description?: string
  /** Private or useless-for-search pages (login, dashboard, 404). */
  noindex?: boolean
}

/**
 * Sets the browser tab title and the SEO / social-sharing tags for the current page.
 * We update the tags in the head directly, so there is only ever one of each.
 */
export function usePageMeta({ title, description, noindex = false }: PageMeta): void {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE}` : DEFAULT_TITLE
    document.title = fullTitle
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:url', window.location.href)
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    if (description) {
      setMeta('name', 'description', description)
      setMeta('property', 'og:description', description)
    }
  }, [title, description, noindex])
}
