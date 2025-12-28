'use client';

import React, { useEffect, useState } from 'react';
import { Container } from '@/components/UI';
import { CSVUpload } from '@/components/CSVUpload';
import { DashboardSummary } from '@/components/DashboardSummary';
import { CategoryBreakdown } from '@/components/CategoryBreakdown';
import { TransactionTable } from '@/components/TransactionTable';
import { PieChart, List, Plus } from 'lucide-react';

export default function App() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      if (Array.isArray(data)) {
        setTransactions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate metrics
  const totalSpent = Math.abs(transactions.reduce((acc, t) => t.amount < 0 ? acc + t.amount : acc, 0));

  const categoriesMap: Record<string, number> = {};
  transactions.forEach(t => {
    if (t.amount < 0) {
      const amt = Math.abs(t.amount);
      categoriesMap[t.category_name] = (categoriesMap[t.category_name] || 0) + amt;
    }
  });

  const categoryData = Object.entries(categoriesMap).map(([category, amount]) => ({ category, amount }));
  const topCategory = categoryData.sort((a, b) => b.amount - a.amount)[0]?.category || 'None';

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <Container>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', letterSpacing: '-0.05em' }}>Spend <span style={{ color: 'var(--primary)' }}>Intel</span></h1>
            <p style={{ color: 'var(--secondary)' }}>Minimalist wealth intelligence.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {/* User profile / Logout placeholder */}
          </div>
        </header>

        {transactions.length === 0 && !loading ? (
          <div style={{ maxWidth: '500px', margin: '4rem auto' }}>
            <CSVUpload onUploadSuccess={fetchData} />
          </div>
        ) : (
          <>
            <DashboardSummary
              totalSpent={totalSpent}
              prevMonthSpent={0} // Mock for v0.1
              topCategory={topCategory}
              transactionCount={transactions.length}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <CategoryBreakdown data={categoryData} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <CSVUpload onUploadSuccess={fetchData} />
              </div>
            </div>

            <TransactionTable transactions={transactions} />
          </>
        )}
      </Container>
    </div>
  );
}
