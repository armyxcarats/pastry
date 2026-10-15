import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import MetaData from '../Layout/MetaData'
import Sidebar from './SideBar'
import './Dashboard.css'

const currency = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
})

const formatDate = (date) => new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium'
}).format(new Date(date))

const Dashboard = () => {
    const [summary, setSummary] = useState({
        products: 0,
        catalog: [],
        orders: 0,
        customers: 0,
        revenue: 0,
        recentOrders: []
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let isCurrent = true

        const loadDashboard = async () => {
            try {
                const [productsResponse, ordersResponse, usersResponse] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API}/admin/products`, { withCredentials: true }),
                    axios.get(`${import.meta.env.VITE_API}/admin/orders`, { withCredentials: true }),
                    axios.get(`${import.meta.env.VITE_API}/admin/users`, { withCredentials: true })
                ])

                if (!isCurrent) return

                const products = productsResponse.data.products || []
                const orders = ordersResponse.data.orders || []
                const customers = (usersResponse.data.users || []).filter((user) => user.role !== 'admin')
                const recentOrders = [...orders]
                    .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt))
                    .slice(0, 5)

                setSummary({
                    products: products.length,
                    catalog: products,
                    orders: orders.length,
                    customers: customers.length,
                    revenue: Number(ordersResponse.data.totalAmount || 0),
                    recentOrders
                })
            } catch (requestError) {
                if (isCurrent) {
                    setError(
                        requestError.response?.data?.message
                        || 'The admin dashboard could not load. Please try again.'
                    )
                }
            } finally {
                if (isCurrent) setLoading(false)
            }
        }

        loadDashboard()

        return () => {
            isCurrent = false
        }
    }, [])

    const productsByCategory = summary.catalog.reduce((groups, product) => {
        const categoryName = product.category?.name || 'Uncategorized'
        if (!groups.has(categoryName)) groups.set(categoryName, [])
        groups.get(categoryName).push(product)
        return groups
    }, new Map())

    return (
        <>
            <MetaData title="Admin Dashboard" />
            <main className="admin-dashboard-page">
                <aside className="admin-dashboard-sidebar">
                    <Sidebar />
                </aside>

                <section className="admin-dashboard-content">
                    <header className="admin-dashboard-heading">
                        <div>
                            <p className="admin-dashboard-eyebrow">CRUMB &amp; CO. MANAGEMENT</p>
                            <h1>Admin dashboard</h1>
                            <p>Here’s an overview of your bakery’s activity.</p>
                        </div>
                    </header>

                    {error && <p className="admin-dashboard-error" role="alert">{error}</p>}

                    <section className="admin-dashboard-stats" aria-label="Store overview">
                        <article className="admin-dashboard-stat">
                            <span>Products</span>
                            <strong>{loading ? '...' : summary.products}</strong>
                            <span className="admin-dashboard-stat-note">In your catalog</span>
                        </article>
                        <article className="admin-dashboard-stat">
                            <span>Orders</span>
                            <strong>{loading ? '...' : summary.orders}</strong>
                            <span className="admin-dashboard-stat-note">Orders received</span>
                        </article>
                        <article className="admin-dashboard-stat">
                            <span>Customers</span>
                            <strong>{loading ? '...' : summary.customers}</strong>
                            <span className="admin-dashboard-stat-note">Registered accounts</span>
                        </article>
                        <article className="admin-dashboard-stat">
                            <span>Total revenue</span>
                            <strong>{loading ? '...' : currency.format(summary.revenue)}</strong>
                            <span className="admin-dashboard-stat-note">Across all orders</span>
                        </article>
                    </section>

                    <section className="admin-dashboard-catalog" aria-labelledby="admin-catalog-heading">
                        <div className="admin-dashboard-section-heading">
                            <div>
                                <p className="admin-dashboard-eyebrow">YOUR BAKERY MENU</p>
                                <h2 id="admin-catalog-heading">Products by category</h2>
                            </div>
                            <Link to="/admin/products">Manage products <span aria-hidden="true">&rarr;</span></Link>
                        </div>

                        {loading ? (
                            <p className="admin-dashboard-message">Loading products...</p>
                        ) : productsByCategory.size ? (
                            [...productsByCategory.entries()].map(([category, products]) => (
                                <section className="admin-dashboard-category" key={category}>
                                    <h3>{category} <span>{products.length}</span></h3>
                                    <div className="admin-dashboard-product-list">
                                        {products.map((product) => (
                                            <Link
                                                className="admin-dashboard-product"
                                                key={product._id}
                                                to={`/admin/product/${product._id}`}
                                            >
                                                {product.images?.[0]?.url ? (
                                                    <img src={product.images[0].url} alt="" loading="lazy" />
                                                ) : (
                                                    <span className="admin-dashboard-product-placeholder" aria-hidden="true">B</span>
                                                )}
                                                <span className="admin-dashboard-product-info">
                                                    <strong>{product.name}</strong>
                                                    <span>{currency.format(Number(product.price || 0))} · {product.stock} in stock</span>
                                                </span>
                                                <span className={`admin-dashboard-product-status ${product.isAvailable === false ? 'is-unavailable' : ''}`}>
                                                    {product.isAvailable === false ? 'Unavailable' : 'Available'}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            ))
                        ) : (
                            <p className="admin-dashboard-message">No products are in the catalog yet.</p>
                        )}
                    </section>

                    <section className="admin-dashboard-orders" aria-labelledby="admin-recent-orders">
                        <div className="admin-dashboard-section-heading">
                            <div>
                                <p className="admin-dashboard-eyebrow">LATEST ACTIVITY</p>
                                <h2 id="admin-recent-orders">Recent orders</h2>
                            </div>
                            <Link to="/admin/orders">Manage orders <span aria-hidden="true">&rarr;</span></Link>
                        </div>

                        {loading ? (
                            <p className="admin-dashboard-message">Loading store activity...</p>
                        ) : summary.recentOrders.length ? (
                            <div className="admin-dashboard-order-list">
                                {summary.recentOrders.map((order) => (
                                    <article className="admin-dashboard-order" key={order._id}>
                                        <div>
                                            <Link to={`/admin/order/${order._id}`}>
                                                Order #{order._id.slice(-6).toUpperCase()}
                                            </Link>
                                            <span>{formatDate(order.createdAt)}</span>
                                        </div>
                                        <span className="admin-dashboard-order-status">
                                            {order.orderStatus || 'Pending'}
                                        </span>
                                        <strong>{currency.format(Number(order.totalPrice || 0))}</strong>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <p className="admin-dashboard-message">No orders have been placed yet.</p>
                        )}
                    </section>
                </section>
            </main>
        </>
    )
}

export default Dashboard
