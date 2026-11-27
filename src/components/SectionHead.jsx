export default function SectionHead({ eyebrow, title, text, align = "center" }) {
  return (
    <div className={`section-head section-head--${align}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {text && <p className="section-head__text">{text}</p>}
    </div>
  );
}
