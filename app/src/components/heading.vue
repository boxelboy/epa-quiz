<script>
export default {
	props: {
		content: String
	},
	name: "Heading"
}
</script>

<template>
	<section class="section heading">
		<div class="container">
			<h1>{{content}}</h1>
		</div>
	</section>
</template>