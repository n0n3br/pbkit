<script lang="ts">
	import { PbApp, PbCollection, PbDocument, PbUser } from '$lib';
	import ErrorDialog from '../components/ErrorDialog.svelte';
	import ListItem from '../components/ListItem.svelte';
	import CreateItem from '../components/CreateItem.svelte';
	import UserDialog from '../components/UserDialog.svelte';
	let isSignIn = true;
	let name: string;
	let email: string;
	let password: string;
	let passwordConfirm: string;

	function modeChangeHandler(e: MouseEvent) {
		e.preventDefault();
		isSignIn = !isSignIn;
	}
</script>

<PbApp url="http://127.0.0.1:8090" let:pb>
	<PbUser {pb} let:user let:signOut>
		<nav>
			<span>Hello {user?.name}</span>
			<button on:click={signOut()}>Sign Out</button>
		</nav>

		<div slot="signedOut" let:signIn let:signUp>
			<form
				on:submit={isSignIn
					? signIn(email, password)
					: signUp(name, email, password, passwordConfirm)}
			>
				{#if !isSignIn}
					<input type="text" placeholder="Name" minlength="5" required />
				{/if}
				<input type="email" placeholder="Email" required />
				<input type="password" placeholder="Password" required minlength="6" />
				{#if !isSignIn}
					<input type="password" placeholder="Password config" minlength="6" required />
				{/if}
				<button type="submit">{isSignIn ? 'Sign In' : 'Sign Up'}</button>
				<a href="/" on:click={modeChangeHandler}>{isSignIn ? 'Create account' : 'Sign In'}</a>
			</form>
		</div>
		<PbCollection
			{pb}
			name="todos"
			let:data
			filter={`user='${user?.id}'`}
			let:update
			let:remove
			let:create
		>
			<nav>
				<div class="brand">Todo App</div>
				{#if user}
					<div class="menu">
						<CreateItem {create} userId={user?.id} />
						<PbDocument collection="users" id={user?.id} {pb} let:document>
							<UserDialog user={document} />
						</PbDocument>
						<button on:click={signOut()}>Sign Off </button>
					</div>
				{/if}
			</nav>
			{#if user}
				<main>
					<article class="card">
						<header>Todos</header>

						<dl style="padding: 0 2em 1em">
							{#each data ?? [] as todo}
								<ListItem {remove} {update} {todo} />
							{/each}
						</dl>
					</article>
				</main>
			{/if}
		</PbCollection>
	</PbUser>
	<ErrorDialog />
</PbApp>

<style>
	.menu {
		display: flex;
		gap: 12px;
	}
	main {
		padding-top: 60px;
		max-width: 960px;
		margin-right: auto;
		margin-left: auto;
	}
</style>
