/**
 * Safely retrieves and parses a value from localStorage.
 * Returns the fallback if key is missing, value is null, or JSON parsing fails.
 */
export function safeGetItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * Safely sets a JSON-serializable value in localStorage.
 * Returns true on success, false on failure (e.g., quota exceeded).
 */
export function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    console.warn(`Failed to save to localStorage key: ${key}`);
    return false;
  }
}

/**
 * Removes a key from localStorage safely.
 */
export function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Silently ignore
  }
}
