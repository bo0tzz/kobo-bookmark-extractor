<script lang="ts">
    const doLog = async () => {
        const handle = await window.showDirectoryPicker({id: 'kobo-root'});
        console.log(handle);
        const file = await handle.getFileHandle("KoboReader.sqlite");
        console.log(file);
    }
</script>

<div class="container mx-auto p-4">
    <button class="btn" on:click={doLog}>Do the thing</button>
</div>