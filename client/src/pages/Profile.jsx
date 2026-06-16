import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import { updateProfile } from '../services/api'
import Spinner from '../components/Spinner'

export default function Profile() {
  const { user, loading: authLoading, refreshUser } = useAuth()

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [college, setCollege] = useState('')
  const [hostel, setHostel] = useState('')
  const [course, setCourse] = useState('')
  const [year, setYear] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (authLoading) return <Spinner />

  const startEditing = () => {
    setName(user.name || '')
    setEmail(user.email || '')
    setCollege(user.college || '')
    setHostel(user.hostel || '')
    setCourse(user.course || '')
    setYear(user.year || '')
    setPhone(user.phone || '')
    setWhatsapp(user.whatsapp || '')
    setImageFile(null)
    setEditing(true)
    setError('')
    setSuccess('')
  }

  const cancelEditing = () => {
    setEditing(false)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!name.trim() || !email.trim()) {
      setError('Name and Email are required')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('email', email)
      formData.append('college', college)
      formData.append('hostel', hostel)
      formData.append('course', course)
      formData.append('year', year)
      formData.append('phone', phone)
      formData.append('whatsapp', whatsapp)
      if (imageFile) {
        formData.append('profileImage', imageFile)
      }

      await updateProfile(formData)
      await refreshUser()
      setEditing(false)
      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  // Default avatar with user's initial
  const avatarUrl = user.profileImage || null

  return (
    <div className="profile-page">
      <h1 className="page-title">My Profile</h1>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="profile-header">
        {avatarUrl ? (
          <img src={avatarUrl} alt={user.name} className="profile-avatar" />
        ) : (
          <div
            className="profile-avatar"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              fontSize: '2.5rem',
              fontWeight: 700
            }}
          >
            {user.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
        )}
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      </div>

      {!editing ? (
        <div className="profile-details" style={{ marginTop: '2rem', display: 'grid', gap: '1rem', maxWidth: '500px' }}>
          <div className="profile-card" style={{ padding: '1.5rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--primary-color)' }}>Campus Details</h3>
            <p style={{ margin: '0.5rem 0' }}><strong>College:</strong> {user.college || 'Not specified'}</p>
            <p style={{ margin: '0.5rem 0' }}><strong>Hostel:</strong> {user.hostel || 'Not specified'}</p>
            <p style={{ margin: '0.5rem 0' }}><strong>Course / Branch:</strong> {user.course || 'Not specified'}</p>
            <p style={{ margin: '0.5rem 0' }}><strong>Year of Study:</strong> {user.year || 'Not specified'}</p>
          </div>
          <div className="profile-card" style={{ padding: '1.5rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--primary-color)' }}>Contact Info</h3>
            <p style={{ margin: '0.5rem 0' }}><strong>Phone:</strong> {user.phone || 'Not specified'}</p>
            <p style={{ margin: '0.5rem 0' }}><strong>WhatsApp:</strong> {user.whatsapp || 'Not specified'}</p>
          </div>
          <button className="btn btn-primary" style={{ marginTop: '1rem', width: 'fit-content' }} onClick={startEditing}>
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="listing-form">
          <h2>Edit Profile</h2>

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="college">College Name</label>
            <input
              id="college"
              type="text"
              placeholder="e.g. UCM College"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="hostel">Hostel Name</label>
            <input
              id="hostel"
              type="text"
              placeholder="e.g. Raman Hostel"
              value={hostel}
              onChange={(e) => setHostel(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="course">Course / Branch</label>
            <input
              id="course"
              type="text"
              placeholder="e.g. B.Tech Computer Science"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="year">Year of Study</label>
            <input
              id="year"
              type="text"
              placeholder="e.g. 3rd Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              placeholder="e.g. +919876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="whatsapp">WhatsApp Number</label>
            <input
              id="whatsapp"
              type="text"
              placeholder="e.g. 919876543210"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="profileImage">Profile Image</label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            {imageFile && (
              <div className="image-preview">
                <img src={URL.createObjectURL(imageFile)} alt="Preview" />
              </div>
            )}
          </div>

          <div className="detail-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={cancelEditing}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
