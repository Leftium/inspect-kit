<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import './app.css';
	import Inspect, {
		InspectOptionsProvider,
		setGlobalInspectOptions,
		type InspectOptions
	} from 'svelte-inspect-value';

	let { data } = $props();

	const { loadEventSerialized } = data;

	let globalConfig: Partial<InspectOptions> = $state({
		borderless: true,
		//expandLevel: 2,
		expandAll: true,
		search: 'filter-strict',
		theme: '',
		noanimate: true,
		previewDepth: 0,
		quotes: 'none',
		showLength: false,
		showTypes: false,
		//heading: 'loadEventSerialized',
		showPreview: false,
		heading: heading
		//stringCollapse: 20
	});

	setGlobalInspectOptions(() => globalConfig);

	//console.log(data.loadEventSerialized);

	function stopPropagation(...events: string[]): Attachment {
		return (element) => {
			const abortController = new AbortController();
			const { signal } = abortController;

			for (const event of events) {
				element.addEventListener(event, (e) => e.stopPropagation(), { signal });
			}

			return () => {
				abortController.abort();
			};
		};
	}
</script>

{#snippet heading(collapsed: boolean)}
	<b style:margin-right="2em">loadEventSerialized</b>

	<label {@attach stopPropagation('click')}>
		<input
			type="checkbox"
			bind:checked={globalConfig.showTypes}
			{@attach stopPropagation('click')}
		/>
		Types
	</label>

	<label {@attach stopPropagation('click')}>
		<input
			type="checkbox"
			bind:checked={globalConfig.showLength}
			{@attach stopPropagation('click')}
		/>
		Lengths
	</label>

	<label {@attach stopPropagation('click')}>
		<input
			type="checkbox"
			checked={globalConfig.quotes === 'single'}
			onclick={(e) => {
				globalConfig.quotes = globalConfig.quotes === 'single' ? 'none' : 'single';
				e.stopPropagation();
			}}
		/>
		Quotes
	</label>

	<button
		onclick={(e) => {
			if (!globalConfig.showTypes || !globalConfig.showLength || globalConfig.quotes === 'none') {
				globalConfig.showTypes = globalConfig.showLength = true;
				globalConfig.quotes = 'single';
			} else {
				globalConfig.showTypes = globalConfig.showLength = false;
				globalConfig.quotes = 'none';
			}
			e.stopPropagation();
		}}>Toggle All</button
	>
{/snippet}

<div>
	<h1>ServerLoadEvent keys</h1>
	<pre>{data.keys
			.map(
				({ status, key, type1, type2 }) =>
					`${status} ${key.padEnd(16)} ${type1.padEnd(9)} ${type1 === type2 ? '' : type2}`
			)
			.join('\n')}</pre>
</div>

<main class="inspect">
	<Inspect value={loadEventSerialized} />
</main>

<div hidden>
	<h1>ServerLoadEvent</h1>
	<pre>{JSON.stringify(data.loadEventSerialized, null, 4)}</pre>
</div>

<style>
	.inspect {
		--base00: #fdf6e3;
		--base01: #eee8d5;
		--base02: #93a1a1;
		--base03: #839496;
		--base04: #657b83;
		--base05: #586e75;
		--base06: #073642;
		--base07: #002b36;
		--base08: #dc322f;
		--base09: #cb4b16;
		--base0A: #b58900;
		--base0B: #859900;
		--base0C: #2aa198;
		--base0D: #268bd2;
		--base0E: #6c71c4;
		--base0F: #d33682;
	}

	/* Override for dark mode */
	@media (prefers-color-scheme: dark) {
		.inspect {
			--base00: #002b36;
			--base01: #073642;
			--base02: #586e75;
			--base03: #657b83;
			--base04: #839496;
			--base05: #93a1a1;
			--base06: #eee8d5;
			--base07: #fdf6e3;
			--base08: #dc322f;
			--base09: #cb4b16;
			--base0A: #b58900;
			--base0B: #859900;
			--base0C: #2aa198;
			--base0D: #268bd2;
			--base0E: #6c71c4;
			--base0F: #d33682;
		}
	}

	.inspect {
		:global(.bullet, .type, .count) {
			opacity: 0.3;
		}
		:global(.bullet) {
			opacity: 0.1;
		}

		/* Color quoted strings the same */
		:global(.key.quotedstring) {
			color: inherit;
		}

		/* Hide weird bug/glitch in svelte-inspect-value */
		:global(.indent, .body) {
			overflow: inherit;
		}

		--inspect-font-size: 14px;
		--inspect-font: fira code, monospace;

		--delimiter-color: var(--base02);
	}
</style>
