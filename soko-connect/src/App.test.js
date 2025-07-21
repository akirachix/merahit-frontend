import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./shared-components/Header/index', () => () => (
  <header data-testid="header">Soko Connect Admin Dashboard</header>
));

jest.mock('./shared-components/Sidebar/index', () => () => (
  <nav data-testid="sidebar" className="open">Sidebar</nav>
));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  UNSAFE_logV6DeprecationWarnings: jest.fn(),
}));

describe('App Component', () => {
  test('renders header and sidebar', () => {
    render(<App />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toHaveClass('open');
  });
});