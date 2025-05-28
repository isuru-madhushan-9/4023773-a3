
import React, { useState } from 'react';
import { useMonthlyPayment } from '../context/MonthlyPaymentContext';
import './styles/LoanForm.css';

const LoanForm = () => {
  const { setMonthlyPayment, setTotalInterestPaid, setBreakdown } = useMonthlyPayment();

  const [formData, setFormData] = useState({
    loanType: '',
    loanAmount: '',
    term: '',
    creditScore: '',
    houseAge: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const { loanType, loanAmount, term, creditScore, houseAge } = formData;

    if (!loanType) newErrors.loanType = 'Loan type is required';
    if (!loanAmount || Number(loanAmount) <= 0) newErrors.loanAmount = 'Loan amount must be a positive number';

    if (!term || Number(term) < 1) {
      newErrors.term = 'Term is required';
    } else if (loanType === 'Interest Only' && Number(term) > 10) {
      newErrors.term = 'Interest Only term must be 1-10 years';
    } else if ((loanType === 'Fixed Rate' || loanType === 'Variable Rate') && Number(term) > 30) {
      newErrors.term = 'Term must be 1-30 years';
    }

    if (!creditScore) newErrors.creditScore = 'Credit score is required';

    if (houseAge === '') {
      newErrors.houseAge = 'House age is required';
    } else if (Number(houseAge) < 0) {
      newErrors.houseAge = 'House age must be non-negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setResult(null);
    setApiError(null);
    setMonthlyPayment(0);
    setTotalInterestPaid(0);
    setBreakdown(null);

    try {
      const response = await fetch("https://home-loan.matthayward.workers.dev/calculate", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loanType: formData.loanType,
          loanAmount: Number(formData.loanAmount),
          term: Number(formData.term),
          creditScore: formData.creditScore,
          houseAge: Number(formData.houseAge),
        })
      });

      if (!response.ok) throw new Error("API Error: " + response.statusText);

      const data = await response.json();
      console.log("API Response:", data);
      setResult(data);
      setMonthlyPayment(data.monthlyPayment);
      setTotalInterestPaid(data.totalInterestPaid);
      setBreakdown(data.breakdown);
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="loan-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Loan Type</label>
        <select name="loanType" value={formData.loanType} onChange={handleChange}>
          <option value="">Select Type</option>
          <option value="Fixed Rate">Fixed Rate</option>
          <option value="Variable Rate">Variable Rate</option>
          <option value="Interest Only">Interest Only</option>
        </select>
        {errors.loanType && <p className="error">{errors.loanType}</p>}
      </div>

      <div className="form-group">
        <label>Loan Amount ($)</label>
        <input type="number" name="loanAmount" value={formData.loanAmount} onChange={handleChange} />
        {errors.loanAmount && <p className="error">{errors.loanAmount}</p>}
      </div>

      <div className="form-group">
        <label>Term (Years)</label>
        <input type="number" name="term" value={formData.term} onChange={handleChange} />
        {errors.term && <p className="error">{errors.term}</p>}
      </div>

      <div className="form-group">
        <label>Credit Score</label>
        <select name="creditScore" value={formData.creditScore} onChange={handleChange}>
          <option value="">Select Score</option>
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Poor">Poor</option>
        </select>
        {errors.creditScore && <p className="error">{errors.creditScore}</p>}
      </div>

      <div className="form-group">
        <label>House Age (Years)</label>
        <input type="number" name="houseAge" value={formData.houseAge} onChange={handleChange} />
        {errors.houseAge && <p className="error">{errors.houseAge}</p>}
      </div>

      <div className="form-group full-width">
        <button type="submit" disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
      </div>

      {apiError && <p className="error">Error: {apiError}</p>}

      {result && (
        <div className="result">
          <h3>Calculation Results</h3>
          <p><strong>Monthly Payment:</strong> ${result.monthlyPayment?.toFixed(2) ?? 'N/A'}</p>
          <p><strong>Total Payment:</strong> ${result.totalPayment?.toFixed(2) ?? 'N/A'}</p>
          <p><strong>Total Interest:</strong> ${result.totalInterestPaid?.toFixed(2) ?? 'N/A'}</p>
          <h4>Breakdown:</h4>
          <ul>
            <li>Loan Amount: ${result.breakdown?.loanAmount ?? 'N/A'}</li>
            <li>Term: {result.breakdown?.term ?? 'N/A'} years</li>
            <li>Base Interest Rate: {result.breakdown?.baseInterestRate ?? 'N/A'}%</li>
            <li>Adjusted Rate: {result.breakdown?.adjustedInterestRate ?? 'N/A'}%</li>
            <li>Credit Score Multiplier: {result.breakdown?.creditScoreMultiplier ?? 'N/A'}</li>
            <li>House Age Multiplier: {result.breakdown?.houseAgeMultiplier ?? 'N/A'}</li>
            <li>House Age Category: {result.breakdown?.houseAgeCategory ?? 'N/A'}</li>
            <li>Term in Months: {result.breakdown?.termInMonths ?? 'N/A'}</li>
          </ul>
        </div>
      )}
    </form>
  );
};

export default LoanForm;
