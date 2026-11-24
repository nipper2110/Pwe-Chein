import { useTranslation } from 'react-i18next'
import NotFoundState from '../components/NotFoundState'
import PageLayout from '../components/PageLayout'
import { usePageMeta } from '../hooks/usePageMeta'

export default function NotFound() {
  const { t } = useTranslation()
  usePageMeta({ title: t('notFound.title'), noindex: true })
  return (
    <PageLayout>
      <NotFoundState />
    </PageLayout>
  )
}
