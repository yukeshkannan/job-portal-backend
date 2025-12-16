import { Briefcase } from 'lucide-react';

const PreLoader = () => {
    return (
        <div className="preloader-container">
            <div className="breathing-logo">
                <div className="logo-icon">
                    <Briefcase size={64} color="white" strokeWidth={1.5} />
                </div>
                <h1 className="brand-text">NextHire</h1>
            </div>

            <style>{`
                .preloader-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: white; /* Clean white background */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                }

                .breathing-logo {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                    animation: breathe 3s ease-in-out infinite;
                }

                .logo-icon {
                    width: 100px;
                    height: 100px;
                    background: var(--primary); /* Royal Blue */
                    border-radius: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
                    position: relative;
                }
                
                /* Subtle glow behind */
                .logo-icon::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-radius: 24px;
                    background: inherit;
                    filter: blur(20px);
                    opacity: 0.4;
                    z-index: -1;
                }

                .brand-text {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    letter-spacing: -0.5px;
                    opacity: 0;
                    animation: fadeIn 1s ease-out forwards 0.5s;
                }

                @keyframes breathe {
                    0%, 100% {
                        transform: scale(1);
                        filter: brightness(1);
                    }
                    50% {
                        transform: scale(1.05); /* Gentle pulse */
                        filter: brightness(1.1); /* Slight glow increase */
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default PreLoader;
