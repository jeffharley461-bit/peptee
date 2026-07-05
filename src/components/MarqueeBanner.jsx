import { useTranslation } from 'react-i18next'

export default function MarqueeBanner() {
  const { t } = useTranslation()
  const text = t('home.marquee.text')

  return (
    <div className="overflow-hidden bg-gradient-to-r from-primary-800 via-accent-700 to-primary-800 py-2.5 group">
      <div className="marquee-track group-hover:[animation-play-state:paused]">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-white text-sm font-medium whitespace-nowrap px-8" aria-hidden={i > 0}>
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
