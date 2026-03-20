<script setup>
import { inject, onMounted, ref, watch } from "vue";
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import router from "../router";

const theValues = inject("theValues");

const startPrompt = '<img class="quiz__pointer" src="/assets/images/pointer.png" alt="pointer" /><p>Drag and drop your selected response into the brain image</p><p class="small">Please select one answer only</p>';

const questions = [
  {
    question: "PPD is defined as onset of depressive<br>symptoms during which perinatal timeframe?",
    references: "<strong>References</strong>:<br>1. American Psychiatric Association. Depressive disorders. In: <em>Diagnostic and Statistical Manual<br>of Mental Disorders</em>. 5th ed. Text revision. American Psychiatric Publishing; 2022.<br>" + "2. Mental, behavioural or neurodevelopmental disorders. In: International Classification of<br>Diseases. 11th revision. World Health Organization; 2024.<br>" + "3. American College of Obstetricians and Gynecologists. Obstet Gynecol.<br>2023;141(6):e1232-e1261.<br>" + "4. MacQueen GM, et al. Can J Psychiatry. 2016;61(9):588-603.<br>" + "5. Antenatal and Postnatal Mental Health: Clinical Management and Service Guidance.<br>National Institute for Health and Care Excellence Website. URL https://www.nice.org.uk/<br>guidance/cg192/resources/antenatal-and-postnatal-mental-health-clinical-management-<br>and-service-guidance-pdf-35109869806789. Published December 17, 2014. Accessed July<br>24, 2024.<br>" + "6. What is Postpartum Depression? United Nations International Children’s Emergency<br>Fund Website. URL https://www.unicef.org/parenting/mental-health/what-postpartum-depression.<br>Accessed August 6, 2024.",
    answers: [
      {
        answer: "During pregnancy or within 4 weeks postpartum",
        correct: "wrong",
        response: "<p class='incorrect'><strong>That’s partially correct.</strong><br>Timing onset of depressive symptoms for a PPD<br>diagnosis differs among professional society<br>guidelines. While most agree that symptoms can<br>start during pregnancy, some specify onset within 4<br>weeks postpartum, whereas other guidelines state up to<br>12 months postpartum.<sup>1-6</sup></p>"
      },
      {
        answer: "During pregnancy or within 6 weeks postpartum",
        correct: "wrong",
        response: "<p class='incorrect'><strong>That’s partially correct.</strong><br>Timing onset of depressive symptoms for a PPD<br>diagnosis differs among professional society<br>guidelines. While most agree that symptoms can<br>start during pregnancy, some specify onset within 4<br>weeks postpartum, whereas other guidelines state up to<br>12 months postpartum.<sup>1-6</sup></p>"
      },
      {
        answer: "During pregnancy or within 12 months postpartum",
        correct: "wrong",
        response: "<p class='incorrect'><strong>That’s partially correct.</strong><br>Timing onset of depressive symptoms for a PPD<br>diagnosis differs among professional society<br>guidelines. While most agree that symptoms can<br>start during pregnancy, some specify onset within 4<br>weeks postpartum, whereas other guidelines state up to<br>12 months postpartum.<sup>1-6</sup></p>"
      },
      {
        answer: "It differs among professional society guidelines",
        correct: "correct",
        response: "<p class='correct'><strong>That’s correct!</strong><br>Timing onset of depressive symptoms for a PPD<br>diagnosis differs among professional society<br>guidelines. While most agree symptoms can<br>start during pregnancy, some specify onset within 4<br>weeks postpartum, whereas other guidelines state<br>up to 12 months postpartum.<sup>1-6</sup></p>"
      }
    ]
  },
  {
    question: "Which of the following are associated with<br>an increased risk of developing PPD?",
    references: "<strong>References</strong>:<br>" + "1. Guintivano J, et al. <em>Am J Psychiatry</em>. 2023;180(12):884-895.<br>" + "2. Hellgren C, et al. Horm Behav. 2017;94:106-113.<br>" + "3. Payne JL, Maguire J. Front Neuroendocrinol. 2019;52:165-180.<br>" + "4. Agrawal I, et al. Cureus. 2022;14(10):e30898.<br>" + "5. Ghaedrahmati M, et al. J Educ Health Promot. 2017;6:60.<br>" + "6. O'Hara MW, McCabe JE. Annu Rev Clin Psychol. 2013;9:379-407.",
    answers: [
      {
        answer: "Genetic factors",
        correct: "wrong",
        response: "<p class='incorrect'><strong>Almost! The correct answer is \"All answers\".</strong><br>Changes to genetic code and genetic profile of<br>GABAergic neurons have been associated with the<br>pathogenesis of PPD.<sup>1-3</sup> However, other factors,<br>including history of psychiatric disorder and<br>environmental risk factors also contribute to the<br>development of PPD.<sup>3</sup></p>"
      },
      {
        answer: "Psychiatric factors",
        correct: "wrong",
        response: "<p class='incorrect'><strong>Almost! The correct answer is \"All answers\".</strong><br>Patients with a history of psychiatric disorders<br>including depression and anxiety have been found to<br>be at increased risk of developing PPD.<sup>4-5</sup> However,<br>there are other factors including genetic and<br>environmental risk factors that may also contribute to<br>the development of PPD.<sup>3</sup></p>"
      },
      {
        answer: "Environmental factors",
        correct: "wrong",
        response: "<p class='incorrect'><strong>Almost! The correct answer is \"All answers\".</strong><br>Environmental factors such as obstetric complications<br>and lack of familial or social support have been<br>associated with the development of PPD.<sup>3-6</sup> However,<br>there are other factors including genetic and<br>psychiatric risk factors that may also contribute to the<br>development of PPD.<sup>3</sup></p>"
      },
      {
        answer: "All answers",
        correct: "correct",
        response: "<p class='correct'><strong>That’s correct!</strong><br>The risk of developing PPD is associated<br>with a combination of factors including:<br>Genetic: changes to genetic code and<br>genetic profile of GABAergic neurons.<sup>1-3</sup><br>Psychiatric: history of depression, anxiety,<br>or other disorders.<sup>4-6</sup><br>Environmental: obstetric complications, lack<br>of familial or social support.<sup>3-6</sup></p>"
      }
    ]
  },
  {
    question: "How is PPD differentiated<br>from the Baby Blues?",
    references: "<strong>References</strong>:<br>" + "1. Thurgood S, et al. <em>Am J Clin</em> Med. 2009;6(2):17-22.<br>" + "2. American Psychiatric Association. <em>Diagnostic and Statistical Manual of Mental Disorders</em>.<br> 5th ed, text revision. American Psychiatric Association Publishing; 2022.<br>" + "3. Perinatal Depression. National Institutes of Mental Health Website. URL https://<br>www.nimh.nih.gov/health/publications/perinatal-depression. Published 2023. Accessed<br>March 17, 2025.<br>" + "4. Postpartum Depression. Mayo Clinic Website. URL https://www.mayoclinic.org/<br>diseases-conditions/postpartum-depression/symptoms-causes/syc-20376617.<br>Published November 24, 2022. Accessed March 17, 2025.",
    answers: [
      {
        answer: "PPD symptoms include extreme sadness, depression, anxiety, and functional impairment; symptoms endure longer than two weeks.",
        correct: "correct",
        response: "<p class='correct'><strong>Correct! Despite some similarities, there are<br>key distinctions:</strong><br>Baby blues refers to mild mood changes, such as<br>tearfulness and poor sleep, that usually resolve<br>without treatment within two weeks postpartum.<br>Baby Blues is not associated with functional<br>impairment.<sup>1-3</sup><br>PPD is characterized by extreme sadness,<br>depression and anxiety, leading to functional<br>impairment, and may include thoughts of self-harm, suicide,<br>or infant harm.<sup>1-3</sup></p>"
      },
      {
        answer: "Functional impairment is more severe in PPD than in Baby Blues.",
        correct: "wrong",
        response: "<p class='incorrect'><strong>That’s not quite right, let’s take another look.</strong><br>Baby Blues refers to mild mood changes, such as<br>tearfulness and poor sleep, that usually resolve<br>without treatment within two weeks postpartum.<br>Baby Blues is not associated with functional<br>impairment.<sup>1-3</sup><br>PPD is characterized by extreme sadness,<br>depression and anxiety, leading to functional<br>impairment, and may include thoughts of self-harm,<br>suicide, or infant harm.<sup>1-3</sup></p>"
      },
      {
        answer: "The symptoms are about the same, but Baby Blues lasts about two weeks while PPD symptoms last much longer.",
        correct: "wrong",
        response: "<p class='incorrect'><strong>That’s not quite right, let’s take another look.</strong><br>Baby Blues refers to mild mood changes, such as<br>tearfulness and poor sleep, that usually resolve<br>without treatment within two weeks postpartum.<br>Baby Blues is not associated with functional<br>impairment.<sup>1-3</sup><br>PPD is characterized by extreme sadness,<br>depression and anxiety, leading to functional<br>impairment, and may include thoughts of self-harm,<br>suicide, or infant harm.<sup>1-3</sup></p>"
      },
      {
        answer: "With baby blues, patient thoughts of suicide, self-harm or infant harm are temporary, while PPD should be suspected if these thoughts last longer than two weeks.",
        correct: "wrong",
        response: "<p class='incorrect'><strong>That’s not quite right, let’s take another look.</strong><br>Baby Blues refers to mild mood changes, such as<br>tearfulness and poor sleep, that usually resolve without<br>treatment within two weeks postpartum. Baby Blues is not<br>associated with functional impairment.<sup>1-3</sup><br>PPD is characterized by extreme sadness, depression and<br>anxiety, leading to functional impairment. Symptoms<br>endure longer than two weeks, and may include thoughts<br>of self-harm, suicide, or infant harm.<sup>1-3</sup><br>Any expression of suicidal thoughts, self-harm, or infant<br>harm, even within the first two weeks postpartum, is a<br>warning sign of PPD.<sup>1-4</sup>"
      }
    ]
  },
  {
    question: "Along with PPD, which of the following are<br>known mental health complications of<br>pregnancy and postpartum?",
    references: "<strong>References</strong>:<br>" + "1. American College of Obstetricians and Gynecologists. <em>Obstet Gynecol</em>.<br>2023;141(6):e1232-e1261.",
    answers: [
      {
        answer: "Generalized anxiety disorder",
        correct: "wrong",
        response: "<p class='incorrect'><strong>Partially correct.<br>The correct answer is \"All answers.\"</strong><br>Known perinatal mental health disorders include<br>depression (PPD or MDD), generalized anxiety<br>disorder, bipolar disorder, and postpartum<br>psychosis.<sup>1</sup> During assessment for PPD, patients<br>should be evaluated for the presence of other<br>possible psychiatric conditions.<sup>1</sup></p>"
      },
      {
        answer: "Bipolar disorder",
        correct: "wrong",
        response: "<p class='incorrect'><strong>Partially correct.<br>The correct answer is \"All answers.\"</strong><br>Known perinatal mental health disorders include<br>depression (PPD or MDD), generalized anxiety<br>disorder, bipolar disorder, and postpartum<br>psychosis.<sup>1</sup> During assessment for PPD, patients<br>should be evaluated for the presence of other<br>possible psychiatric conditions.<sup>1</sup></p>"
      },
      {
        answer: "Postpartum psychosis",
        correct: "wrong",
        response: "<p class='incorrect'><strong>Partially correct.<br>The correct answer is \"All answers.\"</strong><br>Known perinatal mental health disorders include<br>depression (PPD or MDD), generalized anxiety<br>disorder, bipolar disorder, and postpartum<br>psychosis.<sup>1</sup> During assessment for PPD, patients<br>should be evaluated for the presence of other<br>possible psychiatric conditions.<sup>1</sup></p>"
      },
      {
        answer: "All answers",
        correct: "correct",
        response: "<p class='correct'><strong>Correct! All answers.</strong><br>Known perinatal mental health disorders include<br>depression (PPD or MDD), generalized anxiety<br>disorder, bipolar disorder, and postpartum<br>psychosis.<sup>1</sup> During assessment for PPD, patients<br>should be evaluated for the presence of other<br>possible psychiatric conditions.<sup>1</sup></p>"
      }
    ]
  },
  {
    question: "What is the global prevalence of PPD?",
    references: "<strong>References</strong>:<br>" + "1. Wang Z, et al. <em>Transl Psychiatry</em>. 2021;11(1):543.",
    answers: [
      {
        answer: ">5%",
        correct: "wrong",
        response: "<p class='incorrect'><strong>Not quite right – the correct answer is 15-25%</strong><br>According to a published source, the global<br>prevalence of PPD symptoms is 17.2% or<br>approximately 1 in 6 individuals.<sup>1</sup></p>"
      },
      {
        answer: "5-15%",
        correct: "wrong",
        response: "<p class='incorrect'><strong>Not quite right – the correct answer is 15-25%</strong><br>According to a published source, the global<br>prevalence of PPD symptoms is 17.2% or<br>approximately 1 in 6 individuals.<sup>1</sup></p>"
      },
      {
        answer: "15-25%",
        correct: "correct",
        response: "<p class='correct'><strong>Well done! That’s correct.</strong><br>According to a published source, the<br>prevalence of patients who screen positive for<br>PPD symptoms is 17.2% or approximately 1 in<br>6 individuals.<sup>1</sup></p>"
      },
      {
        answer: "25-35%",
        correct: "wrong",
        response: "<p class='incorrect'><strong>Not quite right – the correct answer is 15-25%</strong><br>According to a published source, the global<br>prevalence of PPD symptoms is 17.2% or<br>approximately 1 in 6 individuals.<sup>1</sup></p>"
      }
    ]
  }
];

