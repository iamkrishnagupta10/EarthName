import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Sparkles, Earth, Loader2, Share2, Check } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

const ALPHABET_IMAGES: Record<string, string> = {
  A: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/a/ISS038-E-035416_final_a.jpg?w=720&h=720&fit=clip&crop=faces%2Cfocalpoint',
  B: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/b/hollabend_oli_2014216.jpg?w=720&h=480&fit=clip&crop=faces%2Cfocalpoint',
  C: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/c/ISS026-E-020126_c.jpg?w=720&h=480&fit=clip&crop=faces%2Cfocalpoint',
  D: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/d/akimski_etm_2000222_lrg.jpg?w=3788&h=3788&fit=clip&crop=faces%2Cfocalpoint',
  E: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/e/newzealand_amo_2009298.jpg?w=720&h=480&fit=clip&crop=faces%2Cfocalpoint',
  F: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/f/tibet_oli_2014116.jpg?w=720&h=480&fit=clip&crop=faces%2Cfocalpoint',
  G: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/g/ISS002-ESC-5401_lrg.jpg?w=3060&h=2092&fit=clip&crop=faces%2Cfocalpoint',
  H: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/h/kadamzhai_oli_2014242.jpg?w=720&h=480&fit=clip&crop=faces%2Cfocalpoint',
  I: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/i/andamans_tmo_2007041.jpg?w=720&h=480&fit=clip&crop=faces%2Cfocalpoint',
  J: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/j/townsville_oli_2015198.jpg?w=720&h=480&fit=clip&crop=faces%2Cfocalpoint',
  K: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/k/sirmilik_oli_2015215.jpg?w=720&h=480&fit=clip&crop=faces%2Cfocalpoint',
  L: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/l/neusa_amo_2008304.jpg?w=720&h=720&fit=clip&crop=faces%2Cfocalpoint',
  M: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/m/tienshan_oli_2015226.jpg?w=720&h=480&fit=clip&crop=faces%2Cfocalpoint',
  N: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/n/northpacific_tmo_2009063.jpg?w=720&h=480&fit=clip&crop=faces%2Cfocalpoint',
  O: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/o/tenoumer_ast_2008024.jpg?w=720&h=480&fit=clip&crop=faces%2Cfocalpoint',
  P: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/p/mackenziedelta_ast_2005216.jpg?w=720&h=480&fit=clip&crop=faces%2Cfocalpoint',
  Q: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/q/lonar_ast_2004334_lrg.jpg?w=2000&h=2000&fit=clip&crop=faces%2Cfocalpoint',
  R: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/r/lagomenendez_oli_2015021.jpg?w=720&h=720&fit=clip&crop=faces%2Cfocalpoint',
  S: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/s/satlantic_tmo_2009119.jpg?w=720&h=1061&fit=clip&crop=faces%2Cfocalpoint',
  T: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/t/liwa_oli_2015068_lrg.jpg?w=6000&h=6000&fit=clip&crop=faces%2Cfocalpoint',
  U: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/u/goosenecks_iko_2004129_lrg.jpg?w=3000&h=3010&fit=clip&crop=faces%2Cfocalpoint',
  V: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/v/shiveluch_oli_2015082.jpg?w=720&h=480&fit=clip&crop=faces%2Cfocalpoint',
  W: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/w/redsea_amo_2009014_lrg.jpg?w=4000&h=5500&fit=clip&crop=faces%2Cfocalpoint',
  X: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/x/leidyglacier_ast_2012220.jpg?w=720&h=480&fit=clip&crop=faces%2Cfocalpoint',
  Y: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/y/ast_ugab.jpg?w=720&h=480&fit=clip&crop=faces%2Cfocalpoint',
  Z: 'https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/content-feature/abc/images/z/canada_amo_2012193.jpg?w=720&h=480&fit=clip&crop=faces%2Cfocalpoint'
};

const BACKGROUNDS = [
  '1451187580459-43490279c0fa',
  '1614730321146-b6fa6a46bcb4',
  '1542281286-9e0a16bb7366',
  '1464802686167-b154d0eb6eb1',
  '1552550186-b5fa535af0fc',
  '1518386129-9e8cceaa53b3',
  '1533261642-1e9b2584ba1f'
];

