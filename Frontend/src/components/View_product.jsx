import { useState, useEffect } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import '../css/Home.css'
import Header from "./header"


const View_product = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('jwtToken')
    const apiUrl = "http://localhost:3000/api/product/view-product";

    const [ViewProduct, setViewProduct] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (token === null) {
            console.log('Token not available')
            navigate('/')
            return
        }
    }, [token, navigate])

    async function Fetch_product() {
        try {
            setLoading(true)
            const res = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            if (!res.data) {
                console.log('No data found')
            }
            setViewProduct(res.data)
        } catch (error) {
            if(error.response){
                const {status} = error.response
                if(status === 401){
                    localStorage.removeItem('jwtToken')
                    navigate('/')
                }
            }
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        Fetch_product()
    }, [])

    if (loading) {
        return (
            <>
                <Header />
                <div className="loading">Loading products...</div>
            </>
        )
    }

    if (ViewProduct.length === 0) {
        return (
            <>
                <Header />
                <div className="empty-state">
                    <h3>No Products Available</h3>
                    <p>Check back later for new arrivals!</p>
                </div>
            </>
        )
    }

    return (
        <>
            <Header />
            <div className="product-container">
                {ViewProduct.map((product, idx) => (
                    <div 
                        key={idx} 
                        className="product-card"
                        onClick={() => navigate(`/view-product/${product._id}`)}
                    >
                        <h4>{`${product.product_name} (${product.color}, Size:${product.size[0]})`}</h4>
                        <div className="product-images">
                            <img 
                                src={product.images[0]} 
                                alt={product.product_name} 
                                loading="lazy" 
                            />
                            <div className="small-images">
                                <img 
                                    src={product.images[1]} 
                                    alt={`${product.product_name} view 2`} 
                                    loading="lazy" 
                                />
                                <img 
                                    src={product.images[2]} 
                                    alt={`${product.product_name} view 3`} 
                                    loading="lazy" 
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default View_product