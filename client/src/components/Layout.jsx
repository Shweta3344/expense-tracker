import { Link, Outlet, useLocation } from 'react-router-dom';

function Layout() {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/add', label: 'Add Expense' },
    { to: '/expenses', label: 'Expense List' }
  ];

  return (
    <div className="app-layout">
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">
            <span className="header-icon">💰</span>
            Expense Tracker
          </h1>
          <nav className="nav">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link ${location.pathname === to || (to !== '/' && location.pathname.startsWith(to)) ? 'active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
