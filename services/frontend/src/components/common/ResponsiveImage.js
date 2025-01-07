export function ResponsiveImage({ src, alt, ...props }) {
  return (
    <picture>
      {/* WebP format cho browser hỗ trợ */}
      <source srcSet={`${src}?w=480&f=webp 480w, ${src}?w=768&f=webp 768w`} type="image/webp" />
      {/* Fallback cho browser không hỗ trợ WebP */}
      <Image src={src} alt={alt} {...props} className="w-full h-auto" />
    </picture>
  );
}
