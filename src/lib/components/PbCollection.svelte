<script lang="ts">
	interface Config {
		filter: string;
		sort: string;
	}

	interface $$Slots {
		default: {
			data: any[];
			collection: string;
			count: number;
			update: Function;
			remove: Function;
			create: Function;
		};
		loading: {};
		error: { error: string };
	}
	import type Pocketbase from 'pocketbase';
	import { error } from '@sveltejs/kit';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	export let pb: Pocketbase;
	export let name: string;
	export let filter: string | undefined = undefined;
	export let sort: string | undefined = undefined;

	const config = Object.fromEntries(
		Object.entries({
			filter,
			sort
		}).filter(([_, v]) => v)
	);
	const store = writable([] as any[]);
	let loading = true;

	onMount(() => {
		pb.collection(name)
			.getFullList(200, config)
			.then((initialData) => {
				loading = false;
				store.set(initialData);
			})
			.catch((e) => {
				throw error(500, {
					message: `There was an error retrieving documents from collection ${name}`
				});
			});

		pb.collection(name)
			.subscribe('*', async ({ action, record }) => {
				switch (action) {
					case 'create':
						store.update((data) => [...data, record]);
						break;
					case 'update':
						store.update((data) => data.map((d) => (d.id === record.id ? record : d)));
						break;
					case 'delete':
						store.update((data) => data.filter((d) => d.id !== record.id));
						break;
				}
			})
			.catch((e) => {
				throw error(500, {
					message: `There was an error retrieving documents from collection ${name}`
				});
			});
	});
	function update(id: string, data: object) {
		pb.collection(name)
			.update(id, data)
			.catch((e) => {
				throw error(500, {
					message: `There was an error updating documents ${id} from collection ${name}`
				});
			});
	}
	function remove(id: string) {
		pb.collection(name)
			.delete(id)
			.catch((e) => {
				throw error(500, {
					message: `There was an error deleting document ${id} from collection ${name}`
				});
			});
	}
	function create(data: object) {
		pb.collection(name)
			.create(data)
			.catch((e) => {
				throw error(500, {
					message: `There was an error creating a document on collection ${name}`
				});
			});
	}
</script>

{#if pb}
	{#if loading}
		<slot name="loading" />
	{:else}
		<slot data={$store} collection={name} count={$store.length ?? 0} {update} {remove} {create} />
	{/if}
{/if}
