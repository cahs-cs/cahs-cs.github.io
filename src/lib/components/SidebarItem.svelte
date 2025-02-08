<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  import type { Page } from '$lib/types/sidebar';
  import SidebarItem from './SidebarItem.svelte';

  export let item: Page;

  let currentPath = '';
  $: currentPath = get(page).url.pathname;

  let expanded = false;

  onMount(() => {
    if (currentPath.startsWith(item.route) && item.route !== '/') {
      expanded = true;
    }
  });

  function handleClick() {
    if (item.children && item.children.length) {
      expanded = !expanded;
    } else {
      window.location.href = item.route;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }
</script>

<div class="mb-2">
  <div 
    role="button"
    tabindex="0"
    aria-expanded={item.children ? expanded : undefined}
    class="flex items-center bg-gray-200 p-4 rounded-lg cursor-pointer"
    on:click={handleClick}
    on:keydown={handleKeydown}
  >
    {#if item.children && item.children.length}
      <span class="mr-2 text-gray-800">
        {#if expanded}
          -
        {:else}
          +
        {/if}
      </span>
    {/if}
    <a 
      href={item.route} 
      on:click|stopPropagation 
      class="flex-grow hover:underline"
    >
      <span class="font-semibold">{item.title}</span>
    </a>
  </div>
  {#if item.children && item.children.length && expanded}
    <div class="ml-8 mt-2 space-y-4">
      {#each item.children as child}
        <SidebarItem item={child} />
      {/each}
    </div>
  {/if}
</div>