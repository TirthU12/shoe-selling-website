import closeIcon from '/Close_icon.png'
import { useForm } from 'react-hook-form';
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

const EditAddress = ({ onClose, value, onSuccess }) => {
    const navigate = useNavigate();
    const ApiUpdateAddress = 'http://localhost:3000/api/user/UpdateAddress';
    const token = localStorage.getItem('jwtToken');

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function fetchAddress() {
            try {
                const res = await axios.get(`${ApiUpdateAddress}/${value.toLowerCase()}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const address = res.data.address;
                console.log(address)
                if (address) {

                    setValue('buildingName', address.buildingName || '');
                    setValue('street', address.street || '');
                    setValue('city', address.city || '');
                    setValue('state', address.state || '');
                    setValue('zip', address.zip || '');
                }

                setLoading(false);
            } catch (error) {
                const status = error.response?.status;
                if (status === 401) {
                    localStorage.removeItem('jwtToken');
                    navigate('/');
                }
                console.error("Error fetching address:", error.response?.data?.message || error.message);
                setLoading(false);
            }
        }

        fetchAddress();
    }, [value, token, setValue, navigate]);


    const onSubmit = async (data) => {
        try {
            const res = await axios.put(`${ApiUpdateAddress}/${value.toLowerCase()}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("✅ Address updated:", res.data);
            reset();
            if (onSuccess) {
                onSuccess();
            }

            
        } catch (error) {
            const status = error.response?.status;
            if (status === 401) {
                localStorage.removeItem('jwtToken');
                navigate('/');
            }
            console.error(`❌ Error updating address: ${error.response?.data?.message || error.message}`);
        }
    }

    if (loading) return <p>Loading address...</p>;

    return (
        <>
            <div className="overlay_background" data-selected="true"></div>
            <div className="main_container" data-selected="true">
                <div className="closeButton">
                    <button onClick={onClose} className="close">
                        <img src={closeIcon} alt="Close Button" height={20} className="close" />
                    </button>
                </div>
                <div className="main_content">
                    <h3>Edit {value} Address</h3>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label htmlFor="buildingName">Building Name:</label>
                        <input
                            type="text"
                            id="buildingName"
                            {...register('buildingName', { required: 'Building Name is required' })}
                        />
                        {errors.buildingName && <span className="error">{errors.buildingName.message}</span>}

                        <label htmlFor="street">Street:</label>
                        <input
                            type="text"
                            id="street"
                            {...register('street', { required: 'Street no is required' })}
                        />
                        {errors.street && <span className="error">{errors.street.message}</span>}

                        <label htmlFor="city">City:</label>
                        <input
                            type="text"
                            id="city"
                            {...register('city', { required: 'City is required' })}
                        />
                        {errors.city && <span className="error">{errors.city.message}</span>}

                        <label htmlFor="state">State:</label>
                        <input
                            type="text"
                            id="state"
                            {...register('state', { required: 'State is required' })}
                        />
                        {errors.state && <span className="error">{errors.state.message}</span>}

                        <label htmlFor="zip">Zip:</label>
                        <input
                            type="text"
                            id="zip"
                            {...register('zip', {
                                required: true,
                                pattern: {
                                    value: /^[1-9][0-9]{5}$/,
                                    message: "Enter a valid 6-digit ZIP code"
                                }
                            })}
                        />
                        {errors.zip && <span className="error">{errors.zip.message}</span>}

                        <button type="submit">Update Address</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default EditAddress;
