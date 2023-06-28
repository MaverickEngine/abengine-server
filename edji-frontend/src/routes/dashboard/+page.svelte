<script>
    import Alert from '$lib/ui/alert.svelte';
	export let data;
</script>

<svelte:head>
	<title>EDJI :: Dashboard</title>
	<meta name="description" content="A modern, ready-to-go Restful back-end" />
</svelte:head>
<div class="container">
	<h1>Dashboard</h1>
	<section>
		{JSON.stringify(data)}
        {#if data.status.state === "error"}
        	<Alert type="error" message={data.status.message} />
        {/if}
        {#if data.status.state === "up"}
            <h2>Dashboard</h2>
        {/if}
		{#if data.status.state === "unknown"}
            <h2>Checking status...</h2>
        {/if}
        {#if data.status.state === "setup"}
            <h2>Setup</h2>
			<p>The server is not set up. <a href="/setup">Set up now?</a></p>
        {/if}
        {#if data.status.state === "down"}
            <h2>Something is wrong!</h2>
        {/if}
	</section>
</div>
<style>

	.container {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100vh;
	}

	.welcome {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 300px;
		margin-top: 50px;
	}

	.welcome img {
		position: absolute;
		width: auto;
		height: 250px;
		top: 0;
		display: block;
	}
</style>
