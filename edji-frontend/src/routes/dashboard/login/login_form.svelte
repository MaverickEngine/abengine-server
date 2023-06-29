<script>
    import Input from '$lib/ui/input.svelte';
    import Button from '$lib/ui/button.svelte';
</script>

<form method="POST">
    <Input label="Email" type="email" name="email" id="email" />
    <Input label="Password" type="password" name="password" id="password" />
    <Button type="submit">Login</Button>
</form>