<script>
    import SetupForm from './setup_form.svelte';
    import Alert from '$lib/ui/alert.svelte';
    export let data;
</script>

<svelte:head>
    <title>EDJI :: Setup</title>
</svelte:head>

<div class="block">
    <h1>Setup</h1>
    {#if data.status.state === "setup"}
    <h3>This looks like the first time you're using this instance of EDJI.</h3>
    <h3>Let's get you started!</h3>
    <SetupForm />
    {/if}
    {#if data.status.state !== "setup"}
    <Alert type="info">
        <p>EDJI is already set up.</p> 
        <div ><a href="/dashboard" class="button">Dashboard</a></div>
    </Alert>
    {/if}
</div>