import { useTranslation } from 'react-i18next'
import LegalPage from '../components/LegalPage'
import { usePageMeta } from '../hooks/usePageMeta'

export default function Terms() {
  const { t } = useTranslation()
  usePageMeta({ title: t('terms.title'), description: t('terms.metaDescription') })
  return (
    <LegalPage
      title={t('terms.title')}
      intro={t('terms.intro')}
      sections={[
        { title: t('terms.about.title'), paragraphs: [t('terms.about.body')] },
        { title: t('terms.data.title'), paragraphs: [t('terms.data.body')] },
        { title: t('terms.use.title'), paragraphs: [t('terms.use.body')] },
        { title: t('terms.account.title'), paragraphs: [t('terms.account.body')] },
        { title: t('terms.changes.title'), paragraphs: [t('terms.changes.body')] },
      ]}
    />
  )
}
