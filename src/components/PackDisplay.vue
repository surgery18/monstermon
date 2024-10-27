<!-- src/components/PackDisplay.vue -->
<template>
	<div id="packs-container">
		<div
			v-for="pack in packs"
			:key="pack.id"
			class="pack"
			@click="openPack(pack)">
			<div class="pack-name">{{ pack.name }}</div>
			<div class="pack-type">{{ pack.type }}</div>
			<div class="pack-art" v-html="pack.art"></div>
			<div class="pack-color" :style="{ backgroundColor: pack.color }"></div>
		</div>
	</div>
</template>

<script setup>
	import { ref } from "vue"
	// import { usePackStore } from "../stores/packStore" // Optional: If you manage packs via store

	// Sample packs data
	const packs = ref([
		{
			id: 1,
			name: "Monstermon",
			type: "Basic Pack",
			art: `
            <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="#FFD700" stroke="#000" stroke-width="3"/>
                <circle cx="35" cy="40" r="5" fill="#000"/>
                <circle cx="65" cy="40" r="5" fill="#000"/>
                <path d="M35,60 Q50,75 65,60" stroke="#000" stroke-width="3" fill="none"/>
            </svg>
        `,
			color: "blue",
		},
		// {
		// 	id: 2,
		// 	name: "Monstermon",
		// 	type: "Basic Pack",
		// 	art: `
		//         <svg width="100" height="100" viewBox="0 0 100 100">
		//             <circle cx="50" cy="50" r="40" fill="#FF6347" stroke="#000" stroke-width="3"/>
		//             <circle cx="35" cy="40" r="5" fill="#000"/>
		//             <circle cx="65" cy="40" r="5" fill="#000"/>
		//             <path d="M35,60 Q50,75 65,60" stroke="#000" stroke-width="3" fill="none"/>
		//         </svg>
		//     `,
		// 	color: "blue",
		// },
		// Add more packs as needed
	])

	// Emit an event when a pack is clicked
	const emit = defineEmits(["packOpened"])

	const openPack = (pack) => {
		emit("packOpened", pack)
	}
</script>

<style scoped>
	/* Styles similar to your original CSS */
	#packs-container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		margin: 20px;
	}

	.pack {
		border: 2px solid #000;
		border-radius: 10px;
		width: 150px;
		height: 250px;
		margin: 10px;
		padding: 10px;
		background-color: #fff;
		position: relative;
		cursor: pointer;
		transition: transform 0.3s, box-shadow 0.3s;
	}

	.pack:hover {
		transform: scale(1.05);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.pack-name {
		font-weight: bold;
		font-size: 18px;
		margin-bottom: 5px;
	}

	.pack-type {
		font-size: 14px;
		margin-bottom: 10px;
	}

	.pack-art {
		margin-bottom: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 120px;
	}

	.pack-color {
		width: 100%;
		height: 20px;
		position: absolute;
		bottom: 0;
		left: 0;
		border-bottom-left-radius: 8px;
		border-bottom-right-radius: 8px;
	}
</style>
