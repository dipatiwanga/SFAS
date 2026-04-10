import { a as head } from "../../chunks/dev.js";
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	head("12qhfyh", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>SFAS - Sales Fronting Activity System</title>`);
		});
	});
	$$renderer.push(`<div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 flex flex-col"><header class="bg-white dark:bg-neutral-800 shadow-sm border-b border-neutral-200 dark:border-neutral-700 p-4"><div class="container mx-auto flex justify-between items-center"><h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SFAS</h1> <nav class="hidden md:flex space-x-4"><a href="/" class="hover:text-blue-600 transition-colors">Dashboard</a> <a href="/distribution" class="hover:text-blue-600 transition-colors">Distribution</a> <a href="/activities" class="hover:text-blue-600 transition-colors">Activities</a></nav> <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium">Log Out</button></div></header> <main class="flex-grow container mx-auto p-4 md:p-6 lg:p-8">`);
	children($$renderer);
	$$renderer.push(`<!----></main> <footer class="p-4 text-center text-xs text-neutral-500 border-t border-neutral-200 dark:border-neutral-700">© 2026 SFAS - Sales Fronting Activity System</footer></div>`);
}
//#endregion
export { _layout as default };
