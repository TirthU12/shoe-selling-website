const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT
const connectDB = require('./config/database')
const productRoutes = require('./routes/products.routes')
const cartRoutes = require('./routes/cart.routes')
const cors = require('cors')
const auth = require('./middleware/auth')
const userRoutes = require('./routes/users.routes')
const orderRoutes=require('./routes/order.routes')

connectDB()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true
    }
))
app.use('/public', express.static('public'));
app.use('/api/user', userRoutes)
app.use('/api/product', auth, productRoutes)
app.use('/api/cart', auth, cartRoutes)
app.use('/api/order',orderRoutes)


app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});