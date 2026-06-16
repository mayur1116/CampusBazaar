import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createItem } from '../services/api'

export default function CreateListing() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Books')
  const [condition, setCondition] = useState('Good')
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)

    // Generate preview URLs
    const previewUrls = files.map((file) => URL.createObjectURL(file))
    setPreviews(previewUrls)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
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

      // Append each image file
      images.forEach((img) => {
        formData.append('images', img)
      })

      const res = await createItem(formData)
      navigate(`/items/${res.data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form className="listing-form" onSubmit={handleSubmit}>
        <h2>Sell an Item</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="What are you selling?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Describe your item..."
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
            placeholder="0"
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

        <div className="form-group">
          <label htmlFor="images">Images</label>
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
                <img key={index} src={src} alt={`Preview ${index + 1}`} />
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  )
}
