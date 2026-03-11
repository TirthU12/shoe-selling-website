import styles from '../css/Header.module.css';
import cartIcon from '/icons8-cart-50.png';
import orderIcon from '/icons8-aliexpress.svg';
import cusIcon from '/icons8-customer-support-50.png';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const getUser = 'http://localhost:3000/api/User/getUser';
    const searchApi = 'http://localhost:3000/api/product/search';
    const [userInfo, setUserInfo] = useState(null);
    const [searchProduct, setSearchProduct] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const token = localStorage.getItem('jwtToken');


    useEffect(() => {
        if (!token) navigate('/');
    }, [token, navigate]);


    async function FetchUserInfo() {
        try {
            const res = await axios.get(getUser, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserInfo(res.data.data);


        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('jwtToken');
                navigate('/');
            }
            console.log(error.response?.data?.message || error.message);
        }
    }

    useEffect(() => {
        FetchUserInfo();
    }, []);

    useEffect(() => {
        if (!searchProduct.trim()) {
            setSearchResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            try {
                const res = await axios.get(`${searchApi}?q=${searchProduct}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSearchResults(res.data.products || []);
            } catch (error) {
                console.log(error);
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchProduct, token]);


    const handleSearch = (query) => {
        navigate(`/search?q=${query}`);
        setSearchResults([]);
        setSearchProduct(query);
    };

    return (
        <div className={styles.navbar}>
            <div className={styles.shoe_name} onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>Sneakify</div>

            <div className={styles.search_bar} style={{ position: 'relative' }}>
                <input
                    type="text"
                    placeholder="Find your perfect pair..."
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch(searchProduct);
                    }}
                />

                {searchResults.length > 0 && (
                    <div className={styles.search_results}>
                        {searchResults.map((item) => (
                            <div
                                key={item._id}
                                className={styles.search_item}
                                onClick={() => handleSearch(item.product_name)}
                            >
                                {item.images && item.images[0] && (
                                    <img src={item.images[0]} alt={item.product_name} />
                                )}
                                <div className={styles.item_info}>
                                    <p className={styles.item_name}>{item.product_name}</p>
                                    <p className={styles.item_price}>₹{item.product_price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.icons}>
                <div className={styles.user_name}>
                    <span>{`Welcome\n${userInfo || 'Guest'} !!!`}</span>

                </div>
                <div className={styles.cart_icon} onClick={() => navigate('/cart')}>
                    <img src={cartIcon} alt="" />
                    <span>Cart</span>
                </div>
                <div className={styles.order_icon} onClick={() => navigate('/order')}>
                    <img src={orderIcon} alt="" />
                    <span>My Orders</span>
                </div>
                <div className={styles.cus_icon} onClick={() => navigate('/customersupport')}>
                    <img src={cusIcon} alt="" />
                    <span>Customer Support</span>
                </div>
                <span
                    style={{
                        display: 'inline-flex',
                        // justifyContent: 'center',
                        alignItems: 'center',
                        // margin: '15px',
                    }}
                >
                    <button
                        style={{
                            backgroundColor: '#111',
                            color: '#fff',
                            border: 'none',
                            height:'30px',
                            borderRadius: '5px',
                            fontSize: '15px',
                            fontWeight: '600',
                            letterSpacing: '0.5px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 3px 6px rgba(0, 0, 0, 0.15)',
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#e63946';
                            e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#111';
                            e.target.style.transform = 'scale(1)';
                        }}
                        onClick={()=>{
                            localStorage.removeItem('jwtToken')
                            alert('Are Your sure? \nYou want to Logout')
                            window.location.href='/'
                        }}
                    >
                        Logout
                    </button>
                </span>

            </div>
        </div>
    );
};

export default Header;
