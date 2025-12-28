'use client';

import React from 'react';
import { Card } from './UI';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

interface SummaryProps {
    totalSpent: number;
    prevMonthSpent: number;
    topCategory: string;
    transactionCount: number;
}

export const DashboardSummary = ({ totalSpent, prevMonthSpent, topCategory, transactionCount }: SummaryProps) => {
    const diff = totalSpent - prevMonthSpent;
    const isUp = diff > 0;

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
        }}>
            <Card className="glass">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--primary-glow)' }}>
                        <DollarSign color="var(--primary)" size={24} />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>Total Spent (This Month)</p>
                        <h2 style={{ fontSize: '1.5rem' }}>${totalSpent.toLocaleString()}</h2>
                        <p style={{
                            fontSize: '0.75rem',
                            color: isUp ? 'var(--error)' : 'var(--success)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        }}>
                            {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {Math.abs(diff).toLocaleString()} vs last month
                        </p>
                    </div>
                </div>
            </Card>

            <Card className="glass">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(255, 64, 129, 0.1)' }}>
                        <TrendingUp color="var(--accent)" size={24} />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>Top Category</p>
                        <h2 style={{ fontSize: '1.5rem' }}>{topCategory}</h2>
                    </div>
                </div>
            </Card>

            <Card className="glass">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(0, 200, 83, 0.1)' }}>
                        <Calendar color="var(--success)" size={24} />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>Transactions</p>
                        <h2 style={{ fontSize: '1.5rem' }}>{transactionCount}</h2>
                    </div>
                </div>
            </Card>
        </div>
    );
};
