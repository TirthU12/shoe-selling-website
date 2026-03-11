import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import cartEmpty from '/noorder.png'; // placeholder image

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const ApiGetOrders = "http://localhost:3000/api/order/getorder";
    const token = localStorage.getItem("jwtToken");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(ApiGetOrders, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.data.success) {
                    setOrders(res.data.orders || []);
                } else {
                    setOrders([]);
                    setError(res.data.message || "Failed to fetch orders");
                }
            } catch (err) {
                console.error(err);
                setOrders([]);
                setError("Something went wrong while fetching orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <h3>Loading your orders...</h3>;

    // Show error if exists
    if (error && orders.length === 0) {
        return (
            <>
                <Header />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "70vh",
                        textAlign: "center",
                        gap: "20px",
                    }}
                >
                    <img
                        src={cartEmpty}
                        alt="No Orders"
                        style={{ width: "300px", maxWidth: "80%" }}
                    />
                    <h2>{error}</h2>
                    <button
                        style={{
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "5px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            cursor: "pointer",
                        }}
                        onClick={() => navigate("/")}
                    >
                        Go to Home
                    </button>
                </div>
            </>
        );
    }

    // No orders at all
    if (!orders || orders.length === 0) {
        return (
            <>
                <Header />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "70vh",
                        textAlign: "center",
                        gap: "20px",
                    }}
                >
                    <img
                        src={cartEmpty}
                        alt="No Orders"
                        style={{ width: "300px", maxWidth: "80%" }}
                    />
                    <h2>You have no orders yet.</h2>
                    <button
                        style={{
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "5px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            cursor: "pointer",
                        }}
                        onClick={() => navigate("/home")}
                    >
                        Go to Home
                    </button>
                </div>
            </>
        );
    }

   
    return (
        <>
            <Header />
            <div className="order-container" style={{ padding: "20px" }}>
                {orders.map(order => (
                    <div key={order._id} style={{ marginBottom: "30px" }}>
                        {order.products.map((prod, idx) => {
                            const p = prod.product_id;
                            return (
                                <div
                                    key={idx}
                                    style={{
                                        border: "1px solid #ccc",
                                        borderRadius: "12px",
                                        padding: "15px",
                                        marginBottom: "20px",
                                        backgroundColor: "#fafafa",
                                    }}
                                >
                                    {p?.images?.length > 0 && (
                                        <div
                                            style={{
                                                width: "200px",
                                                height: "200px",
                                                border: "1px solid #e0e0e0",
                                                borderRadius: "10px",
                                                overflow: "hidden",
                                                backgroundColor: "#fff",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                padding: "10px",
                                                cursor: "pointer",
                                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.transform = "scale(1.03)";
                                                e.currentTarget.style.boxShadow =
                                                    "0 4px 12px rgba(0,0,0,0.15)";
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.transform = "scale(1)";
                                                e.currentTarget.style.boxShadow =
                                                    "0 2px 6px rgba(0,0,0,0.1)";
                                            }}
                                        >
                                            <img
                                                src={p.images[0]}
                                                alt={p.name}
                                                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                            />
                                        </div>
                                    )}

                                    <h3>{p?.product_name || "Unnamed Product"}</h3>
                                    <p><b>Color:</b> {prod.color}</p>
                                    <p><b>Size:</b> {prod.size}</p>
                                    <p><b>Price:</b> ₹{prod.price}</p>
                                    <p><b>Quantity:</b> {prod.qty}</p>
                                    <p>
                                        <b>Status:</b>{" "}
                                        <span
                                            style={{
                                                color:
                                                    prod.orderStatus === "Pending"
                                                        ? "orange"
                                                        : prod.orderStatus === "Delivered"
                                                            ? "green"
                                                            : "gray",
                                            }}
                                        >
                                            {prod.orderStatus}
                                        </span>
                                    </p>
                                    <p><b>Shipping Address:</b> {prod.shippingAddress}</p>
                                    <p><b>Payment Method:</b> {prod.paymentMethod}</p>
                                    <p><b>Order Date:</b> {new Date(prod.orderDate).toLocaleDateString()}</p>
                                    <p><b>Delivery Date:</b> {new Date(prod.deliveryDate).toLocaleDateString()}</p>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </>
    );
};

export default Order;
