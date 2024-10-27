<template>
	<div
		class="card"
		:class="{
			'gold-border': card.special.includes('Gold'),
			'silver-border': card.special.includes('Silver'),
			'foil-effect': card.special.includes('Foil'),
			'full-art': card.special.includes('Full Art'),
		}">
		<img :src="`/${card.image}`" class="card-image" />
		<div class="card-info">
			<strong>{{ card.name }}</strong
			><br />
			<span
				class="rarity"
				:style="{
					color: getRarityColor(card.rarity),
				}"
				>{{ card.rarity }}</span
			><br />
			<!-- Type: {{ card.type }}<br /> -->
			ATK: {{ card.attack }} | HP: {{ card.hp }} | DEF: {{ card.defense }} |
			SPD: {{ card.speed }}<br />
			{{ card.description }}<br />
			<!-- Special: {{ card.special }}<br /> -->
			<!-- Value: {{ card.value }} -->
		</div>
		<div v-if="card.count > 1" class="duplicate-count">x{{ card.count }}</div>
	</div>
</template>

<script setup>
	const props = defineProps({ card: Object })

	const getRarityColor = (rarity) => {
		switch (rarity.toLowerCase()) {
			case "common":
				return "#A0A0A0" // Grey
			case "uncommon":
				return "#228B22" // ForestGreen
			case "rare":
				return "#1E90FF" // DodgerBlue
			case "epic":
				return "#800080" // Purple
			default:
				return "orange" // Black - legendary
		}
	}
</script>

<style lang="less" scoped>
	.card {
		width: 280px;
		height: 400px;
		border: 10px solid #000;
		border-radius: 10px;
		background-color: #fff;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		transition: transform 0.3s, box-shadow 0.3s;
		backface-visibility: hidden;
		transform-style: preserve-3d;
		/* position: absolute; */
		overflow: hidden;
	}

	.card:hover {
		transform: scale(1.05);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}

	.card-info {
		padding: 10px;
		text-align: left;
		width: 100%;
		flex-grow: 1;
		background-color: rgba(255, 255, 255, 0.8);
	}

	.card-image {
		width: 100%;
		height: 200px;
		border-bottom: 1px solid #000;
		object-fit: cover;
	}

	.gold-border {
		border: 10px solid gold;
	}

	.silver-border {
		border: 10px solid silver;
	}

	.foil-effect {
		position: relative;
		overflow: hidden;
	}

	.foil-effect::before {
		content: "";
		position: absolute;
		top: 0;
		left: -50%;
		width: 200%;
		height: 100%;
		background: linear-gradient(
			120deg,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 0.5) 50%,
			rgba(255, 255, 255, 0) 100%
		);
		transform: skewX(-25deg);
		animation: shimmer 2s infinite;
		pointer-events: none;
	}

	@keyframes shimmer {
		0% {
			transform: translateX(-100%) skewX(-25deg);
		}
		100% {
			transform: translateX(100%) skewX(-25deg);
		}
	}

	.full-art .card-info {
		background-color: rgba(0, 0, 0, 0.2);
		color: #fff !important;
		text-shadow: 1px 1px 2px #000;
		position: absolute;
		bottom: 0;
		> .rarity {
			font-weight: bold;
		}
	}

	.full-art img {
		height: 100%;
		border-bottom: none;
	}

	@media (max-width: 600px) {
		.pack,
		.album-card {
			width: 230px;
			height: 330px;
		}

		#card-stack {
			width: 250px;
			height: 350px;
		}

		.card,
		.album-card {
			width: 230px;
			height: 330px;
		}

		.card-image,
		.album-card img {
			height: 150px;
		}
	}

	.duplicate-count {
		position: absolute;
		top: 10px;
		right: 10px;
		background-color: rgba(255, 255, 255, 0.8);
		color: #000;
		padding: 2px 6px;
		border-radius: 50%;
		font-size: 14px;
		font-weight: bold;
	}
</style>
