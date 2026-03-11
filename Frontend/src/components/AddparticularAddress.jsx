import closeIcon from '/Close_icon.png'
import { useForm } from 'react-hook-form';
import axios from "axios"
import { useEffect, useState } from "react"

const AddparticularAddress = ({ onClose, value, onSuccess }) => {
    const ApiToAddAddress = 'http://localhost:3000/api/user/AddParticularAddress'
    const token = localStorage.getItem('jwtToken')
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    const OnSubmit = async (data) => {
        let status;
        if (value === 'home') {
            status = 'Home'
        }
        else if (value === 'office') {
            status = 'Office'
        }
        try {
            const res = await axios.post(`${ApiToAddAddress}/${status}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("✅ Address added:", res.data);
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
            console.log(`❌ Error Adding Address: ${error.response?.data?.message || error.message}`);
        }
    }
    return (
        <>
            <div className="overlay_background" data-selected="true"></div>
            <div className="main_container" data-selected="true">
                <div className="closeButton">
                    <button
                        onClick={onClose}
                        className="close"
                    >
                        <img src={closeIcon} alt="Close Button" height={20} className="close" />
                    </button>
                </div>
                <div className="main_content">
                    <h3>Add {value} Address</h3>
                    <form onSubmit={handleSubmit(OnSubmit)}>
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
                            {...register('state', { required: 'State is Required' })}
                        />
                        {errors.state && <span className="error">{errors.state.message}</span>}

                        <label htmlFor="zip">Zip:</label>
                        <input
                            type="text"
                            id="zip"
                            {...register('zip', {
                                required: true, pattern: {
                                    value: /^[1-9][0-9]{5}$/,
                                    message: "Enter a valid 6-digit ZIP code"
                                }
                            })}
                        />
                        {errors.zip && <span className="error">{errors.zip.message}</span>}
                        <button type="submit" >Submit</button>
                    </form>
                </div>
            </div>
        </>
    )
}
export default AddparticularAddress