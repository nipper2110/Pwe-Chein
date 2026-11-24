import { useTranslation } from 'react-i18next'
import { CONTACT_EMAIL } from '../utils/legal'
import PageLayout from './PageLayout'

export interface LegalSection {
  title: string
  /** Paragraphs shown first. */
  paragraphs?: string[]
  /** A bullet list shown after the paragraphs. */
  items?: string[]
}

interface Props {
  title: string
  intro: string
  sections: LegalSection[]
}

/** The shared layout of the Privacy Policy and Terms of Service: title, intro, numbered-free sections, contact. */
export default function LegalPage({ title, intro, sections }: Props) {
  const { t } = useTranslation()
  return (
    <PageLayout className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-slate-400">{t('legal.lastUpdated')}</p>
        <p className="leading-relaxed text-slate-300">{intro}</p>
      </header>
      {sections.map((section) => (
        <section key={section.title} className="space-y-2">
          <h2 className="text-lg font-semibold">{section.title}</h2>
          {section.paragraphs?.map((p) => (
            <p key={p} className="leading-relaxed text-slate-300">{p}</p>
          ))}
          {section.items && (
            <ul className="list-disc space-y-1.5 ps-5 leading-relaxed text-slate-300 marker:text-slate-500">
              {section.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          )}
        </section>
      ))}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">{t('legal.contactTitle')}</h2>
        <p className="leading-relaxed text-slate-300">
          {t('legal.contactText')}{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="whitespace-nowrap text-pitch underline underline-offset-2 hover:no-underline">{CONTACT_EMAIL}</a>
        </p>
      </section>
    </PageLayout>
  )
}