export default function App() {
  const [name, setName] = useState(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    return params.get('name') || 'MISTY';
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Strip non-alphabetic
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');

  useEffect(() => {
    const url = new URL(window.location.href);
    if (name) {
      url.searchParams.set('name', name);
    } else {
      url.searchParams.delete('name');
    }
    window.history.replaceState({}, '', url.toString());
  }, [name]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload = useCallback(async () => {
    if (!panelRef.current) return;
    setIsDownloading(true);
    try {
      // Small timeout to allow the browser to paint properly before capturing
      await new Promise(r => setTimeout(r, 100));
      const dataUrl = await htmlToImage.toPng(panelRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#0a0f0d',
        style: {
          padding: '40px',
          margin: '0',
          boxSizing: 'border-box'
        }
      });
      const link = document.createElement('a');
      link.download = `earth-name-${cleanName.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
    } finally {
      setIsDownloading(false);
    }
  }, [cleanName]);

  const bgIndex = cleanName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % BACKGROUNDS.length;
  const appBgUrl = BACKGROUNDS.length > 0 ? `https://images.unsplash.com/photo-${BACKGROUNDS[bgIndex]}?q=80&w=2500&auto=format&fit=crop` : "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2500&auto=format&fit=crop')";

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-white flex flex-col font-sans selection:bg-emerald-500/30 relative">
      {/* Stunning Earth Background */}
      <div 
        key={`bg-${appBgUrl}`}
        className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat opacity-20 mix-blend-luminosity transition-all duration-1000"
        style={{ 
          backgroundImage: `url('${appBgUrl}')`
        }}
      />
      <div className="relative z-10 flex flex-col min-h-screen flex-1">
      <header className="w-full flex items-end justify-between p-6 max-w-7xl mx-auto border-b border-white/10 pb-8">
        <div>
          <h1 className="text-xs tracking-[0.4em] uppercase text-emerald-500 font-bold mb-2 flex items-center gap-2">
            <Earth className="w-4 h-4" /> EarthName v1.0
          </h1>
          <p className="text-4xl font-light tracking-tight">Earth Panel Generator</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="flex items-center gap-4 mb-4">
            <a href="#" className="text-[10px] uppercase tracking-widest text-white/40 hover:text-emerald-500 transition-colors">Gallery</a>
            <a href="#" className="text-[10px] uppercase tracking-widest text-white/40 hover:text-emerald-500 transition-colors">About</a>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-white/40">Projection Model</p>
          <p className="text-sm font-mono">WGS 84 / EPSG:4326</p>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-7xl mx-auto">
        
        <div className="w-full max-w-2xl text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-light tracking-tight mb-4">
            See your name...<br />through Earth itself
          </h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 max-w-md mx-auto mb-12">
            Type any name to generate a unique typographic artwork forged from our planet's most striking satellite imagery.
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase text-white/30 hidden sm:block">Current Sequence</div>
            <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0 items-center justify-center">
              <input 
                type="text" 
                className="bg-transparent border-b-2 border-emerald-500/30 text-4xl sm:text-6xl text-center w-full sm:w-auto py-2 tracking-[0.2em] font-light focus:outline-none focus:border-emerald-500 transition-colors uppercase placeholder:text-white/10"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="NAME..."
                maxLength={12}
              />
            </div>
            
            {cleanName && (
               <div className="flex justify-center gap-4 mt-8">
                 <motion.button 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   onClick={handleDownload}
                   disabled={isDownloading}
                   className="flex items-center gap-2 border border-emerald-500/30 text-emerald-500 px-6 py-2 hover:bg-emerald-500 hover:text-[#0a0f0d] transition-colors disabled:opacity-50 text-[10px] uppercase tracking-widest"
                   title="Export Grid"
                 >
                   {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                   <span>{isDownloading ? 'Exporting...' : 'Export Grid'}</span>
                 </motion.button>

                 <motion.button 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   onClick={handleShare}
                   className="flex items-center gap-2 border border-emerald-500/30 text-emerald-500 px-6 py-2 hover:bg-emerald-500 hover:text-[#0a0f0d] transition-colors text-[10px] uppercase tracking-widest"
                   title="Share Link"
                 >
                   {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                   <span>{copied ? 'Copied Link!' : 'Share Link'}</span>
                 </motion.button>
               </div>
            )}
          </div>
        </div>

        {/* Art Canvas */}
        <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[400px] overflow-hidden">
          <AnimatePresence mode="popLayout">
            {cleanName ? (
              <motion.div 
                ref={panelRef}
                key="panels"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
                className="flex flex-col items-center gap-6 w-full max-w-max mx-auto px-4"
              >
                {/* Traditional Spaced Text */}
                <div className="flex gap-1 sm:gap-2 md:gap-3 lg:gap-4 overflow-x-auto w-full justify-center px-4 snap-x mb-2">
                  {cleanName.split('').map((letter, i) => (
                      <motion.span 
                        key={i + letter + "title"}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="snap-center shrink-0 w-[80px] sm:w-[100px] md:w-[128px] lg:w-[140px] text-center text-5xl sm:text-7xl md:text-8xl font-light text-white tracking-[-0.02em]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {letter}
                      </motion.span>
                  ))}
                </div>

                {/* Satellite Panels */}
                <div className="flex gap-1 sm:gap-2 md:gap-3 lg:gap-4 overflow-x-auto w-full justify-center pb-8 px-4 snap-x">
                  {(() => {
                    const letterCounts: Record<string, number> = {};
                    return cleanName.split('').map((letter, i) => {
                      if (!letterCounts[letter]) letterCounts[letter] = 0;
                      const occurrence = ++letterCounts[letter];
                      
                      let filterStyle = "";
                      let objectPos = "center";
                      let zoom = "scale-100";
                      
                      if (occurrence === 2) {
                         filterStyle = "hue-rotate(135deg) saturate(1.2)";
                         objectPos = "left center";
                         zoom = "scale-125";
                      } else if (occurrence === 3) {
                         filterStyle = "hue-rotate(270deg) saturate(1.5)";
                         objectPos = "right center";
                         zoom = "scale-150";
                      } else if (occurrence > 3) {
                         filterStyle = `hue-rotate(${occurrence * 45}deg) grayscale(40%) saturate(1.5)`;
                      }

                      const bgUrl = ALPHABET_IMAGES[letter] || ALPHABET_IMAGES['A'];
                      return (
                        <motion.div
                          key={i + letter + "panel"}
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: i * 0.05, type: 'spring', bounce: 0.4 }}
                          className="snap-center shrink-0 w-[80px] h-[180px] sm:w-[100px] sm:h-[240px] md:w-[128px] md:h-[280px] lg:w-[140px] lg:h-[320px] relative overflow-hidden group border-2 border-emerald-500/20 bg-black flex flex-col justify-between p-2 sm:p-3"
                        >
                           <img 
                             src={bgUrl} 
                             className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 ${zoom}`}
                             style={{ filter: filterStyle, objectPosition: objectPos }}
                             alt={`Satellite view for ${letter}`}
                             crossOrigin="anonymous"
                           />
                           
                           {/* Text Overlays - Geometric Balance Theme */}
                           <div className="relative z-10 flex flex-col justify-between h-full pointer-events-none">
                             <div className="text-[8px] font-mono opacity-80 bg-black/40 self-start px-1 mix-blend-normal rounded-sm text-emerald-300">{String(i + 1).padStart(2, '0')}</div>
                             <div className="text-[10px] sm:text-xs font-mono opacity-80 bg-black/40 self-end px-1 py-0.5 mix-blend-normal rounded-sm text-center text-white/90">
                               {(Math.random() * 90).toFixed(1)}°{Math.random() > 0.5 ? 'N' : 'S'}
                             </div>
                           </div>
                        </motion.div>
                      );
                    });
                  })()}
                </div>

                {/* Subtitle */}
                <div className="mt-8 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  <p className="text-xl sm:text-2xl md:text-3xl text-emerald-500 font-light tracking-tight">
                    See {name} name<br className="md:hidden" /> through Earth itself
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-gray-400 gap-4"
              >
                <Sparkles className="w-8 h-8 opacity-50" />
                <p>Enter a name to reveal the panels.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      <footer className="w-full max-w-7xl mx-auto p-6 flex justify-between items-center border-t border-white/10 mt-8">
        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Contrast Scale</span>
            <div className="flex gap-1">
              <div className="w-4 h-1 bg-emerald-500"></div>
              <div className="w-4 h-1 bg-emerald-500/60"></div>
              <div className="w-4 h-1 bg-emerald-500/30"></div>
              <div className="w-4 h-1 bg-emerald-500/10"></div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Spectral Band</span>
            <span className="text-[10px] font-mono text-white/50">Inspired by NASA</span>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
