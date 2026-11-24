import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { STAT_KEYS, prettifyStat } from '../utils/statLabels'

type Translate = (key: string, options?: Record<string, unknown>) => string

// API-Football event detail text (lower-case) -> key under "events.".
const EVENT_DETAIL_KEYS: Record<string, string> = {
  'normal goal': 'normalGoal',
  'own goal': 'ownGoal',
  penalty: 'penalty',
  'missed penalty': 'missedPenalty',
  'yellow card': 'yellowCard',
  'red card': 'redCard',
  'second yellow card': 'secondYellow',
  'goal cancelled': 'goalCancelled',
  'penalty confirmed': 'penaltyConfirmed',
  'card upgrade': 'cardUpgrade',
}

/**
 * Translates the English labels that API-Football sends (match status, statistic names, event details,
 * round names, table zones). Anything we do not recognise is shown exactly as the API sent it.
 * Team, player, league and venue NAMES are never passed through here: they stay in English.
 */
export function useLabels() {
  const { t, i18n } = useTranslation()

  return useMemo(() => {
    const tr = t as unknown as Translate
    const has = (key: string): boolean => i18n.exists(key)

    return {
      /** Match status from its short code ("FT", "2H"...). Falls back to the API's own English text. */
      status: (status: { short: string; long: string }): string =>
        has(`status.${status.short}`) ? tr(`status.${status.short}`) : status.long,

      stat: (type: string): string => {
        const key = STAT_KEYS[type.toLowerCase()]
        return key ? tr(`stats.${key}`) : prettifyStat(type)
      },

      eventDetail: (detail: string): string => {
        const key = EVENT_DETAIL_KEYS[detail.toLowerCase()]
        return key ? tr(`events.${key}`) : detail
      },

      /** "Regular Season - 12" -> translated. Knockout round names stay as the API sends them. */
      round: (round: string): string => {
        const patterns: [RegExp, string][] = [
          [/^Regular Season - (\d+)$/i, 'round.regularSeason'],
          [/^League Stage - (\d+)$/i, 'round.leagueStage'],
          [/^Group Stage - (\d+)$/i, 'round.groupStage'],
        ]
        for (const [pattern, key] of patterns) {
          const match = pattern.exec(round)
          if (match) return tr(key, { n: match[1] })
        }
        return round
      },

      /** Table zone text from the API. Only the plain word "Relegation" is translated; competition names stay. */
      zone: (description: string): string => {
        if (/^relegation$/i.test(description)) return tr('zones.relegation')
        if (/^relegation - /i.test(description)) return `${tr('zones.relegation')} - ${description.slice('relegation - '.length)}`
        return description
      },
    }
  }, [t, i18n])
}
