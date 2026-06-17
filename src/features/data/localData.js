const STORAGE_KEYS = {
  habits: "trackwolf_habits",
  tasks: "trackwolf_tasks",
  timer: "trackwolf_timer",
  categories: "trackwolf_categories",
  goals: "trackwolf_goals",
};

export function exportLocalData() {
  const data = {};
  for (const [key, storageKey] of Object.entries(STORAGE_KEYS)) {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        data[key] = JSON.parse(raw);
      } catch {
        data[key] = raw;
      }
    }
  }
  return data;
}

export function downloadLocalDataExport() {
  const data = exportLocalData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `continuum-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function validateImportData(data) {
  if (!isPlainObject(data)) {
    throw new Error("Invalid backup file: expected a JSON object.");
  }

  const allowed = new Set(Object.keys(STORAGE_KEYS));
  const keys = Object.keys(data).filter((k) => data[k] !== undefined);
  if (keys.length === 0) {
    throw new Error("Backup file contains no data.");
  }

  for (const key of keys) {
    if (!allowed.has(key)) {
      throw new Error(`Unknown data section: ${key}`);
    }
    if (!isPlainObject(data[key]) && key !== "goals") {
      throw new Error(`Invalid shape for "${key}" section.`);
    }
  }

  return data;
}

export function importLocalData(data, { replace = true } = {}) {
  const validated = validateImportData(data);

  if (replace) {
    for (const storageKey of Object.values(STORAGE_KEYS)) {
      localStorage.removeItem(storageKey);
    }
  }

  for (const [key, storageKey] of Object.entries(STORAGE_KEYS)) {
    if (validated[key] !== undefined) {
      localStorage.setItem(storageKey, JSON.stringify(validated[key]));
    }
  }
}

export function resetLocalData() {
  for (const storageKey of Object.values(STORAGE_KEYS)) {
    localStorage.removeItem(storageKey);
  }
}
