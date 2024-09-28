
// pages/index.tsx
import Link from 'next/link';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Home() {
  return (
    <div className="grid grid-rows-2 h-screen bg-blue-900 text-white">
      {/* Primeira metade da tela (EM CONSTRUÇÃO) */}
      <div className="flex items-center justify-center">
        <h1 className="text-4xl font-bold">EM CONSTRUÇÃO</h1>
      </div>

      {/* Segunda metade da tela (Entre em contato + ícone WhatsApp) */}
      <div className="flex flex-col items-center justify-center">
        <p className="text-lg mb-4">Entre em contato</p>
        <Link
          href="https://wa.me/514599739513"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center"
        >
          {/* Ícone do WhatsApp do Bootstrap Icons */}
          <i className="bi bi-whatsapp text-green-500 text-6xl md:text-4xl" aria-label="Entre em contato pelo WhatsApp"></i>
        </Link>
      </div>
    </div>
  );
}