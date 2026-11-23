import NotFoundState from '../components/NotFoundState'
import PageLayout from '../components/PageLayout'
import { usePageMeta } from '../hooks/usePageMeta'

export default function NotFound() {
  usePageMeta({ title: 'Page not found', noindex: true })
  return (
    <PageLayout>
      <NotFoundState />
    </PageLayout>
  )
}
