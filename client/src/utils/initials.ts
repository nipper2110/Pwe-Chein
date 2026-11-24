// Splits text into what people see as single characters. For Burmese, a "character" is a base letter
// plus its marks, so we use the browser's grapheme splitter instead of plain string indexes.
const segmenter = typeof Intl !== 'undefined' && 'Segmenter' in Intl ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null

function firstCharacter(word: string): string {
  if (segmenter) return segmenter.segment(word)[Symbol.iterator]().next().value?.segment ?? ''
  return [...word][0] ?? ''
}

/** "Aung Kyaw" -> "AK", "Madonna" -> "M", "" -> "?" */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  const first = firstCharacter(words[0])
  const last = words.length > 1 ? firstCharacter(words[words.length - 1]) : ''
  return (first + last).toUpperCase()
}
