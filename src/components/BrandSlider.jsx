const brands = [
  {
    src: '/images/slide/Logo-gob-blanco.png',
    alt: 'Gobierno de la Nación Argentina',
    href: 'https://www.argentina.gob.ar/',
    maxW: 160,
  },
  {
    src: '/images/slide/Logo-muni.png',
    alt: 'Municipalidad de Berisso',
    href: 'https://berisso.gob.ar/',
    maxW: 170,
  },
  {
    src: '/images/slide/IPFL-01 BLANCO.png',
    alt: 'Instituto Provincial de Formación Laboral (IPFL)',
    href: 'https://www.gba.gob.ar/ipfl',
    maxW: 220,
  },
  {
    src: '/images/slide/gobierno de la provincia (1).png',
    alt: 'Gobierno de la Provincia de Buenos Aires',
    href: 'https://www.gba.gob.ar/',
    maxW: 220,
  },
]

export default function BrandSlider() {
  // Triplicate for seamless infinite loop
  const items = [...brands, ...brands, ...brands]

  return (
    <div
      className="absolute bottom-20 md:bottom-24 left-0 right-0 z-10 overflow-hidden"
      aria-label="Marcas e instituciones asociadas"
    >
      {/* Scrolling track – no background */}
      <div className="w-full py-4 md:py-5">
        <div className="brand-slider-track flex items-center gap-16 md:gap-24 w-max">
          {items.map((brand, i) => (
            <a
              key={`${brand.alt}-${i}`}
              href={brand.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FDEA14] rounded"
              style={{ width: brand.maxW, height: 45 }}
              title={brand.alt}
              aria-label={brand.alt}
            >
              <img
                src={brand.src}
                alt={brand.alt}
                className="max-h-full max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 select-none pointer-events-auto"
                draggable="false"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
