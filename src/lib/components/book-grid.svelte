<script lang="ts">
	import { getBookmarkedBooks, type Kobo } from "$lib/kobo";
	import BookCard from "./book-card.svelte";


    export let kobo: Kobo;

    const booksPromise = getBookmarkedBooks(kobo);
</script>

<div class="container m-auto grid grid-cols-4 m-4 gap-y-8">
    {#await booksPromise then books}
        {#each books as b}
            <BookCard book={b} />
        {/each}
    {/await}
</div>

