import { useContext } from 'react';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { CartContext } from '../../contexts/CartContext';
import { toast } from 'react-toastify';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { setupAPIClient } from '../../services/api';

export default function Cart() {
  const { cart, total, updateCart, loading } = useContext(CartContext);

  const handleRemoveItem = async (item) => {
    if (item.amount > 1) {
      await updateProductAmount(item.id, item.amount - 1);
    } else {
      toast.error('A quantidade não pode ser menor que 1.');
    }
  };

  const handleAddItem = async (item) => {
    await updateProductAmount(item.id, item.amount + 1);
  };

  async function updateProductAmount(id, amount) {
    try {
      const apiClient = setupAPIClient();
      await apiClient.put(`/cart/${id}`, { amount });
      toast.success('Quantidade atualizada com sucesso!');

      // Atualiza o carrinho após a alteração no servidor
      const updatedCart = cart.map(cartItem =>
        cartItem.id === id ? { ...cartItem, amount, total: cartItem.price * amount } : cartItem
      );
      updateCart(updatedCart);
    } catch (error) {
      console.error('Error updating product amount:', error);
      toast.error('Erro ao atualizar a quantidade.');
      console.log("dados que vao para o servidor:", amount, id);
    }
  }

  return (
    <>
      <Header />
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="font-medium text-2xl text-center my-4">Meu carrinho</h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <p className="font-medium">Verificando se tem itens no carrinho...</p>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <p className="font-medium">Ops, seu carrinho está vazio...</p>
            <Link href="/market">
              <button className="bg-slate-600 my-3 p-1 px-3 text-white font-medium rounded">
                Acessar produtos
              </button>
            </Link>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <section key={item.id} className="flex items-center justify-between border-b-2 border-gray-300">
                <img src={item.cover} alt={item.title} className="w-28" />

                <strong>Preço: {item.price}</strong>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="bg-slate-600 px-2 rounded text-white font-medium flex items-center justify-center"
                  >
                    -
                  </button>

                  {item.amount}

                  <button
                    onClick={() => handleAddItem(item)}
                    className="bg-slate-600 px-2 rounded text-white font-medium flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                <strong className="float-right">
                  SubTotal: {item.total !== undefined ? item.total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                  }) : 'N/A'}
                </strong>
              </section>
            ))}

            <p className="font-bold mt-4">Total: {total}</p>

            <div className="flex justify-center mt-4">
              <div onClick={() => { window.location.href = '/market' }} className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors cursor-pointer">
                Continuar comprando
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return { props: {} }
});
