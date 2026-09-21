import { test } from '@japa/runner'
import CalendarService from '#services/calendar_service'

test.group('CalendarService', () => {
  const service = new CalendarService()

  test('computes a Saturday-based week range', ({ assert }) => {
    const range = service.resolveRange('weekly', '2026-09-11')
    assert.equal(range.from.toISODate(), '2026-09-05')
    assert.equal(range.to.toISODate(), '2026-09-11')
  })

  test('computes a Jalali month range for Shahrivar 1405', ({ assert }) => {
    const range = service.resolveRange('monthly', '2026-09-11')
    assert.equal(range.from.toISODate(), '2026-08-23')
    assert.equal(range.to.toISODate(), '2026-09-22')
  })

  test('marks capacity as over when used exceeds the limit', ({ assert }) => {
    const capacity = service.toCapacity(12, 10)
    assert.equal(capacity.status, 'over')
    assert.equal(capacity.overBy, 2)
    assert.equal(capacity.remaining, 0)
  })
})
