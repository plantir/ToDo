import { toGregorian, toJalaali, jalaaliMonthLength } from 'jalaali-js'
import { toFa } from '$lib/utils/digits'

export const WEEKDAYS = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنجشنبه',
  'جمعه',
] as const
export const MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
] as const

export function isoToday(): string {
  return toIso(new Date())
}

export function toIso(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function fromIso(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function addDays(iso: string, amount: number): string {
  const date = fromIso(iso)
  date.setDate(date.getDate() + amount)
  return toIso(date)
}

export function startOfPersianWeek(iso: string): string {
  const date = fromIso(iso)
  const daysSinceSaturday = (date.getDay() + 1) % 7
  return addDays(iso, -daysSinceSaturday)
}

export function jalaliParts(iso: string): { jy: number; jm: number; jd: number } {
  const date = fromIso(iso)
  return toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

export function jalaliTitle(iso: string): string {
  const { jy, jm, jd } = jalaliParts(iso)
  const weekday = WEEKDAYS[(fromIso(iso).getDay() + 1) % 7]
  return `${weekday} ${toFa(jd)} ${MONTHS[jm - 1]} ${toFa(jy)}`
}

export function jalaliWeekTitle(iso: string): string {
  const start = startOfPersianWeek(iso)
  const end = addDays(start, 6)
  const a = jalaliParts(start)
  const b = jalaliParts(end)
  return `هفته ${toFa(a.jd)}–${toFa(b.jd)} ${MONTHS[b.jm - 1]} ${toFa(b.jy)}`
}

export function jalaliMonthTitle(iso: string): string {
  const { jy, jm } = jalaliParts(iso)
  return `${MONTHS[jm - 1]} ${toFa(jy)}`
}

export function jalaliMonthGrid(iso: string): Array<{ iso: string | null; day: number | null }> {
  const { jy, jm } = jalaliParts(iso)
  const length = jalaaliMonthLength(jy, jm)
  const firstGregorian = toGregorian(jy, jm, 1)
  const first = new Date(firstGregorian.gy, firstGregorian.gm - 1, firstGregorian.gd)
  const leading = (first.getDay() + 1) % 7
  const cells: Array<{ iso: string | null; day: number | null }> = []

  for (let i = 0; i < leading; i += 1) {
    cells.push({ iso: null, day: null })
  }

  for (let day = 1; day <= length; day += 1) {
    const gregorian = toGregorian(jy, jm, day)
    cells.push({
      iso: toIso(new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd)),
      day,
    })
  }

  while (cells.length % 7 !== 0) {
    cells.push({ iso: null, day: null })
  }

  return cells
}

export function shiftJalaliMonth(iso: string, delta: number): string {
  const { jy, jm, jd } = jalaliParts(iso)
  const absolute = jy * 12 + (jm - 1) + delta
  const nextYear = Math.floor(absolute / 12)
  const nextMonth = (absolute % 12) + 1
  const last = jalaaliMonthLength(nextYear, nextMonth)
  const gregorian = toGregorian(nextYear, nextMonth, Math.min(jd, last))
  return toIso(new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd))
}
