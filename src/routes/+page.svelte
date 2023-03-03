<script lang="ts">
	import BookGrid from "$lib/components/book-grid.svelte";
import { loadKoboDatabase, type Kobo } from "../lib/kobo";

    // This is probably a gross hack
    let resolveKobo: (value: Kobo) => void;
    let koboPromise: Promise<Kobo> = new Promise((resolve, _) => resolveKobo = resolve);

    const initKoboAccess = async () => {
        const k = await loadKoboDatabase();
        resolveKobo(k);
    }
</script>

<div class="container mx-auto p-4">
    {#await koboPromise}
        <button class="btn" on:click={initKoboAccess}>Upload</button>
    {:then k} 
        <BookGrid kobo={k} />
    {/await}
</div>