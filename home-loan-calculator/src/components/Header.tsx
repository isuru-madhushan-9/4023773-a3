import { useMonthlyPayment } from '../context/MonthlyPaymentContext';

const Header = () => {
  const { monthlyPayment } = useMonthlyPayment();

  return (
    <header style={{ padding: '1rem', backgroundColor: '#282c34', color: 'white', textAlign: 'center' }}>
      <h1>ZZZ Bank - Home Loan Calculator</h1>
      {monthlyPayment !== null && <h2>Monthly Payment: ${monthlyPayment.toFixed(2)}</h2>}
    </header>
  );
};

export default Header;