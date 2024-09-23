import React, { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import { Header } from '../../components/Header';
import { setupAPIClient } from '../../services/api';
import { toast } from 'react-toastify';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { BsCartPlus, BsPencil, BsTrash } from 'react-icons/bs';
import { CartContext } from '../../contexts/CartContext';
import Link from 'next/link';
import axios from 'axios'; // Importe o axios

export interface ProductProps {
  id: string; // Alterado para string
  title: string;
  description: string;
  price: number;
  inventory:number;
  cover: string;
}

export default function Market() {
  const { addItemCart } = useContext(CartContext);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inputWidth, setInputWidth] = useState<number>(0);

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

  async function handleAddCartItem(product: ProductProps) {
    addItemCart({ ...product, id: parseInt(product.id) });
  }

  async function handleDeleteProduct(id: string) {
    if (confirm('Tem certeza de que deseja excluir este item?')) {
      try {
        const apiClient = setupAPIClient();
        await apiClient.delete(`/solution/${id}`);
        toast.success('Produto excluído com sucesso!');
        setProducts(products.filter(product => product.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Erro ao excluir o produto. Por favor, tente novamente.');
      }
    }
  }
  

  function handleEditClick(id: string) {
    setEditingId(id);
  }

  async function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof ProductProps, id: string) {
    // Atualiza o estado local do produto
    setProducts(products.map(product => {
      if (product.id === id) {
        return { ...product, [field]: event.target.value };
      }
      return product;
    }));
  }

  async function handleInputBlur(id: string) {
    try {
      // Envia a modificação para a API
      const apiClient = setupAPIClient();
      await apiClient.put(`/solution/${id}`, products.find(product => product.id === id));
      // Remove o modo de edição
      setEditingId(null);
      toast.success('Produto atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Erro ao atualizar o produto. Por favor, tente novamente.');
    }
  }

  useEffect(() => {
    if (editingId) {
      const product = products.find(product => product.id === editingId);
      if (product) {
        setInputWidth(calculateInputWidth(product.title)); // Calcula a largura da caixa de entrada com base no título atual
      }
    }
  }, [editingId, products]);

  // Função para calcular a largura da caixa de entrada com base no texto atual
  function calculateInputWidth(text: string) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.font = '16px Arial'; // Define a fonte para o cálculo de largura
      const measuredWidth = context.measureText(text).width + 20; // Adiciona um buffer de 20 pixels
      return Math.max(measuredWidth, 200); // Retorna a largura máxima entre a largura medida e 200 pixels
    }
    return 200; // Largura mínima se o contexto do canvas não estiver disponível
  }

  return (
    <div>
      <Head>
        <title>Mercado</title>
      </Head>
      <Header />
      <main className="w-full max-w-7xl px-4 mx-auto">
        <h1 className="font-bold text-2xl mb-4 mt-10 text-center">GERENCIAMENTO DE SOLUÇÕES</h1>

        <div className="overflow-x-auto">
         <div className="flex justify-end mb-4">
  <Link href="/solutioncreate" passHref>
    <span className="flex items-center bg-green-500 text-white font-bold py-2 px-4 rounded">
      Inserir <BsCartPlus size={20} className="ml-2" />
    </span>
  </Link>
</div>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2"></th>
                <th className="px-4 py-2">Título</th>
                <th className="px-4 py-2">Descrição</th>
                <th className="px-4 py-2">Preço</th>
                <th className="px-4 py-2">Quantidade</th>
                <th className="px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <React.Fragment key={product.id}>
                  <tr key={product.id}>
                    <td className="px-4 py-2">
                      <Link href={`/detail/${product.id}`} passHref>
                        <img
                          className="w-64 h-auto cursor-pointer"
                          src={product.cover}
                          alt={product.title}
                        />
                      </Link>
                    </td>
                    <td className="px-4 py-2">
                      {editingId === product.id ? (
                        <input
                          type="text"
                          value={product.title}
                          style={{ width: `${inputWidth}px` }} // Define a largura dinamicamente
                          onChange={(e) => handleInputChange(e, 'title', product.id)}
                          onBlur={() => handleInputBlur(product.id)}
                        />
                      ) : (
                        <span>{product.title}</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editingId === product.id ? (
                        <textarea
                          value={product.description}
                          style={{ width: `${inputWidth}px`, minHeight: '50px' }} // Define a largura e altura dinamicamente
                          onChange={(e) => handleInputChange(e, 'description', product.id)}
                          onBlur={() => handleInputBlur(product.id)}
                        />
                      ) : (
                        <span>{product.description}</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editingId === product.id ? (
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) => handleInputChange(e, 'price', product.id)}
                          onBlur={() => handleInputBlur(product.id)}
                        />
                      ) : (
                        <span>{product.price}</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editingId === product.id ? (
                        <input
                          type="number"
                          value={product.inventory}
                          onChange={(e) => handleInputChange(e, 'inventory', product.id)}
                          onBlur={() => handleInputBlur(product.id)}
                        />
                      ) : (
                        <span>{product.inventory}</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editingId === product.id ? (
                        <button onClick={() => handleInputBlur(product.id)}>Salvar</button>
                      ) : (
                        <React.Fragment>
                          <button className="bg-zinc-900 p-1 rounded ml-2" onClick={() => handleDeleteProduct(product.id)}>
                            <BsTrash size={20} color="#FFF"/>
                          </button>
                          <button className="bg-zinc-900 p-1 rounded ml-2" onClick={() => handleEditClick(product.id)}>
                            <BsPencil size={20} color="#FFF"/>
                          </button>
                        </React.Fragment>
                      )}
                    </td>
                  </tr>
                  {index !== products.length - 1 && ( // Adiciona a linha separadora se não for o último produto
                    <tr key={`separator-${product.id}`}>
                      <td colSpan={5} className="border-t border-gray-200">&nbsp;</td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {}
  };
});
