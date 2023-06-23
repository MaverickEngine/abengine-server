<script>
    import LoginForm from './login_form.svelte';
    import Alert from '$lib/ui/alert.svelte';
    export let data;
    export let form;
</script>

<svelte:head>
    <title>JEDI :: Login</title>
</svelte:head>

<div class="container">
    <h1>Login</h1>
    {#if form?.login_error}
    <Alert type="error">
        <p>{form.login_error}</p>
    </Alert>
    {/if}
    <LoginForm />
</div>