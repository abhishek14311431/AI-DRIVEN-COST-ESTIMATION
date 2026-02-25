import React from 'react';

const ConfirmationModal = ({ 
    isOpen, 
    title, 
    message, 
    onConfirm, 
    onCancel, 
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isLoading = false,
    type = 'warning' // 'warning', 'error', 'success', 'info'
}) => {
    if (!isOpen) return null;

    const typeColors = {
        warning: { bg: 'rgba(239, 68, 68, 0.1)', border: '#EF4444', text: '#FCA5A5', icon: '⚠️' },
        error: { bg: 'rgba(239, 68, 68, 0.1)', border: '#EF4444', text: '#FCA5A5', icon: '❌' },
        success: { bg: 'rgba(34, 197, 94, 0.1)', border: '#22C55E', text: '#86EFAC', icon: '✅' },
        info: { bg: 'rgba(59, 130, 246, 0.1)', border: '#3B82F6', text: '#93C5FD', icon: 'ℹ️' }
    };

    const config = typeColors[type] || typeColors.warning;

    return (
        <>
            {/* Modal Backdrop */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(5px)',
                    zIndex: 999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'fadeIn 0.3s ease-out'
                }}
                onClick={isLoading ? undefined : onCancel}
            >
                {/* Modal Container */}
                <div
                    style={{
                        background: 'rgba(10, 10, 20, 0.95)',
                        border: `2px solid ${config.border}`,
                        borderRadius: '20px',
                        padding: '2.5rem',
                        maxWidth: '500px',
                        width: '90%',
                        boxShadow: `0 20px 60px rgba(0, 0, 0, 0.5), inset 0 0 40px ${config.bg}`,
                        backdropFilter: 'blur(10px)',
                        animation: 'slideUp 0.3s ease-out',
                        fontFamily: "'Outfit', 'Inter', sans-serif",
                        position: 'relative',
                        zIndex: 1000
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Icon */}
                    <div style={{
                        fontSize: '4rem',
                        textAlign: 'center',
                        marginBottom: '1.5rem',
                        animation: 'bounce 0.6s ease-in-out'
                    }}>
                        {config.icon}
                    </div>

                    {/* Title */}
                    <h2 style={{
                        fontSize: '1.8rem',
                        fontWeight: 900,
                        color: '#fff',
                        margin: '0 0 1rem 0',
                        textAlign: 'center',
                        letterSpacing: '-0.5px'
                    }}>
                        {title}
                    </h2>

                    {/* Message */}
                    <p style={{
                        fontSize: '1rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        margin: '0 0 2rem 0',
                        textAlign: 'center',
                        lineHeight: '1.6',
                        fontWeight: 500
                    }}>
                        {message}
                    </p>

                    {/* Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        marginTop: '2rem'
                    }}>
                        <button
                            onClick={onCancel}
                            disabled={isLoading}
                            style={{
                                padding: '0.9rem 2rem',
                                borderRadius: '10px',
                                border: '1.5px solid rgba(255, 255, 255, 0.2)',
                                background: 'rgba(255, 255, 255, 0.08)',
                                color: '#fff',
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.25s ease',
                                fontFamily: "'Outfit', sans-serif",
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase',
                                opacity: isLoading ? 0.5 : 1,
                                minWidth: '120px'
                            }}
                            onMouseEnter={(e) => {
                                if (!isLoading) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                            }}
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            style={{
                                padding: '0.9rem 2rem',
                                borderRadius: '10px',
                                border: `1.5px solid ${config.border}`,
                                background: config.bg,
                                color: config.text,
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.25s ease',
                                fontFamily: "'Outfit', sans-serif",
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase',
                                opacity: isLoading ? 0.7 : 1,
                                minWidth: '120px',
                                position: 'relative'
                            }}
                            onMouseEnter={(e) => {
                                if (!isLoading) {
                                    e.currentTarget.style.background = config.bg.replace('0.1', '0.25');
                                    e.currentTarget.style.borderColor = config.border;
                                    e.currentTarget.style.boxShadow = `0 0 20px ${config.border}40`;
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = config.bg;
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', marginRight: '0.5rem' }}>⟳</span>
                                    {confirmText}
                                </>
                            ) : (
                                confirmText
                            )}
                        </button>
                    </div>

                    {/* CSS Animation Styles */}
                    <style>{`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        @keyframes slideUp {
                            from {
                                opacity: 0;
                                transform: translateY(30px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                        @keyframes bounce {
                            0%, 100% { transform: scale(1); }
                            50% { transform: scale(1.1); }
                        }
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        </>
    );
};

export default ConfirmationModal;
