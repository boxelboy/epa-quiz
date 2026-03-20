<template>
	<div class="debugBar">
		<div class="container">
			<div class="pathInfo col-100">
				<ul>
					<li class="hotswap" :class="state.blIsExe ? 'enabled' : 'disabled'">
						Hotswap: {{state.blIsExe ? "On" : "Off"}}
					</li>
					<li v-if="isElectron() && state.blIsExe">Resources path: {{state.strResourcesPath}}</li>
					<li v-if="isElectron() && state.blIsExe">Log files path: {{state.strLogPath}}</li>
					<li class="disabled" v-else>Path: Not running in exe</li>
					<li class="modalLinks" v-if="isElectron()">
                        <a class="modalLink" href="#" title="Open FTP deployment" @click="openDebugModal('deploy')">Open Deployment window</a>
						<a class="modalLink" href="#" title="Open Analytics log window" @click="openDebugModal('analytics')">Open Analytics log window</a>
						<a class="modalLink" href="#" title="Open console log window" @click="openDebugModal('console')">Open console log window</a>
					</li>
				</ul>
			</div>
		</div>
		<a href="#" class="closeDebug" title="Close debug bar" @click="closeDebugBar">
			<span class="line line-1"></span>
			<span class="line line-2"></span>
		</a>
	</div>
	<div class="debugModalBox" style="display: none">
		<div class="debugModalWindow">
			<a href="#" class="debugModalClose" @click="closeDebugModal">
				<span class="line line-1"></span>
				<span class="line line-2"></span>
			</a>
			<div class="debugModalContent">
				<AnalyticsDebug :logPath="state.strLogPath" :isExe="state.blIsExe" v-if="state.blAnalytics"/>
				<ConsoleDebug :consoleInfo="objConsole" @updateConsoleData="updateConsoleData" v-if="state.blConsole"/>
                <Deploy v-if="state.blDeployment"/>
			</div>

		</div>
	</div>
