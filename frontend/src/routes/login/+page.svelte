<script lang="ts">
  import { auth } from '$lib/auth';
  import { goto } from '$app/navigation';
  import { User, Lock, Loader2, AlertCircle } from 'lucide-svelte';

  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let error = $state('');

  async function handleLogin(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    error = '';

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      auth.login(data.user, data.token);
      goto('/');
    } catch (err) {
      error = (err as Error).message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
  <div class="max-w-md w-full">
    <div class="text-center mb-10">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 mb-4 shadow-xl shadow-indigo-500/30">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h1 class="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2">SFAS Portal</h1>
      <p class="text-neutral-500 dark:text-neutral-400">Sales Fronting Activity System</p>
    </div>

    <div class="bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-2xl shadow-neutral-200 dark:shadow-none border border-neutral-100 dark:border-neutral-800">
      <form onsubmit={handleLogin} class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Email Address</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User class="h-5 w-5 text-neutral-400" />
            </div>
            <input
              id="email"
              type="email"
              bind:value={email}
              required
              class="block w-full pl-11 pr-4 py-3.5 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="user@sfas.com"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">Password</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock class="h-5 w-5 text-neutral-400" />
            </div>
            <input
              id="password"
              type="password"
              bind:value={password}
              required
              class="block w-full pl-11 pr-4 py-3.5 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        {#if error}
          <div class="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-800 text-sm">
            <AlertCircle class="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        {/if}

        <button
          type="submit"
          disabled={loading}
          class="w-full flex items-center justify-center py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98]"
        >
          {#if loading}
            <Loader2 class="w-5 h-5 animate-spin mr-2" />
            Authenticating...
          {:else}
            Sign In to Dashboard
          {/if}
        </button>
      </form>
    </div>

    <p class="text-center mt-8 text-neutral-500 text-sm">
      &copy; 2024 SFAS. Secure connection active.
    </p>
  </div>
</div>
