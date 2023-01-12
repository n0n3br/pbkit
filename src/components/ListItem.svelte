<script lang="ts">
	interface ListItem {
		id: string;
		description: string;
		done: boolean;
	}

	export let remove: Function;
	export let update: Function;
	export let todo: ListItem;
</script>

<dt>
	<div style="display: flex; gap: 10px">
		<a
			href="/"
			style="text-decoration: none"
			on:click={(e) => {
				e.preventDefault();
				remove(todo.id);
			}}>❌</a
		>
		<a
			href="/"
			style="text-decoration: none"
			on:click={(e) => {
				e.preventDefault();
				update(todo.id, { done: !todo.done });
			}}
		>
			{#if todo.done}
				✅
			{:else}
				⬜
			{/if}
		</a>
		{todo.description}
	</div>
</dt>
