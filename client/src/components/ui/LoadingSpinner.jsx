import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ text = "Loading..." }) => {
    return (
        <div className="spinner-container">
            <div className="loader-content">
                <Loader2 className="spinner" size={40} />
                <p className="loading-text">{text}</p>
            </div>

            <style>{`
                .spinner-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 60vh;
                    width: 100%;
                }

                .loader-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                }

                .spinner {
                    color: var(--primary);
                    animation: spin 1s linear infinite;
                }

                .loading-text {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    color: var(--text-secondary);
                    font-size: 1.1rem;
                    font-weight: 500;
                    letter-spacing: 0.5px;
                    animation: pulse 2s ease-in-out infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes pulse {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default LoadingSpinner;
