<script>
export default {
	props: {
		content: String
	},
	name: "Content"
}
</script>

<template>
	<section class="section content">
		<div class="container textContainer" v-html="content">
		</div>
	</section>
</template>