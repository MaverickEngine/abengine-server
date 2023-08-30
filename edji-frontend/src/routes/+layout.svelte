<script>
	import { page } from '$app/stores';
	import '../app.postcss';
	import './styles.css';

	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	
	let logged_in = false;
	let session;
	$: {
		session = $page.data?.session;
		logged_in = (session.token);
	}

</script>

<div class="app min-h-screen flex flex-col">
	<Header logged_in={logged_in} />
	<main class="min-w-full grow">
		<slot />
	</main>
	<Footer />
</div>