import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, Cpu, Layers, Wrench, Compass, BookOpen, Users } from 'lucide-react';

/**
 * Editorial Hero Section matching the user's reference design:
 * - Clean neutral/cream canvas (#ebebe4)
 * - Large, elegant editorial serif center typography: "Engineering for Creators and Innovators"
 * - 6 floating thematic showcases arranged in an artistic collage:
 *   1. Top-Left: "MatteLab: Rapid Prototyping & Form" (3D printed mechanical book)
 *   2. Top-Center: Open technical catalog laying flat ("Miniaturized Systems & Precision Engineering")
 *   3. Right: Standing sage green book ("The Art of Hardware")
 *   4. Bottom-Left: CET Makerspace gallery exhibition photo (collaborative engineering lab)
 *   5. Bottom-Center: Vibrant yellow "Matte Zine: Field Manual for Makers"
 *   6. Bottom-Right: Hands holding open an electronic breadboard prototyping manual
 */
export default function HeroSection({
  onExploreEvents,
  onExploreResources,
  onExploreRegistrations
}) {
  const [activeHighlight, setActiveHighlight] = useState(null);

  const collageItems = [
    {
      id: 'prototype',
      title: 'Rapid Prototyping & Form',
      tag: '3D PRINTING & FABRICATION',
      src: '/hero/prototype-book.jpg',
      alt: 'MatteLab Rapid Prototyping Book',
      position: 'top-[3%] left-[2%] xl:left-[4%] w-[180px] sm:w-[220px] lg:w-[250px] xl:w-[270px]',
      rotation: '-rotate-[2deg]',
      shadow: 'shadow-[0_20px_45px_rgba(30,40,30,0.14)]',
      tabTarget: 'resources'
    },
    {
      id: 'schematic',
      title: 'Precision Kinetics & Systems',
      tag: 'MINIATURIZED HARDWARE',
      src: '/hero/open-schematic.jpg',
      alt: 'Open Technical Catalog',
      position: 'top-[1%] left-1/2 -translate-x-1/2 w-[270px] sm:w-[330px] md:w-[380px] lg:w-[420px]',
      rotation: 'rotate-[0deg]',
      shadow: 'shadow-[0_16px_40px_rgba(20,30,20,0.12)]',
      tabTarget: 'resources'
    },
    {
      id: 'hardware-book',
      title: 'The Art of Hardware',
      tag: 'CIRCUIT DESIGN & BOTANY',
      src: '/hero/hardware-book.jpg',
      alt: 'Standing Hardware Book',
      position: 'top-[10%] right-[2%] xl:right-[4%] w-[160px] sm:w-[200px] lg:w-[230px] xl:w-[250px]',
      rotation: 'rotate-[1.5deg]',
      shadow: 'shadow-[0_24px_50px_rgba(30,40,30,0.16)]',
      tabTarget: 'events'
    },
    {
      id: 'makerspace-collab',
      title: 'CET Innovation Hub',
      tag: 'COLLABORATIVE WORKSPACE',
      src: '/hero/lab-collab.jpg',
      alt: 'University Engineering Students in Makerspace',
      position: 'bottom-[3%] left-[1%] xl:left-[3%] w-[220px] sm:w-[280px] lg:w-[320px] xl:w-[350px]',
      rotation: 'rotate-[0.5deg]',
      shadow: 'shadow-[0_20px_45px_rgba(20,30,20,0.13)]',
      tabTarget: 'events'
    },
    {
      id: 'yellow-zine',
      title: 'Matte Zine / Vol. 01',
      tag: 'MAKER FIELD MANUAL',
      src: '/hero/yellow-zine.jpg',
      alt: 'Yellow Matte Zine Booklet',
      position: 'bottom-[2%] left-[45%] -translate-x-1/2 w-[150px] sm:w-[180px] lg:w-[210px] xl:w-[230px]',
      rotation: 'rotate-[1deg]',
      shadow: 'shadow-[0_18px_38px_rgba(40,40,10,0.15)]',
      tabTarget: 'events'
    },
    {
      id: 'hands-manual',
      title: 'Hands-on Circuit Assembly',
      tag: 'IOT & EMBEDDED LAB',
      src: '/hero/hands-manual.jpg',
      alt: 'Hands holding open prototyping book',
      position: 'bottom-[3%] right-[1%] xl:right-[3%] w-[220px] sm:w-[270px] lg:w-[310px] xl:w-[340px]',
      rotation: '-rotate-[1.5deg]',
      shadow: 'shadow-[0_20px_45px_rgba(20,30,20,0.14)]',
      tabTarget: 'resources'
    }
  ];

  return (
    <section className="relative w-full bg-[#ebebe4] text-[#242b20] overflow-hidden select-none border-b border-slate-300/70">
      {/* Desktop & Large Screen View: The Artistic Editorial Floating Collage */}
      <div className="hidden lg:block relative w-full h-[720px] xl:h-[780px] 2xl:h-[840px] max-w-[1700px] mx-auto">
        {/* Central Master Editorial Title matching the user's reference layout */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-6">
          <div className="pointer-events-auto flex flex-col items-center max-w-2xl text-center">
            <span className="text-[11px] font-bold tracking-[0.24em] text-[#5a6b54] uppercase mb-4 font-sans">
              College of Engineering Trikaripur · Makerspace
            </span>

            <h1 className="font-editorial text-5xl sm:text-6xl md:text-7xl xl:text-[5.4rem] font-normal leading-[1.04] text-[#242b20] tracking-tight">
              Design for Creators <br />
              and Innovators
            </h1>

            <p className="mt-5 text-sm xl:text-base text-[#4f5c4a] max-w-lg font-sans leading-relaxed">
              Where code converges with hardware craft. Access 3D printers, IoT workstations, join hands-on workshops, and build the future.
            </p>

            {/* Editorial Pill Action Buttons */}
            <div className="mt-8 flex items-center gap-3.5">
              <button
                type="button"
                onClick={onExploreEvents}
                className="px-7 py-3 rounded-full bg-[#242b20] hover:bg-[#151a13] text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Explore Events</span>
                <ArrowUpRight size={15} />
              </button>

              <button
                type="button"
                onClick={onExploreResources}
                className="px-7 py-3 rounded-full bg-white/80 hover:bg-white text-[#242b20] text-xs font-bold tracking-wider uppercase border border-slate-300/80 transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Lab Equipment & Spaces
              </button>
            </div>
          </div>
        </div>

        {/* 6 Floating Thematic Collage Items positioned exactly as in the reference image */}
        {collageItems.map((item) => (
          <div
            key={item.id}
            className={`absolute ${item.position} ${item.rotation} z-10 transition-all duration-500 ease-out hover:z-30 hover:scale-[1.04] hover:-translate-y-2 cursor-pointer group`}
            onMouseEnter={() => setActiveHighlight(item.id)}
            onMouseLeave={() => setActiveHighlight(null)}
            onClick={() => {
              if (item.tabTarget === 'resources') onExploreResources?.();
              else onExploreEvents?.();
            }}
          >
            <div className={`relative rounded-md overflow-hidden bg-white p-1.5 ${item.shadow} transition-shadow duration-500 group-hover:shadow-[0_28px_60px_rgba(20,30,20,0.22)]`}>
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-auto object-cover rounded-sm block"
                loading="eager"
              />

              {/* Minimalist Floating Overlay Pill on Hover */}
              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-between bg-black/85 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wide">
                <span>{item.title}</span>
                <ArrowUpRight size={12} className="text-emerald-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile & Tablet Responsive View */}
      <div className="block lg:hidden px-5 py-12 sm:py-16 max-w-3xl mx-auto text-center">
        <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#5a6b54] uppercase font-sans mb-3 block">
          College of Engineering Trikaripur · Makerspace
        </span>

        <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.08] text-[#242b20] tracking-tight">
          Design for Creators <br />
          and Innovators
        </h1>

        <p className="mt-4 text-xs sm:text-sm text-[#4f5c4a] max-w-md mx-auto font-sans leading-relaxed">
          Where code converges with hardware craft. Explore prototyping equipment, join hands-on technical workshops, and collaborate with peer innovators.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onExploreEvents}
            className="px-6 py-2.5 rounded-full bg-[#242b20] hover:bg-[#151a13] text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md active:scale-95"
          >
            Explore Events
          </button>
          <button
            type="button"
            onClick={onExploreResources}
            className="px-6 py-2.5 rounded-full bg-white text-[#242b20] text-xs font-bold tracking-wider uppercase border border-slate-300 transition-all shadow-sm active:scale-95"
          >
            Lab Machinery
          </button>
        </div>

        {/* 2x3 Grid of Showcase Items on Mobile */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4 text-left">
          {collageItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.tabTarget === 'resources') onExploreResources?.();
                else onExploreEvents?.();
              }}
              className="group bg-white p-2 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 mb-2">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.tag}</p>
              <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
