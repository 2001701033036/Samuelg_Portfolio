/**
 * Renders the configured image when it is marked `ready` in data/content.js,
 * otherwise the given placeholder. Avoids requesting files that don't exist yet.
 */
export default function Media({ image, alt = "", className = "", placeholder = null, eager = false }) {
  if (!image?.ready) return placeholder;
  return (
    <img
      src={image.src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
    />
  );
}
