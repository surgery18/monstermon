<!-- src/App.vue -->
<template>
	<main class="d-flex flex-column min-vh-100 bg-dark text-white">
		<Navigation />

		<router-view />

		<footer class="py-4 bg-secondary mt-auto">
			<div class="container text-center">
				<p>&copy; 2024 Monstermon. All rights reserved.</p>
			</div>
		</footer>

		<!-- Remove or comment out the Album component to match the prototype -->
		<!-- <Album /> -->
	</main>
</template>

<script setup>
	// No script needed as all logic is handled in child components
</script>

<style>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	body {
		font-family: Arial, sans-serif;
		text-align: center;
		background-color: #f0f0f0;
		/* overflow-x: hidden; */
	}
</style>
