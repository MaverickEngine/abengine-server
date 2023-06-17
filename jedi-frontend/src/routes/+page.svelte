<script>
	import jedi_img_svg from '$lib/images/jedi.svg';
</script>

<svelte:head>
	<title>JEDI</title>
	<meta name="description" content="A modern, ready-to-go Restful back-end" />
</svelte:head>
<div class="container">
	<section class="welcome">
		<img class="logo" src={jedi_img_svg} alt="JEDI" />
	</section>

	<section>
		<h2>A no-fuss, full-featured Restful back-end.</h2>
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
