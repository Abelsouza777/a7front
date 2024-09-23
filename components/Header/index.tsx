import { useContext } from 'react';
import styles from './styles.module.scss';
import Link from 'next/link';
import { FiLogOut } from 'react-icons/fi';
import { AuthContext } from '../../contexts/AuthContext';
import { FiShoppingCart } from 'react-icons/fi';
import { CartContext } from '../../contexts/CartContext';
import { useUserData } from '../../utils/nameAuth'; // Importe a função useUserData aqui

export function Header() {
  const { signOut, user } = useContext(AuthContext); // Aqui estamos acessando o usuário fornecido pelo AuthContext
  const { cartAmount } = useContext(CartContext);
  const userData = useUserData(); // Aqui estamos buscando os dados do usuário usando a função useUserData
  console.log(userData?.id); // Exibe o ID do usuário, se existir

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/dashboard" legacyBehavior>
          <img src="/SAASCOM.png" width={190} height={60} />
        </Link>

        <nav className={styles.menuNav}>
          <Link href="/category" legacyBehavior>
            <a>Categoria</a>
          </Link>

          <Link href="/product" legacyBehavior>
            <a>Cardapio</a>
          </Link>

          <Link href="/solutions" legacyBehavior>
            <a>Soluções</a>
          </Link>

          <Link href="/market" legacyBehavior>
            <a>Produtos</a>
          </Link>

          <Link href="/cart" legacyBehavior>
            <div className="relative">
              <FiShoppingCart size={24} color="#FFF" />
              {cartAmount > 0 && (
                <span className="absolute -top-2 -right-2 px-2.5 bg-sky-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs">
                  {cartAmount}
                </span>
              )}
            </div>
          </Link>

          <div>Olá, {user ? user.name : 'visitante'}!</div> {/* Exibe "Olá, NomeDoUsuario!" se estiver logado ou "Olá, visitante!" se não estiver */}
          <button onClick={signOut}>
            <FiLogOut color="#FFF" size={24} />
          </button>
        </nav>
      </div>
    </header>
  );
}
