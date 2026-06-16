import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getItems, deleteItem, markSold, markAvailable } from '../services/api'
import useAuth from '../hooks/useAuth'
import Spinner from '../components/Spinner'

export default function MyListings() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyItems()
  }, [user])

  const fetchMyItems = async () => {
    try {
      const res = await getItems()
      // Filter items client-side to show only current user's listings
      const myItems = res.data.filter((item) => {
        const sellerId = item.seller?._id || item.seller
        return sellerId === user?._id || sellerId === user?.id
      })
      setItems(myItems)
    } catch (err) {
      setError('Failed to load your listings')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return

    try {
      await deleteItem(itemId)
      setItems((prev) => prev.filter((item) => item._id !== itemId))
    } catch (err) {
      setError('Failed to delete item')
    }
  }

  const handleToggleSold = async (item) => {
    try {
      if (item.isSold) {
        await markAvailable(item._id)
      } else {
        await markSold(item._id)
      }
      // Update item in local state
      setItems((prev) =>
        prev.map((i) =>
          i._id === item._id ? { ...i, isSold: !i.isSold } : i
        )
      )
    } catch (err) {
      setError('Failed to update item status')
    }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <div className="flex-between mb-3">
        <h1 className="page-title" style={{ marginBottom: 0 }}>My Listings</h1>
        <Link to="/create" className="btn btn-primary">
          + New Listing
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>No listings yet</h3>
          <p>Start selling by creating your first listing!</p>
        </div>
      ) : (
        <div className="item-grid">
          {items.map((item) => {
            // Get the first image or use a placeholder
            const imageUrl = item.images && item.images.length > 0
              ? item.images[0]
              : null

            return (
              <div key={item._id} className="item-card" style={{ cursor: 'default' }}>
                <Link to={`/items/${item._id}`}>
                  <div className="card-image-wrapper">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.title} className="card-image" />
                    ) : (
                      <div className="card-image" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        color: 'var(--primary)',
                        background: 'linear-gradient(135deg, var(--primary-light), #e0f2fe)'
                      }}>
                        📦
                      </div>
                    )}
                    {item.isSold && <div className="sold-overlay">SOLD</div>}
                  </div>

                  <div className="card-body">
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-price">₹{item.price}</p>
                    <div className="card-meta">
                      <span className="badge badge-category">{item.category}</span>
                      <span className="badge badge-condition">{item.condition}</span>
                      {item.isSold ? (
                        <span className="badge badge-sold">SOLD</span>
                      ) : (
                        <span className="badge badge-available">Available</span>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Quick actions for the seller */}
                <div className="card-actions">
                  <Link to={`/edit/${item._id}`} className="btn btn-secondary btn-sm">
                    Edit
                  </Link>
                  <button
                    className={`btn btn-sm ${item.isSold ? 'btn-success' : 'btn-secondary'}`}
                    onClick={() => handleToggleSold(item)}
                  >
                    {item.isSold ? 'Mark Available' : 'Mark Sold'}
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
