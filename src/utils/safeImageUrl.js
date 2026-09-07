const ALLOWED_HOSTS = new Set([
  'lh3.googleusercontent.com',
  'lh4.googleusercontent.com',
  'lh5.googleusercontent.com',
  'lh6.googleusercontent.com',
  'googleusercontent.com',
  'images.unsplash.com',
])

export function isSafeImageUrl(value) {
  if (!value || typeof value !== 'string') return false
  const trimmed = value.trim()
  if (!trimmed) return false
  const lower = trimmed.toLowerCase()
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('http:')) {
    return false
  }
  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol !== 'https:') return false
    const host = parsed.hostname.toLowerCase()
    return ALLOWED_HOSTS.has(host) || host.endsWith('.googleusercontent.com')
  } catch {
    return false
  }
}

export function safeImageSrc(value) {
  return isSafeImageUrl(value) ? value : ''
}
