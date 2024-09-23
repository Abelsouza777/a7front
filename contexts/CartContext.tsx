import { createContext, ReactNode, useState, useEffect } from 'react';
import { setupAPIClient } from '../services/api';
import { useUserData } from '../utils/nameAuth';
import { ProductProps } from '../pages/market';

interface CartContextData {
  cart: CartProps[];
  cartAmount: number;
  addItemCart: (newItem: ProductProps) => void;
  removeItemCart: (product: CartProps) => void;
  deleteProduct: (id: string) => void;
  total: string;
  loading: boolean;
  updateCart: (updatedCart: CartProps[]) => void;
}

interface CartProps {
  id: number;
  solutionId: number;
  title: string;
  description: string;
  price: number;
  cover: string;
  amount: number;
  total: number;
}

interface CartProviderProps {
  children: ReactNode;
}

export const CartContext = createContext({} as CartContextData);

function formatPriceToBRL(price: number): string {
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartProps[]>([]);
  const [total, setTotal] = useState("");
  const [loading, setLoading] = useState(true);
  const userData = useUserData();

  useEffect(() => {
    async function fetchCartItems() {
      setLoading(true);
      try {
        if (userData?.id) {
          const apiClient = setupAPIClient();
          const response = await apiClient.get(`/cart/${userData.id}`);
          const cartItems = response.data;

          const detailedCartItems = await Promise.all(cartItems.map(async (item: any) => {
            const productResponse = await apiClient.get(`/solution/${item.solutionId}`);
            const productData = productResponse.data;

            const total = productData.price * item.amount;

            return {
              ...item,
              title: productData.title,
              description: productData.description,
              //
              price: productData.price,
              //
              cover: productData.cover,
              total: total
            };
          }));

          setCart(detailedCartItems);
          totalResultCart(detailedCartItems);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCartItems();
  }, [userData]);
//a função additemcart cria o novo produto no carrinho pela primeira vez antes 
//de recarregar os dados do banco de dados.
  async function addItemCart(newItem: ProductProps) {
  const indexItem = cart.findIndex(item => item.solutionId === newItem.id);

  if (indexItem !== -1) {
    if (window.location.pathname !== '/cart') {
      return;
    }

    const updatedCart = [...cart];
    updatedCart[indexItem].amount += 1;
    updatedCart[indexItem].total = updatedCart[indexItem].amount * updatedCart[indexItem].price;

    setCart(updatedCart);
    totalResultCart(updatedCart);

    try {
      const apiClient = setupAPIClient();
      await apiClient.put(`/cart/${updatedCart[indexItem].id}`, { amount: updatedCart[indexItem].amount });
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
    return;
  }

  const productResponse = await setupAPIClient().get(`/solution/${newItem.id}`);
  const productData = productResponse.data;

  const data: CartProps = {
    id: 0,
    solutionId: productData.id,
    title: productData.title,
    description: productData.description,
    price: productData.price,
    cover: productData.cover,
    amount: 1,
    total: productData.price
  };

  try {
    const response = await setupAPIClient().post(`/cart`, {
      userId: userData.id,
      solutionId: newItem.id,
      amount: 1,
      status: true,
      delivery: "pending",
    });

    data.id = response.data.id;

    const updatedCart = [...cart, data];
    setCart(updatedCart);
    totalResultCart(updatedCart);
  } catch (error) {
    console.error('Error adding cart item:', error);
  }
}


  async function removeItemCart(product: CartProps) {
    const indexItem = cart.findIndex(item => item.solutionId === product.solutionId);
    if (cart[indexItem]?.amount > 1) {
      let cartList = [...cart];
      cartList[indexItem].amount -= 1;
      cartList[indexItem].total -= cartList[indexItem].price;
      setCart(cartList);
      totalResultCart(cartList);

      try {
        const apiClient = setupAPIClient();
        await apiClient.put(`/cart/${cartList[indexItem].id}`, { amount: cartList[indexItem].amount });
      } catch (error) {
        console.error('Error updating cart item:', error);
      }
    } else {
      const updatedCart = cart.filter(item => item.solutionId !== product.solutionId);
      setCart(updatedCart);
      totalResultCart(updatedCart);

      try {
        const apiClient = setupAPIClient();
        await apiClient.delete(`/cart/${product.id}`);
      } catch (error) {
        console.error('Error deleting cart item:', error);
      }
    }
  }

  async function deleteProduct(id: string) {
    if (confirm('Tem certeza de que deseja excluir este item?')) {
      try {
        const apiClient = setupAPIClient();
        await apiClient.delete(`/cart/${id}`);
        console.log(`Product with id ${id} deleted successfully.`);
        const updatedCart = cart.filter(product => product.id !== parseInt(id));
        setCart(updatedCart);
        totalResultCart(updatedCart);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  }

  function totalResultCart(items: CartProps[]) {
    let myCart = items;
    let result = myCart.reduce((acc, obj) => acc + obj.total, 0);

    const resultFormatted = formatPriceToBRL(result);

    setTotal(resultFormatted);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        cartAmount: cart.length,
        addItemCart,
        removeItemCart,
        deleteProduct,
        total,
        loading,
        updateCart: setCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
