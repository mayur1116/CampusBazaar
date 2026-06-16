import { Link } from 'react-router-dom'

export default function ItemCard({ item }) {
  // Use the first image or show a placeholder
  const imageUrl = item.images && item.images.length > 0
    ? item.images[0]
    : null

  return (
    <Link to={`/items/${item._id}`} className="item-card">
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

        {/* Sold banner overlay */}
        {item.isSold && <div className="sold-overlay">SOLD</div>}
      </div>

      <div className="card-body">
        <h3 className="card-title">{item.title}</h3>
        <p className="card-price">₹{item.price}</p>
        <div className="card-meta">
          <span className="badge badge-category">{item.category}</span>
          <span className="badge badge-condition">{item.condition}</span>
        </div>
      </div>
    </Link>
  )
}
