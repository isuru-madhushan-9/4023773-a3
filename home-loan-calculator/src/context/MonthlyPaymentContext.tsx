import React, { createContext, useContext, useState } from "react";

interface BreakdownData {
  loanAmount: number;
  term: number;
  baseInterestRate: number;
  adjustedInterestRate: number;
  creditScoreMultiplier: number;
  houseAgeMultiplier: number;
  houseAgeCategory: string;
  termInMonths: number;
}

interface MonthlyPaymentContextType {
  monthlyPayment: number | null;
  setMonthlyPayment: (value: number) => void;

  totalInterestPaid: number | null;
  setTotalInterestPaid: (value: number) => void;

  breakdown: BreakdownData | null;
  setBreakdown: (value: BreakdownData) => void;

}

const MonthlyPaymentContext = createContext<MonthlyPaymentContextType | undefined>(undefined);

export const MonthlyPaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalInterestPaid, setTotalInterestPaid] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<BreakdownData | null>(null);

  return (
    <MonthlyPaymentContext.Provider
      value={{ monthlyPayment, setMonthlyPayment, totalInterestPaid, setTotalInterestPaid, breakdown, setBreakdown }}
    >
      {children}
    </MonthlyPaymentContext.Provider>
  );
};

export const useMonthlyPayment = () => {
  const context = useContext(MonthlyPaymentContext);
  if (!context) throw new Error("useMonthlyPayment must be used within MonthlyPaymentProvider");
  return context;
};