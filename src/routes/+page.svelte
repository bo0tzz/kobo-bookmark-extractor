<script lang="ts">
	import { goto } from "$app/navigation";
	import { koboState } from "$lib/stores/kobo-state";
    import { loadKoboDatabase, type Kobo } from "../lib/kobo";

    const initKoboAccess = async () => {
        const k = await loadKoboDatabase();
        koboState.set(k);
        goto('/books')
    }
</script>

<div class="container mx-auto p-4">
    <button class="btn" on:click={initKoboAccess}>Upload</button>
</div>