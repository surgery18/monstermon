"use strict"
import fs from "fs"
import "dotenv/config"
//this script will call ai to generate x amount of art

const apiKey = process.env.CLOUDFLARE_AI_KEY
const id = process.env.CLOUDFLARE_ID

async function run(model, input) {
	const response = await fetch(
		`https://api.cloudflare.com/client/v4/accounts/${id}/ai/run/${model}`,
		{
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
			method: "POST",
			body: JSON.stringify(input),
		}
	)
	const result = await response.json()
	return result
}

async function genArt(data, index) {
	const response = await run("@cf/black-forest-labs/flux-1-schnell", {
		prompt: `
    Draw the following in the style of art that would be on a collectable card:\n
		${data.image_prompt}
  `,
	})

	const image = response?.result?.image

	//decode b64
	if (image) {
		const b = Buffer.from(image, "base64")
		//save to disk as jpeg
		fs.writeFileSync(`art${index}.jpg`, b)
	}
}

//mock data
// const mock = [
// 	{
// 		image_prompt:
// 			"A demonic creature made entirely of shadow and darkness, with glowing red eyes and twisted horns.",
// 		name: "Umbra, the Shadow Reaper",
// 		description:
// 			"A monster that can absorb enemy attacks and use them to grow stronger, leaving the player vulnerable.",
// 	},
// 	{
// 		image_prompt:
// 			"A massive, serpentine dragon with scales that shift between a sickly green and yellow, breathing a toxic gas that poisons the enemy.",
// 		name: "Venomhiss",
// 		description:
// 			"A dragon that can poison its enemies, dealing damage over time and making them weak to attack.",
// 	},
// 	{
// 		image_prompt:
// 			"A ghostly, undead knight with a cracked and rusted suit of armor, wielding a cursed sword that drains the life force of its victims.",
// 		name: "The Wraithknight",
// 		description:
// 			"A ghostly knight that drains the health of its enemies, dealing damage over time and becoming stronger.",
// 	},
// 	{
// 		image_prompt:
// 			"A humanoid, grotesque creature with bulging, pulsing veins and blackened skin, its eyes glowing with an otherworldly energy.",
// 		name: "The Blood Brood",
// 		description:
// 			"A creature that can infect its enemies, dealing damage over time and spreading its detrimental effects to other targets.",
// 	},
// 	{
// 		image_prompt:
// 			"A hulking, humanoid monster with razor-sharp claws and teeth, covered in dark, wet fur, and an earsplitting scream.",
// 		name: "The Cribrius",
// 		description:
// 			"A powerful, aggressive monster that deals massive damage in close combat, with a shriek that stuns its enemies.",
// 	},
// 	{
// 		image_prompt:
// 			"A ghostly, ethereal creature with tendrils of energy, hovering in the air, its eyes shooting laser-like attacks.",
// 		name: "The Spectra",
// 		description:
// 			"A monster that shoots laser-like attacks, dealing damage from a distance, and can phaze enemies, making them vulnerable to attacks.",
// 	},
// 	{
// 		image_prompt:
// 			"A demonic, four-armed beast with sharp machetes for hands, sprinting towards the player with malevolent glee.",
// 		name: "Ksdkazi",
// 		description:
// 			"A four-armed monster with sharp blades for hands, dealing massive damage in close combat, and sprinting rapidly around the battlefield.",
// 	},
// 	{
// 		image_prompt:
// 			"A moldering, skeletal figure with glowing red eyes, standing atop a crumbling fortress, summoning forth undead minions.",
// 		name: "Lord Vaut",
// 		description:
// 			"A powerful undead warlord that summons an army of undead minions to do its bidding, overwhelming the player with sheer numbers.",
// 	},
// 	{
// 		image_prompt:
// 			"A slithering, snake-like creature with jagged, wound-like markings, shooting electrical charges from its body.",
// 		name: "Voragg draconia",
// 		description:
// 			"A serpent creature that deals electrical damage from a distance and releases explosion blasts that stun the enemy, then perfect killing abilities as the foe doesn’t fully recover accordingly.",
// 	},
// 	{
// 		image_prompt:
// 			"A startling-looking humanoid statue that leaps forward suddenly and leaps back simultaneously to cover great distances.",
// 		name: "Janrek Everalè ",
// 		description:
// 			"a man of similar light structure construction but covered also standing statues human that kills lots of increasing tiny sparks rising burn",
// 	},
// ]

