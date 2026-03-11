import axios from "axios"
import Header from "./header"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import '../css/Cart.css'
import cartEmpty from '/Cart_empty.png'

import AddAddress from "./AddAddress"

const Cart = () => {
    const navigate = useNavigate()
    const ApiCart = 'http://localhost:3000/api/cart/get-cart-product'
    const UpdateQty = 'http://localhost:3000/api/cart/qty_update'
    const ApiToDeleteProduct = 'http://localhost:3000/api/cart/delete_cart_item'
    const ApiToGetAddress = 'http://localhost:3000/api/user/getAddress'
    const token = localStorage.getItem('jwtToken')
    const [ProductDetails, setProductDetails] = useState([])
    const [MainProductDetails, setMainProductsDetails] = useState([])
    const [TotalPrice, setTotalPrice] = useState('')
    const [showAddress, setShowAddress] = useState(false)
    async function CartProductFetch() {
        try {
            const res = await axios.get(ApiCart, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })


            const allProducts = res.data.products.map(item => item.product_id)
            console.log('All Product', allProducts)
            setProductDetails(allProducts)
            const allProductMainDetail = res.data.products
            console.log("All Main Details", allProductMainDetail)
            setMainProductsDetails(allProductMainDetail)
            const totalPrice = res.data.totalPrice
            setTotalPrice(totalPrice)

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


    async function handleQtyDecrease(productId, productQty, productPrice) {
        if (productQty > 1) {
            const qty = Number(productQty) - 1
            const price = productPrice * qty
            const QtyUpdate = {
                qty,
                price
            };
            try {
                const res = await axios.patch(`${UpdateQty}/${productId}`, QtyUpdate, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log("Quantity updated:", res.data);
                CartProductFetch()
            } catch (error) {
                if (error.response) {
                    const { status } = error.response
                    if (status === 401) {
                        localStorage.removeItem('jwtToken')
                        navigate('/')
                    }
                }
                console.log(`Error Update Qty ${error.response?.data?.message || error.message}`);

            }

        }
    }






    async function handleQtyIncrease(productId, productQty, productPrice) {
        if (productQty >= 1) {
            const qty = Number(productQty) + 1
            const price = productPrice * qty
            const QtyUpdate = {
                qty,
                price
            };
            try {
                const res = await axios.patch(`${UpdateQty}/${productId}`, QtyUpdate, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log("Quantity updated:", res.data);
                CartProductFetch()
            } catch (error) {
                if (error.response) {
                    const { status } = error.response
                    if (status === 401) {
                        localStorage.removeItem('jwtToken')
                        navigate('/')
                    }
                }
                console.log(`Error Update Qty ${error.response?.data?.message || error.message}`);

            }

        }
    }

    async function handleDeleteProduct(product_id) {
        try {
            await axios.delete(`${ApiToDeleteProduct}/${product_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            CartProductFetch()
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

    async function handlePlaceOrder() {
        try {
            const res = await axios.get(ApiToGetAddress, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const address = res.data?.address || {}

            if (!address.Home && !address.Office) {
                console.log("address not available")
                setShowAddress(true)
            }
            else {
                setShowAddress(false);
                
                navigate('/SelectAddress',{
                    state:{

                        type:"cart"
                    }
                })
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


    useEffect(() => {
        CartProductFetch()
    }, [])


    return (
        <>
          
            {showAddress && <AddAddress onClose={()=>setShowAddress(false)}/>}
            <Header />

            <div className="showHide"
                data-selected={showAddress ? "true" : "false"}
            >
                {
                    ProductDetails.length == 0 && MainProductDetails.length == 0 ? (
                        <div className="emptyCart">
                            <img src={cartEmpty} alt="" height={100} />
                            <button onClick={() => navigate('/home')}>Go To Home</button>
                        </div>
                    ) : (
                        <div className="container">
                            {
                                ProductDetails.map((CartItem, idx) => (
                                    <div key={idx}>
                                        <div className="cart_details">
                                            <div className="image_detail">
                                                <img src={CartItem.images[0]} alt="" height={100} />
                                            </div>
                                            <div className="All_main_details">
                                                <div className="main_details">
                                                    <span style={{ fontSize: 25 }} className="main_name">
                                                        <span style={{ fontSize: 22, fontStyle: "italic" }}>{CartItem.brand} </span><br />
                                                        <strong>{`${CartItem.product_name}...`}</strong>
                                                    </span>
                                                    <button className="remove_button" onClick={() => handleDeleteProduct(CartItem._id)}>Remove</button>
                                                </div>
                                                <span style={{ fontSize: 20 }}>{`Size: ${MainProductDetails[idx].size}, Color: ${CartItem.color}`}</span>
                                                <span style={{ fontSize: 18 }} className="Qty">Qty:
                                                    <button type="button"
                                                        onClick={
                                                            () =>
                                                                handleQtyDecrease(
                                                                    CartItem._id,
                                                                    MainProductDetails[idx]?.qty,
                                                                    CartItem.product_price

                                                                )}
                                                        data-selected={MainProductDetails[idx].qty === 1 ? "true" : "false"}
                                                    >
                                                        -
                                                    </button>

                                                    <input type="text" name="" id=""
                                                        value={MainProductDetails[idx].qty} disabled
                                                    />

                                                    <button type="button"
                                                        onClick={
                                                            () =>
                                                                handleQtyIncrease(
                                                                    CartItem._id,
                                                                    MainProductDetails[idx]?.qty,
                                                                    CartItem.product_price
                                                                )}
                                                        data-selected={MainProductDetails[idx].qty >= 3 ? "true" : "false"}
                                                    >
                                                        +
                                                    </button>
                                                </span>
                                                <span style={{ fontSize: 18 }}>Price: ₹{MainProductDetails[idx].price}</span>
                                            </div>
                                        </div>
                                        <hr />
                                    </div>

                                ))
                            }
                            <div className="cart_checkout">
                                <div className="child_component">
                                    <button
                                        onClick={() => handlePlaceOrder()}
                                    >
                                        Place Order
                                    </button>
                                    <p>Total Price: ₹ {TotalPrice}</p>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    )
}

// const AddAddress = ({ onClose }) => {
//     const ApiToAddAddress = 'http://localhost:3000/api/user/AddAddress'
//     const token = localStorage.getItem('jwtToken')
//     const { register, handleSubmit, reset, formState: { errors } } = useForm()
//     const [HomeOffice, setHomeOffice] = useState(true)
//     const OnSubmit = async (data) => {
//         let status;
//         if (HomeOffice == true) {
//             status = 'Home'
//         }
//         else if (HomeOffice == false) {
//             status = 'Office'
//         }
//         try {
//             const res = await axios.post(`${ApiToAddAddress}/${status}`, data, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             console.log("✅ Address added:", res.data);
//             reset();
//         } catch (error) {
//             const status = error.response?.status;
//             if (status === 401) {
//                 localStorage.removeItem('jwtToken');
//                 navigate('/');
//             }
//             console.log(`❌ Error Adding Address: ${error.response?.data?.message || error.message}`);
//         }
//     }
//     return (
//         <>
//             <div className="overlay_background" data-selected="true"></div>
//             <div className="main_container" data-selected="true">
//                 <div className="closeButton">
//                     <button
//                         onClick={onClose}
//                         className="close"
//                     >
//                         <img src={closeIcon} alt="Close Button" height={20} className="close" />
//                     </button>
//                 </div>
//                 <div className="main_content">
//                     <form onSubmit={handleSubmit(OnSubmit)}>
//                         <label htmlFor="buildingName">Building Name:</label>
//                         <input
//                             type="text"
//                             id="buildingName"
//                             {...register('buildingName', { required: 'Building Name is required' })}
//                         />
//                         {errors.buildingName && <span className="error">{errors.buildingName.message}</span>}

//                         <label htmlFor="street">Street:</label>
//                         <input
//                             type="text"
//                             id="street"
//                             {...register('street', { required: 'Street no is required' })}
//                         />
//                         {errors.street && <span className="error">{errors.street.message}</span>}



//                         <label htmlFor="city">City:</label>
//                         <input
//                             type="text"
//                             id="city"
//                             {...register('city', { required: 'City is required' })}
//                         />
//                         {errors.city && <span className="error">{errors.city.message}</span>}



//                         <label htmlFor="state">State:</label>
//                         <input
//                             type="text"
//                             id="state"
//                             {...register('state', { required: 'State is Required' })}
//                         />
//                         {errors.state && <span className="error">{errors.state.message}</span>}

//                         <label htmlFor="zip">Zip:</label>
//                         <input
//                             type="text"
//                             id="zip"
//                             {...register('zip', {
//                                 required: true, pattern: {
//                                     value: /^[1-9][0-9]{5}$/,
//                                     message: "Enter a valid 6-digit ZIP code"
//                                 }
//                             })}
//                         />
//                         {errors.zip && <span className="error">{errors.zip.message}</span>}
//                         <div className="state">
//                             <button
//                                 type="button"
//                                 onClick={() => setHomeOffice(true)}
//                                 data-selected={HomeOffice === true}
//                             >
//                                 Home
//                             </button>
//                             <button
//                                 type="button"
//                                 onClick={() => setHomeOffice(false)}
//                                 data-selected={HomeOffice === false}

//                             >Office
//                             </button>
//                         </div>
//                         <button type="submit" >Submit</button>
//                     </form>
//                 </div>
//             </div>
//         </>
//     )
// }

export default Cart