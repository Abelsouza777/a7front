import '../styles/globals.scss'
import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


import { AuthProvider } from '../contexts/AuthContext'
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from '../contexts/CartContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>

   <AuthProvider>
      <Component {...pageProps} />
      <ToastContainer autoClose={3000} />
      
   </AuthProvider>
   </CartProvider>
  )
}

export default MyApp
