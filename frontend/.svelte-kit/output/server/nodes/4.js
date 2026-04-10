

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/activities/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.BkcTSH9q.js","_app/immutable/chunks/B6mH6idE.js","_app/immutable/chunks/CFKVnMbq.js"];
export const stylesheets = [];
export const fonts = [];
