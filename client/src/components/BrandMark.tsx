import PixelLogo from './PixelLogo'

/**
 * Logo + wordmark. "sm" is the header version (the Latin name appears from lg up, where the bar has room);
 * "lg" is the big stacked version for the login and sign-up pages.
 */
export default function BrandMark({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const large = size === 'lg'

  return (
    <span className={`flex items-center ${large ? 'flex-col gap-4' : 'gap-2.5'}`}>
      {/* 2x and 6x the 18x12 map, so every pixel is a whole number of screen pixels. */}
      <PixelLogo className={large ? 'h-[72px] w-[108px]' : 'h-6 w-9'} />
      <span className={`flex items-center ${large ? 'flex-col gap-2.5' : 'gap-3'}`}>
        <span lang="my" className={`font-burmese font-bold leading-none whitespace-nowrap text-pitch ${large ? 'text-3xl' : 'text-xl'}`}>
          ပွဲချိန်
        </span>
        {!large && <span aria-hidden="true" className="hidden h-4 w-px bg-slate-700 lg:block" />}
        <span className={`font-pixel leading-none tracking-wide text-pitch ${large ? 'text-xs' : 'hidden text-[8px] lg:block'}`}>
          PWECHEIN
        </span>
      </span>
    </span>
  )
}
