<script lang="ts">
	export let create: Function;
	export let userId: string;
	let description: string;
</script>

<form class="form">
	<input type="text" placeholder="Create todo" bind:value={description} />
	<button
		on:click={() => {
			create({ description, done: false, user: userId });
			description = '';
		}}
		disabled={!description || description?.length < 3}>Add</button
	>
</form>

<style>
	.form {
		display: flex;
		gap: 12px;
		align-items: center;
	}
</style>
