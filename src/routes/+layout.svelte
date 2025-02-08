<script lang="ts">
  import '../app.css';
  import Sidebar from '$lib/components/Sidebar.svelte';

  export let data: { pages: any };

  let showSidebarDesktop = true;
  function toggleDesktopSidebar() {
    showSidebarDesktop = !showSidebarDesktop;
  }
</script>

<div class="min-h-screen font-mono">
  <Sidebar pages={data.pages} showDesktop={showSidebarDesktop} toggleDesktop={toggleDesktopSidebar} />
  <main class={`pt-16 md:pt-4 transition-all duration-300 ${showSidebarDesktop ? 'md:ml-96' : 'md:ml-0'}`}>
    {#if !showSidebarDesktop}
      <button 
        on:click={toggleDesktopSidebar}
        class="hidden md:block fixed top-4 left-4 z-50 bg-[#44475a] text-white p-2 rounded focus:outline-none"
        aria-label="Open sidebar"
      >
        ☰
      </button>
    {/if}
    <article class="p-4 max-w-3xl mx-auto">
      <slot />
    </article>
  </main>
</div>
