import { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import { Header } from '../../components/Header';
import { setupAPIClient } from '../../services/api';
import { toast } from 'react-toastify';
import { BsCartPlus } from 'react-icons/bs';
import { CartContext } from '../../contexts/CartContext';
import Link from 'next/link';
import { useUserData } from '../../utils/nameAuth';
import { parseCookies, setCookie } from 'nookies';

export interface ProductProps {
  id: number;
  title: string;
  description: string;
  price: number;
  cover: string;
}

export default function Market({ initialClickedProducts }) {
  const { addItemCart } = useContext(CartContext);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const userData = useUserData();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const apiClient = setupAPIClient();
        const response = await apiClient.get('/solution');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    if (userData) {
      const cookies = parseCookies();
      const clickedProducts = cookies.clickedProducts ? JSON.parse(cookies.clickedProducts) : [];
      console.log('Produtos clicados:', clickedProducts);
    }
  }, [userData]);

  async function handleAddCartItem(product: ProductProps) {
    try {
      // Adiciona ao estado local do carrinho
      addItemCart(product);

      // Envia para o servidor para atualizar o banco de dados
      const apiClient = setupAPIClient();
      await apiClient.post('/cart', {
        solutionId: product.id,
        userId: userData.id,
        status: true,
        delivery: 'pending',
        amount: 1,
      });

      toast.success('Produto adicionado ao carrinho com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrinho no banco de dados:', error);
      toast.error('Erro ao adicionar produto ao carrinho. Por favor, tente novamente.');
    }

    // Salvando temporariamente o produto clicado em um cookie
   
  }

  return (
    <div>
      <Head>
        <title>Mercado</title>
      </Head>
      <Header />
      <main className="w-full max-w-7xl px-4 mx-auto">
        <h1 className="font-bold text-2xl mb-4 mt-10 text-center">Produtos em alta</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
          {products.map((product) => (
            <section key={product.id} className="w-full">
             <Link href={`/detail/${product.id}`} passHref>
              <div>
                <img
                  className="w-full rounded-lg max-h-70 mb-2"
                  src={product.cover}
                  alt={product.title}
                />
                <p className="font-medium mt-1 mb-2">{product.title}</p>
              </div>
            </Link>

              <div className="flex gap-3 items-center">
                <strong className="text-zinc-700/90">
                  {product.price ? `R$ ${Number(product.price).toFixed(2).replace('.', ',')}` : 'Preço não disponível'}
                </strong>

                <button className="bg-zinc-900 p-1 rounded" onClick={() => handleAddCartItem(product)}>
                  <BsCartPlus size={20} color="#FFF"/>
                </button>
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const clickedProducts = context.req.cookies.clickedProducts || '[]';

  return {
    props: {
      initialClickedProducts: JSON.parse(clickedProducts)
    }
  };
}
