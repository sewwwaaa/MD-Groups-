import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import Icon from "../components/Icon.jsx";
import { api } from "../api.js";
import { useSiteData } from "../context/SiteData.jsx";

const interests = [
  "Buying a property", "Selling a property", "Renting a property",
  "Buying a vehicle", "Selling a vehicle", "Investment advice", "Something else",
];

export default function Contact() {
  const { settings } = useSiteData();
  const [params] = useSearchParams();
  const about = params.get("about");

  const [form, setForm] = useState({
    name: "", phone: "", email: "", website: "",
    interest: interests[0],
    message: about ? `Hi, I'm interested in "${about}". Please contact me with more details.` : "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Please enter your name";
    if (!/^[+\d][\d\s-]{6,}$/.test(form.phone.trim())) err.phone = "Please enter a valid phone number";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Please enter a valid email";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      await api("/enquiries", { method: "POST", body: form });
      setStatus("sent");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  const tel = settings.phone?.replace(/\s/g, "");

  return (
    <>
      <PageHero title="Contact Us" subtitle="We usually reply within one working day. The first consultation is free." />

      <section className="section">
        <div className="container contact">
          <div className="contact__info">
            <h2>Let's talk</h2>
            <p className="muted">
              Buying, selling or renting a property or vehicle? Dineth and Madusha are happy to help.
            </p>

            <div className="contact__cards">
              {settings.phone && (
                <a href={`tel:${tel}`} className="ccard">
                  <Icon name="phone" size={22} />
                  <div><span>Call us</span><strong>{settings.phone}</strong></div>
                </a>
              )}
              {settings.phone2 && (
                <a href={`tel:${settings.phone2.replace(/\s/g, "")}`} className="ccard">
                  <Icon name="phone" size={22} />
                  <div><span>Call us</span><strong>{settings.phone2}</strong></div>
                </a>
              )}
              {settings.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="ccard">
                  <Icon name="whatsapp" size={22} />
                  <div><span>WhatsApp</span><strong>Chat with us</strong></div>
                </a>
              )}
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="ccard">
                  <Icon name="mail" size={22} />
                  <div><span>Email</span><strong>{settings.email}</strong></div>
                </a>
              )}
              {settings.hours && (
                <div className="ccard">
                  <Icon name="clock" size={22} />
                  <div><span>Office hours</span><strong>{settings.hours}</strong></div>
                </div>
              )}
            </div>

            {settings.address && (
              <div className="map">
                <iframe
                  title="Office location"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          <div className="form-card">
            {status === "sent" ? (
              <div className="form-success">
                <div className="form-success__icon"><Icon name="check" size={32} /></div>
                <h3>Thank you, {form.name.split(" ")[0]}!</h3>
                <p className="muted">Your message has been sent. We'll get back to you soon.</p>
                <button className="btn btn--outline" onClick={() => { setStatus("idle"); setForm({ ...form, message: "" }); }}>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <h3>Send us a message</h3>
                <div className="form-row">
                  <Field label="Full name *" error={errors.name}>
                    <input value={form.name} onChange={set("name")} autoComplete="name" />
                  </Field>
                  <Field label="Phone number *" error={errors.phone}>
                    <input type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" placeholder="07X XXX XXXX" />
                  </Field>
                </div>
                <Field label="Email" error={errors.email}>
                  <input type="email" value={form.email} onChange={set("email")} autoComplete="email" />
                </Field>
                <Field label="I'm interested in">
                  <select value={form.interest} onChange={set("interest")}>
                    {interests.map((i) => <option key={i}>{i}</option>)}
                  </select>
                </Field>
                <Field label="Message">
                  <textarea rows="5" value={form.message} onChange={set("message")} placeholder="Tell us your budget, preferred area or vehicle, and anything else that helps." />
                </Field>
                {/* Hidden field to catch spam bots */}
                <input type="text" value={form.website} onChange={set("website")} className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                {status === "error" && <p className="form-error">{errorMsg} You can also call or WhatsApp us.</p>}
                <button type="submit" className="btn btn--gold btn--block" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, error, children }) {
  return (
    <label className={`field ${error ? "field--error" : ""}`}>
      <span>{label}</span>
      {children}
      {error && <small>{error}</small>}
    </label>
  );
}
