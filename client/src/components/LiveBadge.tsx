interface Props {
  minute?: number | null
}

export default function LiveBadge({ minute }: Props) {
  return (
    <span className="inline-flex animate-pulse items-center gap-1 rounded bg-live px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#ffffff]">
      Live{minute ? ` ${minute}'` : ''}
    </span>
  )
}
