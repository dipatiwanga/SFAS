<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/auth';
  import { get } from 'svelte/store';
  
  let salesUsers = $state([]);
  let activities = $state([]);
  let selectedSales = $state("");

  async function fetchActivities() {
    try {
      const params = new URLSearchParams();
      if (selectedSales) params.append('salesId', selectedSales);

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
    const url = `http://localhost:3001/api/activities/export/excel${selectedSales ? '?salesId=' + selectedSales : ''}`;
    // We might need to handle token for window.open, usually via a temporary download token or query param
    // But for now we'll just open it. Secure excel export might need a different approach.
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
  <div class="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 flex flex-wrap gap-4 items-end">
    <div class="space-y-1">
      <label for="sales-select" class="text-xs font-bold text-neutral-400 uppercase">Filter Sales</label>
      <select id="sales-select" bind:value={selectedSales} onchange={fetchActivities} class="bg-neutral-50 dark:bg-neutral-900 border-none rounded-lg p-2 text-sm w-48">
        <option value="">All Sales</option>
        {#each salesUsers as s}
          <option value={s.id}>{s.name}</option>
        {/each}
      </select>
    </div>
    <div class="space-y-1">
      <label for="periode-input" class="text-xs font-bold text-neutral-400 uppercase">Periode</label>
      <input id="periode-input" type="date" class="bg-neutral-50 dark:bg-neutral-900 border-none rounded-lg p-2 text-sm" />
    </div>
    <button onclick={fetchActivities} class="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg text-sm font-bold border border-blue-100 dark:border-blue-800 underline">Cari Data</button>
  </div>

  <!-- Activity Cards/List -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each activities as a}
      <div class="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-700 space-y-4 hover:border-blue-200 dark:hover:border-blue-800 transition-all">
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-bold text-lg">{a.client?.shop_name || 'Unknown Client'}</h4>
            <p class="text-xs text-neutral-400 font-medium tracking-wide uppercase">{new Date(a.check_in_time).toLocaleString()}</p>
          </div>
          <button onclick={() => handleDelete(a.id)} aria-label="Delete activity" class="text-neutral-300 hover:text-red-500 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>

        <p class="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3 italic">"{a.notes || 'No notes provided'}"</p>

        <div class="flex items-center gap-3 pt-2">
          <button class="flex-1 bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 py-2 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all flex justify-center items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            Detail Activity
          </button>
          <a href="https://www.google.com/maps?q={a.lat},{a.long}" target="_blank" class="flex-1 bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 py-2 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all flex justify-center items-center gap-2 text-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            Geotagging
          </a>
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
</div>
