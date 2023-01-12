<script lang="ts">
	import { onMount } from 'svelte';

	interface User {
		name: string;
		email: string;
		password: string;
	}
	export let user: User;
	export let updateEmail: Function;
	let email: string;
	let dialog: HTMLDialogElement;
	onMount(() => {
		dialog = document.getElementById('user-dialog') as HTMLDialogElement;
	});
	function handleOpenDialog() {
		if (!dialog) {
			return;
		}
		email = user.email;
		dialog.showModal();
	}
	function handleCloseDialog() {
		if (!dialog) {
			return;
		}
		dialog.close();
	}
</script>

<button on:click={handleOpenDialog}>{user.name}</button>
<dialog id="user-dialog" class="user-dialog">
	<form action="" class="form">
		<div class="form-inputs">
			<label for="name">Name</label>
			<input type="text" name="name" bind:value={user.name} disabled />
			<label for="email">Email</label>
			<input type="text" name="email" bind:value={email} />
		</div>
		<div class="form-buttons">
			<button disabled={email === user.email} on:click={updateEmail(email)}>Change Email</button>
			<button on:click={handleCloseDialog}>Close</button>
		</div>
	</form>
</dialog>

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.form-inputs {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-rows: auto;
		gap: 12px;
	}
	.form-buttons {
		display: flex;
		gap: 12px;
	}
	.form-buttons > button {
		flex: 1;
	}
	.user-dialog {
		width: 600px;
		margin-right: auto;
		margin-left: auto;
	}
</style>
