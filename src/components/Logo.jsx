// Company logo (public/logo.png — transparent background, made for dark backgrounds).
export default function Logo({ size = "md" }) {
  return (
    <span className={`logo logo--${size}`}>
      <img src="/logo.png" alt="MD Groups" width="640" height="268" />
    </span>
  );
}
