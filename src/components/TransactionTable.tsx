'use client';

import React, { useState } from 'react';
import { Card } from './UI';
import { Search, Download, Edit2 } from 'lucide-react';

interface Transaction {
    id: number;
    date: string;
    description: string;
    amount: number;
    category_name: string;
}

export const TransactionTable = ({ transactions }: { transactions: Transaction[] }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = transactions.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExport = () => {
        const headers = ['Date', 'Description', 'Amount', 'Category'];
        const csvData = filtered.map(t => [t.date, t.description, t.amount, t.category_name]);
        const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transactions_export.csv';
        a.click();
    };

    return (
        <Card className="glass" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3>History</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '0.6rem 1rem 0.6rem 2.5rem',
                                borderRadius: '8px',
                                border: '1px solid var(--card-border)',
                                background: 'var(--glass-bg)',
                                color: 'var(--foreground)',
                                outline: 'none',
                                width: '240px'
                            }}
                        />
                    </div>
                    <button onClick={handleExport} className="glass" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', borderRadius: '8px' }}>
                        <Download size={18} /> Export
                    </button>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--secondary)', fontSize: '0.85rem' }}>
                            <th style={{ padding: '1rem 0.5rem' }}>Date</th>
                            <th style={{ padding: '1rem 0.5rem' }}>Description</th>
                            <th style={{ padding: '1rem 0.5rem' }}>Amount</th>
                            <th style={{ padding: '1rem 0.5rem' }}>Category</th>
                            <th style={{ padding: '1rem 0.5rem' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(t => (
                            <tr key={t.id} style={{ borderBottom: '1px solid var(--card-border)', fontSize: '0.9rem' }}>
                                <td style={{ padding: '1rem 0.5rem' }}>{new Date(t.date).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem 0.5rem' }}>{t.description}</td>
                                <td style={{ padding: '1rem 0.5rem', color: t.amount < 0 ? 'var(--error)' : 'var(--success)', fontWeight: '600' }}>
                                    {t.amount < 0 ? '-' : ''}${Math.abs(t.amount).toLocaleString()}
                                </td>
                                <td style={{ padding: '1rem 0.5rem' }}>
                                    <span style={{
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        background: 'var(--card-border)'
                                    }}>
                                        {t.category_name}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                                    <button style={{ background: 'none', color: 'var(--secondary)' }}>
                                        <Edit2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
