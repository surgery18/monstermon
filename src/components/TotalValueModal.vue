<!-- src/components/TotalValueModal.vue -->
<template>
	<div id="total-value-modal" v-if="isVisible" @click.self="closeModal">
		<div class="modal-content">
			<span class="close-button" @click="closeModal">&times;</span>
			<h2>Total Value of Pulled Cards</h2>
			<p id="total-value-content">${{ totalValue }}</p>
		</div>
	</div>
</template>

<script setup>
	import { computed } from "vue"
	import { useAlbumStore } from "../stores/albumStore"

	// Props received from parent component
	const props = defineProps({
		isVisible: {
			type: Boolean,
			default: false,
		},
	})

	// Emits events to parent component
	const emitParent = defineEmits(["closeTotalValueModal"])

	// Access total value from store
	const albumStore = useAlbumStore()
	const totalValue = computed(() => albumStore.totalValue)

	// Close modal function
	const closeModal = () => {
		emitParent("closeTotalValueModal")
	}
</script>

<style scoped>
	#total-value-modal {
		display: flex;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.8);
		justify-content: center;
		align-items: center;
		z-index: 2500;
	}

	.modal-content {
		background-color: #fff;
		padding: 20px;
		border-radius: 10px;
		width: 80%;
		max-width: 400px;
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

	#total-value-content {
		font-size: 18px;
		margin-top: 20px;
		color: #555;
	}
</style>