</template>
<script>
import isElectron from "../../helpers/is_electron";
import AnalyticsDebug from "@/components/electron/analytics_debug.vue";
import ConsoleDebug from "@/components/electron/console_debug.vue";
import {reactive,ref} from "vue";
import Deploy from "@/components/electron/deploy.vue";
export default {
	name: "Debug",
	components: {Deploy, ConsoleDebug, AnalyticsDebug},
  props: {
    blDebugState: Boolean
  },
  emits: ['updateDebugState'],
  setup(props, { emit }){
    const state = reactive({
      strLogPath: '',
      strResourcesPath: '',
      blIsExe: JSON.parse(import.meta.env.VITE_ELECTRON_EXE),
      strDebugWindowContent: '',
      blDeployment: false,
      blAnalytics: false,
      blConsole: false,
    });
    const objConsole  = ref( {
      arrLogs: [],
      arrWarnings: [],
      arrErrors: []
    });

    const updateConsoleData = (arrNewLogs,strType) => {
      switch(strType){
        case "log":
          objConsole.value.arrLogs = arrNewLogs;
          break;
        case "warning":
          objConsole.value.arrWarnings = arrNewLogs;
          break;
        case "error":
          objConsole.value.arrErrors = arrNewLogs;
          break;
      }
    };

    const closeDebugBar = () => {
      emit('updateDebugState',false);
    };

    const openDebugModal = (strType) => {
      // decide which type of component to include
      if(strType === "analytics"){
        state.blAnalytics = true;
      } else if(strType === "console") {
        state.blConsole = true;
      } else {
        state.blDeployment = true;
      }
      // open modal
      event.preventDefault();
      document.querySelector(".debugModalBox").style.display = "flex";
    };

    const closeDebugModal = () => {
      //reset state
      state.blAnalytics = false;
      state.blConsole = false;
      state.blDeployment = false;
      document.querySelector(".debugModalBox").style.display = "none";
    };

    const logDateTime = () => {
      let date = new Date();
      let logDate = date.getDate().toString().padStart(2,"0")+'-'+(date.getMonth()+1).toString().padStart(2,"0")+'-'+date.getFullYear();
      let logTime = date.getHours().toString().padStart(2,"0")+":"+date.getMinutes().toString().padStart(2,"0")+":"+date.getSeconds().toString().padStart(2,"0");

      return logDate+" "+logTime;
    };

    if(isElectron() && state.blIsExe){
      const path = window.require("path");
      state.strLogPath = path.join(__dirname,'..','..','..');
      state.strResourcesPath = path.join(__dirname,'..','..','public','assets');
    }

    const _log = console.log,
      _warn = console.warn,
      _error = console.error;

    console.log = function() {
      objConsole.value.arrLogs.push(
        {
          method: 'log',
          title: arguments[0],
          datetime: logDateTime()
        }
      )
      return _log.apply(console,arguments);
    }.bind(state);

    console.warn = function() {
      objConsole.value.arrWarnings.push(
        {
          method: 'warn',
          title: arguments[0],
          message: arguments[2],
          datetime: logDateTime()
        }
      );
      return _warn.apply(console, arguments);
    }.bind(state);

    console.error = function() {
      objConsole.value.arrErrors.push(
        {
          method: 'error',
          message: (arguments[0].message !== undefined) ? arguments[0].message : arguments[0],
          stack: (arguments[0].stack !== undefined) ? arguments[0].stack : arguments[0],
          datetime: logDateTime()
        }
      );
      return _error.apply(console, arguments);
    }.bind(state);

    return{
      state,
      objConsole,
      updateConsoleData,
      closeDebugBar,
      isElectron,
      openDebugModal,
      closeDebugModal,
      logDateTime,
    }
  },
}
</script>
<style lang="scss">
.debugBar{
	position: fixed;
	bottom: 0;
	right: 0;
	left: 0;
	background-color: $hexBlackBerry;
	padding: 15px 0 15px;

	.container{
		max-width: 100%;
	}
	.pathInfo{
		ul{
			list-style: none;
			padding: 0;
			margin: 0;
			@include flexbox();
			@include flex-wrap(wrap);
			@include align-items(center);

			li{
				border-radius: 28px;
				background-color: $hexAqua;
				margin-bottom: 0;
				@include r(margin-right,10,10,10);
				@include r(padding,10,10,10);
				@include r(font-size,12,12,12);
				@include r(line-height,16,16,16);

				&.disabled{
					background-color: $hexRed;
					color: $hexWhite;
				}

				&.modalLinks{
					background-color: transparent;
					margin-left: auto;
					margin-right: 0;
					a{
						display: inline-block;
						color: $hexWhite;
						text-decoration: underline;
						margin:0 5px;
					}
				}
			}
		}
	}
	.disabled{
		background-color: $hexRed;
	}
	.closeDebug{
		display: inline-block;
		width: 30px;
		height: 30px;
		background-color: $hexBlackBerry;
		position: absolute;
		top: -30px;
		right: 0;

		.line{
			display: inline-block;
			width: 18px;
			height: 2px;
			background-color: $hexWhite;
			position: absolute;
			bottom: 12px;

			&.line-1{
				transform: rotate(131deg);
				left: 6px;
				right: auto;
			}
			&.line-2{
				transform: rotate(229deg);
				left: auto;
				right: 6px;
			}
		}
	}
}
.debugModalBox{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0,0,0,0.75);
	@include flexbox();
	@include justify-content(center);
	@include align-items(center);

	.debugModalWindow{
		background-color: $hexWhite;
		width: 100%;
		display: inline-block;
		margin:0 auto;
		@include r(padding,30,30,30);
		@include r(max-width,1024,1024,1024);
		position: relative;

		.debugModalContent{
			max-height: 80vh;
			overflow: auto;

			h1,h2,h3,h4,h5,h6{
				margin: 0;
			}
		}

		.debugModalClose{
			display: inline-block;
			width: 30px;
			height: 30px;
			background-color: $hexBlackBerry;
			position: absolute;
			top:-15px;
			right:-15px;
			border-radius:50%;

			.line{
				display: inline-block;
				width: 18px;
				height: 2px;
				background-color: $hexWhite;
				position: absolute;
				top:14px;

				&.line-1{
					transform: rotate(131deg);
					left: 6px;
					right: auto;
				}
				&.line-2{
					transform: rotate(229deg);
					left: auto;
					right: 6px;
				}
			}
		}
	}
}
</style>
