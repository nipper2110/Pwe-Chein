import { initials } from '../utils/initials'

const SIZES = { md: 'size-9 text-sm', lg: 'size-16 text-xl' } as const

interface Props {
  name: string
  size?: keyof typeof SIZES
}

/** A round badge with the person's initials. The name is read out elsewhere, so this is decorative. */
export default function Avatar({ name, size = 'md' }: Props) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full bg-pitch font-bold text-on-pitch ${SIZES[size]}`}
    >
      {initials(name)}
    </span>
  )
}
