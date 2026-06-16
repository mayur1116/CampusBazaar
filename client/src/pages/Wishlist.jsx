import { useState, useEffect } from 'react'
import { getWishlist, removeFromWishlist } from '../services/api'
import ItemCard from '../components/ItemCard'
import Spinner from '../components/Spinner'

export default function Wishlist() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const res = await getWishlist()
      setItems(res.data)
    } catch (err) {
      setError('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (itemId) => {
    try {
      await removeFromWishlist(itemId)
      // Remove item from local state immediately
      setItems((prev) => prev.filter((item) => item._id !== itemId))
    } catch (err) {
      setError('Failed to remove item from wishlist')
    }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <h1 className="page-title">My Wishlist</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>Your wishlist is empty</h3>
          <p>Browse items and save the ones you like!</p>
        </div>
      ) : (
        <div className="item-grid">
          {items.map((item) => (
            <div key={item._id} className="wishlist-card-wrapper">
              <button
                className="wishlist-remove-btn"
                onClick={() => handleRemove(item._id)}
                title="Remove from wishlist"
              >
                ✕
              </button>
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
