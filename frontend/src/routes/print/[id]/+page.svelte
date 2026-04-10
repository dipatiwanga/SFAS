<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { auth } from '$lib/auth';
  
  let pensioner = $state(null);
  const id = page.params.id;

  onMount(async () => {
    try {
        // Fetch details for the specific pensioner
        const res = await fetch(`http://localhost:3001/api/supervision/pensioners?search=${id}`, {
            headers: {
                'Authorization': `Bearer ${$auth.token}`
            }
        }); 
        if (!res.ok) throw new Error('Failed to fetch pensioner');
        const data = await res.json();
        pensioner = data.find((p: any) => p.id === Number(id)) || data[0];
        
        if (pensioner) {
            setTimeout(() => window.print(), 1000);
        }
    } catch (e) {
        console.error(e);
    }
  });
</script>

{#if pensioner}
<div class="p-12 bg-white text-black min-h-screen font-serif" id="printable">
  <div class="border-b-4 border-double border-black pb-4 mb-8 flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-bold uppercase">SFAS Banking</h1>
      <p class="text-sm">Sales Fronting Activity System - Official Letter</p>
    </div>
    <div class="text-right text-xs">
      <p>Tanggal: {new Date().toLocaleDateString('id-ID')}</p>
      <p>Nomor: SFAS/SP/{new Date().getFullYear()}/{id}</p>
    </div>
  </div>

  <div class="space-y-6">
    <div class="space-y-1">
      <p>Kepada Yth,</p>
      <p class="font-bold text-xl">{pensioner.name}</p>
      <p class="text-sm max-w-md">{pensioner.address || 'Alamat tidak terdaftar'}</p>
      <p class="text-sm">Mitra: {pensioner.partner?.name || '-'}</p>
    </div>

    <h2 class="text-center text-2xl font-bold underline py-4">SURAT PENAWARAN KREDIT PENSIUN</h2>

    <p class="text-justify leading-relaxed">
      Dengan Hormat, <br/><br/>
      Sehubungan dengan data kepesertaan Bapak/Ibu pada <strong>{pensioner.partner?.name || 'Mitra Kami'}</strong>, kami bermaksud menawarkan fasilitas Kredit Pensiun dengan proses yang cepat dan tahapan yang telah disimplifikasi melalui sistem terintegrasi SFAS kami.
    </p>

    <div class="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
      <h3 class="font-bold mb-2 uppercase text-sm tracking-widest">Keunggulan Layanan Kami:</h3>
      <ul class="list-disc list-inside space-y-1 text-sm">
        <li>Proses integrasi langsung dengan LOS & Corebanking</li>
        <li>Minimalisasi dokumen pengajuan</li>
        <li>SLA pencairan yang lebih cepat</li>
        <li>Proses yang aman dan transparan</li>
      </ul>
    </div>

    <p class="text-justify leading-relaxed">
      Petugas kami akan segera menghubungi Bapak/Ibu untuk memberikan penjelasan lebih lanjut mengenai detail produk dan simulasi angsuran.
    </p>

    <div class="pt-20 flex justify-end">
      <div class="text-center w-64 border-t border-black pt-2">
        <p class="font-bold">Sales Fronting Officer</p>
        <p class="text-xs text-neutral-500">(SFAS System Generated)</p>
      </div>
    </div>
  </div>
</div>
{:else}
<div class="p-20 text-center">Loading document...</div>
{/if}

<style>
  @media print {
    :global(header, footer, nav) {
      display: none !important;
    }
    :global(main) {
       margin: 0 !important;
       padding: 0 !important;
    }
  }
</style>
