<template>
	<div id="pack-opening-overlay" v-if="isVisible">
		<div
			id="animated-pack"
			ref="animatedPack"
			v-html="currentPack?.art"
			@click="continueOpening"></div>
		<div id="card-stack" v-if="showCards">
			<card
				v-for="(card, index) in cardsToShow"
				:key="card.id"
				:style="{
					top: `${index * 5}px`,
					left: `${index * 5}px`,
					zIndex: cardsToShow.length - index,
				}"
				@click="revealCard(card)"
				:card="card" />
		</div>
	</div>
</template>

<script setup>
	import { useTemplateRef, ref, onMounted, nextTick } from "vue"
	import gsap from "gsap"
	import { useAlbumStore } from "../stores/albumStore"
	import Card from "@/components/Card.vue"
	import Mock from "../../card_collection.json"

	// Props received from parent component
	const props = defineProps({
		isVisible: {
			type: Boolean,
			default: false,
		},
		pack: {
			type: Object,
			default: null,
		},
	})

	// Emits events to parent component
	const emitParent = defineEmits(["showTotalValue"])

	// References for animated pack and cards
	const animatedPack = ref(null)
	const showCards = ref(false)
	const cardsToShow = ref([])

	// Access the album store
	const albumStore = useAlbumStore()

	// Watch for pack prop to trigger opening
	onMounted(() => {
		if (props.pack) {
			animatePack(props.pack)
		}
	})

	// Function to animate the pack flying to the center
	const animatePack = (pack) => {
		// Set pack HTML
		animatedPack.value.innerHTML = pack.art

		// Animate pack flying to center using GSAP
		gsap.fromTo(
			animatedPack.value,
			{
				scale: 1,
				x: 0,
				y: 0,
			},
			{
				duration: 1,
				scale: 1.2,
				x: 0,
				y: 0,
				ease: "power2.out",
			}
		)
	}

	// Function to handle "Pick to Continue" action by clicking the pack
	const continueOpening = () => {
		// Flip the pack
		gsap.to(animatedPack.value, {
			duration: 1,
			rotationY: 180,
			ease: "power2.inOut",
			onComplete: () => {
				animatedPack.value.style.display = "none"
				revealCards()
			},
		})
	}

	// Function to reveal cards after pack flip
	const revealCards = () => {
		// Simulate fetching 3 random cards
		cardsToShow.value = getRandomCards(5)
		showCards.value = true
	}

	// Function to get random cards (replace with actual data fetching if needed)
	const getRandomCards = (number) => {
		// Shuffle and return 'number' of cards
		return Mock.sort(() => 0.5 - Math.random())
			.slice(0, number)
			.map((card) => ({ ...card, uuid: crypto.randomUUID() }))
	}
	// Function to reveal a card
	const revealCard = (card) => {
		// Prevent clicks on cards that are not on top of the stack
		const topCard = cardsToShow.value[0]
		if (card.uuid !== topCard.uuid) {
			console.log(
				"Only the top card can be clicked. Ignoring click for card:",
				card.id
			)
			return
		}

		// Prevent multiple clicks
		if (card.isRevealed || card.isAnimating) {
			console.log("Card is already revealed or animating:", card.id)
			return
		}

		// Mark the card as animating to prevent re-clicks
		card.isAnimating = true
		console.log("Card animation started:", card.id)

		const index = cardsToShow.value.findIndex((c) => c.id === card.id)
		console.log("Card index found:", index)

		nextTick(() => {
			const cardRef = document.querySelector(
				`#card-stack .card:nth-child(${index + 1})`
			)

			if (cardRef) {
				console.log("Card reference found for animation:", card.id)

				// Function to start the animation, with retry logic if it fails
				const startAnimation = () => {
					if (gsap.isTweening(cardRef)) {
						console.log("Card is already tweening:", card.id)
						return
					}

					// Animate the card flying out using GSAP
					gsap.to(cardRef, {
						duration: 1,
						x: -window.innerWidth,
						rotation: -45,
						opacity: 0,
						ease: "power2.in",
						onStart() {
							// Mark as revealed when animation starts
							card.isRevealed = true
							console.log("Animation started for card:", card.id)
						},
						onUpdate() {
							console.log("Animation progress for card:", card.id)
						},
						onComplete() {
							// Remove the animating flag
							card.isAnimating = false
							console.log("Animation complete for card:", card.id)

							// Add card to album
							albumStore.addToAlbum(card)
							console.log("Card added to album:", card.id)

							// Remove the card from cardsToShow
							cardsToShow.value.shift()

							// Check if all cards are revealed
							if (cardsToShow.value.every((card) => card.isRevealed)) {
								// Hide card stack
								showCards.value = false
								console.log("All cards revealed, hiding card stack")

								// Emit event to show total value modal
								emitParent("showTotalValue")
								console.log("Emitted event to show total value modal")
							}
						},
						onInterrupt() {
							// If the animation is interrupted, retry the animation
							console.log("Animation interrupted for card:", card.id)
							card.isAnimating = false
							card.isRevealed = false
							startAnimation()
						},
					})

					// Fallback timeout to reset animating flag if animation does not complete
					setTimeout(() => {
						if (card.isAnimating) {
							card.isAnimating = false
							console.log(
								"Timeout reached, retrying animation for card:",
								card.id
							)
							startAnimation()
						}
					}, 1500) // Duration slightly longer than the GSAP animation duration
				}

				// Start the animation
				startAnimation()
			} else {
				// If the card reference is not found, allow re-click
				card.isAnimating = false
				card.isRevealed = false
				console.log(
					"Card reference not found, allowing re-click for card:",
					card.id
				)
			}
		})

		// Log the state of all cards for debugging purposes
		console.log(
			"Current state of all cards:",
			cardsToShow.value.map((c) => ({
				id: c.id,
				isRevealed: c.isRevealed,
				isAnimating: c.isAnimating,
			}))
		)
	}
</script>

<style lang="less" scoped>
	.card {
		position: absolute;
	}

	/* Styles similar to your original CSS */
	#pack-opening-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.8);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	#animated-pack {
		width: 150px;
		height: 250px;
		background-color: blue;
		border: 2px solid #000;
		border-radius: 10px;
		position: absolute;
		cursor: pointer;
		backface-visibility: hidden;
		transform-style: preserve-3d;
	}

	#card-stack {
		margin-top: 20px;
		position: relative;
		width: 300px;
		height: 420px;
	}
</style>
