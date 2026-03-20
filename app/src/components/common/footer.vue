<script setup>
//import isElectron from '@/helpers/is_electron';
import { ref } from "vue";

/*if(!isElectron()){
  state.strBaseURL = import.meta.env.VITE_ROOTURL;
}*/
import Timeout from "../timeout.vue";

// const inactivityTimeoutSecs = 300;

// let showTimeout = ref(false);

// const getShowTimeout = (answer) => {
//   showTimeout.value = answer;
// };

// setTimeout(() => {
//   showTimeout.value = true;
// }, inactivityTimeoutSecs * 1000);
</script>
<template>
  <footer>
    <div class="logo">
      <img src="/assets/images/Biogen_Logo.png" alt="Biogen logo" />
      <p>Biogen-260745 | Date of preparation March 2025</p>
    </div>
  </footer>
  <Timeout v-if="showTimeout" :show="getShowTimeout" />
</template>

<style lang="scss" scoped>
footer {
  .logo {
    position: absolute;
    bottom: 2vh;
    right: 7.9vw;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    img {
      width: 9vw;
    }

    p {
      color: $hexWhite;
      @include fontLight($font);
      font-size: 0.5vw;
    }
  }
}
</style>
