import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Header from "./header"
import '../css/ViewOneProduct.css'
import star from '/star.png'
import AddAddress from "./AddAddress"


const View_one_product = () => {
    const navigate = useNavigate()
    const [productName, setProductName] = useState('')
    const [viewOneProduct, setOneProduct] = useState(null)
    const [imageUrl, setImageUrl] = useState("")
    const [size, setsize] = useState("")
    const [productColor, setProductColor] = useState([])
    const [cartProductId, setCartProductId] = useState([])
    const [buttonName, setButtonName] = useState('Add To Cart')
    const [productQty, setProductQty] = useState(1);
    const [RealPrice, setRealPrice] = useState('')
    const [ProductPrice, setProductPrice] = useState('');
    const [showAddress, setShowAddress] = useState(false);

    const { id } = useParams()
    const apiUrl = 'http://localhost:3000/api/product/view-one-product'
    const apiColorUrl = 'http://localhost:3000/api/product/get-color'
    const apiCart = 'http://localhost:3000/api/cart/add-cart'
    const apiCartProductCheck = 'http://localhost:3000/api/cart/get-cart-product'
    const getUser = 'http://localhost:3000/api/User/getUser'
    const ApiToGetAddress = 'http://localhost:3000/api/user/getAddress'


    const token = localStorage.getItem('jwtToken')

    async function view_one_product(id) {
        try {
            const res = await axios.get(`${apiUrl}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setOneProduct(res.data)
            setImageUrl(res.data.images[0])
            setsize(res.data.size[0])
            setProductName(res.data.product_name)
            setProductPrice(res.data.product_price)
            setRealPrice(res.data.product_price)

        } catch (error) {
            if (error.response) {
                const { status } = error.response
                if (status === 401) {
                    localStorage.removeItem('jwtToken')
                    navigate('/')
                }
            }
            console.log(`Error Fetching Product ${error.message}`)
        }
    }
    async function fetch_color(pn) {
        try {
            const res = await axios.get(`${apiColorUrl}/${pn}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setProductColor(res.data)
        } catch (error) {
            console.log(`Error Fetching Color: ${error.message}`)
        }
    }

    async function fetchCartProductId() {
        try {
            const res = await axios.get(apiCartProductCheck, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const productIds = res.data.products.map(item => item.product_id._id)
            if (!productIds) {
                return null
            }
            console.log(productIds)
            setCartProductId(productIds)
        } catch (error) {
            console.log(`Error Fetching Data ${error.response?.message}`)
        }
    }

    function CheckProductId() {

        if (cartProductId.includes(id)) {
            setButtonName('Go To Cart')
        }
        else {
            setButtonName('Add To Cart')
        }

    }

    async function FetchUserId() {
        try {
            const res = await axios.get(getUser, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(`Userid=${res.data.UserId}`)
            setUserId(res.data.UserId)
        } catch (error) {
            console.log(`Error Fetching UserId ${error.message}`)
        }

    }
    useEffect(() => {
        FetchUserId()
    }, [])
    useEffect(() => {
        if (id && cartProductId.length > 0) {
            CheckProductId()
        }
    }, [id, cartProductId])
    useEffect(() => {
        fetchCartProductId()
    }, [])
    useEffect(() => {
        view_one_product(id)
    }, [id])

    useEffect(() => {
        if (productName) {
            fetch_color(productName)
        }
    }, [productName])

    const handleMouseEnter = (imgUrl) => {
        setImageUrl(imgUrl)
    }

    const handelSizeClick = (selectSize) => {
        setsize(selectSize)
    }

    const handleProductColorClick = (product_id) => {
        if (product_id === id) {
            return
        }
        navigate(`/view-product/${product_id}`)

    }

    const handleAddTOCart = async (product_id, price, size, qty) => {
        if (cartProductId.includes(id)) {
            console.log('Product is already in cart')
            navigate('/cart')
            return
        }

        try {
            const cartData = {
                product_id,
                price,
                size,
                qty
            }

            const res = await axios.post(apiCart, cartData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log("✅ Cart added:", res.data)
            setCartProductId((prev) => [...prev, product_id])
            setButtonName('Go To Cart')
        } catch (error) {
            console.error("❌ Error adding to cart:", error.response?.data || error.message)
        }
    }

    const handleBuyNow = async (id, product_price, size, image, color, name, qty) => {
        try {
            const res = await axios.get(ApiToGetAddress, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const address = res.data.address || {}
            if (!address.Home && !address.Office) {
                setShowAddress(true)

            }
            else {
                setShowAddress(false)

                console.log("Navigating to SelectAddress...");
                navigate('/SelectAddress', {
                    state: {
                        type: "buynow",
                        product: { id, product_price, size, image, color, name, qty }
                    }
                });

            }


        } catch (error) {
            if (error.response) {
                const { status } = error.response
                if (status === 401) {
                    localStorage.removeItem('jwtToken')
                    navigate('/')
                }
            }
            console.log(`Error Deleting Product: ${error.response?.data?.message || error.message}`);
        }



    }
    const handleUpdateQty = (e) => {
        const newQty = parseInt(e.target.value, 10);
        setProductQty(newQty)
        setProductPrice(newQty * RealPrice)
    }


    return (
        <>
            {showAddress && <AddAddress onClose={() => setShowAddress(false)} />}
            <Header />
            <div className="main">
                <div className="main_image_container">
                    <div className="child_container">
                        {!viewOneProduct ? (
                            <p>Product is loading...</p>
                        ) : (
                            <>
                                <div className="image_container">
                                    <div className="small_image">
                                        {viewOneProduct.images?.map((img, i) => (
                                            <div key={i} className="image_box" onMouseEnter={() => handleMouseEnter(img)}>
                                                <img src={img} alt={`Thumbnail ${i}`} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="main_image_box">
                                        <img src={imageUrl} alt="Main Product" />
                                    </div>
                                </div>

                                <div className="button_container">
                                    <button className="buy_button" onClick={() => handleBuyNow(id, ProductPrice, size, viewOneProduct.images[0], viewOneProduct.color, viewOneProduct.product_name, productQty)} style={{cursor:'pointer'}}>Buy Now</button>
                                    <button className="add_to_cart" onClick={() => handleAddTOCart(id, ProductPrice, size, productQty)} style={{cursor:'pointer'}}>{buttonName}</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                {viewOneProduct && (
                    <div className="details_container">
                        <div className="product_name">
                            <div className="product_text">
                                <span>{`${viewOneProduct.brand}\n`}</span>{`${viewOneProduct.product_name} (${viewOneProduct.color},${size})`}
                            </div>
                        </div>
                        < div className="size">
                            <span>Size:</span>

                            {
                                viewOneProduct.size?.map((sizeValue, idx) => (

                                    <div
                                        key={idx}
                                        className="size_avi"
                                        onClick={() => handelSizeClick(sizeValue)}
                                        data-selected={size === sizeValue}
                                    >
                                        <p>{sizeValue}</p>
                                    </div>

                                ))
                            }
                            <div className="price">
                                <p>{`Price: ₹${ProductPrice}`}</p>
                            </div>
                            <div className="qtymain">
                                <label htmlFor="qty" style={{ fontSize: 20 }}>Qty:</label>
                                <select value={productQty} onChange={handleUpdateQty}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </div>
                        </div>
                        <div className="description">
                            <p><span>Description: </span>{`${viewOneProduct.description}`}</p>
                        </div>
                        <div className="rating">
                            <div>
                                <span style={{ fontSize: 20 }}>Rating: </span>
                                <span className="rating_name">{viewOneProduct.rating} <img src={star} alt="star" height={12} /></span>
                                <span style={{fontSize:18}}>/5.0</span>
                            </div>
                        </div>

                        <div className="color_main">
                            <p>Color Available:</p>
                            {
                                productColor.map((color, idx) => (

                                    <div key={idx}
                                        onClick={() => handleProductColorClick(color._id)}
                                        data-selected={id === color._id}
                                    >
                                        <img src={color.images[0]} alt="image" height={100} />
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default View_one_product
