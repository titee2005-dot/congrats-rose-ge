import { createContext, useContext, useMemo } from 'react';

const CopyContext = createContext({});

export function formatCopy(overrides, key, fallback, values = {}) {
  const text = typeof overrides?.[key] === 'string' ? overrides[key] : fallback;
  return String(text).replace(/\{(\w+)\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match);
}

export function SiteCopyProvider({ overrides, children }) {
  return <CopyContext.Provider value={overrides || {}}>{children}</CopyContext.Provider>;
}

export function useSiteCopy() {
  const overrides = useContext(CopyContext);
  return useMemo(() => (key, fallback, values) => formatCopy(overrides, key, fallback, values), [overrides]);
}
