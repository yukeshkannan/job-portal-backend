import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-container">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`toast toast-${toast.type} slide-in-right`}>
                        <div className="toast-icon">
                            {toast.type === 'success' && <CheckCircle size={20} />}
                            {toast.type === 'error' && <AlertCircle size={20} />}
                            {toast.type === 'info' && <Info size={20} />}
                        </div>
                        <div className="toast-message">{toast.message}</div>
                        <button onClick={() => removeToast(toast.id)} className="toast-close">
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
            <style>{`
                .toast-container {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .toast {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    min-width: 300px;
                    padding: 16px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    border-left: 4px solid;
                    animation: slideIn 0.3s ease-out;
                }
                .toast-success { border-color: var(--success); }
                .toast-error { border-color: var(--error); }
                .toast-info { border-color: var(--primary); }
                
                .toast-icon { display: flex; align-items: center; }
                .toast-success .toast-icon { color: var(--success); }
                .toast-error .toast-icon { color: var(--error); }
                .toast-info .toast-icon { color: var(--primary); }

                .toast-message {
                    flex-grow: 1;
                    font-size: 0.95rem;
                    color: var(--text-primary);
                }
                .toast-close {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    color: var(--text-secondary);
                    display: flex;
                }
                .toast-close:hover { color: var(--text-primary); }

                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </ToastContext.Provider>
    );
};
