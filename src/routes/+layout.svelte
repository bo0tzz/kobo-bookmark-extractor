<script lang="ts">
	import { page } from "$app/stores";
	import { books } from "$lib/stores/local-storage";
    import { importKobo } from "../lib/kobo";

    const clearData = async () => {
        if (confirm("Are you sure you want to clear all data?")) {
            books.set({});
        }
    }
</script>

<div class="m-4">

    <div class="navbar bg-base-200 rounded-lg">
        <div class="navbar-start">
            <a href="/" class="btn btn-ghost normal-case text-xl">Kobo Slurper</a>
        </div>
        {#if $page.data.meta}
        <div class="navbar-center">
            <p class="btn btn-ghost pointer-events-none normal-case text-xl">
                {$page.data.meta.title}
            </p>
        </div>
        {/if}
        <div class="navbar-end gap-4">
            <button class="btn" on:click={importKobo}>Import Kobo data</button>
            <button class="btn" on:click={clearData}>Clear data</button>
        </div>
    </div>

    <slot />
</div>