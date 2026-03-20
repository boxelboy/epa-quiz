<template>
  <div class="container ftpWrapper">
    <div class="col-100">
      <h2>FTP/ZIP</h2>
      <p>If you don't have an internet connection you can use the zip option. This will zip up all csv files and provide with a link to the file. If you do have an internet connection use the test connection button first to see if you can connect to the ftp. When connect successfully you will then be able to FTP all found csv files. </p>
    </div>
    <div class="zip col-100 border">
      <button class="button" @click="zipFiles">Zip csv files</button>
      <span class="status" v-if="state.strZipMessage">{{state.strZipMessage}}</span>
      <span class="status filePath" v-if="state.strZipPath">file path: {{state.strZipPath}}</span>
      <span class="status red" v-if="state.strZipError">{{state.strZipError}}</span>
    </div>
    <div class="connectionStatus col-100">
      <button class="button" @click="checkFTPConnection">Test Connection</button>
      <span class="status">{{state.strTestConnectionMessage}}</span>
      <span class="status red" v-if="state.strErrorMessage">{{state.strErrorMessage}}</span>
    </div>
    <div class="ftpUpload col-100">
      <button class="button" :disabled="!state.blConnected" @click="uploadAllCSVFiles">Upload All CSV files</button>
      <span class="status" v-if="state.strErrorUploadMessage">{{state.strErrorUploadMessage}}</span>
      <ul>
        <li v-for="file of state.arrFiles">File uploaded: {{file}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import {onMounted, reactive} from "vue";

export default {
  name: "deploy",
  setup(props){
    const state = reactive({
      blConnected: false,
      arrFiles: [],
      strErrorMessage: "",
      strErrorUploadMessage: "",
      strTestConnectionMessage: "Not connected, test connection",
      strZipMessage: "",
      strZipError: "",
      strZipPath: ""
    });

    const zipFiles = (event) => {
      event.preventDefault();
      fetch(`${import.meta.env.VITE_SERVERROOT}/deploy/zip`, {
        headers: {
          "Content-Type": "application/json",
        }
      })
        .then(res => res.json())
        .then((data) => {
          if(data.statusCode === 200){
            state.strZipMessage = data.message;
            state.strZipPath = data.folder;
            state.strZipError = "";
          }else{
            state.strZipMessage = null;
            state.strZipError = data.message;
          }
        })
        .catch((error) => {
          state.strZipError = error;
          console.error("error:", error);
        });
    };

    const checkFTPConnection = (event) => {
      event.preventDefault();
      fetch(`${import.meta.env.VITE_SERVERROOT}/deploy/connection`, {
        headers: {
          "Content-Type": "application/json",
        }
      })
        .then(res => res.json())
        .then((data) => {
          if(data.statusCode === 200){
            state.strTestConnectionMessage = data.message;
            state.blConnected = true;
          }else{
            state.strTestConnectionMessage = "Connection failed";
            state.strErrorMessage = data.message;
            state.blConnected = false;
          }
        })
        .catch((error) => {
          state.strErrorMessage = error;
          console.error("error:", error);
        });
    };

    const uploadAllCSVFiles = (event) => {
      event.preventDefault();
      event.target.textContent = "Uploading...";
      fetch(`${import.meta.env.VITE_SERVERROOT}/deploy/upload`, {
        headers: {
          "Content-Type": "application/json",
        }
      })
        .then(res => res.json())
        .then((data) => {
          if(data.statusCode === 200){
            event.target.textContent = data.message;
            event.target.disabled = true;
            state.arrFiles = data.files;
          }else{
            event.target.textContent = data.message;
            event.target.disabled = false;
          }
        })
        .catch((error) => {
          state.strErrorUploadMessage = error;
          console.error("error:", error);
        });
    }

    onMounted(() => {
    });

    return {
      state,
      checkFTPConnection,
      uploadAllCSVFiles,
      zipFiles
    };

  },
}
</script>
<style lang="scss">
.ftpWrapper{
  .status{
    @include r(margin-left, 15, 15, 15);
  }
  .zip{
    .status{
      margin-top: 0;

      &.filePath{
        margin-left: 0;
        @include r(margin-top,15,15,15);
      }
    }
  }
}
</style>