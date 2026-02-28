export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Exponential decay — year max 3000, location max 2000, total max 5000
export function calcYearScore(yearDiff) {
  return Math.round(3000 * Math.exp(-0.015 * Math.abs(yearDiff)))
}

export function calcLocationScore(distanceKm) {
  return Math.round(2000 * Math.exp(-distanceKm / 2000))
}

// Per-round max is 5000. Emoji thresholds for share string.
export function roundEmoji(roundTotal) {
  if (roundTotal >= 4000) return '🟩'
  if (roundTotal >= 3000) return '🟨'
  if (roundTotal >= 1500) return '🟧'
  return '⬛'
}
