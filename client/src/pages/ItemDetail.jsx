import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getItem, deleteItem, markSold, markAvailable, getWishlist, addToWishlist, removeFromWishlist } from '../services/api'
import useAuth from '../hooks/useAuth'
import Spinner from '../components/Spinner'

export default function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mainImage, setMainImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await getItem(id)
        setItem(res.data)
      } catch (err) {
        setError('Item not found')
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [id])

  // Check if item is in user's wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (!user || !item) return
      try {
        const res = await getWishlist()
        const wishlistItems = res.data
        const found = wishlistItems.some(
          (w) => (w._id || w) === item._id
        )
        setIsWishlisted(found)
      } catch {
        // Wishlist check failed — not critical
      }
    }

    checkWishlist()
  }, [user, item])

  // Check if the current user is the seller
  const isSeller = () => {
    if (!user || !item) return false
    const sellerId = item.seller?._id || item.seller
    return sellerId === user._id || sellerId === user.id
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return

    setActionLoading(true)
    try {
      await deleteItem(id)
      navigate('/')
    } catch (err) {
      setError('Failed to delete item')
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleSold = async () => {
    setActionLoading(true)
    try {
      if (item.isSold) {
        await markAvailable(id)
        setItem({ ...item, isSold: false })
      } else {
        await markSold(id)
        setItem({ ...item, isSold: true })
      }
    } catch (err) {
      setError('Failed to update item status')
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleWishlist = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setActionLoading(true)
    try {
      if (isWishlisted) {
        await removeFromWishlist(item._id)
        setIsWishlisted(false)
      } else {
        await addToWishlist(item._id)
        setIsWishlisted(true)
      }
    } catch (err) {
      setError('Failed to update wishlist')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <Spinner />

  if (error && !item) {
    return (
      <div className="empty-state">
        <h3>{error}</h3>
        <p>The item you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn btn-primary mt-2" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          Back to Home
        </Link>
      </div>
    )
  }

  const images = item.images && item.images.length > 0 ? item.images : []

  return (
    <div className="detail-page">
      {error && <div className="alert alert-error">{error}</div>}

      {/* Image Gallery */}
      <div className="detail-images">
        {images.length > 0 ? (
          <img
            src={images[mainImage]}
            alt={item.title}
            className="detail-main-image"
          />
        ) : (
          <div
            className="detail-main-image"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '300px',
              fontSize: '4rem'
            }}
          >
            📦
          </div>
        )}

        {images.length > 1 && (
          <div className="detail-thumbnails">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${item.title} ${index + 1}`}
                className={`detail-thumbnail ${index === mainImage ? 'active' : ''}`}
                onClick={() => setMainImage(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Item Info */}
      <div className="detail-info">
        <h1>{item.title}</h1>
        <p className="detail-price">₹{item.price}</p>

        <div className="detail-badges">
          <span className="badge badge-category">{item.category}</span>
          <span className="badge badge-condition">{item.condition}</span>
          {item.isSold ? (
            <span className="badge badge-sold">SOLD</span>
          ) : (
            <span className="badge badge-available">Available</span>
          )}
        </div>

        <p className="detail-description">{item.description}</p>

        {/* Seller Info */}
        <div className="detail-seller">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '0.75rem', borderBottom: '1px solid #eee', paddingBottom: '0.25rem' }}>Seller Information</h3>
          <p><strong>Name:</strong> {item.seller?.name || 'Unknown'}</p>
          {item.seller?.email && <p><strong>Email:</strong> {item.seller.email}</p>}
          {item.seller?.college && <p><strong>College:</strong> {item.seller.college}</p>}
          {item.seller?.hostel && <p><strong>Hostel:</strong> {item.seller.hostel}</p>}
          {item.seller?.course && <p><strong>Course:</strong> {item.seller.course}</p>}
          {item.seller?.year && <p><strong>Year of Study:</strong> {item.seller.year}</p>}

          {(item.seller?.phone || item.seller?.whatsapp || item.seller?.email) && (
            <div className="contact-preferences" style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.6rem', color: 'var(--text-color)' }}>Contact Seller</h4>
              <div className="contact-links" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {item.seller?.phone && (
                  <a href={`tel:${item.seller.phone}`} className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
                    📞 Call Seller
                  </a>
                )}
                {item.seller?.whatsapp && (
                  <a href={`https://wa.me/${item.seller.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
                    💬 WhatsApp Seller
                  </a>
                )}
                {item.seller?.email && (
                  <a href={`mailto:${item.seller.email}`} className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
                    ✉️ Email Seller
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="detail-actions">
          {isSeller() ? (
            <>
              <Link to={`/edit/${item._id}`} className="btn btn-primary">
                Edit Listing
              </Link>
              <button
                className={`btn ${item.isSold ? 'btn-success' : 'btn-secondary'}`}
                onClick={handleToggleSold}
                disabled={actionLoading}
              >
                {item.isSold ? 'Mark as Available' : 'Mark as Sold'}
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={actionLoading}
              >
                Delete
              </button>
            </>
          ) : (
            user && (
              <button
                className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                onClick={handleToggleWishlist}
                disabled={actionLoading}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                {isWishlisted ? '❤️' : '🤍'} {isWishlisted ? 'Saved' : 'Save to Wishlist'}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )
}
