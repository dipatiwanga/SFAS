

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.Ce4ttxt9.js","_app/immutable/chunks/B6mH6idE.js","_app/immutable/chunks/CFKVnMbq.js"];
export const stylesheets = ["_app/immutable/assets/0.Cqasxah6.css"];
export const fonts = [];
