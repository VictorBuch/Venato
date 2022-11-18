<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	let fileInput;

	function tsvJSON(tsv) {
		console.log('tsvJSON');
		var lines = tsv.split('\n');

		var result = [];

		var headers = lines[0].split('\t');

		for (var i = 1; i < lines.length; i++) {
			var obj = {};
			var currentline = lines[i].split('\t');

			for (var j = 0; j < headers.length; j++) {
				obj[headers[j]] = currentline[j];
			}

			result.push(obj);
		}
		result = result.slice(3, 5);
		result = result.map((food) => {
			return {
				barcode: food['barcode'],
				name: food['name'],
				brands: food['brands'],
				calories_100g: parseFloat(food['calories_100g']),
				calories_serving_size: parseFloat(food['calories_serving_size']),
				carbs_100g: parseFloat(food['carbs_100g']),
				carbs_serving_size: parseFloat(food['carbs_serving_size']),
				fat_100g: parseFloat(food['fat_100g']),
				fat_serving_size: parseFloat(food['fat_serving_size']),
				protein_100g: parseFloat(food['protein_100g']),
				protein_serving_size: parseFloat(food['protein_serving_size']),
				fat_saturated_g_100g: parseFloat(food['fat_saturated_g_100g']),
				fat_saturated_g_serving_size: parseFloat(food['fat_saturated_g_serving_size']),
				fiber_100g: parseFloat(food['fiber_100g']),
				fiber_serving_size: parseFloat(food['fiber_serving_size']),
				sodium_100g: parseFloat(food['sodium_100g']),
				sodium_serving_size: parseFloat(food['sodium_serving_size']),
				sugar_100g: parseFloat(food['sugar_100g']),
				sugar_serving_size: parseFloat(food['sugar_serving_size']),
				cholesterol_100g: parseFloat(food['cholesterol_100g']),
				cholesterol_serving_size: parseFloat(food['cholesterol_serving_size'])
			};
		});
		return result;
	}

	const onFileSelected = async (event: Event) => {
		console.log('onFileSelected');
		let file = event.target.files[0];
		console.log(file);
		let reader = new FileReader();
		reader.onload = async function (e) {
			console.log('reader.onload');
			const text = e.target.result;
			const data = tsvJSON(text);
			console.log(data);
			for (let i = 0; i < data.length; i++) {
				try {
					const { data: food, error } = await supabase.from('meals').insert([data[i]]).select();
					if (error) console.log('error', error);
					console.log('food', food);
				} catch (error) {
					console.log('error', error);
				}
			}
		};
		reader.readAsText(file);
	};
</script>

<input type="file" accept=".csv" on:change={(e) => onFileSelected(e)} bind:this={fileInput} />
