import ReactDOM from 'react-dom/client';
import App from './App';
import { MonthlyPaymentProvider } from './context/MonthlyPaymentContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <MonthlyPaymentProvider>
    <App />
  </MonthlyPaymentProvider>
);