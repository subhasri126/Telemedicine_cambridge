import React from 'react';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    showTagline?: boolean;
}

export const CareBridgeLogo: React.FC<LogoProps> = ({ className = '', size = 'md', showTagline = false }) => {
    const iconSizes = {
        sm: 'w-7 h-7',
        md: 'w-9 h-9',
        lg: 'w-12 h-12'
    };

    const textSizes = {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-2xl'
    };

    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            {/* Custom Medical Bridge Logo Icon */}
            <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-teal-600 text-white shadow-medical ${iconSizes[size]}`}>
                <svg viewBox="0 0 36 36" fill="none" className="w-3/5 h-3/5 text-white stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {/* Medical Cross Symbol */}
                    <path d="M18 7V29" />
                    <path d="M7 18H29" />
                    {/* Connecting Arch Bridge Arc */}
                    <path d="M6 25C12 17 24 17 30 25" strokeWidth="2" strokeDasharray="2 2" className="opacity-80" />
                </svg>
            </div>

            <div className="flex flex-col">
                <div className={`font-bold tracking-tight text-medical-navy flex items-center ${textSizes[size]}`}>
                    CAREBRIDGE <span className="ml-1.5 text-brand-600 font-extrabold uppercase text-[0.8em] tracking-wider bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">RURAL</span>
                </div>
                {showTagline && (
                    <span className="text-xs text-slate-500 font-medium">Healthcare shouldn't depend on where you live.</span>
                )}
            </div>
        </div>
    );
};
