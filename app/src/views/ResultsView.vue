<script setup>
import {inject, onMounted, reactive, ref} from "vue";
import router from "@/router";

const theValues = inject('theValues');
let total = theValues.total;
total = (total / 5) * 100;

const finish = () => {
  router.push({ name: 'homeview' });
}

onMounted(async() => {
  document.body.classList.add('results');
  console.log(theValues.total)
});

</script>

<template>
  <transition name="fade" appear>
    <main>
      <h1>Well done!</h1>
      <div>You scored</div>
      <div id="theTotal">{{total}}%</div>
      <button data-log="Finish quiz" @click="finish" class="btn btn-white">Finish</button>
    </main>
  </transition>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: $hexWhite;
  font-family: $font;
  height: 100vh;
  width: 20vw;
  margin: 0 auto;

  h1 {
    font-size: 3vw;
    margin-top: 10vh;
  }

  div {
    font-size: 5vw;

    &:first-of-type {
      font-size: 3.5vw;
      margin-top: 23vh;
    }
  }

  #theTotal {
    font-family: 'FranklinGothicDemi', arial, sans-serif;
  }

  button {
    position: absolute;
    bottom: 5vh;
    font-family: 'FranklinGothicDemi', arial, sans-serif !important;
  }
}

</style>