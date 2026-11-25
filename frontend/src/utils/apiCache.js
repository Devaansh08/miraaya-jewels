import axios from 'axios'

// ── In-Memory + SessionStorage Micro-Cache for Instant UI Transitions ──
const memoryCache = new Map()
const DEFAULT_TTL_MS = 3 * 60 * 1000 // 3 minutes

/**
 * Retrieves cached data synchronously if available & unexpired.
 */
export function getCached(key) {
  const item = memoryCache.get(key)
  if (item && Date.now() - item.timestamp < DEFAULT_TTL_MS) {
    return item.data
  }
  try {
    const raw = sessionStorage.getItem('__mj_cache_' + key)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Date.now() - parsed.timestamp < DEFAULT_TTL_MS) {
        memoryCache.set(key, parsed)
        return parsed.data
      }
    }
  } catch { }
  return null
}

/**
 * Stores data in memory + sessionStorage
 */
export function setCached(key, data) {
  const payload = { data, timestamp: Date.now() }
  memoryCache.set(key, payload)
  try {
    sessionStorage.setItem('__mj_cache_' + key, JSON.stringify(payload))
  } catch { }
}

/**
 * Automatic Axios Caching Interceptor (Stale-While-Revalidate)
 * Transparently accelerates all GET /api/ requests across the whole app.
 */
export function setupAxiosCache() {
  axios.interceptors.request.use(config => {
    if (config.method?.toLowerCase() === 'get' && config.url?.startsWith('/api/')) {
      const cacheKey = config.url + (config.params ? JSON.stringify(config.params) : '')
      const cached = getCached(cacheKey)
      if (cached) {
        config.__cachedData = cached
      }
    }
    return config
  })

  axios.interceptors.response.use(response => {
    if (
      response.config.method?.toLowerCase() === 'get' &&
      response.config.url?.startsWith('/api/') &&
      response.status === 200 &&
      response.data
    ) {
      const cacheKey = response.config.url + (response.config.params ? JSON.stringify(response.config.params) : '')
      setCached(cacheKey, response.data)
    }
    return response
  })
}
