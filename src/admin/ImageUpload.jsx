import { useRef, useState } from "react";
import Icon from "../components/Icon.jsx";
import { uploadImage } from "../api.js";

// Lets the admin upload a photo (or paste an image link). Calls onChange(url).
export default function ImageUpload({ value, onChange, onAuthError, round = false, label = "Photo" }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadImage(file));
    } catch (err) {
      if (err.status === 401) onAuthError?.();
      else setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="upload">
      <span className="upload__label">{label}</span>
      <div className={`upload__preview ${round ? "upload__preview--round" : ""}`}>
        {value ? <img src={value} alt="" /> : <Icon name="upload" size={28} />}
      </div>
      <div className="upload__controls">
        <button type="button" className="btn btn--outline btn--sm" onClick={() => input.current.click()} disabled={busy}>
          <Icon name="upload" size={16} /> {busy ? "Uploading…" : value ? "Change photo" : "Upload photo"}
        </button>
        {value && (
          <button type="button" className="btn btn--text btn--sm" onClick={() => onChange("")}>Remove</button>
        )}
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" onChange={pick} hidden />
      </div>
      <small className="muted">JPG, PNG or WEBP, up to 8 MB.</small>
      {error && <small className="form-error">{error}</small>}
    </div>
  );
}
