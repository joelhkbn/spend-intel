'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, Button } from './UI';

export const VisionAnalyzer = ({ onAnalysisComplete }: { onAnalysisComplete: (data: any[]) => void }) => {
    const [image, setImage] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setStatus('idle');
            };
            reader.readAsDataURL(file);
        }
    };

    const startAnalysis = async () => {
        if (!image) return;
        setAnalyzing(true);
        setStatus('idle');

        try {
            const res = await fetch('/api/analyze-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image }),
            });

            if (res.ok) {
                const data = await res.json();
                onAnalysisComplete(data);
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <Card className="glass" style={{ textAlign: 'center', overflow: 'hidden' }}>
            <div style={{ padding: '2rem 1.5rem' }}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(0, 112, 243, 0.4)'
                    }}>
                        <ImageIcon size={32} color="white" />
                    </div>
                </div>

                <h2 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    AI Vision Analysis <Sparkles size={18} color="var(--accent)" />
                </h2>
                <p style={{ color: 'var(--secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Upload a screenshot of a chart, graph, or statement.
                </p>

                <label style={{
                    display: 'block',
                    border: '2px dashed var(--card-border)',
                    borderRadius: 'var(--radius)',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    marginBottom: '1.5rem',
                    transition: 'all 0.2s',
                    background: image ? 'rgba(0,0,0,0.2)' : 'transparent'
                }}>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    {image ? (
                        <img src={image} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                    ) : (
                        <div style={{ padding: '2rem 0', color: 'var(--secondary)' }}>
                            Click to select image
                        </div>
                    )}
                </label>

                {status === 'success' && (
                    <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <CheckCircle size={16} /> Analysis complete!
                    </div>
                )}

                {status === 'error' && (
                    <div style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <AlertCircle size={16} /> Analysis failed. Check API Key.
                    </div>
                )}

                <Button
                    onClick={startAnalysis}
                    disabled={!image || analyzing}
                    style={{ width: '100%', background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)', color: 'white' }}
                >
                    {analyzing ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <Loader2 className="animate-spin" size={18} /> Analyzing with AI...
                        </div>
                    ) : 'Analyze Graph'}
                </Button>
            </div>
        </Card>
    );
};
