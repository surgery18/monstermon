<!-- src/components/Album.vue -->
<template>
	<div id="album-container">
		<card
			v-for="(card, name) in album"
			:key="name"
			class="card"
			@click="openCardModal(card)"
			:card="card" />
	</div>
</template>

<script setup>
	import { computed } from "vue"
	import { useAlbumStore } from "../stores/albumStore"
	import Card from "@/components/card.vue"
	// import { emit } from "vue"

	// Access the album from the store
	const albumStore = useAlbumStore()
	const album = computed(() => {
		const sortedAlbum = { ...albumStore.album }
		const rarityOrder = ["legendary", "epic", "rare", "uncommon", "common"]
		Object.keys(sortedAlbum)
			.sort((a, b) => {
				const rarityA = sortedAlbum[a].rarity.toLowerCase()
				const rarityB = sortedAlbum[b].rarity.toLowerCase()
				return rarityOrder.indexOf(rarityA) - rarityOrder.indexOf(rarityB)
			})
			.forEach((key) => {
				const value = sortedAlbum[key]
				delete sortedAlbum[key]
				sortedAlbum[key] = value
			})
		return sortedAlbum
	})

	// Emit an event to parent to open card modal
	const emitParent = defineEmits(["openCardModal"])

	const openCardModal = (card) => {
		emitParent("openCardModal", card)
	}
</script>

<style lang="less" scoped>
	#album-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		margin: 20px;
		gap: 10px;
	}
</style>
