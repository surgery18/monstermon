<!-- src/components/CardModal.vue -->
<template>
	<div id="card-modal" v-if="isVisible" @click.self="closeModal">
		<div class="modal-content">
			<span class="close-button" @click="closeModal">&times;</span>
			<div v-html="card.image"></div>
			<h2>{{ card.name }}</h2>
			<p><strong>Rarity:</strong> {{ card.rarity }}</p>
			<p><strong>Type:</strong> {{ card.type }}</p>
			<p><strong>Attack:</strong> {{ card.attack }}</p>
			<p><strong>HP:</strong> {{ card.hp }}</p>
			<p><strong>Defense:</strong> {{ card.defense }}</p>
			<p><strong>Speed:</strong> {{ card.speed }}</p>
			<p><strong>Description:</strong> {{ card.description }}</p>
			<p><strong>Special:</strong> {{ card.special }}</p>
			<p><strong>Value:</strong> {{ card.value }}</p>
		</div>
	</div>
</template>

<script setup>
	import { ref, watch } from "vue"

	// Props received from parent
	const props = defineProps({
		card: {
			type: Object,
			default: null,
		},
		isVisible: {
			type: Boolean,
			default: false,
		},
	})

	// Emits events to parent component
	const emitParent = defineEmits(["closeCardModal"])

	// Close modal function
	const closeModal = () => {
		emitParent("closeCardModal")
	}
</script>

<style scoped>
	#card-modal {
		display: flex;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.8);
		justify-content: center;
		align-items: center;
		z-index: 2000;
	}

	.modal-content {
		background-color: #fff;
		padding: 20px;
		border-radius: 10px;
		width: 80%;
		max-width: 500px;
		position: relative;
		text-align: center;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.close-button {
		position: absolute;
		top: 10px;
		right: 20px;
		font-size: 24px;
		cursor: pointer;
	}

	.modal-content h2 {
		margin-top: 10px;
		color: #333;
	}

	.modal-content p {
		margin: 5px 0;
		color: #555;
	}
</style>
