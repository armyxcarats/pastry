import React, { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Product from './Product/Product'
// import products from '../products.json'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import MetaData from './Layout/MetaData'
import Loader from './Layout/Loader';
import Pagination from '@mui/material/Pagination';
import axios from 'axios'

import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../actions/productActions'

const Home = () => {
    // console.log(products)
    // const [products, setProducts] = useState([])
    const [price, setPrice] = useState([1, 1000]);
    // const [loading, setLoading] = useState(true)
    // const [productsCount, setProductsCount] = useState(0)
    // const [resPerPage, setResPerPage] = useState(0)
    // const [filteredProductsCount, setFilteredProductsCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [activeCategory, setActiveCategory] = useState('All bakes')
    let { keyword } = useParams();
    const dispatch = useDispatch();
    const { loading, products, error, productsCount, resPerPage, filteredProductsCount } = useSelector(state => state.products);

    let count = productsCount;

    if (keyword) {
        count = filteredProductsCount
    }



    // const getProducts = async (keyword = '', price, page = 1) => {

    //     let link = `http://localhost:4001/api/v1/products?keyword=${keyword}&price[gte]=${price[0]}&price[lte]=${price[1]}&page=${page}`
    //     // http://localhost:4001/api/v1/products?keyword=''
    //     // http://localhost:4001/api/v1/products?keyword=adid&page=1&price[gte]=100&price[lte]=1000
    //     let res = await axios.get(link)
    //     console.log(res.data.products)
    //     setProducts(res.data.products)
    //     setProductsCount(res.data.productsCount)
    //     setFilteredProductsCount(res.data.filteredProductsCount)
    //     setResPerPage(res.data.resPerPage)
    //     setLoading(false)
    // }

    const handleChange = (event, newValue) => {
        setPrice(newValue);
    };

    const categories = useMemo(() => [
        'All bakes',
        ...new Set((products || []).map((product) => product.category?.name).filter(Boolean))
    ], [products])
    const visibleProducts = activeCategory === 'All bakes'
        ? products
        : products.filter((product) => product.category?.name === activeCategory)

    function valuetext(price) {
        return `P${price.toString()}`;
    }
    // getProducts()
    // useEffect(() => {
    //     // getProducts(keyword, price, currentPage)
    // }, [keyword, price, currentPage]);
    useEffect(() => {

        dispatch(getProducts(currentPage, keyword, price))
    }, [currentPage, keyword, price, dispatch]);

    return (
        <>
            <MetaData title={'shop Here'} />
            {loading ? <Loader /> : (
                <main className="bakery-storefront">
                    <section className="bakery-welcome">
                        <div className="bakery-welcome-copy">
                            <p className="bakery-welcome-kicker">CRUMB & CO. · SMALL-BATCH BAKERY</p>
                            <h1>A little joy,<br />fresh from the oven.</h1>
                            <p className="bakery-welcome-description">Cookies, pastries, and sweet little reasons to slow down. Find your new favorite, baked fresh for you.</p>
                            <a className="bakery-welcome-button" href="#products">Browse the bakes <span aria-hidden="true">&rarr;</span></a>
                        </div>
                        <div className="bakery-welcome-photo">
                            <img
                                src={products?.[0]?.images?.[0]?.url || 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=85'}
                                alt="Freshly baked cookies"
                            />
                            <span>Made for your<br />happy place</span>
                        </div>
                    </section>

                    <div className="container container-fluid bakery-catalog">
                        <div className="bakery-catalog-heading">
                            <div>
                                <p className="bakery-welcome-kicker">FROM OUR OVEN TO YOU</p>
                                <h2 id="products_heading">Find your favorite</h2>
                            </div>
                            <span>Freshly baked, always worth sharing.</span>
                        </div>
                        <section id="products" className="container mt-4">
                    {/* <div className="row">
                        {products && products.map(product => (
                            <Product key={product._id} product={product} />
                            // <Product product={product} />


                        ))}
                    </div> */}
                    <nav className="bakery-category-chips" aria-label="Filter products by category">
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                className={activeCategory === category ? 'active' : ''}
                                aria-pressed={activeCategory === category}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </nav>
                    {error && <p className="alert alert-danger" role="alert">{error}</p>}
                    <div className="row">
                        {keyword ? (
                            <>
                                <div className="col-6 col-md-3 mt-5 mb-5">
                                    <Box sx={{ width: 150 }}>
                                        <Slider
                                            getAriaLabel={() => 'Price Filter'}
                                            value={price}
                                            onChange={handleChange}
                                            valueLabelDisplay="on"
                                            getAriaValueText={valuetext}
                                            min={1}
                                            max={1000}

                                        />
                                    </Box>
                                    <div className="mt-5">
                                        <h4 className="mb-3">
                                            Categories
                                        </h4>

                                    </div>



                                </div>

                                <div className="col-6 col-md-9">
                                    <div className="row">
                                        {visibleProducts.map(product => (
                                            <Product key={product._id} product={product} />
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            visibleProducts.map(product => (
                                <Product key={product._id} product={product} />
                            ))
                        )}

                    </div>
                    {resPerPage < count && (
                        <div className="d-flex justify-content-center mt-5">
                            <Stack spacing={2}>
                                <Pagination
                                    count={Math.ceil(count / resPerPage)}
                                    page={currentPage}
                                    onChange={(event, value) => setCurrentPage(value)}
                                    // onChange={setCurrentPageNo}
                                    color="primary"
                                    variant="outlined"
                                    shape="rounded"
                                    showFirstButton
                                    showLastButton
                                    size="large"
                                    sx={{
                                        backgroundColor: 'white',

                                    }}
                                />
                            </Stack>
                        </div>
                    )}
                        </section>
                    </div>
                </main>
            )}
        </>
    )
}

export default Home