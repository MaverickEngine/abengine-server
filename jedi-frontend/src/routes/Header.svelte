<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/jedi.svg';
	import github from '$lib/images/github.svg';
</script>

<header>
	<div class="corner">
		<a href="/">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div>

	<nav>
		<ul>
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Home</a>
			</li>
			<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
				<a href="/about">About</a>
			</li>
			<li aria-current={$page.url.pathname.startsWith('/docs') ? 'page' : undefined}>
				<a href="/docs">Docs</a>
			</li>
		</ul>
	</nav>

	<div class="corner">
		<a href="https://github.com/j-norwood-young/jedi">
			<img class="github" src={github} alt="GitHub" />
		</a>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		background-color: rgb(50, 50, 50);
	}

	.corner {
		width: 6em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 5em;
		height: 3em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		color: white;
	}

	svg {
		width: 6em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: rgb(230, 230, 230);
		font-weight: 600;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}

	.github {
		filter: invert(81%) sepia(93%) saturate(1%) hue-rotate(352deg) brightness(100%) contrast(95%);
	}
</style>
