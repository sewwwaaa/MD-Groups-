import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="notfound">
      <div className="container">
        <p className="notfound__code">404</p>
        <h1>Page not found</h1>
        <p className="muted">The page you are looking for doesn't exist or has been moved.</p>
        <div className="empty__actions">
          <Link to="/" className="btn btn--gold">Go to Home</Link>
          <Link to="/properties" className="btn btn--outline">Browse Properties</Link>
        </div>
      </div>
    </section>
  );
}
