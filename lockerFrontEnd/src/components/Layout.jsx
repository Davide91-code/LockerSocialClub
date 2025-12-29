import DateTimeDisplay from './DateTimeDisplay';
import LanguageSwitcher from './LanguageSwitcher';
import logo from '../assets/LogoLocker.svg';

export default function Layout({ children }) {
  return (
    <div className="layout-container">
      <header className="layout-header">
        <img src={logo} alt="Logo cliente" />

        <div>
          <h2>Locker A – Via Roma</h2>
          <DateTimeDisplay />
        </div>
        <LanguageSwitcher />
      </header>

      <main className="layout-main">
        {children}
      </main>
    </div>
  );
}
