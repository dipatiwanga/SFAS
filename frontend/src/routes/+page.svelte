<script lang="ts">
  import { onMount } from 'svelte';
  
  let stats = $state({
    totalLeads: 0,
    visited: 0,
    allocated: 0
  });

  onMount(async () => {
    // Mock fetching stats or real fetch if needed
    const res = await fetch('http://localhost:3000/supervision/pensioners');
    const data = await res.json();
    stats.totalLeads = data.length;
    stats.visited = data.filter((p: any) => p.status === 'Visited').length;
    stats.allocated = data.filter((p: any) => p.status === 'Allocated' || p.status === 'Visited').length;
  });
</script>

<div class="space-y-8">
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-3xl font-extrabold text-neutral-900 dark:text-white">Productivity Overview</h2>
      <p class="text-neutral-500 dark:text-neutral-400">Welcome back, monitor your sales activity and lead distributions.</p>
    </div>
    <div class="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-semibold border border-blue-100 dark:border-blue-800">
      Real-time Sync Active
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700 hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between mb-4">
        <div class="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
          <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        </div>
        <span class="text-xs font-bold text-neutral-400 uppercase tracking-wider">Total Leads</span>
      </div>
      <div class="text-3xl font-bold">{stats.totalLeads}</div>
      <div class="text-sm text-neutral-500 mt-1">Database Pensiun</div>
    </div>

    <div class="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700 hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between mb-4">
        <div class="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
          <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <span class="text-xs font-bold text-neutral-400 uppercase tracking-wider">Visits Completed</span>
      </div>
      <div class="text-3xl font-bold">{stats.visited}</div>
      <div class="text-sm text-neutral-500 mt-1">Aktifitas Kunjungan</div>
    </div>

    <div class="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700 hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between mb-4">
        <div class="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
          <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
        </div>
        <span class="text-xs font-bold text-neutral-400 uppercase tracking-wider">Allocated</span>
      </div>
      <div class="text-3xl font-bold">{stats.allocated}</div>
      <div class="text-sm text-neutral-500 mt-1">Distribusi Prospek</div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div class="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700">
      <h3 class="text-xl font-bold mb-6">Quick Actions</h3>
      <div class="grid grid-cols-2 gap-4">
        <a href="/distribution" class="flex flex-col items-center justify-center p-6 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl transition-all group">
          <div class="bg-blue-600 text-white p-3 rounded-full mb-3 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          </div>
          <span class="font-semibold text-blue-700 dark:text-blue-400">Distribute Leads</span>
        </a>
        <a href="/activities" class="flex flex-col items-center justify-center p-6 bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 border border-purple-100 dark:border-purple-800/50 rounded-xl transition-all group">
          <div class="bg-purple-600 text-white p-3 rounded-full mb-3 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          </div>
          <span class="font-semibold text-purple-700 dark:text-purple-400">View Activities</span>
        </a>
      </div>
    </div>

    <div class="bg-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden flex flex-col justify-center">
      <div class="relative z-10">
        <h3 class="text-2xl font-bold mb-2">System Integration</h3>
        <p class="text-indigo-100 mb-6 max-w-sm">SFAS is successfully connected with LOS and Corebanking systems for automated processing.</p>
        <button class="bg-white text-indigo-600 px-6 py-2.5 rounded-lg font-bold hover:bg-neutral-100 transition-colors shadow-xl">System Status</button>
      </div>
      <!-- Abstract background pattern -->
      <div class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500 rounded-full opacity-20"></div>
      <div class="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-indigo-700 rounded-full opacity-30"></div>
    </div>
  </div>
</div>
