import Head from 'next/head';
import React, { useEffect, useRef, useState, FormEvent } from 'react';
import styles from '../aasstudio/styles.module.scss'; // Importe o SCSS
import { toast } from 'react-toastify';
import { setupAPIClient } from '../../services/api';

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nome, setNome] = useState('');
  const [fone, setFone] = useState('');
  const [msg, setMsg] = useState('');
  const slideRef = useRef<HTMLDivElement>(null);
  const images = ['/images/pexels1.jpg', '/images/pexels2.jpg']; // Caminhos para as imagens
  const totalSlides = images.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 6000); // Troca de slide a cada 6 segundos

    return () => clearInterval(interval);
  }, [totalSlides]);

  useEffect(() => {
    if (slideRef.current) {
      slideRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    try {
      if (nome === '' || fone === '' || msg === '') {
        toast.error("Preencha todos os campos!");
        return;
      }

      const data = new FormData();
      data.append('nome', nome);
      data.append('fone', fone);
      data.append('msg', msg);

      const apiClient = setupAPIClient();
      await apiClient.post('/astudio', data);

      toast.success('Cadastrado com sucesso!');
    } catch (err) {
      console.log(err);
      toast.error("Ops erro ao cadastrar!");
    }

    // Limpa os campos após o envio
    setNome('');
    setFone('');
    setMsg('');
  }

  return (
    <div className="bg-darkblue min-h-screen">
      <Head>
        <title>Landing Page</title>
        <style>{`body { background-color: #0A2540; }`}</style>
      </Head>

      {/* Header com botões */}
      <header className="flex justify-between items-center p-4">
        <div className="text-white text-xl">Logo</div>
        <div className="space-x-4">
          {['Botão 1', 'Botão 2', 'Botão 3'].map((label, index) => (
            <button
              key={index}
              className="text-white px-4 py-2 rounded transition-colors duration-300 hover:bg-blue-500"
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Carrossel */}
      <div className={styles['carousel-container']}>
        <div ref={slideRef} className={styles['slides']}>
          {images.map((src, i) => (
            <div key={i} className={styles['slide']}>
              <img src={src} alt={`Imagem ${i}`} />
            </div>
          ))}
        </div>
        <button onClick={handlePrevClick} className={styles['prev-button']}>
          Prev
        </button>
        <button onClick={handleNextClick} className={styles['next-button']}>
          Next
        </button>
        {/* Texto centralizado com link sobre o carrossel */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="text-black text-3xl font-bold">SAIBA MAIS</h1>
          <a href="#link" className="mt-5 text-black-500 underline hover:text-black-300">
            Saiba mais
          </a>
        </div>
      </div>

      {/* Imagem centralizada */}
      <div className="flex justify-center my-4">
        <img
          src="/images/pexels1.jpg"
          alt="Imagem centralizada"
          className="w-full max-w-[calc(100%-4cm)]"
        />
      </div>

      {/* Layout de colunas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Coluna 1 com duas linhas */}
        <div className="flex flex-col gap-[0.7cm]">
          <div className="bg-gray-200 p-4">Coluna 1, Linha 1</div>
          <div className="bg-gray-200 p-4">Coluna 1, Linha 2</div>
        </div>

        {/* Coluna 2 */}
        <div className="bg-gray-200 p-4 flex flex-col gap-4">
          {/* Texto na parte superior */}
          <h2 className="text-xl font-bold text-gray-700">
            SOLICITE O SEU ORÇAMENTO OU VISITA
          </h2>

          {/* Formulário */}
          <form className="flex flex-col space-y-4" onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full md:w-2/3 p-2 border border-gray-300 rounded"
            />
            <input
              type="tel"
              placeholder="Telefone"
              value={fone}
              onChange={(e) => setFone(e.target.value)}
              className="w-full md:w-2/3 p-2 border border-gray-300 rounded"
            />
            <textarea
              placeholder="Mensagem"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="w-full md:w-2/3 p-2 border border-gray-300 rounded"
            ></textarea>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
