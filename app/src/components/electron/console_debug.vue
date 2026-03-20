<template>
	<div class="container debugWrapper">
		<div class="col-100">
			<h1>Console</h1>
			<p>When debug bar is activated any logs, warnings or errors will now be logged and can be viewed below.</p>
			<div class="box consoleLogs">
				<div class="boxHeader">
					<span>Debug Logs</span>
					<a href="#" @click="clearLogs('log')">Clear all logs</a>
				</div>
				<div class="boxContent">
					<ul v-if="consoleInfo.arrLogs.length > 0">
						<li v-for="objLog of consoleInfo.arrLogs.slice().reverse()">
							<strong>{{objLog.title}} </strong>
							<span class="created">{{objLog.datetime}}</span>
						</li>
					</ul>
					<span v-else>No logs logged.</span>
				</div>
			</div>
			<div class="box consoleWarnings">
				<div class="boxHeader">
					<span>Warning Logs</span>
					<a href="#" @click="clearLogs('warning')">Clear all Warnings</a>
				</div>
				<div class="boxContent">
					<ul v-if="consoleInfo.arrWarnings.length > 0">
						<li v-for="objWarning of consoleInfo.arrWarnings.slice().reverse()">
							<div class="logHeader">
								<strong>{{objWarning.title}}</strong>
								<span class="created">{{objWarning.datetime}}</span>
							</div>
							<span>{{objWarning.message}}</span>
						</li>
					</ul>
					<span v-else>No warnings logged.</span>
				</div>
			</div>
			<div class="box consoleErrors">
				<div class="boxHeader">
					<span>Error Logs</span>
					<a href="#" @click="clearLogs('error')">Clear all errors</a>
				</div>
				<div class="boxContent">
					<ul v-if="consoleInfo.arrErrors.length > 0">
						<li v-for="objError of consoleInfo.arrErrors.slice().reverse()">
							<div class="logHeader">
								<strong>{{objError.message}}</strong>
								<span class="created">{{objError.datetime}}</span>
							</div>
							<span>{{objError.stack}}</span>
						</li>
					</ul>
					<span v-else>No errors logged.</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import {reactive} from "vue";

  export default {
		name: "consoleDebug",
		props: {
			consoleInfo: Object
		},
    emits: ['updateConsoleData'],
    setup(props, {emit}){
      const state = reactive({

      });
      const clearLogs = (strType) => {
        let blConfirmRemoval = confirm('Are you sure you would like to clear '+strType+'?');
        if(blConfirmRemoval){
          switch(strType){
            case 'log':
              emit('updateConsoleData',[],'log');
              break;
            case 'warning':
              emit('updateConsoleData',[],'warning');
              break;
            case 'error':
              emit('updateConsoleData',[],'error');
              break;
          }
        }
      }

      return{
        state,
        clearLogs
      };
    }
	}
</script>
<style lang="scss">
	.debugWrapper{
		.box{
			@include r(margin-top,30,30,30);
			@include r(margin-bottom,30,30,30);
			@include flexbox();
			@include flex-wrap(wrap);

			.boxHeader{
				background-color:$hexBlackBerry;
				color: $hexWhite;
				width: 100%;
				@include flexbox();
				@include justify-content(space-between);
				@include r(padding,15,15,15);

				a{
					color: $hexWhite;
				}
			}
			.boxContent{
				background-color: $hexMorningMist;
				width: 100%;
				@include flexbox();
				@include flex-wrap(wrap);
				@include r(padding,15,15,15);
				max-height: 225px;
				overflow: auto;
				ul{
					list-style: none;
					width: 100%;
					margin-top: 0;
					margin-bottom: 0;

					li{
						background-color: $hexAqua;
						color: $hexWhite;
						width: 100%;
						display: inline-block;
						@include r(padding,15,15,15);
						@include r(font-size,14,14,14);
						@include r(line-height,18,18,18);
						@include fontRegular($font);
						border-radius: 14px;
						position: relative;

						.created{
							position: absolute;
							top: -10px;
							right: 0px;
							background-color: rgba(255,255,255,0.8);
							color: $hexBlackBerry;
							@include fontSemiBold($font);
							@include r(font-size,12,12,12);
							@include r(line-height,14,14,14);
							@include r(border-radius,14,14,14);
							@include r(padding,5,5,5);
						}
					}
				}
			}
		}
	}
</style>