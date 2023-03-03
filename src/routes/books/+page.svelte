<script lang="ts">
	import BookGrid from "$lib/components/book-grid.svelte";
	import { getBookmarkedBooks } from "$lib/kobo";
	import { koboState } from "$lib/stores/kobo-state";

    const getBooks = async () => {
        return await getBookmarkedBooks($koboState!);
    };
</script>

{#await getBooks() then b}
    <BookGrid books={b}/>
{/await}