<script setup>
import router from "../router";

const props = defineProps(["show"]);

const continueQuiz = () => {
  router.push({ name: "homeview" });
  props.show(false);
};
</script>

<!-- <template>
  <div id="timeoutModal" class="modal" style="z-index: 15">
    <video autoplay loop src="http://localhost:5173/assets/video/QuizPreSlides_v4_1.mp4" />
    <div data-log="Timeout: continue" @click="continueQuiz()"></div>
  </div>
</template> -->
<template>
  <div id="timeoutModal" class="modal" style="z-index: 15">
    <video autoplay loop muted>
      <source src="/assets/video/QuizPreSlides_v4_1.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div data-log="Timeout: continue" @click="continueQuiz()"></div>
  </div>
</template>
<style scoped lang="scss">
video {
  position: relative;
  width: 100vw;
  height: 100vh;
}

#timeoutModal {
  div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    z-index: 20;
  }
}
</style>
