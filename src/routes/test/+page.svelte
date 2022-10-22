<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	let fileInput;

	const getProportionateMacros = (value, serving_size) => {
		return parseFloat(((value * serving_size.replace(/\D/g, '')) / 100).toFixed(2));
	};
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
		console.log(result);

		// fileter out objects with no code or where code is not a number and no product_name_en
		result = result.filter(
			(food) =>
				food.code &&
				!isNaN(food.code) &&
				food.product_name_en &&
				food.product_name_en.length > 0 &&
				food.product_name_en.match(/([A-z])\w+/g) &&
				food['energy-kcal_value'] &&
				food.serving_size &&
				food.proteins_value &&
				food.carbohydrates_value &&
				food.fat_value
		);
		console.log(result.slice(100, 100));
		// TODO: handle portion units g and ml and such
		result = result.map((food) => {
			return {
				barcode: food.code,
				name: food.product_name_en,
				brands: food.brands,
				nutrition_grade: food['off:nutriscore_grade'],
				calories_100g: parseInt(food['energy-kcal_value']),
				portion: parseInt(food.serving_size.replace(/\D/g, '')),
				calories_serving_size: getProportionateMacros(food['energy-kcal_value'], food.serving_size),
				carbs: getProportionateMacros(food.carbohydrates_value, food.serving_size),
				fat: getProportionateMacros(food.fat_value, food.serving_size),
				fat_saturated_g: parseInt(food['saturated-fat_value']),
				protein: getProportionateMacros(food.proteins_value, food.serving_size),
				sodium_mg: food?.sodium_value.length
					? getProportionateMacros(food.sodium_value, food.serving_size) * 1000
					: null,
				sugar_g: food?.sugars_value.length
					? getProportionateMacros(food.sugars_value, food.serving_size)
					: null,
				cholesterol_mg: food?.cholesterol_value.length
					? getProportionateMacros(food.cholesterol_value, food.serving_size) * 1000
					: null,
				fiber_g: food?.fiber_value.length
					? getProportionateMacros(food.fiber_value, food.serving_size)
					: null,
				potassium_mg: food?.potassium_value.length
					? getProportionateMacros(food.potassium_value, food.serving_size) * 1000
					: null
			};
		});
		return result; //JSON
	}
	const onFileSelected = async (event: Event) => {
		let file = event.target.files[0];
		console.log(file);
		let reader = new FileReader();
		reader.onload = async function (e) {
			console.log(e.target.result);
			const text = e.target.result;
			const data = tsvJSON(text);
			console.log(data);
			// for (let i = 0; i < data.length; i++) {
			// 	const { data: food, error } = await supabase.from('meals').insert([data[i]]);
			// 	if (error) console.log('error', error);
			// 	console.log('food', food);
			// }
		};
		reader.readAsText(file);
	};
</script>

<input type="file" accept=".csv" on:change={(e) => onFileSelected(e)} bind:this={fileInput} />
