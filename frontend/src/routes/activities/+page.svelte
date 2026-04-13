<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/auth';
  
  let salesUsers = $state([]);
  let activities = $state([]);
  let selectedSales = $state("");
  let startDate = $state("");
  let endDate = $state("");
  let selectedMitra = $state("");
  let searchQuery = $state("");
  let selectedActivity = $state(null);

  const mitraOptions = ["DAPENBUN", "TASPEN", "BANK"];

  async function fetchActivities() {
    try {
      const params = new URLSearchParams();
      if (selectedSales) params.append('user_id', selectedSales);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      if (selectedMitra) params.append('mitra', selectedMitra);
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(`http://localhost:3001/api/activities?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${$auth.token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch activities');
      activities = await res.json();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this activity log?")) return;
    try {
      const res = await fetch(`http://localhost:3001/api/activities/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${$auth.token}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete activity');
      fetchActivities();
    } catch (e) {
      console.error(e);
    }
  }

  function handleExportExcel() {
    const params = new URLSearchParams();
    if (selectedSales) params.append('user_id', selectedSales);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (selectedMitra) params.append('mitra', selectedMitra);
    if (searchQuery) params.append('search', searchQuery);
    
    const url = `http://localhost:3001/api/activities/export/excel?${params.toString()}`;
    window.open(url, '_blank');
  }

  onMount(async () => {
    try {
      const usersRes = await fetch('http://localhost:3001/api/users', {
        headers: {
          'Authorization': `Bearer ${$auth.token}`
        }
      });
      if (usersRes.ok) {
        salesUsers = await usersRes.json();
      }
      fetchActivities();
    } catch (e) {
      console.error(e);
    }
  });

  function openDetail(activity) {
    selectedActivity = activity;
  }

  function closeDetail() {
    selectedActivity = null;
  }
</script>

<div class="space-y-6">
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <h2 class="text-2xl font-bold">Sales Activities</h2>
    <div class="flex items-center gap-2">
      <button onclick={handleExportExcel} class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        Export Excel
      </button>
      <button class="bg-neutral-800 hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
        Print PDF
      </button>
    </div>
  </div>

  <!-- Filter Bar -->
  <div class="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 space-y-4">
    <div class="flex flex-wrap gap-4 items-end">
        <div class="space-y-1 flex-1 min-w-[200px]">
          <label for="search-input" class="text-xs font-bold text-neutral-400 uppercase">Search Pensioner / Notes</label>
          <input id="search-input" type="text" bind:value={searchQuery} placeholder="Search..." class="w-full bg-neutral-50 dark:bg-neutral-900 border-none rounded-lg p-2 text-sm" />
        </div>
        <div class="space-y-1">
          <label for="sales-select" class="text-xs font-bold text-neutral-400 uppercase">Sales</label>
          <select id="sales-select" bind:value={selectedSales} class="bg-neutral-50 dark:bg-neutral-900 border-none rounded-lg p-2 text-sm w-48">
            <option value="">All Sales</option>
            {#each salesUsers as s}
              <option value={s.id}>{s.name}</option>
            {/each}
          </select>
        </div>
        <div class="space-y-1">
          <label for="mitra-select" class="text-xs font-bold text-neutral-400 uppercase">Mitra</label>
          <select id="mitra-select" bind:value={selectedMitra} class="bg-neutral-50 dark:bg-neutral-900 border-none rounded-lg p-2 text-sm w-40">
            <option value="">All Mitra</option>
            {#each mitraOptions as m}
                <option value={m}>{m}</option>
            {/each}
          </select>
        </div>
    </div>
    <div class="flex flex-wrap gap-4 items-end pt-2 border-t border-neutral-50 dark:border-neutral-700">
        <div class="space-y-1">
          <label for="start-date" class="text-xs font-bold text-neutral-400 uppercase">Start Date</label>
          <input id="start-date" type="date" bind:value={startDate} class="bg-neutral-50 dark:bg-neutral-900 border-none rounded-lg p-2 text-sm" />
        </div>
        <div class="space-y-1">
          <label for="end-date" class="text-xs font-bold text-neutral-400 uppercase">End Date</label>
          <input id="end-date" type="date" bind:value={endDate} class="bg-neutral-50 dark:bg-neutral-900 border-none rounded-lg p-2 text-sm" />
        </div>
        <button onclick={fetchActivities} class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-500/20 ml-auto">
          Apply Filters
        </button>
    </div>
  </div>

  <!-- Activity Cards/List -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each activities as a}
      <div class="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-700 space-y-4 hover:border-blue-200 dark:hover:border-blue-800 transition-all flex flex-col">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded uppercase tracking-wider">{a.client?.mitra || 'N/A'}</span>
                <span class="text-[10px] text-neutral-400 font-medium">{new Date(a.check_in_time).toLocaleDateString()}</span>
            </div>
            <h4 class="font-bold text-lg leading-tight">{a.client?.shop_name || 'Unknown Client'}</h4>
            <p class="text-xs text-neutral-500 font-medium mt-1">Visited by {a.user?.name}</p>
          </div>
          <button onclick={() => handleDelete(a.id)} aria-label="Delete activity" class="text-neutral-300 hover:text-red-500 transition-colors ml-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>

        <p class="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 italic flex-grow">"{a.notes || 'No notes provided'}"</p>

        <div class="flex items-center gap-2 pt-4 border-t border-neutral-50 dark:border-neutral-700">
          <button onclick={() => openDetail(a)} class="flex-1 bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 py-2 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all flex justify-center items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            Detail
          </button>
          {#if a.lat && a.long}
            <a href="https://www.google.com/maps?q={a.lat},{a.long}" target="_blank" class="flex-1 bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 py-2 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all flex justify-center items-center gap-2 text-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Maps
            </a>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  {#if activities.length === 0}
    <div class="bg-neutral-50 dark:bg-neutral-900/50 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-3xl p-20 text-center text-neutral-400">
      <svg class="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
      No activities recorded for the selected filter.
    </div>
  {/if}

  <!-- Detail Modal -->
  {#if selectedActivity}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm shadow-2xl transition-opacity">
        <div class="bg-white dark:bg-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
            <div class="p-6 border-b border-neutral-100 dark:border-neutral-700 flex justify-between items-center">
                <h3 class="text-xl font-bold">Activity Detail</h3>
                <button onclick={closeDetail} class="text-neutral-400 hover:text-neutral-600 dark:hover:text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
            <div class="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                <div class="grid grid-cols-2 gap-8">
                    <div class="space-y-1">
                        <span class="text-xs font-bold text-neutral-400 uppercase tracking-wider">Pensioner / Client</span>
                        <p class="text-lg font-bold">{selectedActivity.client?.shop_name}</p>
                        <p class="text-sm text-neutral-500">{selectedActivity.client?.address}</p>
                    </div>
                    <div class="space-y-1">
                        <span class="text-xs font-bold text-neutral-400 uppercase tracking-wider">Visit Status</span>
                        <div>
                            <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">Visited</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-8 pt-4 border-t border-neutral-50 dark:border-neutral-700">
                    <div class="space-y-1">
                        <span class="text-xs font-bold text-neutral-400 uppercase tracking-wider">Date & Time</span>
                        <p class="font-semibold text-neutral-700 dark:text-neutral-200">{new Date(selectedActivity.check_in_time).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}</p>
                    </div>
                    <div class="space-y-1">
                        <span class="text-xs font-bold text-neutral-400 uppercase tracking-wider">Sales Officer</span>
                        <p class="font-semibold text-neutral-700 dark:text-neutral-200">{selectedActivity.user?.name}</p>
                    </div>
                </div>

                <div class="space-y-2 pt-4 border-t border-neutral-50 dark:border-neutral-700">
                    <span class="text-xs font-bold text-neutral-400 uppercase tracking-wider">Notes & Remarks</span>
                    <div class="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl italic text-neutral-600 dark:text-neutral-400">
                        "{selectedActivity.notes || 'No description provided'}"
                    </div>
                </div>

                {#if selectedActivity.image_url}
                    <div class="space-y-2 pt-4 border-t border-neutral-50 dark:border-neutral-700">
                        <span class="text-xs font-bold text-neutral-400 uppercase tracking-wider">Verification Photo</span>
                        <img src={selectedActivity.image_url} alt="Visit evidence" class="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm" />
                    </div>
                {/if}

                {#if selectedActivity.lat && selectedActivity.long}
                    <div class="space-y-2 pt-4 border-t border-neutral-50 dark:border-neutral-700">
                        <span class="text-xs font-bold text-neutral-400 uppercase tracking-wider">Geotagging Info</span>
                        <div class="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
                            <span>Latitude: {selectedActivity.lat}, Longitude: {selectedActivity.long}</span>
                        </div>
                    </div>
                {/if}
            </div>
            <div class="p-6 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-700 flex justify-end">
                <button onclick={closeDetail} class="px-6 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-lg text-sm font-bold transition-all">Close</button>
            </div>
        </div>
    </div>
  {/if}
</div>
