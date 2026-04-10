<script lang="ts">
  import '../app.css';
  import { auth } from '$lib/auth';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { LogOut, LayoutDashboard, Send, Activity } from 'lucide-svelte';

  let { children } = $props();

  // Route protection
  onMount(() => {
    if (!$auth.isAuthenticated && page.url.pathname !== '/login') {
      goto('/login');
    }
  });

  // Watch auth state
  $effect(() => {
    if (!$auth.isAuthenticated && page.url.pathname !== '/login') {
      goto('/login');
    }
  });

  const isLoginPage = $derived(page.url.pathname === '/login');
</script>

<svelte:head>
  <title>SFAS - Sales Fronting Activity System</title>
</svelte:head>

{#if isLoginPage}
  {@render children()}
{:else}
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col">
    <header class="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm border-b border-neutral-200 dark:border-neutral-800 p-4">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center gap-2">
          <div class="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-500/20">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">SFAS</h1>
        </div>
        
        <nav class="hidden md:flex items-center space-x-1">
          <a href="/" class="flex items-center gap-2 px-4 py-2 rounded-xl {page.url.pathname === '/' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'} transition-all text-sm font-semibold">
            <LayoutDashboard class="w-4 h-4" />
            Dashboard
          </a>
          <a href="/distribution" class="flex items-center gap-2 px-4 py-2 rounded-xl {page.url.pathname === '/distribution' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'} transition-all text-sm font-semibold">
            <Send class="w-4 h-4" />
            Distribution
          </a>
          <a href="/activities" class="flex items-center gap-2 px-4 py-2 rounded-xl {page.url.pathname === '/activities' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'} transition-all text-sm font-semibold">
            <Activity class="w-4 h-4" />
            Activities
          </a>
        </nav>

        <div class="flex items-center gap-4">
          <div class="hidden sm:block text-right">
            <p class="text-xs font-bold text-neutral-900 dark:text-white leading-none">{$auth.user?.name}</p>
            <p class="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">{$auth.user?.role}</p>
          </div>
          <button 
            onclick={() => auth.logout()}
            class="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 px-4 py-2.5 rounded-xl transition-all text-sm font-bold border border-neutral-200 dark:border-neutral-700"
          >
            <LogOut class="w-4 h-4" />
            <span class="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>

    <main class="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
      {@render children()}
    </main>

    <footer class="p-6 text-center border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <p class="text-xs text-neutral-500 font-medium tracking-wide">
        &copy; 2026 SFAS - Sales Fronting Activity System &bull; Enterprise Edition
      </p>
    </footer>
  </div>
{/if}
