<script lang="ts">
	import { onMount } from 'svelte';
	onMount(() => {
		window.onunhandledrejection = (e) => {
			alert(e.reason.body.message);
		};
	});
</script>
