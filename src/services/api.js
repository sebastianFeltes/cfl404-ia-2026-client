import axios from 'axios'

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  throw new Error('VITE_API_URL es obligatorio en producción')
}

const DEV_URL = 'http://localhost:4000'
const BASE_URL = import.meta.env.VITE_API_URL || DEV_URL

const USER_KEY = 'cfl404_user'
const SESSION_FLAG = 'cfl404_session'

let authToken = null
let onUnauthorized = null

export function getAuthToken() {
  return authToken
}

export function setAuthToken(token, { remember = true } = {}) {
  authToken = token && String(token).includes('.') ? token : null
  localStorage.removeItem('cfl404_token')
  sessionStorage.removeItem('cfl404_token')
  const storage = remember ? localStorage : sessionStorage
  const other = remember ? sessionStorage : localStorage
  other.removeItem(SESSION_FLAG)
  storage.setItem(SESSION_FLAG, '1')
}

export function clearAuthToken() {
  authToken = null
  localStorage.removeItem('cfl404_token')
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(SESSION_FLAG)
  sessionStorage.removeItem('cfl404_token')
  sessionStorage.removeItem(USER_KEY)
  sessionStorage.removeItem(SESSION_FLAG)
}

export function persistUser(user, { remember = true } = {}) {
  const serialized = user ? JSON.stringify(user) : null

  localStorage.removeItem(USER_KEY)
  sessionStorage.removeItem(USER_KEY)

  if (!serialized) return

  const storage = remember ? localStorage : sessionStorage
  storage.setItem(USER_KEY, serialized)
}

export function readStoredUser() {
  const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setOnUnauthorized(callback) {
  onUnauthorized = callback
}

export function isRememberedSession() {
  return Boolean(localStorage.getItem(SESSION_FLAG) || localStorage.getItem(USER_KEY))
}

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const LOGIN_ENDPOINTS = ['/api/auth/google', '/api/auth/dev-login']

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || ''
    const isLoginRequest = LOGIN_ENDPOINTS.some((endpoint) => url.includes(endpoint))

    if (error.response?.status === 401 && !isLoginRequest) {
      clearAuthToken()
      onUnauthorized?.()
    }
    return Promise.reject(error)
  },
)

function extractError(error) {
  const data = error.response?.data
  if (typeof data?.message === 'string') return data.message
  if (typeof data?.error === 'string') return data.error
  if (typeof data?.error?.message === 'string') return data.error.message
  return error.message || 'Error de red'
}

export function isUnauthorizedError(error) {
  return error?.response?.status === 401 || error?.response?.status === 403
}

export async function GET(route) {
  try {
    const res = await api.get(route)
    return res.data
  } catch (error) {
    throw Object.assign(new Error(extractError(error)), { status: error.response?.status })
  }
}

export async function POST(route, data) {
  try {
    const res = await api.post(route, data)
    return res.data
  } catch (error) {
    throw Object.assign(new Error(extractError(error)), { status: error.response?.status })
  }
}

export async function PUT(route, data, id) {
  try {
    const res = await api.put(`${route}/${id}`, data)
    return res.data
  } catch (error) {
    throw Object.assign(new Error(extractError(error)), { status: error.response?.status })
  }
}

export async function PATCH(route, data) {
  try {
    const res = await api.patch(route, data)
    return res.data
  } catch (error) {
    throw Object.assign(new Error(extractError(error)), { status: error.response?.status })
  }
}

export async function DELETE(route, id) {
  try {
    const res = await api.delete(`${route}/${id}`)
    return res.data
  } catch (error) {
    throw Object.assign(new Error(extractError(error)), { status: error.response?.status })
  }
}

export async function GET_BY_ID(route, id) {
  try {
    const res = await api.get(`${route}/${id}`)
    return res.data
  } catch (error) {
    throw Object.assign(new Error(extractError(error)), { status: error.response?.status })
  }
}
