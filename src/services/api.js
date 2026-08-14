import axios from 'axios'

const DEV_URL = 'http://localhost:4000'
const PROD_URL = 'https://clf404.ar'

const TOKEN_KEY = 'cfl404_token'
const USER_KEY = 'cfl404_user'

let authToken = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
let onUnauthorized = null

export function getAuthToken() {
  return authToken
    || localStorage.getItem(TOKEN_KEY)
    || sessionStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token, { remember = true } = {}) {
  authToken = token || null

  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)

  if (!token) return

  const storage = remember ? localStorage : sessionStorage
  storage.setItem(TOKEN_KEY, token)
}

export function clearAuthToken() {
  authToken = null
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)
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

function authStoragePrefersRemember() {
  return Boolean(localStorage.getItem(TOKEN_KEY))
}

export function isRememberedSession() {
  return authStoragePrefersRemember()
}

const api = axios.create({
  baseURL: import.meta.env.PROD ? PROD_URL : DEV_URL,
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login')
    if (error.response?.status === 401 && !isLoginRequest) {
      clearAuthToken()
      onUnauthorized?.()
    }
    return Promise.reject(error)
  },
)

function extractError(error) {
  return error.response?.data?.error
    || error.response?.data?.message
    || error.message
    || 'Error de red'
}

export async function GET(route) {
  try {
    const res = await api.get(route)
    return res.data
  } catch (error) {
    throw new Error(extractError(error))
  }
}

export async function POST(route, data) {
  try {
    const res = await api.post(route, data)
    return res.data
  } catch (error) {
    throw new Error(extractError(error))
  }
}

export async function PUT(route, data, id) {
  try {
    const res = await api.put(`${route}/${id}`, data)
    return res.data
  } catch (error) {
    throw new Error(extractError(error))
  }
}

export async function DELETE(route, id) {
  try {
    const res = await api.delete(`${route}/${id}`)
    return res.data
  } catch (error) {
    throw new Error(extractError(error))
  }
}

export async function GET_BY_ID(route, id) {
  try {
    const res = await api.get(`${route}/${id}`)
    return res.data
  } catch (error) {
    throw new Error(extractError(error))
  }
}
