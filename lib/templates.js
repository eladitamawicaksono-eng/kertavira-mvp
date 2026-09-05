const KEY = 'kertavira_templates';

export function getTemplates() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTemplate(template) {
  const list = getTemplates();
  const newTemplate = { id: crypto.randomUUID(), ...template };
  const updated = [...list, newTemplate];
  window.localStorage.setItem(KEY, JSON.stringify(updated));
  return newTemplate;
}

export function deleteTemplate(id) {
  const updated = getTemplates().filter((tpl) => tpl.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}
