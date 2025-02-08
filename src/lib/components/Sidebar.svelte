<script lang="ts">
  import SidebarItem from './SidebarItem.svelte';
  import type { Page } from '$lib/types/sidebar';

  export let pages: Page[] = [];
  let showMobile = false;
  function toggleMobile() {
    showMobile = !showMobile;
  }

  export let showDesktop: boolean;
  export let toggleDesktop: () => void;
</script>

<!-- Mobile header with hamburger -->
<div class="md:hidden fixed top-0 left-0 w-full bg-gray-800 text-white p-4 z-50 flex items-center">
  <button
    on:click={toggleMobile}
    aria-label="Toggle sidebar"
    class="mr-4 focus:outline-none"
  >
    ☰
  </button>
  <span class="font-mono text-lg">Mr. Mankin's Classroom</span>
</div>

<!-- Mobile sidebar (overlay) -->
{#if showMobile}
  <div
    class="fixed inset-0 bg-black opacity-50 z-40"
    on:click={toggleMobile}
    aria-hidden="true"
  ></div>
{/if}
<div
  class="fixed top-0 left-0 h-full w-64 bg-gray-100 font-mono overflow-y-auto z-50 transition-transform transform md:hidden"
  style:transform={showMobile ? 'translateX(0)' : 'translateX(-100%)'}
>
  <div class="p-4 border-b border-gray-300 flex justify-between items-center">
    <span class="font-bold">Mr. Mankin's Classroom</span>
    <button
      on:click={toggleMobile}
      aria-label="Close sidebar"
      class="px-2 py-1 text-gray-800 focus:outline-none"
    >
      ✕
    </button>
  </div>
  <div class="p-4 space-y-4">
    {#each pages as item}
      <SidebarItem item={item} />
    {/each}
  </div>
</div>

<!-- Desktop sidebar -->
<div class="hidden md:block fixed top-0 left-0 h-full w-64 bg-gray-100 font-mono overflow-y-auto p-4 transition-transform duration-300"
  style:transform={showDesktop ? 'translateX(0)' : 'translateX(-100%)'}>
  <div class="flex justify-between items-center mb-4">
    <span class="font-bold">Mr. Mankin's Classroom</span>
    <button
      on:click={toggleDesktop}
      aria-label="Close sidebar"
      class="text-gray-800 focus:outline-none"
    >
      ✕
    </button>
  </div>
  {#each pages as item}
    <SidebarItem item={item} />
  {/each}
</div>