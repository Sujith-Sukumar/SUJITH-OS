import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ArrowLeft, Mail, FileText, Send } from 'lucide-react';
import { portfolioConfig } from '../../../data/portfolioData';
import { workspaceSound } from '../../../utils/workspaceAudio';
import { LinkedinIcon } from '../../ui/BrandIcons';

interface ContactRoomProps {
  onReturn: () => void;
}

const ContactRoom: React.FC<ContactRoomProps> = ({ onReturn }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const towerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    workspaceSound.playOpen();
    
    const ctx = gsap.context(() => {
      // Entry Animation
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out' }
      );

      // Tower pulse
      gsap.to('.pulse-ring', {
        scale: 4,
        opacity: 0,
        duration: 3,
        repeat: -1,
        stagger: 1,
        ease: 'power1.out'
      });

      // Connections
      gsap.fromTo(
        '.contact-node',
        { scale: 0, opacity: 0, y: 50 },
        { 
          scale: 1, 
          opacity: 1, 
          y: 0,
          duration: 0.8, 
          stagger: 0.15,
          ease: 'back.out(1.2)',
          delay: 0.5
        }
      );
      
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleReturn = () => {
    workspaceSound.playClose();
    onReturn();
  };

  const contactMethods = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      value: portfolioConfig.contact.linkedin.split('/').pop() || 'Connect',
      icon: LinkedinIcon,
      href: portfolioConfig.contact.linkedin,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      position: 'left' as const,
    },
    {
      id: 'email',
      name: 'Email',
      value: portfolioConfig.contact.email,
      icon: Mail,
      href: `mailto:${portfolioConfig.contact.email}`,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      position: 'right' as const,
    },
    {
      id: 'resume',
      name: 'Resume',
      value: 'Download PDF',
      icon: FileText,
      href: portfolioConfig.contact.resumePdfUrl,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      position: 'bottom' as const,
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-hidden"
      ref={containerRef}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-900/20 via-slate-950 to-slate-950" />
      <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjZjQzZjVlIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTAgMTBoMjBMMTAgMHpNMCAxMGwyMCAyMEwxMCAyMHoiLz48L2c+PC9zdmc+')] [mask-image:radial-gradient(circle_at_center,black_30%,transparent_70%)] opacity-20" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6 border-b border-rose-500/20 bg-slate-950/70 backdrop-blur-md">
        <button
          onClick={handleReturn}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border rounded-md text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
        >
          <ArrowLeft className="w-4 h-4" />
          RETURN TO NEXUS
        </button>
        <div className="text-right">
          <div className="text-xs font-mono text-rose-400/70">ROOM 05</div>
          <h1 className="text-xl font-bold tracking-wider text-rose-400">COMMS_LINK</h1>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8 overflow-y-auto overflow-x-hidden">
        <div className="relative w-full max-w-4xl h-[560px] sm:h-[600px] flex items-center justify-center">
          {/* Central Signal Tower (Slightly elevated above vertical midpoint to balance the bottom Resume node) */}
          <div
            className="absolute top-[38%] sm:top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            ref={towerRef}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="pulse-ring absolute w-24 h-24 rounded-full border border-rose-500/50 pointer-events-none"
              />
            ))}
            <div className="relative z-10 w-20 h-20 bg-rose-500/20 rounded-full border-2 border-rose-500 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.4)] backdrop-blur-md">
              <Send className="w-8 h-8 text-rose-400" />
            </div>
          </div>

          {/* Contact Nodes: LinkedIn (Left), Email (Right), Resume (Beneath Center) */}
          {contactMethods.map((method) => {
            const positionClasses =
              method.position === 'left'
                ? 'top-[38%] sm:top-[42%] left-1/2 -translate-y-1/2 -translate-x-[calc(50%+115px)] sm:-translate-x-[calc(50%+190px)] md:-translate-x-[calc(50%+250px)]'
                : method.position === 'right'
                ? 'top-[38%] sm:top-[42%] left-1/2 -translate-y-1/2 translate-x-[calc(-50%+115px)] sm:translate-x-[calc(-50%+190px)] md:translate-x-[calc(-50%+250px)]'
                : 'top-[38%] sm:top-[42%] left-1/2 -translate-x-1/2 translate-y-[95px] sm:translate-y-[115px]';

            return (
              <div
                key={method.id}
                className={`absolute ${positionClasses} flex flex-col items-center justify-center`}
              >
                <a
                  href={method.href}
                  target={method.id === 'email' ? undefined : '_blank'}
                  rel={method.id === 'email' ? undefined : 'noreferrer'}
                  download={method.id === 'resume' ? 'SUJITH.CV.pdf' : undefined}
                  className="contact-node relative flex flex-col items-center justify-center group"
                >
                  {/* Subtle visual connecting line to the central icon */}
                  {method.position === 'left' && (
                    <div
                      className="hidden sm:block absolute top-8 left-full h-px w-[95px] md:w-[155px] bg-gradient-to-l from-rose-500/50 to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    />
                  )}
                  {method.position === 'right' && (
                    <div
                      className="hidden sm:block absolute top-8 right-full h-px w-[95px] md:w-[155px] bg-gradient-to-r from-rose-500/50 to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    />
                  )}
                  {method.position === 'bottom' && (
                    <div
                      className="absolute bottom-full left-1/2 -translate-x-1/2 w-px h-[55px] sm:h-[75px] bg-gradient-to-b from-rose-500/50 via-rose-500/30 to-emerald-500/40 opacity-40 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    />
                  )}

                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${method.border} ${method.bg} backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.2)] mb-4`}
                  >
                    <method.icon className={`w-8 h-8 ${method.color}`} />
                  </div>

                  <div className="text-center bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-700/50 backdrop-blur-sm group-hover:border-rose-500/30 transition-colors">
                    <div className="text-sm font-bold text-white mb-1">{method.name}</div>
                    <div className="text-xs font-mono text-slate-400 truncate max-w-[150px] sm:max-w-[240px]">
                      {method.value}
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export { ContactRoom };
export default ContactRoom;
