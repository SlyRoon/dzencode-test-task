import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import OrderPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Navigate to='/orders' replace />}/>
          <Route path='orders' element={<OrderPage/>}/>
          <Route path='products' element={<ProductsPage/>}/>
        </Route>
        <Route
        path='*'
        element={<div>404 Not Found</div>}
        />

        
      </Routes>
    </BrowserRouter>
  )
}

export default App
