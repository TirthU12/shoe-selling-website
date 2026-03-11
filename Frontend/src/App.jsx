import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import View_product from './components/View_product'
import View_one_product from './components/View_one_product'
import Cart from './components/Cart'
import Login from './components/Login'
import Register from './components/Register'
import SelectAddress from './components/SelectAddress'
import Order from './components/Order'
import Search from './components/Search'
import CustomerSupport from './components/CustomerSupport'

function App() {
  return (
    <GoogleOAuthProvider clientId='252894133101-e47o7m0k43ig321fdjc34o3rvotrkhr7.apps.googleusercontent.com'>
      <BrowserRouter>
        <Routes>
          <Route path="/search" element={<Search />} />
          <Route path='/customersupport' element={<CustomerSupport />} />
          <Route path="/" element={<Login />} />
          <Route path="/SelectAddress" element={<SelectAddress />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/home" element={<View_product />} />
          <Route path="/view-product/:id" element={<View_one_product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path='/order' element={<Order />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>

  )
}

export default App
