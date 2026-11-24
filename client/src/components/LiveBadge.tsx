import { useTranslation } from 'react-i18next'

interface Props {
  minute?: number | null
}

export default function LiveBadge({ minute }: Props) {
  const { t } = useTranslation()
  return (
    <span className="inline-flex animate-pulse items-center gap-1 rounded bg-live px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#ffffff]">
      {t('live.badge')}
      {/* The minute is always written with Western digits. */}
      {minute ? ` ${minute}'` : ''}
    </span>
  )
}
