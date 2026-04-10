

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.CEp4NViQ.js","_app/immutable/chunks/B6mH6idE.js","_app/immutable/chunks/B4mcJ6na.js","_app/immutable/chunks/CFKVnMbq.js"];
export const stylesheets = [];
export const fonts = [];
