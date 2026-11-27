import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../api.js";

// Loads company settings, team, properties and vehicles from the server once,
// and shares them with every page.
const SiteDataContext = createContext(null);

const emptySettings = {
  name: "MD Groups", phone: "", whatsapp: "", email: "", address: "Sri Lanka", hours: "",
  facebook: "", instagram: "", linkedin: "",
};

export function SiteDataProvider({ children }) {
  const [state, setState] = useState({
    loading: true, error: null,
    settings: emptySettings, team: [], properties: [], vehicles: [],
  });

  const load = useCallback(async () => {
    try {
      const [site, properties, vehicles] = await Promise.all([
        api("/site"), api("/properties"), api("/vehicles"),
      ]);
      setState({ loading: false, error: null, settings: site.settings, team: site.team, properties, vehicles });
    } catch {
      setState((s) => ({ ...s, loading: false, error: "Could not connect to the server." }));
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return <SiteDataContext.Provider value={{ ...state, reload: load }}>{children}</SiteDataContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSiteData = () => useContext(SiteDataContext);
