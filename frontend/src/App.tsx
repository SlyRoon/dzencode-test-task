import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Navigate to='/orders' replace />}/>
          <Route path='orders' element={<Orders/>}/>
          <Route path='products' element={<Products/>}/>
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
