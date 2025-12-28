'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, Button } from './UI';

export const CSVUpload = ({ onUploadSuccess }: { onUploadSuccess: () => void }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setStatus('idle');

        try {
            const text = await file.text();
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ csvContent: text }),
            });

            if (res.ok) {
                setStatus('success');
                onUploadSuccess();
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card className="glass" style={{ textAlign: 'center' }}>
            <div style={{ padding: '2rem 1rem' }}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'var(--primary-glow)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Upload size={32} color="var(--primary)" />
                    </div>
                </div>

                <h2 style={{ marginBottom: '0.5rem' }}>Upload Transactions</h2>
                <p style={{ color: 'var(--secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Drop your CSV file here or click to browse
                </p>

                <label style={{
                    display: 'block',
                    border: '2px dashed var(--card-border)',
                    borderRadius: 'var(--radius)',
                    padding: '2rem',
                    cursor: 'pointer',
                    marginBottom: '1rem',
                    transition: 'border-color 0.2s'
                }}>
                    <input type="file" accept=".csv" onChange={handleFileChange} style={{ display: 'none' }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <FileText size={20} />
                        {file ? file.name : 'Select CSV File'}
                    </div>
                </label>

                {status === 'success' && (
                    <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <CheckCircle size={16} /> Successfully imported!
                    </div>
                )}

                {status === 'error' && (
                    <div style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <AlertCircle size={16} /> Error uploading file
                    </div>
                )}

                <Button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    style={{ width: '100%', marginTop: '0.5rem' }}
                >
                    {uploading ? 'Processing...' : 'Start Import'}
                </Button>
            </div>
        </Card>
    );
};
