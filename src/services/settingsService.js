import { GET, POST, PATCH, DELETE } from './api.js'

// ── Settings públicos ──────────────────────────────────────────────────────────
export const getKpis = () => GET('/api/settings/kpis')

// ── Settings protegidos (GOD / DIRECTOR / REGENTE) ───────────────────────────
export const getAllSettings = () => GET('/api/v1/settings')

export const createSetting = (data) => POST('/api/v1/settings', data)

export const updateSetting = (key, body) => PATCH(`/api/v1/settings/${encodeURIComponent(key)}`, body)

export const deleteSetting = (key) => DELETE('/api/v1/settings', encodeURIComponent(key))

// ── Patrocinadores ────────────────────────────────────────────────────────────
export const getSponsors = () => GET('/api/v1/sponsors')

export const createSponsor = (data) => POST('/api/v1/sponsors', data)

export const updateSponsor = (id, data) => PATCH(`/api/v1/sponsors/${id}`, data)

export const deleteSponsor = (id) => DELETE('/api/v1/sponsors', id)

// ── Asignación de sponsor a curso ─────────────────────────────────────────────
export const assignSponsor = (courseId, sponsorId) =>
  PATCH(`/api/v1/courses/${courseId}/sponsor`, { sponsorId })
