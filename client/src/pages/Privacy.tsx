import { useTranslation } from 'react-i18next'
import LegalPage from '../components/LegalPage'
import { usePageMeta } from '../hooks/usePageMeta'

export default function Privacy() {
  const { t } = useTranslation()
  usePageMeta({ title: t('privacy.title'), description: t('privacy.metaDescription') })
  return (
    <LegalPage
      title={t('privacy.title')}
      intro={t('privacy.intro')}
      sections={[
        {
          title: t('privacy.collect.title'),
          paragraphs: [t('privacy.collect.intro')],
          items: [t('privacy.collect.email'), t('privacy.collect.google'), t('privacy.collect.teams'), t('privacy.collect.theme'), t('privacy.collect.ip')],
        },
        { title: t('privacy.use.title'), paragraphs: [t('privacy.use.body')] },
        { title: t('privacy.cookies.title'), paragraphs: [t('privacy.cookies.cookie'), t('privacy.cookies.storage'), t('privacy.cookies.google')] },
        {
          title: t('privacy.services.title'),
          paragraphs: [t('privacy.services.intro')],
          items: [t('privacy.services.google'), t('privacy.services.fonts'), t('privacy.services.api'), t('privacy.services.mongo'), t('privacy.services.hosting')],
        },
        { title: t('privacy.deletion.title'), paragraphs: [t('privacy.deletion.body')] },
      ]}
    />
  )
}
