<script lang="ts">
	import type Pocketbase from 'pocketbase';
	import { error } from '@sveltejs/kit';
	export let pb: Pocketbase;
	export let collection: string;
	export let id: string;
	let document: Object;
	let loading = false;
	$: {
		loading = true;
		pb.collection(collection)
			.getOne(id)
			.then((data) => (document = data))
			.then(() => (loading = false))
			.catch((e) => {
				throw error(500, {
					message: `There was an error retrieving document ${id} from collection ${collection}`
				});
			});
	}

	interface $$SLots {
		default: { document: any };
		loading: {};
	}
</script>

{#if loading}
	<slot name="loading" />
{:else if document}
	<slot {document} />
{/if}
