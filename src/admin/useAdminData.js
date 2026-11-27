import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";

// Loads data from an admin endpoint and handles "logged out" errors.
export function useAdminData(path, onAuthError) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setData(await api(path, { auth: true }));
      setError("");
    } catch (err) {
      if (err.status === 401) onAuthError();
      else setError(err.message);
    }
  }, [path, onAuthError]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return { data, setData, error, reload: load };
}

export const formatDate = (iso) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
