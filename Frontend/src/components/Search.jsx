import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './header';

const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem('jwtToken');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

   
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('q') || '';

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:3000/api/product/search?q=${searchQuery}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setResults(res.data.products || []);
            } catch (err) {
                console.error(err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        if (searchQuery) fetchSearchResults();
    }, [searchQuery, token]);

    if (loading)
        return (
            <>
                <Header />
                <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <h3>Loading search results...</h3>
                </div>
            </>
        );

    return (
        <>
            <Header />
            <div
                style={{
                    minHeight: '80vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: results.length === 0 ? 'center' : 'flex-start',
                    alignItems: 'center',
                    padding: '20px',
                    textAlign: 'center'
                }}
            >
                
                {results.length === 0 ? (
                    <p>No products found.</p>
                ) : (
                    <div
                        style={{
                            
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '20px',
                            marginTop: '20px'
                        }}
                    >
                        {results.map((item) => (
                            <div
                                key={item._id}
                                style={{
                                    background: 'white',
                                    border: '1px solid #ccc',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    width: '200px',
                                    cursor: 'pointer',
                                    textAlign: 'center'
                                }}
                                onClick={() => navigate(`/view-product/${item._id}`)}
                            >
                                <img
                                    src={item.images[0]}
                                    alt={item.product_name}
                                    style={{ width: '100%', height: '150px', objectFit: 'contain' }}
                                />
                                <p>{item.product_name}</p>
                                <p>₹{item.product_price}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Search;
