

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.D-ljSIXH.js","_app/immutable/chunks/B6mH6idE.js","_app/immutable/chunks/CFKVnMbq.js"];
export const stylesheets = [];
export const fonts = [];
