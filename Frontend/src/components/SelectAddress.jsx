import { useEffect, useState } from "react"
import Header from "./header"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import '../css/SelectAddress.css'
import EditAddress from "./EditAddress"
import AddparticularAddress from "./AddparticularAddress"



const SelectAddress = () => {
    const ApiCart = 'http://localhost:3000/api/cart/get-cart-product'
    const SelectAddressApi = 'http://localhost:3000/api/user/getAddress'
    const AddToOrderApi = 'http://localhost:3000/api/order/add-order'
    const token = localStorage.getItem('jwtToken')
    const [ProductDetails, setProductDetails] = useState([])
    const [allMainProductsDetails, setAllMainProductsDetails] = useState([])
    const [OneProductDetail, setOneProductDetail] = useState(null)
    const [HomeAddress, setHomeAddress] = useState(null)
    const [OfficeAddress, setOfficeAddress] = useState(null)
    const [totalPrice, setTotalPrice] = useState(null)
    const location = useLocation();
    const [selectAddress, setSelectAddress] = useState("home");
    const [WhichAddressSelected, setWhichAddressSelected] = useState(null)
    const [showEditAddress, setShowEditAddress] = useState(false)
    const [whichvalueofaddress, setwhichvalueofaddress] = useState(null);
    const [ShowAddOneAddress, setShowAddOneAddress] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const state = location.state;
        if (!state) {
            navigate('/home')
            return
        }
        if (state.type === 'buynow') {
            setOneProductDetail(state.product);
        }
        else if (state.type === 'cart') {
            setOneProductDetail(null);
        }


    }, [location.state]);


    async function FetchCartProduct() {
        try {
            const res = await axios.get(ApiCart, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const allProducts = res.data.products.map(item => item.product_id)
            console.log(allProducts)
            setProductDetails(allProducts)
            const allMainDetails = res.data.products

            setAllMainProductsDetails(allMainDetails)
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
    useEffect(() => {
        FetchCartProduct()
    }, [])

    async function FetchAddress() {
        try {
            const res = await axios.get(SelectAddressApi, {
                headers: {
                    Authorization: `Bearer ${token}`
                }

            })
            const address = res.data?.address
            let home = '';
            let office = '';

            if (address.Home && address.Office) {
                for (let key in address.Home) {
                    home += `${address.Home[key]} ${' '}`
                }

                setHomeAddress(home)
                setWhichAddressSelected(home)
                for (let key in address.Office) {
                    office += `${address.Office[key]} ${' '}`
                }
                setOfficeAddress(office)
                setShowAddress(false)
            }
            else if (address.Home) {
                for (let key in address.Home) {
                    home += `${address.Home[key]} ${' '}`
                }
                setHomeAddress(home)
                setWhichAddressSelected(home)
                setShowAddress(false)

            }
            else if (address.Office) {
                for (let key in address.Office) {
                    office += `${address.Office[key]} ${' '}`
                }
                setOfficeAddress(office)
                setWhichAddressSelected(office)
                setShowAddress(false)

            }


        } catch (error) {
            if (error.response) {
                const { status } = error.response
                if (status === 401) {
                    localStorage.removeItem('jwtToken')
                    navigate('/')
                }
            }
            console.log(`Error Fetching Home Address: ${error.response?.data?.message || error.message}`);
        }
    }
    useEffect(() => {
        FetchAddress()
    }, [])

    const handleChange = (e) => {
        const whichAddress = e.target.value === "home" ? HomeAddress : OfficeAddress
        setWhichAddressSelected(whichAddress)
        setSelectAddress(e.target.value)
    }
    useEffect(() => {

    }, [WhichAddressSelected]);

    async function AddOrder() {
        let products = [];

        if (OneProductDetail) {

            products.push({
                product_id: OneProductDetail.id,
                qty: OneProductDetail.qty,
                price: OneProductDetail.product_price,
                size: OneProductDetail.size,
                color: OneProductDetail.color,
                shippingAddress: WhichAddressSelected,
                paymentMethod: "Cash On Delivery"
            });
        } else {

            products = ProductDetails.map((item, idx) => ({
                product_id: item._id,
                qty: allMainProductsDetails[idx]?.qty,
                price: allMainProductsDetails[idx]?.price,
                size: allMainProductsDetails[idx]?.size,
                color: item.color,
                shippingAddress: WhichAddressSelected,
                paymentMethod: "Cash On Delivery"
            }));
        }

        console.log("🧾 Products in Order:", products);

        try {
            const res = await axios.post(
                AddToOrderApi,
                { products },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log("✅ Order Success:", res.data);
            navigate('/order')

            
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem("jwtToken");
                navigate("/");
            }
            console.log(`❌ Error placing order: ${error.response?.data?.message || error.message}`);
        }
    }

    function handleAddOfficeAddress() {
        setShowAddOneAddress(true)
        setwhichvalueofaddress("office")
    }

    function handleAddHomeAddress() {
        console.log('Add Home Address');
        setShowAddOneAddress(true)
        setwhichvalueofaddress("home")

    }

    function handleUpdateAddress(value) {
        console.log(value)
        setShowEditAddress(true)
        setwhichvalueofaddress(value);


    }


    return (
        <>
            {showEditAddress && <EditAddress onClose={() => setShowEditAddress(false)} value={whichvalueofaddress}
                onSuccess={() => {
                    setShowEditAddress(false)
                    FetchAddress();
                }}
            />}
            {ShowAddOneAddress && <AddparticularAddress onClose={()=>setShowAddOneAddress(false) } value={whichvalueofaddress}
                onSuccess={()=>{
                    setShowAddOneAddress(false)
                    FetchAddress();
                }}
                /> }
            <Header />
            {
                HomeAddress != null && OfficeAddress != null ? (
                    <div className="containerAddress">
                        <div className="address">
                            <strong>Select Address:</strong>
                        </div>
                        <div className="mainSelectAddress">
                            <strong>Home:</strong>
                            <div className="selectAddress">
                                <input type="radio" value='home' name="address" checked={selectAddress === 'home'} onChange={handleChange} />
                                <textarea name="" id="" cols={20} rows={5} value={HomeAddress} readOnly> </textarea><span onClick={() => handleUpdateAddress("home")} style={{ cursor: "pointer" }}>Edit</span>
                            </div>
                            <strong>Office:</strong>
                            <div className="selectAddress">
                                <input type="radio" value='office' name="address" checked={selectAddress === 'office'} onChange={handleChange} />
                                <textarea name="" id="" cols={20} rows={5} value={OfficeAddress} readOnly> </textarea><span onClick={() => handleUpdateAddress("office")} style={{ cursor: "pointer" }}>Edit</span>
                            </div>

                        </div>
                    </div>
                ) : (
                    HomeAddress != null ? (
                        <div className="containerAddress">
                            <div className="address">
                                <strong>Select Address:</strong>
                            </div>
                            <div className="mainSelectAddress">
                                <strong>Home:</strong>
                                <div className="selectAddress">
                                    <input type="radio" value='home' name="address" checked />
                                    <textarea name="" id="" cols={20} rows={5} value={HomeAddress} readOnly> </textarea><span onClick={() => handleUpdateAddress("home")} style={{ cursor: "pointer" }}>Edit</span>
                                </div>
                            </div>
                            <span onClick={() => handleAddOfficeAddress()} style={{ cursor: "pointer" }}>Add Office Address</span>
                        </div>
                    ) : (
                        <div className="containerAddress">
                            <div className="address">
                                <strong>Select Address:</strong>
                            </div>
                            <div className="mainSelectAddress">
                                <strong>Office:</strong>
                                <div className="selectAddress">
                                    <input type="radio" value='office' name="address" checked />
                                    <textarea name="" id="" cols={20} rows={5} value={OfficeAddress} readOnly> </textarea><span onClick={() => handleUpdateAddress("office")} style={{ cursor: "pointer" }}>Edit</span>
                                </div>
                            </div>
                            <span onClick={() => handleAddHomeAddress()} style={{ cursor: "pointer" }}>Add Home Address</span>
                        </div>
                    )
                )
            }
            {
                !OneProductDetail ? (
                    ProductDetails.length === 0 ? (
                        <p>Product is Loading</p>
                    ) : (
                        <div className="mainContent">
                            <div className="address">
                                <strong>Order Summary:</strong>
                            </div>
                            {
                                <div className="mainSelectAddress">
                                    {
                                        ProductDetails.map((item, idx) => (
                                            <div key={idx}  >
                                                <div className="orderItems">
                                                    <div>
                                                        <img src={item.images[0]} alt="" height={100} />

                                                    </div>
                                                    <div className="text">
                                                        <span style={{ fontSize: 20 }}>{item.product_name}</span>
                                                        <span style={{ fontSize: 16 }}>Price:{allMainProductsDetails[idx]?.price}</span>
                                                        <span style={{ fontSize: 16 }}>{`Size:${allMainProductsDetails[idx]?.size} , Color:${item.color}`}</span>
                                                    </div>
                                                </div>
                                                <span className="qty">Qty: <span>{allMainProductsDetails[idx]?.qty}</span> </span>
                                                <hr />
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                            <div className="totalprice">
                                <p className="total-price">Total Price: ₹{totalPrice}</p>
                                <button className="placeorderbutton" onClick={() => AddOrder()}>Place Order</button>
                            </div>
                        </div >
                    )
                ) : (
                    <div className="mainContent">
                        <div className="address">
                            <strong>Order Summary:</strong>
                        </div>
                        <div className="mainSelectAddress">
                            <div className="orderItems">
                                <div>
                                    <img src={OneProductDetail.image} alt="" height={100} />
                                    <div className="qty">Qty: <span>{OneProductDetail.qty}</span> </div>
                                </div>
                                <div className="text">
                                    <span style={{ fontSize: 20 }}>{OneProductDetail.name}</span>
                                    <span style={{ fontSize: 16 }}>Price:{OneProductDetail.product_price}</span>
                                    <span style={{ fontSize: 16 }}>{`Size:${OneProductDetail.size} , Color:${OneProductDetail.color}`}</span>
                                </div>
                            </div>
                        </div>
                        <div className="totalprice">
                            <p className="total-price">Total Price: ₹{OneProductDetail.product_price}</p>
                            <button className="placeorderbutton" onClick={() => AddOrder()}>Place Order</button>
                        </div>
                    </div>
                )
            }
        </>
    )
}
export default SelectAddress