<script lang="ts">
	import BookGrid from "$lib/components/book-grid.svelte";
	import { books } from "$lib/stores/local-storage";
</script>

<BookGrid books={$books}/>