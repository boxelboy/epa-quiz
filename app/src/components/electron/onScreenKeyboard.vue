<template>
  <div class="keyboardWrapper">
    <button class="button" @click="destroy" v-if="state.blKeyboardActive">Close keyboard</button>
    <div class="simple-keyboard"></div>
  </div>
</template>

<script>
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";
import {onMounted, onUnmounted, reactive, ref, watch} from "vue";

export default {
  name: "onScreenKeyboard",
  setup(props){
    const state = reactive({
      keyboard: null,
      keyboardClass: "simple-keyboard",
      elmFocusedInput: null,
      blKeyboardActive: false,
      arrAllowedNodes: [
        "INPUT",
        "TEXTAREA"
      ]
    });

    const keyboardValue = ref('');

    const init = () => {
      if(state.keyboard === null){
        state.keyboard = new Keyboard("simple-keyboard", {
          onChange: onChange,
          onKeyPress: onKeyPress,
          newLineOnEnter: true,
          display: {
            "{bksp}": "←",
            "{tab}": "Tab ⇄",
            "{lock}": "Caps Lock",
            "{enter}": "Enter↵",
            "{shift}": "⇑Shift",
            "{space}": "Space",
          },
        });
        state.blKeyboardActive = true;
      }
    };

    const destroy = () => {
      if(state.keyboard !== undefined){
        state.keyboard.destroy();
        state.keyboard = null;
        state.blKeyboardActive = false;
      }
    }

    const onChange = (input) => {
      keyboardValue.value = input;
    }

    const eventHandler = (e) => {
      const elmTarget = e.target;
      // if the input isn't disabled and is in the array of tag names.
      if (
				!elmTarget.disabled
	      &&
	      elmTarget.getAttribute('type') !== "submit"
	      &&
	      elmTarget.getAttribute('type') !== "radio"
	      &&
	      elmTarget.getAttribute('type') !== "checkbox"
	      &&
	      state.arrAllowedNodes.indexOf(elmTarget.tagName) !== -1) {
        // if the keyboard isn't initialised then start it up
        if(state.keyboard === null){
          init();
          state.blKeyboardActive = true;
        }

        // if the focused input is there. Detect if it's same as current. If not set the keyboard input and state
        if(state.elmFocusedInput !== null){
          if(state.elmFocusedInput.getAttribute('name') !== elmTarget.getAttribute('name')){
            keyboardValue.value = elmTarget.value;
            state.keyboard.setInput(elmTarget.value);
          }
        }
        // set current input as the focused
        state.elmFocusedInput = elmTarget;
      }
    }

    // watch the data if it changes set the new value
    watch(keyboardValue, (strNewValue) => {
      if(state.elmFocusedInput){
        state.elmFocusedInput.value = strNewValue;
      }
    });

    const onKeyPress = (button) => {
      if(button === "{shift}" || button === "{lock}") {
        handleShift();
      }
    }

    const handleShift = () => {
      let currentLayout = state.keyboard.options.layoutName;
      let shiftToggle = currentLayout === "default" ? "shift" : "default";
      state.keyboard.setOptions({
        layoutName: shiftToggle,
      });
    }

    onUnmounted(() => {
      document.removeEventListener("focusin",eventHandler);
      document.removeEventListener("input",eventHandler);
    });

    onMounted(() => {
      document.addEventListener("focusin",eventHandler);
      document.addEventListener("input",eventHandler);
    });
    return{
      state,
      init,
      destroy
    }
  }
};
</script>
<style lang="scss">
  .keyboardWrapper{
    max-width: 1024px;
    margin:0 auto;
    position: fixed;
    @include r(bottom,30,30,30);
    left: 0;
    right: 0;

    input,textarea{
      width: 100%;
      display: inline-block;
      @include r(margin-bottom,10,10,10);
    }
  }
</style>
