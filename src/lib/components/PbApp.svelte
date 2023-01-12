<script lang="ts">
	import { pbStore } from '$lib/store/pbStore';
	import Pocketbase from 'pocketbase';
	export let url: string;
	const pb = new Pocketbase(url);
	pbStore.set({ pb });
	interface $$Slot {
		default: {
			pb: Pocketbase;
		};
	}
</script>

<slot {pb} />
