'use client';

import React from 'react';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Card } from './UI';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryData {
    category: string;
    amount: number;
}

export const CategoryBreakdown = ({ data }: { data: CategoryData[] }) => {
    const chartData = {
        labels: data.map(d => d.category),
        datasets: [
            {
                data: data.map(d => d.amount),
                backgroundColor: [
                    '#0070f3',
                    '#ff4081',
                    '#00c853',
                    '#ff9100',
                    '#7c4dff',
                    '#00bcd4',
                    '#607d8b'
                ],
                borderWidth: 0,
                hoverOffset: 10,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    color: '#888',
                    font: { size: 12 },
                    usePointStyle: true,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: 12,
                titleFont: { size: 14 },
                bodyFont: { size: 13 },
            },
        },
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <Card className="glass" style={{ height: '400px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Category Breakdown</h3>
            <div style={{ height: '300px' }}>
                <Doughnut data={chartData} options={options} />
            </div>
        </Card>
    );
};
