<script lang="ts">
	import type { Book } from "$lib/kobo";
	import BookCard from "./book-card.svelte";

    export let books: Book[];
</script>

<div class="container m-auto grid grid-cols-4 m-4 gap-y-8">
    {#each books as b}
        <BookCard book={b} />
    {/each}
</div>