// const ar = []
// for (const index in mock) {
// 	const data = mock[index]
// 	ar.push(genArt(data, index))
// }

// await Promise.all(ar)

//We need to generate every single card possible in the entire collection. They will only use the art0-9 and legendary and epic
const CARDS_IN_COLLECTION = 100 //will increase to a much higher amount later
const rarities = {
	legendary: {
		per: 0.05,
		max_specials: 3,
	},
	epic: {
		per: 0.1,
		max_specials: 2,
	},
	rare: {
		per: 0.25,
		max_specials: 1,
	},
	uncommon: {
		per: 0.2,
		max_specials: 0,
	},
	common: {
		per: 0.4,
		max_specials: 0,
	},
}

const rarityCounts = {
	legendary: 0,
	epic: 0,
	rare: 0,
	uncommon: 0,
	common: 0,
}
const cardStatsMap = new Map()

function getRandomRarity() {
	const cumulativeCounts = {
		legendary: Math.floor(CARDS_IN_COLLECTION * rarities.legendary.per),
		epic: Math.floor(CARDS_IN_COLLECTION * rarities.epic.per),
		rare: Math.floor(CARDS_IN_COLLECTION * rarities.rare.per),
		uncommon: Math.floor(CARDS_IN_COLLECTION * rarities.uncommon.per),
		common: Math.floor(CARDS_IN_COLLECTION * rarities.common.per),
	}

	const availableRarities = Object.keys(rarityCounts).filter(
		(rarity) => rarityCounts[rarity] < cumulativeCounts[rarity]
	)

	if (availableRarities.length === 0) {
		return "common"
	}

	const randomIndex = Math.floor(Math.random() * availableRarities.length)
	const selectedRarity = availableRarities[randomIndex]
	rarityCounts[selectedRarity]++

	return selectedRarity
}

/*
	GUIDE on max_specials
	- if max_specials = 3
	-- the card has to be a foil, full art, and gold or silver.
	- if max_specials = 2, the card can be in one of these configs
	-- foil and gold or silver
	-- full art and gold or silver
	-- foil and full art
	- if max_specials = 1, the card can be in one of these configs
	-- gold
	-- silver
	-- full art
*/

function getSpecialsByRarity(rarity) {
	const maxSpecials = rarities[rarity].max_specials
	if (maxSpecials === 0) return "None"

	let selectedSpecials = []

	if (maxSpecials === 3) {
		selectedSpecials = [
			"Foil",
			"Full Art",
			Math.random() < 0.5 ? "Gold" : "Silver",
		]
	} else if (maxSpecials === 2) {
		const configs = [
			["Foil", Math.random() < 0.5 ? "Gold" : "Silver"],
			["Full Art", Math.random() < 0.5 ? "Gold" : "Silver"],
			["Foil", "Full Art"],
		]
		selectedSpecials = configs[Math.floor(Math.random() * configs.length)]
	} else if (maxSpecials === 1) {
		const options = ["Gold", "Silver", "Full Art"]
		selectedSpecials = [options[Math.floor(Math.random() * options.length)]]
	}

	return selectedSpecials.join(", ")
}

function getCardStats(name, rarity, special) {
	const key = `${name}_${rarity}_${special}`

	if (cardStatsMap.has(key)) {
		return cardStatsMap.get(key)
	}

	const stats = {
		attack: Math.floor(Math.random() * 10) + 1,
		hp: Math.floor(Math.random() * 10) + 1,
		defense: Math.floor(Math.random() * 10) + 1,
		speed: Math.floor(Math.random() * 10) + 1,
	}

	cardStatsMap.set(key, stats)
	return stats
}

async function genCardData(data, index) {
	const rarity = getRandomRarity()
	const special = getSpecialsByRarity(rarity)
	const stats = getCardStats(data.name, rarity, special)

	//TODO genart function

	const card = {
		id: index,
		name: data.name,
		description: data.description,
		rarity: rarity.charAt(0).toUpperCase() + rarity.slice(1),
		type: "Basic/Blue", // You can customize this as needed
		attack: stats.attack,
		hp: stats.hp,
		defense: stats.defense,
		speed: stats.speed,
		special: special,
		image: `art${index % mock.length}.jpg`,
	}

	return card
}
const collection = []

for (let i = 0; i < CARDS_IN_COLLECTION; i++) {
	const data = mock[i % mock.length]
	const cardData = await genCardData(data, i)
	collection.push(cardData)
}

fs.writeFileSync("card_collection.json", JSON.stringify(collection, null, 2))
console.log("Done")
