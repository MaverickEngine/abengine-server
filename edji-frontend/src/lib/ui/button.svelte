<script>
	export let type = 'button';
	export let disabled = false;
</script>

<button {disabled}
	{type}
	class:cursor-not-allowed = {disabled}
	class:opacity-50 = {disabled}
	class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
>
	<slot />
</button>