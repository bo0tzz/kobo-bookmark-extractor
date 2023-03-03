<script lang="ts">
	import { query } from "../lib/database";
	import { loadKoboDatabase } from "../lib/kobo";


    const doUpload = async () => {
        const kobo = await loadKoboDatabase();
        
        const res = await query(kobo.database, "select * from Bookmark;");
        console.log(res);
    }
</script>

<div class="container mx-auto p-4">
    <button class="btn" on:click={doUpload}>Upload</button>
</div>