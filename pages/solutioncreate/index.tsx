import React, { useState, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';
import styles from './styles.module.scss';
import { Header } from '../../components/Header';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { setupAPIClient } from '../../services/api';
import { toast } from 'react-toastify';

type ItemProps = {
  id: string;
  name: string;
};

interface CategoryProps {
  categoryList: ItemProps[];
}

export default function Solution({ categoryList }: CategoryProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    inventory: '',
    cover: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    try {
      const apiClient = setupAPIClient();
      await apiClient.post('/solution', formData);
      toast.success('Cadastrado com sucesso!');
    } catch (err) {
      console.log(err);
      toast.error('Ops erro ao cadastrar!');
    }

    setFormData({ title: '', description: '', price: '',inventory: '', cover: '' });
  }

  return (
    <>
      <Head>
        <title>Novo produto - SAASCOM</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <h1>Novo produto</h1>

          <form className={styles.form} onSubmit={handleRegister}>
            <input
              type="text"
              name="title"
              placeholder="Digite o título do produto"
              className={styles.input}
              value={formData.title}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Descreva seu produto..."
              className={styles.input}
              value={formData.description}
              onChange={handleChange}
            />

            <input
              type="number"
              name="price"
              placeholder="Preço"
              className={styles.input}
              value={formData.price}
              onChange={handleChange}
            />

<input
              type="number"
              name="inventory"
              placeholder="Quantidade"
              className={styles.input}
              value={formData.inventory}
              onChange={handleChange}
            />

            <input
              type="text"
              name="cover"
              placeholder="Endereço da imagem"
              className={styles.input}
              value={formData.cover}
              onChange={handleChange}
            />

            <button className={styles.buttonAdd} type="submit">
              Cadastrar
            </button>
          </form>
        </main>
      </div>
    </>
  );
}
export const getServerSideProps = canSSRAuth(async (ctx) => {

  return {
    props: {}
  }

})