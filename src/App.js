
import './App.css';
import React, { useState,useEffect } from 'react';
import {commerce} from './lib/commerce';
import {Products,Navbar,Cart,Checkout} from './components';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
const App=() =>{
  const[products,setProducts]= useState([]);
  const[cart,setCart]=useState({});
   const[order,setOrder]=useState ({});
   const[errorMessage,setErrorMessage]=useState('');
  const fetchProducts= async() =>{
    const{data}=await commerce.products.list();

    setProducts(data);
  }
  const fetchCart=async ()=> {
    setCart(await commerce.cart.retrieve());
    
  }
  const handleAddToCart=async(productId,quantity) =>
  {
    setCart(await commerce.cart.add(productId,quantity));

  }
  const handleUpdateCartQty = async (productId, quantity) => {
    const response=(await commerce.cart.update(productId, { quantity }));
    setCart(response);

  }
  const handleRemoveFromCart = async (productId) => {
     setCart(await commerce.cart.remove(productId));

  }
  const handleEmptyCart=async() =>{
    setCart(await commerce.cart.empty());
   
  }
    const refreshCart= async () => {
       const newCart=await commerce.cart.refresh();
       setCart(newCart);
    } 
  const handleCaptureCheckout =async(checkoutTokenId,newOrder) => {
    try {
      const incomingOrder=await commerce.checkout.capture(checkoutTokenId, newOrder);
      setOrder(incomingOrder);
      refreshCart();
    } catch(error) {
      setErrorMessage(error.data.error.message);
    }
  }

  useEffect(()=>{
   fetchProducts();
   fetchCart();
  },[]);
  
  return (
    <Router>
   <div>
    <Navbar totalItems={cart.total_items}/>
    <Routes>
      <Route path='/' element ={ <Products products={products} onAddToCart={handleAddToCart} handleUpdateCartQty/>}/>
      <Route path='/cart' element =
      {<Cart
       cart={cart}
       handleUpdateCartQty={handleUpdateCartQty}
       handleRemoveFromCart={handleRemoveFromCart}
       handleEmptyCart={handleEmptyCart}
       
    />}
    />
    <Route path='/checkout' element=
    {<Checkout 
    cart={cart}
        order={order}
        onCaptureCheckout={handleCaptureCheckout}
        error={errorMessage}
        />}>
    </Route>
  
   
    </Routes>
    
    </div>
    </Router>
  );
}

export default App;
