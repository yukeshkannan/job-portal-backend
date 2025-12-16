import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isDangerous = false }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <X size={20} />
                </button>
                
                <div className="modal-header">
                    <div className={`modal-icon ${isDangerous ? 'danger' : 'primary'}`}>
                        <AlertTriangle size={24} />
                    </div>
                    <h3>{title}</h3>
                </div>
                
                <p className="modal-body">
                    {message}
                </p>

                <div className="modal-actions">
                    <button className="btn btn-outline" onClick={onClose}>
                        {cancelText}
                    </button>
                    <button 
                        className={`btn ${isDangerous ? 'btn-danger' : 'btn-primary'}`} 
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        style={{
                            background: isDangerous ? '#ef4444' : 'var(--primary)',
                            color: 'white',
                            borderColor: isDangerous ? '#ef4444' : 'var(--primary)'
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>

            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(4px);
                    animation: fadeIn 0.2s ease-out;
                }
                .modal-content {
                    width: 90%;
                    max-width: 400px;
                    padding: 24px;
                    background: white;
                    position: relative;
                    animation: scaleUp 0.2s ease-out;
                }
                .modal-close {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    color: var(--text-secondary);
                }
                .modal-header {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 12px;
                    text-align: center;
                }
                .modal-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .modal-icon.danger {
                    background: #fee2e2;
                    color: #ef4444;
                }
                .modal-icon.primary {
                    background: #eff6ff;
                    color: var(--primary);
                }
                .modal-header h3 {
                    font-size: 1.25rem;
                    margin: 0;
                }
                .modal-body {
                    text-align: center;
                    color: var(--text-secondary);
                    margin-bottom: 24px;
                    line-height: 1.5;
                }
                .modal-actions {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleUp {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ConfirmationModal;
