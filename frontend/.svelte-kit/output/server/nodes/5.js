

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/distribution/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.BrzevsT5.js","_app/immutable/chunks/B6mH6idE.js","_app/immutable/chunks/CFKVnMbq.js"];
export const stylesheets = [];
export const fonts = [];
