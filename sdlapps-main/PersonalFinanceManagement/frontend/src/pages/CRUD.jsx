import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig'; // Make sure this points to your API

const TransactionForm = () => {
  const [formData, setFormData] = useState({
    amount: '',
    transactionMethod: '',
    dateEntered: '',
  });

  const [transactions, setTransactions] = useState([]);

  // Fetch transactions from backend API
  const fetchTransactions = async () => {
    try {
      const response = await axiosInstance.get('/api/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submit to save a transaction
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data payload
    const payload = {
      amount: Number(formData.amount),
      transactionMethod: formData.transactionMethod,
      dateEntered: formData.dateEntered, // send as string (ISO format)
    };

    try {
      await axiosInstance.post('/api/transactions', payload);
      alert('Transaction saved!');
      setFormData({ amount: '', transactionMethod: '', dateEntered: '' });
      fetchTransactions(); // Refresh list
    } catch (error) {
      alert('Failed to save transaction.');
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="text"
            name="transactionMethod"
            placeholder="Transaction Method"
            value={formData.transactionMethod}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="date"
            name="dateEntered"
            value={formData.dateEntered}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: 10, backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: 4 }}>
          Save Transaction
        </button>
      </form>

      <h3 style={{ marginTop: 24 }}>Transactions List</h3>
      <ul>
        {transactions.length === 0 && <li>No transactions yet.</li>}
        {transactions.map((tx) => (
          <li key={tx._id || tx.id} style={{ borderBottom: '1px solid #ddd', padding: '8px 0' }}>
            Amount: ${tx.amount} | Method: {tx.transactionMethod} | Date: {new Date(tx.dateEntered).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionForm;
