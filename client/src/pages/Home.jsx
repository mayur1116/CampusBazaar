import { useState, useEffect } from 'react'
import { getItems } from '../services/api'
import ItemCard from '../components/ItemCard'
import Spinner from '../components/Spinner'

export default function Home() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [condition, setCondition] = useState('')

  // Fetch items whenever filters change
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      try {
        const params = {}
        if (search) params.search = search
        if (category) params.category = category
        if (condition) params.condition = condition

        const res = await getItems(params)
        setItems(res.data)
      } catch (err) {
        console.error('Failed to fetch items:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [category, condition])

  // Search on Enter key press
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSearch = async () => {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (category) params.category = category
      if (condition) params.condition = condition

      const res = await getItems(params)
      setItems(res.data)
    } catch (err) {
      console.error('Failed to search items:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="page-title">Browse Items</h1>

      {/* Search and filter bar */}
      <div className="search-filters">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Books">Books</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Cycle">Cycle</option>
          <option value="Others">Others</option>
        </select>

        <select value={condition} onChange={(e) => setCondition(e.target.value)}>
          <option value="">All Conditions</option>
          <option value="New">New</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
        </select>

        <button className="btn btn-primary btn-sm" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Items display */}
      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <div className="empty-state">
          <h3>No items found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="item-grid">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
