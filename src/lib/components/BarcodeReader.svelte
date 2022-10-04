<script>
	import { Html5Qrcode } from 'html5-qrcode';
	import { onMount, onDestroy } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let html5Qrcode;

	onMount(init);

	onDestroy(() => {
		html5Qrcode.stop();
	});
	function init() {
		html5Qrcode = new Html5Qrcode('reader');
		start();
	}

	function start() {
		html5Qrcode.start(
			{ facingMode: 'environment' },
			{
				fps: 10,
				qrbox: { width: 250, height: 250 },
				aspectRatio: 1
			},
			onScanSuccess,
			onScanFailure
		);
	}

	async function stop() {
		await html5Qrcode.stop();
	}

	async function onScanSuccess(decodedText, decodedResult) {
		console.log(decodedText);

		const { data, error } = await supabase
			.from('meals')
			.select()
			.match({ barcode: decodedText })
			.single();
		if (data) {
			console.log(data);
			goto(`/track-food/${$page.params.mealType}-${data.id}`);
		} else {
			console.log(error);
		}
	}

	function onScanFailure(error) {
		// console.warn(`Code scan error = ${error}`);
	}
</script>

<main>
	<reader id="reader" />
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20px;
		height: 100vh;
		width: 100vw;
	}
	reader {
		width: 100%;
		background-color: black;
	}
</style>
