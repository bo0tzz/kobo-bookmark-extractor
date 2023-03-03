<script lang="ts">
	import { query } from "../lib/database";
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
    {:then kobo} 
        "Database ready!"
        {kobo}
    {/await}
</div>