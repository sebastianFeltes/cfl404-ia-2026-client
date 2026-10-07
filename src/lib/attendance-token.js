export const ATTENDANCE_TOKEN_REGEX =
  /CFL404-ATT-[A-Za-z0-9_-]{8}-[A-Za-z0-9_-]{4}-[A-Za-z0-9_-]{4}-[A-Za-z0-9_-]{4}-[A-Za-z0-9_-]{12}/

export function extractAttendanceTokenFromBuffer(buffer) {
  const match = String(buffer ?? '').match(ATTENDANCE_TOKEN_REGEX)
  return match ? match[0] : null
}

export function isCompleteAttendanceToken(buffer) {
  return Boolean(extractAttendanceTokenFromBuffer(buffer))
}
