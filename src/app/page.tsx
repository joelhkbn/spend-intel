'use client';

import React, { useEffect, useState } from 'react';
import { Container } from '@/components/UI';
import { CSVUpload } from '@/components/CSVUpload';
import { VisionAnalyzer } from '@/components/VisionAnalyzer';
import { DashboardSummary } from '@/components/DashboardSummary';
import { CategoryBreakdown } from '@/components/CategoryBreakdown';
import { TransactionTable } from '@/components/TransactionTable';
import { FileText, Sparkles } from 'lucide-react';

export default function App() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ingestMode, setIngestMode] = useState<'csv' | 'ai'>('csv');

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

  const handleVisionComplete = async (analyzedData: any[]) => {
    try {
      const res = await fetch('/api/transactions/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: analyzedData }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Failed to save vision results:', err);
    }
  };

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
          <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--card-bg)', padding: '0.4rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
            <button
              onClick={() => setIngestMode('csv')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                background: ingestMode === 'csv' ? 'var(--primary)' : 'transparent',
                color: ingestMode === 'csv' ? 'white' : 'var(--secondary)',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                fontSize: '0.85rem', border: 'none', cursor: 'pointer'
              }}
            >
              <FileText size={16} /> CSV
            </button>
            <button
              onClick={() => setIngestMode('ai')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                background: ingestMode === 'ai' ? 'linear-gradient(90deg, var(--primary), var(--accent))' : 'transparent',
                color: ingestMode === 'ai' ? 'white' : 'var(--secondary)',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                fontSize: '0.85rem', border: 'none', cursor: 'pointer'
              }}
            >
              <Sparkles size={16} /> AI Vision
            </button>
          </div>
        </header>

        {transactions.length === 0 && !loading ? (
          <div style={{ maxWidth: '500px', margin: '4rem auto' }}>
            {ingestMode === 'csv' ? (
              <CSVUpload onUploadSuccess={fetchData} />
            ) : (
              <VisionAnalyzer onAnalysisComplete={handleVisionComplete} />
            )}
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
                {ingestMode === 'csv' ? (
                  <CSVUpload onUploadSuccess={fetchData} />
                ) : (
                  <VisionAnalyzer onAnalysisComplete={handleVisionComplete} />
                )}
              </div>
            </div>

            <TransactionTable transactions={transactions} />
          </>
        )}
      </Container>
    </div>
  );
}
