<script lang="ts">
	export let radius: number;
	export let percent: number;
	export let percentOver: number;
	export let stroke: number;
	export let number: number | undefined;
	export let text: string | undefined;
</script>

<div class="relative" width={radius} height={radius}>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width={radius} height={radius}>
		<g id="circles" stroke-width={stroke}>
			<circle class="stroke-gray-600" r="16" cx="18" cy="18" fill="none" />
			{#if percent > 0}
				<circle
					class="-rotate-90 stroke-accent"
					style="	transform-origin: 50% 50%;
			stroke-dashoffset: {100 - percent}"
					r="16"
					cx="18"
					cy="18"
					fill="none"
					stroke-dasharray="100 100"
					id="circle-meter"
				/>
			{/if}

			{#if percentOver > 1}
				<circle
					class="-rotate-90   stroke-orange-400"
					style="	transform-origin: 50% 50%;
			stroke-dashoffset: {percentOver * -1}"
					r="16"
					cx="18"
					cy="18"
					fill="none"
					stroke-dasharray="100 100"
					id="circle-meter"
				/>
			{/if}
		</g>
	</svg>
	<div
		class="absolute inset-0 flex flex-col items-center justify-center text-2xl text-neutral-content"
	>
		{#if number}
			<p>{number}</p>
		{/if}
		{#if text}
			<p>{text}</p>
		{/if}
	</div>
</div>
