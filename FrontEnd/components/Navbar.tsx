'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity } from 'lucide-react';

const Navbar = () => {
    const pathname = usePathname();
    const isLoginPage = pathname === '/' || pathname === '/login' || pathname === '/breach';

    if (isLoginPage) return null;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full h-[60px] font-display pointer-events-none">
            {/* Layered Background Container */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
                {/* Layer 1: Dark city silhouette (Placeholder/Image) */}
                <div className="absolute inset-0 bg-deep-black opacity-90">
                    <div className="absolute inset-0 bg-[url('/atlastbg.webp')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                </div>

                {/* Layer 2: Grid Pattern */}
                <div className="absolute inset-0 bg-[size:40px_40px] bg-[linear-gradient(to_right,rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.05)_1px,transparent_1px)] z-10"></div>

                {/* Layer 3: Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-20"></div>

                {/* Bottom Border Glow */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent z-30 shadow-[0_0_10px_rgba(0,255,255,0.3)]"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-40 h-full max-w-[1920px] mx-auto px-6 md:px-12 flex items-center justify-between pointer-events-auto">

                {/* Left: Branding & Status */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-3 group relative">
                        <div className="relative size-8 flex items-center justify-center">
                            {/* Logo Glow Effect */}
                            <div className="absolute inset-0 bg-neon-cyan/20 blur-md rounded-full group-hover:bg-neon-cyan/40 transition-all duration-300"></div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 1333.17 1607.4"
                                className="w-full h-full object-contain relative z-10 fill-neon-cyan drop-shadow-[0_0_5px_rgba(0,255,255,0.8)] transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(0,255,255,1)]"
                            >
                                <path d="M0,673.41c2-30.88,2.94-62.9,6.4-94.64,2.41-22.06,8.32-43.74,12.5-65.62,4.51-23.58,11.93-46.34,19.91-68.89A665.89,665.89,0,0,1,219.88,172.09,653.57,653.57,0,0,1,364.21,72.65a695.29,695.29,0,0,1,94.62-39.56,627.91,627.91,0,0,1,78-20.75A640.72,640.72,0,0,1,649.9.13c43.11-.68,86,1.19,128.5,8.44A669.34,669.34,0,0,1,1009.05,94.1c52.18,31.4,99.54,69,141.32,113.43a669.07,669.07,0,0,1,92.91,124.6c21.09,36.66,39,74.79,52.59,115,9.72,28.7,18.1,57.7,24.07,87.39a653.18,653.18,0,0,1,12.39,163c-1.72,33.23-4.63,66.46-8.74,99.48a688.44,688.44,0,0,1-14.1,77.55c-10.67,43.86-23,87.24-38.66,129.73a1174.54,1174.54,0,0,1-61.52,138.42,1165.81,1165.81,0,0,1-118,181.41,1043.14,1043.14,0,0,1-108.59,118.48c-40.77,37.9-84.18,72.52-131.79,101.6-30.75,18.78-62.75,35.27-96.81,47-29.66,10.18-60.19,17-92,16.19-24.19-.64-47.47-5.65-70.43-12.88-55.21-17.39-104.65-45.72-151.5-79.12a811.81,811.81,0,0,1-87.91-72.21c-22.44-21.31-43.94-43.7-64.85-66.53-31.53-34.42-60.17-71.24-86.93-109.49a1188.29,1188.29,0,0,1-92-155.22c-17.66-35.78-33.59-72.44-46.46-110.3-7.69-22.62-16.32-45-22.48-68-9.26-34.68-19-69.3-23.88-105-2.76-20.45-7.35-40.7-9.3-61.21C3.42,736.47,2.09,705.51,0,673.41Zm747.92,499.7c2.47.41,4.39.84,6.34,1a309.43,309.43,0,0,0,79.75-2c37.64-5.79,73.87-16.27,108.08-33.65,37.83-19.21,71.71-43.69,100.25-74.93,45.66-50,75.46-108.22,88.51-175a366.09,366.09,0,0,0,5.59-94.46c-.48-7.4-1.54-8.41-9.06-9a347.57,347.57,0,0,0-106.3,7.25c-35.9,8.13-69.89,21.2-101.59,40.43-30.42,18.45-57.9,40.16-82,66.3A347.55,347.55,0,0,0,775,994.72c-11.62,26.22-19.29,53.6-24.25,82a358.87,358.87,0,0,0-4.12,88.58C746.8,1167.83,747.45,1170.36,747.92,1173.11ZM238.07,784.82c-9.32,0-18.65-.24-28,.07-11.05.36-11.82,1.35-12.58,12.08-2.88,40.21.59,79.83,11.63,118.64,20.42,71.85,58.73,132.11,116.64,179.7a349.64,349.64,0,0,0,117.72,63.92,341,341,0,0,0,94.18,16.18c13.95.36,27.93-1,41.91-1.37,5-.13,6.76-2.44,7.3-7.31,3.89-35.15.48-69.89-6.13-104.35-4.21-21.91-11.74-42.88-20.33-63.5a337.69,337.69,0,0,0-64.31-100.31C453.21,852.22,402,818.71,341.2,800.16,307.54,789.89,273.27,784.11,238.07,784.82Zm676.06,553.72c14.57,16.13,17.2,34.23,19.75,53.78,21.24-16.13,38.67-33.77,52.58-54.62,13.76-20.64,25.29-42.5,30.6-68.41,10.07,10.78,11.66,23.48,15.64,36.9,30.19-37.53,47-79.15,59.25-122.93,6.62-23.63,11.45-63.19,8.69-71.74-7.69,15.91-15,31.45-22.66,46.77-7.82,15.57-16,30.94-28.49,44.5-5.37-9.2-7.49-19.24-18.25-23.57-6.15,23-12,45.36-29.08,63-13.08-21.81-13.12-21.86-20.77-25.45-4.86,15.1-9.29,30.4-14.73,45.34a130.83,130.83,0,0,1-25,41.33c-4.73-10.83-8-21.47-13.72-30.58-5.86-9.37-13.34-18.18-25.68-21.57-8.64,40.33-23.22,77-55.35,106.54C845,1341.57,842.3,1327.31,836,1314c-9-19-17.49-30.72-24.74-34-6.47,17-12.28,34.35-19.63,51s-17.43,31.65-32.7,44.39c-4.62-34.46-17.59-62.9-43.32-86-13.19,25.82-24.82,51-42.12,75.42l-41.12-74.89c-25.61,22.33-38.15,50.82-43.32,84.76-15.32-12.78-24.76-27.93-32.27-44-7.62-16.35-13.49-33.52-20.45-51.17-20.37,21.61-33.43,46.17-34.43,78.41-32.4-30.14-47.65-66.51-56.07-107.45-21.83,11.85-32.62,30.34-37.7,54.3-12.9-12.64-20.3-27.2-26.4-42-6.22-15.1-10.2-31.11-15.32-47.24-10.45,6.21-13.84,17.1-20.21,27-16.58-18.6-23.52-40.65-29.88-63.29-10.45,5-11.5,15.85-17.59,23.74C276,1175,262,1143.09,247,1111.72c-4.77,50.63,39.08,171.43,69.52,192.62,3.25-12,5.47-24.3,14.93-35.4,7.28,26.08,17,48.88,31.65,69.47,18.7,26.35,41.07,48.84,52,51.89,4.05-28.74,9.15-42.36,19.5-50.18,4.47,24,14.48,45.24,28.77,64.37,14.44,19.31,31.85,35.2,53.89,46.47,5.79-39.63,10.29-52.47,20.2-59.81,7.66,14.5,14.7,29.52,23.28,43.6,12,19.69,24.63,31.65,34.22,34.65,2.54-20,8.15-38.67,22.25-56,6.4,27.4,15.5,51.23,37.57,68.64,6.72-13.27,10.84-26.91,20.58-40,6.59,14.16,12.39,26.6,18.39,39.48,11.36-7.89,18.71-18.58,24.19-30.29,5.38-11.51,9.31-23.71,14.32-36.77,13,17.35,19,36,21.61,57.81,6.56-5.89,12.31-10.3,17.14-15.55,17.74-19.3,30.12-41.86,39.19-68.51,15.35,19.16,19.49,40.41,21.21,63.32C876.36,1425.87,903.65,1389.27,914.13,1338.54Z" />
                            </svg>
                        </div>
                        <h2 className="text-white text-lg font-bold tracking-[0.2em] uppercase group-hover:text-neon-cyan transition-colors drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                            AtLast
                        </h2>
                    </Link>

                    {/* HUD Status Elements (Desktop) */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">STILL_IN_DEVELOPMENT</span>
                            <div className="flex items-center gap-2">
                                <div className="h-1 w-16 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[60%] shadow-[0_0_5px_#10b981]"></div>
                                </div>
                                <span className="text-[10px] text-emerald-500 font-bold">60%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center: Decorative HUD Elements */}
                <div className="hidden lg:flex items-center gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50">
                    <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-neon-cyan"></div>
                    <div className="text-[8px] text-neon-cyan font-mono tracking-[0.5em] uppercase">CURRENTLY_FRONTEND_DEMO_ONLY</div>
                    <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-neon-cyan"></div>
                </div>


                {/* Right Actions */}
                <div className="flex items-center gap-6">
                    {/* Network Status */}
                    <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-neon-cyan/70">
                        <Activity size={14} className="animate-pulse" />
                        <span>ONLINE</span>
                    </div>

                    {/* Agent Name Display - Skewed Parallelogram Style */}
                    <div className="relative group min-w-[180px] h-10 flex items-center justify-center">
                        {/* Static Skewed Background */}
                        <div className="absolute inset-0 bg-deep-blue/20 border border-blue-400/30 transform skew-x-[-12deg] shadow-[0_0_15px_rgba(0,0,255,0.1)] transition-all duration-300 group-hover:bg-deep-blue/40 group-hover:border-blue-400/60"></div>

                        {/* Glitch Overlay */}
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 skew-x-[-12deg] transition-colors duration-100 mix-blend-overlay"></div>

                        <div className="relative z-10 flex items-center gap-2 text-white font-bold tracking-widest uppercase text-xs">
                            <span className="transform skew-x-[12deg] text-blue-300 text-[10px]">AGENT:</span>
                            <span className="transform skew-x-[12deg] text-neon-cyan drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">UNIDENTIFIED</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
            `}</style>
        </header>
    );
};

export default Navbar;