let componentKey = ref(0);

let num = theValues.num;
let dropZone = null;
let element = null;
let offsetX = 0;
let offsetY = 0;

const forceRerender = () => {
  componentKey.value += 1;
  num = theValues.num;
  answersArr = questions[num].answers;
  shuffle(answersArr);
};

const goHome = () => {
  router.push({ name: "homeview" });
};

const onDrag = (e) => {
  if (!element) return;

  // Handle both mouse and touch events
  const event = e.touches ? e.touches[0] : e;

  element.style.right = "unset";
  element.style.left = event.pageX - offsetX + "px";
  element.style.top = event.pageY - offsetY + "px";
};

const onDrop = (e) => {
  e.preventDefault();
  if (!element) return;

  let box = dropZone.getBoundingClientRect();

  element.style.cursor = "grab";

  // Only release pointer capture if it's a pointer event
  if (e.pointerId !== undefined) {
    element.releasePointerCapture(e.pointerId);
  }

  //dropZone = document.getElementsByClassName("quiz__dropzone")[0];
  const theAnswer = theValues.theAnswer;
  const ansElement = document.getElementById(theAnswer);

  if (parseFloat(element.style.left) > box.left && parseFloat(element.style.left) < box.right) {
    dropZone.innerHTML = "";
    dropZone.appendChild(ansElement);
    dropZone.classList.remove("faded");

    ansElement.classList.remove(`pos${theAnswer}`);

    document.getElementById("restartBtn").style.display = "block";
    document.getElementById("submitBtn").style.display = "block";
    document.getElementById("submitBtn").dataset.log = "Question " + (num + 1) + ": " + ansElement.innerText;

    // Cleanup
    element = null;
    document.removeEventListener("pointermove", onDrag);
    document.removeEventListener("pointerup", onDrop);
    document.removeEventListener("touchmove", onDrag);
    document.removeEventListener("touchend", onDrop);
  }
};

