<script lang="ts">
	import { books } from "$lib/stores/local-storage";
	import BookCard from "./book-card.svelte";

    console.log($books)
</script>

<div class="container m-auto grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 m-4 gap-y-8">
    {#each Object.values($books) as book}
        <BookCard book={book} />
    {/each}
</div>

