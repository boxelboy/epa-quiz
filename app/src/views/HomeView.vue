<script setup>
import { onMounted, inject } from "vue";
import router from "@/router";

const theValues = inject("theValues");
theValues.expertise = "not given";
theValues.num = 0;
theValues.total = 0;

let expertise = null;

onMounted(async () => {
  document.body.classList.add("home");
});

const getExpertise = () => {
  if (expertise !== null) {
    theValues.expertise = expertise;
    startQuiz();
  }
};

const startQuiz = () => {
  router.push({ name: "quizview" });
};
</script>

<template>
  <main>
    <h1>Learn more about Postpartum Depression<br />with our interactive review</h1>
    <section>
      <h2>Submit your area of expertise to start our interactive review:</h2>
      <form>
        <div>
          <label><input data-log="Expertise: psychiatrist" type="radio" value="psychiatrist" name="expertise" v-model="expertise" /> Psychiatrist</label>
          <label><input type="radio" data-log="Expertise: obgyn" value="obgyn" name="expertise" v-model="expertise" /> OBGYN</label>
          <label><input type="radio" value="pcp" data-log="Expertise: pcp" name="expertise" v-model="expertise" /> PCP</label>
          <label><input type="radio" value="psychologist" data-log="Expertise: psychologist" name="expertise" v-model="expertise" /> Psychologist</label>
          <label><input type="radio" value="midwife" name="expertise" data-log="Expertise: midwife" v-model="expertise" /> Midwife</label>
          <label><input type="radio" value="other" data-log="Expertise: other" name="expertise" v-model="expertise" /> Other</label>
        </div>
        <div>
          <button @click="getExpertise()" class="btn btn-white">Submit</button>
          <button data-log="Expertise: not given" @click="startQuiz()" class="btn btn-blue">Skip</button>
          <div>Alternatively, skip to start</div>
        </div>
      </form>
    </section>
  </main>
</template>

<style lang="scss" scoped>
h1 {
  font-size: 2.5vw;
  color: $hexWhite;
  margin: 20vh 0 0 7vw;
  font-weight: normal;
}

section {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60vh;
  background-color: rgba(37, 115, 186, 0.7);
  padding: 7vw 0 0 7vw;
  color: $hexWhite;

  h2,
  label {
    font-size: 1.5vw;
  }

  form {
    display: flex;
    flex-direction: row;

    div:first-child {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      align-items: end;
      grid-column-gap: 3vw;

      input[type="radio"] {
        margin-right: 0.75vw;

        &:after {
          height: 1.5vh;
          width: 1.5vh;
          background-color: white;
          border-radius: 50%;
          top: -2px;
          left: -1px;
          position: relative;
          content: "";
          display: inline-block;
          visibility: visible;
          border: 2px solid white;
        }

        &:checked:after {
          background-color: $hexGreen;
          height: 1.5vh;
          width: 1.5vh;
          border-radius: 50%;
          top: -2px;
          left: -1px;
          position: relative;
          content: "";
          display: inline-block;
          visibility: visible;
          border: 2px solid white;
        }
      }
    }

    div:nth-child(2) {
      margin-left: 5vw;
      display: flex;
      flex-direction: row;
      align-self: flex-end;
      justify-content: space-around;

      & > * {
        margin-right: 2.5vw;
      }

      div {
        font-family: $font;
        font-size: 1.2vw;
        align-self: flex-end;
        padding-bottom: 0.5vh;
      }
    }
  }
}
</style>
