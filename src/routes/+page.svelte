<script lang="ts">
	let { data } = $props();

	console.log(data.loadEventSerialized)
</script>

<h1>ServerLoadEvent keys</h1>
<pre>{data.keys
		.map(
			({ status, key, type1, type2 }) =>
				`${status} ${key.padEnd(16)} ${type1.padEnd(9)} ${type1 === type2 ? '' : type2}`
		)
		.join('\n')}</pre>

<h1>ServerLoadEvent</h1>
<pre>{JSON.stringify(data.loadEventSerialized, null, 4)}</pre>
