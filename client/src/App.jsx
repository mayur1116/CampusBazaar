import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import CreateListing from './pages/CreateListing'
import EditListing from './pages/EditListing'
import ItemDetail from './pages/ItemDetail'
import Wishlist from './pages/Wishlist'
import MyListings from './pages/MyListings'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="/create" element={
              <ProtectedRoute><CreateListing /></ProtectedRoute>
            } />
            <Route path="/edit/:id" element={
              <ProtectedRoute><EditListing /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/wishlist" element={
              <ProtectedRoute><Wishlist /></ProtectedRoute>
            } />
            <Route path="/my-listings" element={
              <ProtectedRoute><MyListings /></ProtectedRoute>
            } />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