onMounted(() => {
  document.body.classList.remove("home");
});

const onNext = () => {
  theValues.num += 1;
  if (theValues.num >= questions.length) {
    router.push({ name: "resultsview" });
  }
  forceRerender();
};

const onSubmit = () => {
  document.getElementById("inhibitor").style.display = "block";
  dropZone = document.getElementsByClassName("quiz__dropzone")[0];
  const id = dropZone.querySelector(".quiz__question").id;
  //setTimeout(function() {
  if (dropZone.querySelector(".quiz__question").dataset.answer === "correct") theValues.total += 1;
  dropZone.innerHTML = questions[num].answers[id - 1].response;
  dropZone.classList.add("show");
  document.getElementById("submitBtn").style.display = "none";
  document.getElementById("nextBtn").style.display = "block";
  //},2000);
};

const shuffle = (array) => {
  let currentIndex = array.length;
  while (currentIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
};

const startDrag = (e) => {
  element = e.currentTarget;
  theValues.theAnswer = e.target.id;

  // Handle both touch and pointer events
  const event = e.touches ? e.touches[0] : e;

  // Only use setPointerCapture if it's a pointer event
  if (e.pointerId !== undefined) {
    element.setPointerCapture(e.pointerId);
  }

  element.style.cursor = "grabbing";

  offsetX = event.clientX - element.getBoundingClientRect().left;
  offsetY = event.clientY - element.getBoundingClientRect().top;

  dropZone = document.getElementsByClassName("quiz__dropzone")[0];
  dropZone.classList.add("faded");

  // Add event listeners for both pointer and touch events
  document.addEventListener("pointermove", onDrag);
  document.addEventListener("pointerup", onDrop);
  document.addEventListener("touchmove", onDrag, { passive: false });
  document.addEventListener("touchend", onDrop);
};

let answersArr = questions[num].answers;
shuffle(answersArr);
</script>

<template>
  <img data-log="Home" @click="goHome" class="quiz__home" src="/assets/images/Home.svg" alt="Back to home page" />
  <transition>
    <div class="quiz" :class="`question-${num}`" :key="componentKey">
      <div class="quiz__header" v-html="questions[num].question"></div>

      <div id="inhibitor"></div>

      <div v-for="(answer, index) in answersArr" :key="index" class="quiz__question" :id="`${index + 1}`" :class="`pos${index + 1}`" :data-answer="answer.correct" draggable v-html="answer.answer" @pointerdown="startDrag" @pointerup="onDrop" @pointermove="onDrag" @mousemove="onDrag"></div>

      <div class="quiz__dropzone" v-html="startPrompt" @drop="onDrop($event)" @mouseup="onDrop($event)" @dragover.prevent @dragenter.prevent></div>

      <div class="quiz__references" v-html="questions[num].references"></div>

      <div class="quiz__footer">
        <button data-log="Restart" @click="forceRerender" id="restartBtn" class="btn btn-blue">Try again</button>
        <div>{{ num + 1 }} / 5</div>
        <button data-log="Submit answer" @click="onSubmit" id="submitBtn" class="btn btn-white">Submit</button>
        <button data-log="Next question" @click="onNext" id="nextBtn" class="btn btn-white">Next</button>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.quiz {
  height: 100vh;
  width: 100vw;
  padding: 5vh 6vw 0 6vw;
  font-family: $font;
  color: $hexWhite;
  position: relative;

  &__home {
    position: absolute;
    right: 2vh;
    top: 2vh;
    z-index: 15;
  }

  &.question-0 {
    > .quiz__question,
    > .quiz__dropzone > .quiz__question {
      padding: 0 1vw;
    }

    :deep(.incorrect) {
      @include r(font-size, 26, 26, 26);
      margin-top: 6vh;
    }
    :deep(.correct) {
      @include r(font-size, 26, 26, 26);
      margin-top: 6vh;
    }
  }

  &.question-1 {
    :deep(.incorrect) {
      @include r(font-size, 26, 26, 26);
      margin-top: 6vh;
    }
    :deep(.correct) {
      @include r(font-size, 26, 26, 26);
      margin-top: 6vh;
    }
  }

  &.question-2 {
    > .quiz__question,
    > .quiz__dropzone > .quiz__question {
      @include r(font-size, 16, 16, 16);
      padding: 0 1vw;
    }
    :deep(.incorrect) {
      @include r(font-size, 26, 26, 26);
      margin-top: 6vh;
    }
    :deep(.correct) {
      @include r(font-size, 26, 26, 26);
      margin-top: 6vh;
    }
  }

  &.question-3 {
    :deep(.incorrect) {
      @include r(font-size, 26, 26, 26);
      margin-top: 6vh;
    }
    :deep(.correct) {
      @include r(font-size, 26, 26, 26);
      margin-top: 6vh;
    }
  }

  &.question-4 {
    > .quiz__question,
    > .quiz__dropzone > .quiz__question {
      font-size: 1.5vw;
      padding: 0 1vw;
      display: flex;
      justify-content: center;
    }
    :deep(.incorrect) {
      @include r(font-size, 26, 26, 26);
      margin-top: 6vh;
    }
    :deep(.correct) {
      @include r(font-size, 26, 26, 26);
      margin-top: 6vh;
    }
  }

  &__footer {
    position: absolute;
    bottom: 3vh;
    left: 43vw;
    display: flex;
    flex-direction: row;
    font-size: 1.5vw;
    justify-content: space-between;
    align-items: flex-end;
    width: 20vw;
    text-align: center;

    .btn {
      text-transform: uppercase;
      display: none;
    }

    div {
      margin: 0 auto;
    }
  }

  &__header {
    font-size: 2.3vw;
    text-align: center;
  }

  &__references {
    position: absolute;
    font-size: 0.5vw;
    width: 25vw;
    bottom: 3vh;
  }

  &__question {
    @include r(width, 272, 272, 272);
    @include r(height, 137, 137, 137);
    @include r(font-size, 26, 26, 26);
    font-family: "FranklinGothicDemi", arial, sans-serif;
    font-weight: 100;
    background-color: $hexAnswerGreen;
    border-radius: 10px;
    box-shadow: inset 2px 2px 2px 0 rgba(255, 255, 255, 0.5), inset -2px -2px 2px 0 rgba(0, 0, 0, 0.5);
    padding: 0 2vw 0 1vw;
    display: flex;
    align-items: center;
    min-height: 9vh;
    cursor: grab;

    &.pos1 {
      position: absolute;
      top: 38vh;
    }

    &.pos2 {
      position: absolute;
      top: 55.5vh;
    }

    &.pos3 {
      position: absolute;
      top: 38vh;
      right: 6vw;
    }

    &.pos4 {
      position: absolute;
      top: 55.5vh;
      right: 6vw;
    }
  }

  &__dropzone {
    position: absolute;
    top: 30vh;
    left: 30vw;
    width: 42vw;
    height: 37vh;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1.5vw;
    @include r(font-size, 32, 32, 32);

    :deep(strong) {
      font-family: "FranklinGothicDemi", arial, sans-serif;
    }

    :deep(.quiz__pointer) {
      @include r(width, 172, 172, 172);
      margin: 5vh auto 0;
    }

    :deep(p) {
      margin-top: 0;
    }

    :deep(.small) {
      @include r(font-size, 24, 24, 24);
      @include r(margin-top, -24, -24, -24);
      margin-bottom: 0;
    }

    > .quiz__question {
      text-align: left;
    }
  }
}

:deep(.faded) {
  opacity: 0.3;
}

/*:deep(.hide) {
  visibility: hidden;
  opacity: 0;
  -webkit-transition: opacity 25ms ease-out, visibility 0ms ease-in 25ms;
  -moz-transition: opacity 25ms ease-out, visibility 0ms ease-in 25ms;
  -ms-transition: opacity 25ms ease-out, visibility 0ms ease-in 25ms;
  -o-transition: opacity 25ms ease-out, visibility 0ms ease-in 25ms;
  transition: opacity 25ms ease-out, visibility 0ms ease-in 25ms;
}*/

:deep(.quiz__dropzone.show) {
  visibility: visible;
  opacity: 1;
  transition-delay: 0ms;
}

#inhibitor {
  display: none;
  position: absolute;
  top: 10vh;
  left: 0;
  right: 0;
  height: 80vh;
  background-color: transparent;
  z-index: 99;
}
</style>
