import { useTranslation } from 'react-i18next'

export default function MarqueeBanner() {
  const { t } = useTranslation()
  const text = t('home.marquee.text')

  return (
    <div className="overflow-hidden bg-gradient-to-r from-primary-800 via-accent-700 to-primary-800 py-3 group">
      <div
        className="marquee-track group-hover:[animation-play-state:paused]"
      >
        {/* Two copies for seamless loop */}
        <span className="text-white text-sm font-medium whitespace-nowrap px-4">
          {text}
        </span>
        <span className="text-white text-sm font-medium whitespace-nowrap px-4" aria-hidden="true">
          {text}
        </span>
      </div>
    </div>
  )
}
