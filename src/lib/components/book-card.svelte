<script lang="ts">
	import type { Book } from "$lib/kobo";
    import cover from '$lib/assets/cover.jpg';

    export let book: Book;

    const coverImage = book.cover || cover;
</script>

<a href={`/books/${encodeURIComponent(book.id)}`} class="card w-64 bg-neutral shadow-xl">
    <figure><img src={coverImage} alt="Cover" /></figure>
    <div class="card-body">
        <h2 class="card-title">{book.title}</h2>
        <p>{book.author}</p>
    </div>
</a>