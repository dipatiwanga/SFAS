import "../../../chunks/index-server.js";
import { B as escape_html, c as stringify, i as ensure_array_like, n as attr_class, z as attr } from "../../../chunks/dev.js";
//#region src/routes/distribution/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let partners = [];
		let offices = [];
		let salesUsers = [];
		let pensioners = [];
		let selectedPartner = "";
		let selectedOffice = "";
		let selectedStatus = "";
		let searchQuery = "";
		let selectedPIC = "";
		let selectedLeads = /* @__PURE__ */ new Set();
		async function fetchData() {
			const params = new URLSearchParams();
			pensioners = await (await fetch(`http://localhost:3000/supervision/pensioners?${params.toString()}`)).json();
		}
		$$renderer.push(`<div class="space-y-6"><div class="flex flex-col md:flex-row md:items-center justify-between gap-4"><h2 class="text-2xl font-bold">Lead Distribution</h2> <div class="flex items-center gap-2">`);
		$$renderer.select({
			value: selectedPIC,
			class: "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-4 py-2 text-sm"
		}, ($$renderer) => {
			$$renderer.option({ value: "" }, ($$renderer) => {
				$$renderer.push(`Select PIC Sales`);
			});
			$$renderer.push(`<!--[-->`);
			const each_array = ensure_array_like(salesUsers);
			for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
				let s = each_array[$$index];
				$$renderer.option({ value: s.id }, ($$renderer) => {
					$$renderer.push(`${escape_html(s.name)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(` <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/20">Submit Assignment</button></div></div> <div class="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700 grid grid-cols-1 md:grid-cols-4 gap-4"><div class="space-y-1"><label class="text-xs font-bold text-neutral-400 uppercase tracking-tighter">Mitra</label> `);
		$$renderer.select({
			value: selectedPartner,
			onchange: fetchData,
			class: "w-full bg-neutral-50 dark:bg-neutral-900 border-none rounded-lg p-2.5"
		}, ($$renderer) => {
			$$renderer.option({ value: "" }, ($$renderer) => {
				$$renderer.push(`All Partners`);
			});
			$$renderer.push(`<!--[-->`);
			const each_array_1 = ensure_array_like(partners);
			for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
				let p = each_array_1[$$index_1];
				$$renderer.option({ value: p.id }, ($$renderer) => {
					$$renderer.push(`${escape_html(p.name)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</div> <div class="space-y-1"><label class="text-xs font-bold text-neutral-400 uppercase tracking-tighter">Kantor</label> `);
		$$renderer.select({
			value: selectedOffice,
			onchange: fetchData,
			class: "w-full bg-neutral-50 dark:bg-neutral-900 border-none rounded-lg p-2.5"
		}, ($$renderer) => {
			$$renderer.option({ value: "" }, ($$renderer) => {
				$$renderer.push(`All Offices`);
			});
			$$renderer.push(`<!--[-->`);
			const each_array_2 = ensure_array_like(offices);
			for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
				let o = each_array_2[$$index_2];
				$$renderer.option({ value: o.id }, ($$renderer) => {
					$$renderer.push(`${escape_html(o.name)}`);
				});
			}
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`</div> <div class="space-y-1"><label class="text-xs font-bold text-neutral-400 uppercase tracking-tighter">Status</label> `);
		$$renderer.select({
			value: selectedStatus,
			onchange: fetchData,
			class: "w-full bg-neutral-50 dark:bg-neutral-900 border-none rounded-lg p-2.5"
		}, ($$renderer) => {
			$$renderer.option({ value: "" }, ($$renderer) => {
				$$renderer.push(`All Status`);
			});
			$$renderer.option({ value: "Prospect" }, ($$renderer) => {
				$$renderer.push(`Prospect`);
			});
			$$renderer.option({ value: "Allocated" }, ($$renderer) => {
				$$renderer.push(`Allocated`);
			});
			$$renderer.option({ value: "Visited" }, ($$renderer) => {
				$$renderer.push(`Visited`);
			});
		});
		$$renderer.push(`</div> <div class="space-y-1"><label class="text-xs font-bold text-neutral-400 uppercase tracking-tighter">Cari Data</label> <div class="relative"><input type="text"${attr("value", searchQuery)} placeholder="Nama pensiunan..." class="w-full bg-neutral-50 dark:bg-neutral-900 border-none rounded-lg p-2.5 pr-10"/> <svg class="w-5 h-5 absolute right-3 top-2.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div></div></div> <div class="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden"><table class="w-full text-left border-collapse"><thead><tr class="bg-neutral-50 dark:bg-neutral-900/50 text-neutral-400 text-xs font-bold uppercase tracking-wider"><th class="p-4 w-12 text-center"><input type="checkbox" class="rounded border-neutral-300"/></th><th class="p-4">Nama Pensiunan</th><th class="p-4">Mitra</th><th class="p-4">Kantor</th><th class="p-4">Status</th><th class="p-4">PIC Sales</th></tr></thead><tbody><!--[-->`);
		const each_array_3 = ensure_array_like(pensioners);
		for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
			let p = each_array_3[$$index_3];
			$$renderer.push(`<tr class="border-t border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900/20 transition-colors"><td class="p-4 text-center"><input type="checkbox"${attr("checked", selectedLeads.has(p.id), true)} class="rounded border-neutral-300"/></td><td class="p-4 font-semibold">${escape_html(p.name)}</td><td class="p-4 text-neutral-500">${escape_html(p.partner?.name || "-")}</td><td class="p-4 text-neutral-500">${escape_html(p.office?.name || "-")}</td><td class="p-4"><span${attr_class(`px-2.5 py-1 rounded-full text-xs font-bold ${stringify(p.status === "Visited" ? "bg-green-100 text-green-700" : p.status === "Allocated" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700")}`)}>${escape_html(p.status)}</span></td><td class="p-4">${escape_html(p.picSales?.name || "Unassigned")}</td></tr>`);
		}
		$$renderer.push(`<!--]--></tbody></table> `);
		if (pensioners.length === 0) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="p-12 text-center text-neutral-400">No records found matching your criteria.</div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div>`);
	});
}
//#endregion
export { _page as default };
