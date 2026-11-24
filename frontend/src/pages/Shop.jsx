import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi'
import './Shop.css'

const CATEGORIES = ['Necklaces','Rings','Bangles','Earrings','Hair Accessories','Watches']
const SORTS = [
  { value:'',         label:'Featured' },
  { value:'newest',  label:'Newest First' },
  { value:'price-asc',label:'Price: Low to High' },
  { value:'price-desc',label:'Price: High to Low' },
  { value:'discount', label:'Best Discount' },
]

const ALL_PRODUCTS = [
  { id:1,  name:'Rani Kundan Floral Bangle Pair',       slug:'rani-kundan-floral-bangle-pair',       price:2650, mrp:3050, category:'Bangles',          image_url:'/images/products/bangle-pair.jpg',       featured:true },
  { id:2,  name:'Green Stone Kundan Jhumka Earrings',   slug:'green-stone-kundan-jhumka-earrings',   price:1800, mrp:2200, category:'Earrings',          image_url:'/images/products/jhumka-earrings.jpg',   featured:true },
  { id:3,  name:'Triple Layer Kundan Necklace Set',     slug:'triple-layer-kundan-necklace-set',     price:3200, mrp:3800, category:'Necklaces',          image_url:'/images/products/necklace-set.jpg',       featured:true },
  { id:4,  name:'Green Stone Cocktail Ring',            slug:'green-stone-cocktail-ring',            price:1250, mrp:1600, category:'Rings',              image_url:'/images/products/cocktail-ring.jpg',      featured:true },
  { id:5,  name:'Kundan Pearl Passa Hair Ornament',     slug:'kundan-pearl-passa-hair-ornament',     price:2400, mrp:2800, category:'Hair Accessories',   image_url:'/images/products/passa-ornament.jpg' },
  { id:6,  name:'Ruby Heart Dial Cuff Watch',           slug:'ruby-heart-dial-cuff-watch',           price:2900, mrp:3400, category:'Watches',            image_url:'/images/products/cuff-watch.jpg' },
  { id:7,  name:'Pearl Layer Peacock Necklace Set',     slug:'pearl-layer-peacock-necklace-set',     price:3500, mrp:4100, category:'Necklaces',          image_url:'/images/products/peacock-necklace.jpg' },
  { id:8,  name:'Peacock Arch Pearl Jhumka Earrings',   slug:'peacock-arch-pearl-jhumka-earrings',   price:1950, mrp:2400, category:'Earrings',           image_url:'/images/products/peacock-earrings.jpg' },
  { id:9,  name:'Sparkle Stone Bangle Pair',            slug:'sparkle-stone-bangle-pair',            price:1750, mrp:2275, category:'Bangles',            image_url:'/images/products/sparkle-bangle.jpg' },
  { id:10, name:'Pearl Fringe Meenakari Bangles',       slug:'pearl-fringe-meenakari-bangles',       price:2750, mrp:3175, category:'Bangles',            image_url:'/images/products/meenakari-bangles.jpg' },
  { id:11, name:'Royal Enamel Kada Pair',               slug:'royal-enamel-kada-pair',               price:2550, mrp:2950, category:'Bangles',            image_url:'/images/products/bangle-pair.jpg' },
  { id:12, name:'Rajwadi Blossom Kada Pair',            slug:'rajwadi-blossom-kada-pair',            price:2700, mrp:3050, category:'Bangles',            image_url:'/images/products/meenakari-bangles.jpg' },
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products,    setProducts]    = useState(ALL_PRODUCTS)
  const [loading,     setLoading]     = useState(false)
  const [filterOpen,  setFilterOpen]  = useState(false)

  const category = searchParams.get('category') || ''
  const sort     = searchParams.get('sort')     || ''
  const search   = searchParams.get('search')   || ''

  useEffect(() => {
    setLoading(true)
    axios.get('/api/products', { params: { category, sort, search } })
      .then(r => setProducts(r.data))
      .catch(() => {
        // Fallback: filter locally
        let list = [...ALL_PRODUCTS]
        if (category) list = list.filter(p => p.category === category)
        if (search)   list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        if (sort === 'price-asc')  list.sort((a,b) => a.price - b.price)
        if (sort === 'price-desc') list.sort((a,b) => b.price - a.price)
        if (sort === 'newest')     list.sort((a,b) => b.id - a.id)
        if (sort === 'discount')   list.sort((a,b) => (b.mrp-b.price)/b.mrp - (a.mrp-a.price)/a.mrp)
        setProducts(list)
      })
      .finally(() => setLoading(false))
  }, [category, sort, search])

  const setFilter = (key, val) => {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val); else p.delete(key)
    setSearchParams(p)
  }

  const clearAll = () => setSearchParams({})

  const hasFilters = category || sort || search

  return (
    <div className="shop-page">
      {/* Header */}
      <div className="shop-header">
        <div className="container">
          <div className="shop-header__breadcrumb">
            <Link to="/">Home</Link> / <span>Shop</span>
            {category && <> / <span>{category}</span></>}
          </div>
          <h1 className="shop-header__title">
            {category || (search ? `Search: "${search}"` : 'All Jewellery')}
          </h1>
          <p className="shop-header__count">{products.length} piece{products.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="container shop-layout">
        {/* Sidebar filters */}
        <aside className={`shop-sidebar ${filterOpen ? 'shop-sidebar--open' : ''}`}>
          <div className="sidebar-section">
            <h3 className="sidebar-title">Categories</h3>
            <ul className="sidebar-list">
              <li>
                <button
                  className={`sidebar-link ${!category ? 'sidebar-link--active' : ''}`}
                  onClick={() => setFilter('category', '')}
                >All</button>
              </li>
              {CATEGORIES.map(c => (
                <li key={c}>
                  <button
                    className={`sidebar-link ${category === c ? 'sidebar-link--active' : ''}`}
                    onClick={() => setFilter('category', c)}
                  >{c}</button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <div className="shop-main">
          {/* Toolbar */}
          <div className="shop-toolbar">
            <button className="shop-toolbar__filter-btn" onClick={() => setFilterOpen(o => !o)}>
              <FiFilter size={15} /> Filter
            </button>
            {hasFilters && (
              <button className="shop-toolbar__clear" onClick={clearAll}>
                <FiX size={13} /> Clear filters
              </button>
            )}
            <div className="shop-toolbar__sort">
              <label htmlFor="sort-select" className="shop-toolbar__sort-label">Sort by</label>
              <select
                id="sort-select"
                value={sort}
                onChange={e => setFilter('sort', e.target.value)}
                className="shop-toolbar__sort-select"
              >
                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <FiChevronDown size={13} className="shop-toolbar__sort-icon" />
            </div>
          </div>

          {/* Category pills */}
          <div className="category-pills">
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`category-pill ${category === c ? 'category-pill--active' : ''}`}
                onClick={() => setFilter('category', category === c ? '' : c)}
              >{c}</button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="shop-empty">
              <p>No products found.</p>
              <button className="btn btn-outline" onClick={clearAll}>Clear Filters</button>
            </div>
          ) : (
            <div className="shop-grid">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
