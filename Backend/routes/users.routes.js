const express = require('express')
const routes = express.Router()
const User = require('../models/users.models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const auth = require('../middleware/auth');
const { OAuth2Client } = require("google-auth-library");
dotenv.config()
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

routes.post('/register', async (req, res) => {
    try {
        const { email, number, user_name, password, gender } = req.body
        const existingUser = await User.findOne({ $or: [{ email, user_name, number }] })
        if (existingUser) {
            res.status(400).json({ message: 'Username Or Email Is already exists' })
            return
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({ email, number, user_name, password: hashedPassword, gender })
        const newUser = await user.save()
        res.status(201).json({ message: 'User Created', data: newUser })
    } catch (error) {
        res.status(400).json({ message: error.message })
        console.log(error.message)
    }
})

routes.post('/login', async (req, res) => {
    try {
        const { EmailOrPhone, password } = req.body
        if (!EmailOrPhone && !password) {
            return res.status(400).json({ message: "Email or phone and password are required" });
        }
        const isPhone = /^[0-9]{10}$/.test(EmailOrPhone);
        const query = isPhone ? { number: Number(EmailOrPhone) } : { email: EmailOrPhone }

        const chkInfo = await User.findOne(query)
        if (!chkInfo) {
            res.status(404).json({ message: "User Not Found" })
            return
        }
        const isMatch = await bcrypt.compare(password, chkInfo.password)
        if (!isMatch) {
            res.status(400).json({ message: "Invalid Credentials" })
            return
        }
        const token = jwt.sign(
            { userId: chkInfo._id, user_name: chkInfo.user_name },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        )
        res.json({ token })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

routes.post('/google-login', async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ message: "Google token is req" });
        }
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, picture } = payload;
        let user = await User.findOne({ email })
        if (!user) {
            user = new User({
                user_name: name,
                email,
                password: 'google-auth',
                picture: picture,
                authType: 'google',
                number: Math.floor(Math.random() * 10000000000),
                gender: 'male'
            })
            await user.save();
        }
        else {
            if (user.authType !== 'google') {
                console.log("This email is already registered with normal login. Please use password login.");
                return res.json({
                    message: "This email is already registered with normal login. Please use password login.",
                })

            }
        }
        const token = jwt.sign(
            { userId: user._id, user_name: user.user_name },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );
        res.json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Google login failed', error: error.message });

    }

})

routes.get('/getUser', auth, (req, res) => {
    try {
        const UserName = req.user.user_name
        const UserId = req.user.userId
        res.json({ data: UserName, UserId: UserId })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

routes.get('/getAddress', auth, async (req, res) => {
    try {
        const user_id = req.user.userId;
        const user = await User.findById(user_id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ address: user.Address });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


routes.get('/UpdateAddress/:status', auth, async (req, res) => {
    try {
        const status = req.params.status
        const user_id = req.user.userId
        const user = await User.findById(user_id);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (status === 'home') {
            res.status(200).json({ address: user.Address.Home })
        }
        else if (status === 'office') {
            res.status(200).json({ address: user.Address.Office })
        }
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
})

routes.put('/UpdateAddress/:status', auth, async (req, res) => {
    try {
        const status = req.params.status
        const user_id = req.user.userId

        const user = await User.findById(user_id)
        const { buildingName, street, city, state, zip } = req.body
        console.log(buildingName)
        if (!user) return res.status(404).json({ message: "User not found" });

        const addressDate = {
            buildingName: buildingName,
            street: street,
            city: city,
            state: state,
            zip: zip,
            country: 'India'
        }
        console.log(`In Side ${addressDate.buildingName}`)

        if (status === 'home') {
            user.Address.Home = addressDate
        }
        else if (status === 'office') {
            user.Address.Office = addressDate
        }
        else {
            return res.status(400).json({ message: "Invalid status value" });
        }

        await user.save()
        res.status(200).json({ message: `${status} address added`, Address: user.Address });


    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }

})


routes.post('/AddAddress/:status', auth, async (req, res) => {
    try {
        const status = req.params.status
        const user_id = req.user.userId

        const user = await User.findById(user_id)
        const { buildingName, street, city, state, zip, country } = req.body
        console.log(buildingName)
        if (!user) return res.status(404).json({ message: "User not found" });

        const addressDate = {
            buildingName: buildingName,
            street: street,
            city: city,
            state: state,
            zip: zip,
            country: 'India'
        }
        console.log(`In Side ${addressDate.buildingName}`)

        if (status === 'Home') {
            user.Address.Home = addressDate
        }
        else if (status === 'Office') {
            user.Address.Office = addressDate
        }
        else {
            return res.status(400).json({ message: "Invalid status value" });
        }

        await user.save()
        res.status(200).json({ message: `${status} address added`, Address: user.Address });


    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }

})



routes.post('/AddParticularAddress/:status', auth, async (req, res) => {
    try {
        const status = req.params.status
        const user_id = req.user.userId

        const user = await User.findById(user_id)
        const { buildingName, street, city, state, zip, country } = req.body
        console.log(buildingName)
        if (!user) return res.status(404).json({ message: "User not found" });

        const addressDate = {
            buildingName: buildingName,
            street: street,
            city: city,
            state: state,
            zip: zip,
            country: 'India'
        }
        console.log(`In Side ${addressDate.buildingName}`)

        if (status === 'Home') {
            user.Address.Home = addressDate
        }
        else if (status === 'Office') {
            user.Address.Office = addressDate
        }
        else {
            return res.status(400).json({ message: "Invalid status value" });
        }

        await user.save()
        res.status(200).json({ message: `${status} address added`, Address: user.Address });


    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }

})


module.exports = routes