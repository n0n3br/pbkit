<script lang="ts">
	import type Pocketbase from 'pocketbase';
	import { error } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	export let pb: Pocketbase;
	const user = writable(pb.authStore.model);

	let email: string;
	let password: string;
	let passwordConfirm: string;
	let name: string;
	let mode: string = 'signIn';
	$: submitButtonLabel = mode === 'signIn' ? 'Sign In' : 'Sign Up';

	onMount(() => {
		if (!pb) {
			throw new Error('Pocketbase instance not defined');
		}
	});

	pb.authStore.onChange(() => user.set(pb.authStore.model));

	function signIn() {
		if (!email || !password) {
			return;
		}
		pb.collection('users')
			.authWithPassword(email, password)
			.catch(() => {
				throw error(500, { message: 'Authentication failed' });
			});
	}

	function signUp() {
		if (!email || !password || !name || passwordConfirm !== password) {
			return;
		}
		pb.collection('users')
			.create({
				email,
				password,
				name,
				passwordConfirm
			})
			.then(() => {
				signIn();
			})
			.catch((e) => {
				throw error(500, { message: 'There was an error creating your account' });
			});
	}

	function signOut() {
		pb.authStore.clear();
	}

	function changeMode(event: MouseEvent) {
		event.preventDefault();
		mode = mode === 'signIn' ? 'signUp' : 'signIn';
	}

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (mode === 'signIn') {
			signIn();
		} else {
			signUp();
		}
	}

	function updateEmail(email: string) {
		pb.collection('users')
			.requestEmailChange(email)
			.catch((e) => {
				throw error(500, { message: 'There was an error on email updating request' });
			});
	}

	interface $$Slots {
		default: {
			user: typeof pb.authStore.model;
			signOut: Function;
		};
		signedOut: { signIn: Function; signUp: Function };
	}
</script>

{#if $user}
	<slot user={$user} {signOut} />
{:else}
	<slot name="signedOut" {signIn} {signUp}>
		<div class="form-container">
			<form action="" on:submit={handleSubmit} class="form">
				<div class="form-grid">
					{#if mode === 'signUp'}
						<!-- <div style="display: flex; gap: 6px;"> -->
						<label for="name" style="flex-grow: 0">Name</label>
						<input
							type="text"
							style="flex-grow: 1"
							required
							minlength="3"
							maxlength="200"
							bind:value={name}
						/>
						<!-- </div> -->
					{/if}
					<!-- <div style="display: flex; gap: 6px;"> -->
					<label for="email" style="flex-grow: 0">Email</label>
					<input type="email" required style="flex-grow: 1" bind:value={email} />
					<!-- </div> -->
					<!-- <div style="display: flex; gap: 6px"> -->
					<label for="password" style="flex-grow: 0">Password</label>
					<input
						type="password"
						style="flex-grow: 1"
						bind:value={password}
						required
						minlength="6"
						maxlength="8"
					/>
					<!-- </div> -->
					{#if mode === 'signUp'}
						<!-- <div style="display: flex; gap: 6px"> -->
						<label for="passwordConfig" style="flex-grow: 0">Confirmation</label>
						<input
							type="password"
							bind:value={passwordConfirm}
							style="flex-grow: 1"
							required
							minlength="6"
							maxlength="8"
						/>
						<!-- </div> -->
					{/if}
				</div>
				<button type="submit">{submitButtonLabel}</button>
				{#if mode === 'signIn'}
					<p>Dont have an account ? Create one <a href="/" on:click={changeMode}>here</a></p>
				{:else}
					<p>
						Already have an account ? You can sign in <a href="/" on:click={changeMode}>here</a>
					</p>
				{/if}
			</form>
		</div>
	</slot>
{/if}

<style>
	.form-container {
		display: flex;
		justify-content: center;
		width: 100vw;
		height: 100vh;
		align-items: center;
	}
	.form {
		min-width: 400px;
		width: 30%;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.form-grid {
		display: grid;
		grid-template-columns: 120px 1fr;
		grid-template-rows: auto;
		align-items: center;
		gap: 12px;
	}
</style>
