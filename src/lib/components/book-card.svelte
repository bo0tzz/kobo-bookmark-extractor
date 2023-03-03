<script lang="ts">
	import type { Book } from "$lib/kobo";
    import cover from '$lib/assets/cover.jpg';

    export let book: Book;
</script>

<div class="card w-64 bg-neutral shadow-xl">
    <figure><img src={cover} alt="Cover" /></figure>
    <div class="card-body">
        <h2 class="card-title">{book.BookTitle}</h2>
    </div>
</div>