// src/stores/albumStore.js
import { defineStore } from "pinia"
import { ref, computed } from "vue"

export const useAlbumStore = defineStore("album", () => {
	// Reactive state for album
	const album = ref({})

	// Load album from localStorage upon initialization
	const loadAlbum = () => {
		const savedAlbum = localStorage.getItem("monstermon_album")
		if (savedAlbum) {
			album.value = JSON.parse(savedAlbum)
		}
	}

	// Save album to localStorage
	const saveAlbum = () => {
		localStorage.setItem("monstermon_album", JSON.stringify(album.value))
	}

	// Add a card to the album
	const addToAlbum = (cardData) => {
		const key =
			cardData.name.toLowerCase().replace(/\s+/g, "_") +
			"_" +
			cardData.rarity.toLowerCase()
		if (album.value[key]) {
			album.value[key].count += 1
		} else {
			album.value[key] = {
				...cardData,
				count: 1,
			}
		}
		saveAlbum()
	}

	// Computed property to calculate total value
	const totalValue = computed(() => {
		let total = 0
		for (const cardName in album.value) {
			const card = album.value[cardName]
			total += card.value * card.count
		}
		return total
	})

	// Initialize the store by loading the album
	loadAlbum()

	return {
		album,
		addToAlbum,
		totalValue,
	}
})
