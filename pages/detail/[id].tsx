import { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import { Header } from '../../components/Header';
import { setupAPIClient } from '../../services/api';
import { toast } from 'react-toastify';
import { CartContext } from '../../contexts/CartContext';
import { useRouter } from 'next/router';
import { ProductProps } from '../market';
import { BsCartPlus } from 'react-icons/bs';

export default function Market() {
  const [product, setProduct] = useState<ProductProps | null>(null);
  const { addItemCart } = useContext(CartContext);
  const router = useRouter();

  useEffect(() => {
    async function getProduct() {
      const { id } = router.query;
      if (!id) return;
      try {
        const apiClient = setupAPIClient(); // Cria o cliente API
        const response = await apiClient.get(`/solution/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        // Lide com erros, por exemplo, exibindo uma mensagem de erro ao usuário
      }
    }
    

    getProduct();
  }, [router.query]);
  async function handleAddCartItem(product: ProductProps) {
    addItemCart(product);
  }
  return (
    <div>
      <Head>
        {product && <title>{product.title}</title>}
      </Head>
      <Header />
      <main className="w-full max-w-7xl px-4 mx-auto my-6">
        {product && (
          <section className="w-full">
            <div className="flex flex-col lg:flex-row">
              <img
                className="flex-1 w-full max-h-72 object-contain"
                src={product.cover}
                alt={product.title}
              />
              <div className="flex-1">
                <p className="font-bold text-2xl mt-4 mb-2">{product.title}</p>
                <p className="my-4">{product.description}</p>
                <strong className="text-zinc-700/90">
  {product.price ? product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : 'Preço não disponível'}
</strong>

                <button className="bg-zinc-900 p-1 rounded" onClick={() => handleAddCartItem(product)}>
                  <BsCartPlus size={20} color="#FFF"/>
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
