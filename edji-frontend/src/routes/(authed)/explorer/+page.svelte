<script>
    export let data;
    console.log(data);
</script>

<h1>Explorer</h1>
{#each data.collections as collection}
    <p><a href="/explorer/{collection.model}">{collection.model}</a></p>
{/each}