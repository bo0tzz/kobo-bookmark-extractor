<script lang="ts">
	import type { PageData } from "./$types";

    export let data: PageData;

    const book = data.book;
</script>

<div class="flex flex-col gap-4 m-4">
    {#each book.bookmarks as b}
            <p>{b.text}<p/>
            <hr />
    {/each}
</div>