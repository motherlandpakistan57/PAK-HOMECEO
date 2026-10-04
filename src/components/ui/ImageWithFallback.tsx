import React, { useState } from 'react';
import { ProductIconGraphic } from '../common/ProductIconGraphic';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  iconType: 'embroidery' | 'pickle' | 'recipe' | 'tailoring' | 'shawl' | 'honey' | 'sweets' | 'ralli' | 'pottery';
  title?: string;
  className?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  iconType,
  title,
  className = 'w-full h-48',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If no src provided or image failed to load, render the high-fidelity SVG illustration
  if (!src || hasError) {
    return <ProductIconGraphic iconType={iconType} title={title} className={className} />;
  }

  return (
    <div className={`relative overflow-hidden bg-stone-100 ${className}`}>
      {/* Background skeleton while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center">
          <span className="text-xs text-stone-400 font-medium">Loading artisan asset...</span>
        </div>
      )}

      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
