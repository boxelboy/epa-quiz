import './assets/scss/styles.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './app.vue';
import router from './router';
import analytics from "@/helpers/local_analytics";
import isElectron from "@/helpers/is_electron";

const app = createApp(App);

app.use(createPinia());
app.use(router);

// when building the electron exe this includes our env file. If not it only uses the computer environment.
if(isElectron()){
	const path = window.require("path");
	const dotenv = window.require("dotenv");
	dotenv.config({path: path.join(__dirname,'..','..','resources','.env')});
}

// output the path here
if(isElectron() && JSON.parse(import.meta.env.VITE_ELECTRON_EXE) === true){
	const path = window.require("path");
	console.log("Log files are stored here:",path.join(__dirname,'..','..','..'));
	console.log("File swap path",path.join(__dirname,'..','..','public','assets'));
}

removeEventListener("click",event => {
	analytics("click",event);
})
addEventListener("click", event => {
	analytics("click",event);
});

app.mount('#app')
