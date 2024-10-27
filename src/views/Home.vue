<!-- src/views/Home.vue -->
<template>
	<div>
		<h1>Monstermon Pack Opening System</h1>

		<!-- Pack Display Section -->
		<PackDisplay v-if="!isOpening" @packOpened="handlePackOpened" />

		<!-- Pack Opening Overlay -->
		<PackOpeningOverlay
			v-if="isOpening"
			:isVisible="isOpening"
			:pack="currentPack"
			@showTotalValue="showTotalValueModal" />

		<!-- Album Section -->
		<h2>Your Album</h2>
		<Album @openCardModal="openCardModal" />

		<!-- Card Detail Modal -->
		<CardModal
			v-if="isCardModalVisible"
			:card="selectedCard"
			:isVisible="isCardModalVisible"
			@closeCardModal="closeCardModal" />

		<!-- Total Value Modal -->
		<TotalValueModal
			v-if="isTotalValueModalVisible"
			:isVisible="isTotalValueModalVisible"
			@closeTotalValueModal="closeTotalValueModal" />
	</div>
</template>

<script setup>
	import { ref } from "vue"
	import PackDisplay from "../components/PackDisplay.vue"
	import PackOpeningOverlay from "../components/PackOpeningOverlay.vue"
	import Album from "../components/Album.vue"
	import CardModal from "../components/CardModal.vue"
	import TotalValueModal from "../components/TotalValueModal.vue"
	import { useAlbumStore } from "../stores/albumStore"

	// State to control pack opening overlay visibility
	const isOpening = ref(false)
	const currentPack = ref(null)

	// State for card modal
	const isCardModalVisible = ref(false)
	const selectedCard = ref(null)

	// State for total value modal
	const isTotalValueModalVisible = ref(false)

	// Handle pack opened event
	const handlePackOpened = (pack) => {
		currentPack.value = pack
		isOpening.value = true
	}

	// // Handle finished opening (optional if needed)
	// const handleFinishedOpening = () => {
	// 	// Currently handled within PackOpeningOverlay
	// }

	// Open card modal
	const openCardModal = (card) => {
		selectedCard.value = card
		isCardModalVisible.value = true
	}

	// Close card modal
	const closeCardModal = () => {
		isCardModalVisible.value = false
		selectedCard.value = null
	}

	// Show total value modal
	const showTotalValueModal = () => {
		// isTotalValueModalVisible.value = true
		closeTotalValueModal()
	}

	// Close total value modal
	const closeTotalValueModal = () => {
		isTotalValueModalVisible.value = false
		isOpening.value = false
	}

	// Watch for opening and closing of PackOpeningOverlay
	const handleFinishedOpeningWithEmit = () => {
		// Logic after opening is finished if needed
	}
</script>

<style scoped>
	/* Add any additional styles if necessary */
	h1 {
		margin-top: 20px;
		margin-bottom: 20px;
		color: #333;
	}

	h2 {
		margin-top: 40px;
		color: #333;
	}
</style>
