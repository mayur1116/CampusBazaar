import axios from 'axios'

// Create axios instance with /api base URL
const api = axios.create({
  baseURL: 'https://campusbazaar-ro9k.onrender.com/api'
})

// Attach the auth token to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ===== Auth =====
export const loginUser = (data) => api.post('/auth/login', data)
export const registerUser = (data) => api.post('/auth/register', data)
export const getCurrentUser = () => api.get('/auth/me')

// ===== Items =====
export const getItems = (params) => api.get('/items', { params })
export const getItem = (id) => api.get(`/items/${id}`)
export const createItem = (formData) =>
  api.post('/items', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const updateItem = (id, formData) =>
  api.put(`/items/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
export const deleteItem = (id) => api.delete(`/items/${id}`)
export const markSold = (id) => api.put(`/items/${id}/sold`)
export const markAvailable = (id) => api.put(`/items/${id}/available`)

// ===== Wishlist =====
export const getWishlist = () => api.get('/wishlist')
export const addToWishlist = (itemId) => api.post(`/wishlist/${itemId}`)
export const removeFromWishlist = (itemId) => api.delete(`/wishlist/${itemId}`)

// ===== Profile =====
export const getProfile = () => api.get('/users/profile')
export const updateProfile = (formData) =>
  api.put('/users/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

export default api
