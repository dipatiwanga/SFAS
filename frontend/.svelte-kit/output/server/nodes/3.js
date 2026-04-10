

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/print/_id_/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.BbC202fL.js","_app/immutable/chunks/B6mH6idE.js","_app/immutable/chunks/B4mcJ6na.js","_app/immutable/chunks/CFKVnMbq.js"];
export const stylesheets = ["_app/immutable/assets/3.CjiJIGFm.css"];
export const fonts = [];
