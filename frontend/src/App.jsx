import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'

import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Login from './pages/Login'
import Register from './pages/Register'
import About from './pages/About'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import {
  TrackOrder, CancelOrder, ShippingPolicy, Returns,
  PrivacyPolicy, Terms, NotFound
} from './pages/StaticPages'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="page-wrap">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                  <Route path="/cancel-order" element={<CancelOrder />} />
                  <Route path="/shipping-policy" element={<ShippingPolicy />} />
                  <Route path="/returns" element={<Returns />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <BackToTop />
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

