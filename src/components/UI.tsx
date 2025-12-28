'use client';

import React from 'react';

export const Card = ({ children, className = '', style = {} }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) => (
    <div className={`card ${className}`} style={style}>
        {children}
    </div>
);

export const Button = ({
    children,
    onClick,
    variant = 'primary',
    className = '',
    disabled = false,
    style = {}
}: {
    children: React.ReactNode,
    onClick?: () => void,
    variant?: 'primary' | 'secondary' | 'ghost',
    className?: string,
    disabled?: boolean,
    style?: React.CSSProperties
}) => (
    <button
        onClick={onClick}
        className={`${variant} ${className}`}
        disabled={disabled}
        style={style}
    >
        {children}
    </button>
);

export const Container = ({ children, style = {} }: { children: React.ReactNode, style?: React.CSSProperties }) => (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', ...style }}>
        {children}
    </div>
);
