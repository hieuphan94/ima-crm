import Image from 'next/image';

export function ImageOptimized({ src, alt, width, height, className, style, ...props }) {
  return (
    <div
      className={`relative ${className || ''}`}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
        ...style,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${width}px`}
        style={{
          objectFit: 'contain',
        }}
        {...props}
      />
    </div>
  );
}
