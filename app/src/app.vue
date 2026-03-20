<script>
import Debug from "./components/electron/debug.vue";
import isElectron from "./helpers/is_electron";
import { onUnmounted, reactive, ref, provide, onMounted } from "vue";
import OnScreenKeyboard from "@/components/electron/onScreenKeyboard.vue";
import { values } from "@/stores/values";
import Footer from "@/components/common/footer.vue";
import Timeout from "@/components/timeout.vue";

export default {
  components: { Debug, Footer, OnScreenKeyboard, Timeout },
  setup(props) {
    provide("theValues", values);

    const inactivityTimeoutSecs = 10;
    const inactivityWarningCountdown = 15;

    const state = reactive({
      arrClickBuffer: [],
      arrKeyBuffer: [],
      lastKeyPress: Date.now(),
      lastClickPress: Date.now(),
      arrClickActivationZones: [
        {
          position: {
            intAreaXAxis: 0,
            intAreaYAxis: 0
          },
          width: 400,
          height: 400
        },
        {
          position: {
            intAreaXAxis: 100,
            intAreaYAxis: 100
          },
          width: 400,
          height: 400
        },
        {
          position: {
            intAreaXAxis: 100,
            intAreaYAxis: 0
          },
          width: 400,
          height: 400
        },
        {
          position: {
            intAreaXAxis: 0,
            intAreaYAxis: 100
          },
          width: 400,
          height: 400
        }
      ],
      arrCombination: ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"]
    });

    if (screen.orientation.lock("landscape")) screen.orientation.lock("landscape");

    const blDebugState = ref(false);

    const updateDebugState = (newData) => {
      blDebugState.value = newData;
    };

    const keyDown = (event) => {
      const key = event.key.toLowerCase();
      const currentTime = Date.now();
      // if it's been longer than a second since last reset array
      if (currentTime - state.lastKeyPress > 1000) {
        state.arrKeyBuffer = [];
      }
      // push key to key buffer
      state.arrKeyBuffer.push(key);
      // update last key press
      state.lastKeyPress = Date.now();

      // detect if key combination
      if (JSON.stringify(state.arrKeyBuffer) === JSON.stringify(state.arrCombination)) {
        blDebugState.value = true;
        console.log("got combination");
      }
    };

    const debugClick = (event) => {
      // if it's been longer than 5 seconds since last reset array
      let currentTime = Date.now();
      if (currentTime - state.lastClickPress > 5000) {
        state.arrClickBuffer = [];
      }
      // loop through the debug activation boxes to see if you clicked within area
      for (let intPattern = 0; intPattern < state.arrClickActivationZones.length; intPattern++) {
        let arrDebugActivation = state.arrClickActivationZones[intPattern];

        // detect if x & y is in the area of any activation zones
        let intFullWidth = window.innerWidth;
        let intFullHeight = window.innerHeight; // Change to innerHeight for consistency
        let intAreaXAxis = (intFullWidth / 100) * arrDebugActivation.position.intAreaXAxis;
        let intAreaYAxis = (intFullHeight / 100) * arrDebugActivation.position.intAreaYAxis;

        if ((arrDebugActivation.position.intAreaXAxis < 100 ? event.clientX <= intAreaXAxis + arrDebugActivation.width : event.clientX >= intAreaXAxis - arrDebugActivation.width) && (arrDebugActivation.position.intAreaYAxis < 100 ? event.clientY <= intAreaYAxis + arrDebugActivation.height : event.clientY >= intAreaYAxis - arrDebugActivation.height)) {
          console.log("correct location");
          state.arrClickBuffer.push(arrDebugActivation);
          state.lastClickPress = Date.now();
          break;
        }
      }
      // detect if click combination is correct
      if (JSON.stringify(state.arrClickBuffer) === JSON.stringify(state.arrClickActivationZones)) {
        blDebugState.value = true;
        console.log("got click combination");
      }
    };

    if (isElectron()) {
      document.addEventListener("click", debugClick);
      window.addEventListener("keydown", keyDown);
    }

    onUnmounted(() => {
      if (isElectron()) {
        window.removeEventListener("keydown", keyDown);
        document.removeEventListener("click", debugClick);
      }
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      clearTimeout(timer);
    });

    // === Inactivity Timer ===
    const showTimeout = ref(false);
    const activityEvents = ["click", "mousemove", "keydown", "touchstart"];
    let timer = null;

    const startInactivityTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        showTimeout.value = true;
      }, inactivityTimeoutSecs * 1000);
    };

    const resetTimer = () => {
      showTimeout.value = false;
      startInactivityTimer();
    };

    onMounted(() => {
      activityEvents.forEach((event) => {
        window.addEventListener(event, resetTimer);
      });
      startInactivityTimer();
    });

    return {
      state,
      values,
      blDebugState,
      updateDebugState,
      isElectron,
      keyDown,
      inactivityTimeoutSecs,
      inactivityWarningSecs: inactivityTimeoutSecs - inactivityWarningCountdown,
      inactivityTimeout: null,
      inactivityWarningTimeout: null,
      thanksTimeoutSecs: 10,
      showWarning: false,
      showTimeout
    };
  }
};
</script>

<template>
  <div class="site-content">
    <RouterView />
  </div>
  <Footer />
  <Timeout v-if="showTimeout" :show="(val) => (showTimeout = val)" />
  <Debug v-if="blDebugState" :blDebugState="blDebugState" @updateDebugState="updateDebugState" />
  <onScreenKeyboard v-if="isElectron()" />
</template>

<style lang="scss">
body {
  background-image: url("/assets/images/Background2.png");
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;

  @include larger-than(desktop) {
    background-size: cover;
  }

  &.home {
    background-image: url("/assets/images/Background.png");
  }

  &.results {
    background-image: url("/assets/images/Background3.png");
  }
}
@media screen and (orientation: portrait) {
  body {
    transform-origin: top left;
    transform: rotate(90deg) translateY(-100%);
    width: 100vh !important;
    height: 100vw !important;
  }
}
</style>
