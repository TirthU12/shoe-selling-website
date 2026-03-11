const mongoose = require('mongoose')

const AddressSchema = new mongoose.Schema({
    buildingName: { type: String, required: true },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String }
}, { _id: false });
const UserSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
        trim: true

    },
    password: {
        type: String,
        required: function(){
            return this.authType==='local';
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true

    },
    number: {
        type: Number,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other']
    },
    Address: {
        Home: AddressSchema,
        Office: AddressSchema
    },
    authType: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    picture: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('Users', UserSchema)
module.exports = User