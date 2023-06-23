<script>
    import SetupForm from './setup_form.svelte';
    import Alert from '$lib/ui/alert.svelte';
    export let data;
</script>

<svelte:head>
    <title>JEDI :: Setup</title>
</svelte:head>

<div>
    <h1>Setup</h1>
    {#if data.status.state === "setup"}
    <p>Let's get you started!</p>
    <SetupForm />
    {/if}
    {#if data.status.state !== "setup"}
    <Alert type="info">
        <p>JEDI is already set up.</p> 
        <div ><a href="/dashboard" class="button">Dashboard</a></div>
    </Alert>
    {/if}
</div>