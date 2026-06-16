import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getItem, updateItem } from '../services/api'
import useAuth from '../hooks/useAuth'
import Spinner from '../components/Spinner'

export default function EditListing() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Books')
  const [condition, setCondition] = useState('Good')
  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  // Fetch existing item data
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await getItem(id)
        const item = res.data

        // Only the owner can edit
        const sellerId = item.seller?._id || item.seller
        if (sellerId !== user?._id && sellerId !== user?.id) {
          navigate('/')
          return
        }

        setTitle(item.title)
        setDescription(item.description)
        setPrice(item.price.toString())
        setCategory(item.category)
        setCondition(item.condition)
        setExistingImages(item.images || [])
      } catch (err) {
        setError('Failed to load item')
      } finally {
        setFetching(false)
      }
    }

    fetchItem()
  }, [id, user, navigate])

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setNewImages(files)
    const previewUrls = files.map((file) => URL.createObjectURL(file))
    setPreviews(previewUrls)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !description.trim() || !price) {
      setError('Please fill in all required fields')
      return
    }

    if (Number(price) <= 0) {
      setError('Price must be greater than 0')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('category', category)
      formData.append('condition', condition)

      // If new images were selected, send them (they replace old ones)
      newImages.forEach((img) => {
        formData.append('images', img)
      })

      await updateItem(id, formData)
      navigate(`/items/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <Spinner />

  return (
    <div>
      <form className="listing-form" onSubmit={handleSubmit}>
        <h2>Edit Listing</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price (₹)</label>
          <input
            id="price"
            type="number"
            min="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Books">Books</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Cycle">Cycle</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="condition">Condition</label>
          <select
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="New">New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
        </div>

        {/* Show existing images */}
        {existingImages.length > 0 && (
          <div className="form-group">
            <label>Current Images</label>
            <div className="image-preview">
              {existingImages.map((src, index) => (
                <img key={index} src={src} alt={`Current ${index + 1}`} />
              ))}
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="images">
            {existingImages.length > 0 ? 'Replace Images (optional)' : 'Images'}
          </label>
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          {previews.length > 0 && (
            <div className="image-preview">
              {previews.map((src, index) => (
                <img key={index} src={src} alt={`New ${index + 1}`} />
              ))}
            </div>
          )}
        </div>

        <div className="detail-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Listing'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(`/items/${id}`)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
