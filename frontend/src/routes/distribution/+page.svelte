<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/auth';
  
  let partners = $state([]);
  let offices = $state([]);
  let salesUsers = $state([]);
  let pensioners = $state([]);
  
  let selectedPartner = $state("");
  let selectedOffice = $state("");
  let selectedStatus = $state("");
  let searchQuery = $state("");
  let selectedPIC = $state("");
  
  let selectedLeads = $state(new Set());

  async function fetchData() {
    try {
      const params = new URLSearchParams();
      if (selectedPartner) params.append('partnerId', selectedPartner);
      if (selectedOffice) params.append('officeId', selectedOffice);
      if (selectedStatus) params.append('status', selectedStatus);
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(`http://localhost:3001/api/supervision/pensioners?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${$auth.token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch pensioners');
      pensioners = await res.json();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleReassign() {
    if (selectedLeads.size === 0 || !selectedPIC) return alert("Select leads and PIC");
    
    try {
      const res = await fetch('http://localhost:3001/api/supervision/reassign', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${$auth.token}`
        },
        body: JSON.stringify({
          ids: Array.from(selectedLeads),
          picSalesId: Number(selectedPIC)
        })
      });
      
      if (!res.ok) throw new Error('Failed to reassign leads');
      
      selectedLeads.clear();
      fetchData();
      alert("Leads reassigned successfully");
    } catch (e) {
      console.error(e);
      alert("Error: " + (e as Error).message);
    }
  }

  function toggleLead(id: number) {
    if (selectedLeads.has(id)) selectedLeads.delete(id);
    else selectedLeads.add(id);
    selectedLeads = new Set(selectedLeads); // Trigger reactivity
  }

  onMount(async () => {
    try {
      const headers = { 'Authorization': `Bearer ${$auth.token}` };
      
      const [pRes, oRes, sRes] = await Promise.all([
        fetch('http://localhost:3001/api/partners', { headers }),
        fetch('http://localhost:3001/api/offices', { headers }),
        fetch('http://localhost:3001/api/users', { headers })
      ]);

      if (pRes.ok) partners = await pRes.json();
      if (oRes.ok) offices = await oRes.json();
      if (sRes.ok) salesUsers = await sRes.json();
      
      fetchData();
    } catch (e) {
      console.error(e);
    }
  });
</script>

<div class="space-y-6">
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <h2 class="text-2xl font-bold">Lead Distribution</h2>
    <div class="flex items-center gap-2">
      <select bind:value={selectedPIC} class="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-4 py-2 text-sm">
        <option value="">Select PIC Sales</option>
        {#each salesUsers as s}
          <option value={s.id}>{s.name}</option>
        {/each}
      </select>
      <button onclick={handleReassign} class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/20">
        Submit Assignment
      </button>
    </div>
  </div>

  <!-- Filters -->
  <div class="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700 grid grid-cols-1 md:grid-cols-4 gap-4">
    <div class="space-y-1">
      <label class="text-xs font-bold text-neutral-400 uppercase tracking-tighter">Mitra</label>
      <select bind:value={selectedPartner} onchange={fetchData} class="w-full bg-neutral-50 dark:bg-neutral-900 border-none rounded-lg p-2.5">
        <option value="">All Partners</option>
        {#each partners as p}
          <option value={p.id}>{p.name}</option>
        {/each}
      </select>
    </div>
    <div class="space-y-1">
      <label class="text-xs font-bold text-neutral-400 uppercase tracking-tighter">Kantor</label>
      <select bind:value={selectedOffice} onchange={fetchData} class="w-full bg-neutral-50 dark:bg-neutral-900 border-none rounded-lg p-2.5">
        <option value="">All Offices</option>
        {#each offices as o}
          <option value={o.id}>{o.name}</option>
        {/each}
      </select>
    </div>
    <div class="space-y-1">
      <label class="text-xs font-bold text-neutral-400 uppercase tracking-tighter">Status</label>
      <select bind:value={selectedStatus} onchange={fetchData} class="w-full bg-neutral-50 dark:bg-neutral-900 border-none rounded-lg p-2.5">
        <option value="">All Status</option>
        <option value="Prospect">Prospect</option>
        <option value="Allocated">Allocated</option>
        <option value="Visited">Visited</option>
      </select>
    </div>
    <div class="space-y-1">
      <label class="text-xs font-bold text-neutral-400 uppercase tracking-tighter">Cari Data</label>
      <div class="relative">
        <input type="text" bind:value={searchQuery} oninput={fetchData} placeholder="Nama pensiunan..." class="w-full bg-neutral-50 dark:bg-neutral-900 border-none rounded-lg p-2.5 pr-10" />
        <svg class="w-5 h-5 absolute right-3 top-2.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      </div>
    </div>
  </div>

  <!-- Data Table -->
  <div class="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-neutral-50 dark:bg-neutral-900/50 text-neutral-400 text-xs font-bold uppercase tracking-wider">
          <th class="p-4 w-12 text-center">
            <input type="checkbox" class="rounded border-neutral-300" onchange={(e) => {
              if (e.currentTarget.checked) selectedLeads = new Set(pensioners.map(p => p.id));
              else selectedLeads.clear();
              selectedLeads = new Set(selectedLeads);
            }} />
          </th>
          <th class="p-4">Nama Pensiunan</th>
          <th class="p-4">Mitra</th>
          <th class="p-4">Kantor</th>
          <th class="p-4">Status</th>
          <th class="p-4">PIC Sales</th>
        </tr>
      </thead>
      <tbody>
        {#each pensioners as p}
          <tr class="border-t border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900/20 transition-colors">
            <td class="p-4 text-center">
              <input type="checkbox" checked={selectedLeads.has(p.id)} onchange={() => toggleLead(p.id)} class="rounded border-neutral-300" />
            </td>
            <td class="p-4 font-semibold">{p.name}</td>
            <td class="p-4 text-neutral-500">{p.partner?.name || '-'}</td>
            <td class="p-4 text-neutral-500">{p.office?.name || '-'}</td>
            <td class="p-4">
              <span class="px-2.5 py-1 rounded-full text-xs font-bold {p.status === 'Visited' ? 'bg-green-100 text-green-700' : p.status === 'Allocated' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}">
                {p.status}
              </span>
            </td>
            <td class="p-4">{p.picSales?.name || 'Unassigned'}</td>
          </tr>
        {/each}
      </tbody>
    </table>
    {#if pensioners.length === 0}
      <div class="p-12 text-center text-neutral-400">
        No records found matching your criteria.
      </div>
    {/if}
  </div>
</div>
