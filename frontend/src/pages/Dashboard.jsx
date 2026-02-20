import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBalance, transfer, logout, getCustomers } from '../api';

export default function Dashboard({ user, onLogout }) {
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);

  async function handleCheckBalance() {
    setBalance(null);
    setBalanceLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const data = await getBalance();
      setBalance(data.balance);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to load balance' });
    } finally {
      setBalanceLoading(false);
    }
  }

  async function handleTransfer(e) {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setTransferLoading(true);
    try {
      const result = await transfer({ recipient_email: recipientEmail, amount });
      const messageText = result.recipientCreated 
        ? `Transfer successful! New account created for ${recipientEmail}`
        : 'Transfer successful.';
      setMessage({ type: 'success', text: messageText });
      setRecipientEmail('');
      setAmount('');
      setBalance(null);
      // Refresh customers list to show the new recipient
      loadCustomers();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Transfer failed' });
    } finally {
      setTransferLoading(false);
    }
  }

  async function handleLogout() {
    await logout();
    onLogout();
  }

  async function loadCustomers() {
    setCustomersLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data.customers || []);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setCustomersLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const displayName = user?.customer_name || 'User';

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <Link to="/dashboard" className="logo">
          <span className="logo-icon">🏠</span>
          KodBank
        </Link>
        <div className="header-right">
          <span className="welcome">Welcome, {displayName}</span>
          <button type="button" className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <h1 className="page-title">Dashboard</h1>

        {message.text && (
          <div className={`message message-${message.type}`}>{message.text}</div>
        )}

        <div className="cards">
          <section className="card">
            <h2 className="card-title">
              <span className="card-icon">👛</span>
              Your Balance
            </h2>
            <div className="balance-area">
              {balance === null && !balanceLoading && (
                <p className="balance-placeholder">Click refresh to view balance</p>
              )}
              {balanceLoading && <p className="balance-loading">Loading...</p>}
              {balance !== null && !balanceLoading && (
                <p className="balance-value">${Number(balance).toFixed(2)}</p>
              )}
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCheckBalance}
              disabled={balanceLoading}
            >
              <span className="btn-icon">↻</span> Refresh
            </button>
          </section>

          <section className="card">
            <h2 className="card-title">
              <span className="card-icon">✈</span>
              Transfer Money
            </h2>
            <form onSubmit={handleTransfer}>
              <label>
                Recipient Email
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="recipient@example.com"
                  required
                />
              </label>
              <label>
                Amount ($)
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </label>
              <button type="submit" className="btn-primary" disabled={transferLoading}>
                <span className="btn-icon">✈</span> Transfer Funds
              </button>
            </form>
          </section>
        </div>

        <section className="card card-full">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-icon">👥</span>
              Customers Database
            </h2>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={loadCustomers}
              disabled={customersLoading}
            >
              <span className="btn-icon">↻</span> Refresh
            </button>
          </div>
          {customersLoading ? (
            <p className="balance-loading">Loading customers...</p>
          ) : customers.length === 0 ? (
            <p className="balance-placeholder">No customers found</p>
          ) : (
            <div className="table-container">
              <table className="customers-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Balance</th>
                    <th>Password Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.customer_id}>
                      <td>{customer.customer_id}</td>
                      <td>{customer.customer_name}</td>
                      <td>{customer.email}</td>
                      <td className="balance-cell">${Number(customer.balance).toFixed(2)}</td>
                      <td className="password-cell">
                        {customer.customer_password
                          ? customer.customer_password.substring(0, 30) + '...'
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
