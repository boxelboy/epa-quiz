<template>
	<div class="container analyticsWrapper">
		<div class="col-100">
			<h1>Analytics</h1>
			<p>Use the drop down below to get the data from all csv files being populated. These files are being found here <br><span class="path">{{state.strFilesPath}}</span></p>
			<form method="post" @submit.prevent="readCSVFile">
				<label>
					<select name="files">
						<option v-for="strOption of state.arrSelectOptions" :value="strOption">{{strOption}}</option>
					</select>
				</label>
				<input type="submit" value="Get file data">
			</form>
			<form method="post" @submit.prevent="emailCSVFile">
				<label>
					<input type="email" value="" name="email" placeholder="Email address" />
				</label>
				<input type="submit" value="Email all data files">
				<span v-if="state.emailSent" class="email-sent">Email sent &check;</span>
			</form>
			<div class="fileResults" v-if="state.strErrorMessage === ''">
				<table v-if="state.arrTableBody.length > 0">
					<thead>
					<tr>
						<th v-for="strTableHeader of state.arrTableHeaders">{{strTableHeader}}</th>
					</tr>
					</thead>
					<tbody>
			          <template v-for="arrTableRow of state.arrTableBody">
			            <tr v-if="state.arrTableBody.length > 0">
			              <td v-for="strTableColumn of arrTableRow">{{strTableColumn}}</td>
			            </tr>
			          </template>
					</tbody>
				</table>
			</div>
			<p v-else style="color: #a00;">
				{{ state.strErrorMessage }}
			</p>
		</div>
	</div>
</template>
<script>
import {onMounted, reactive} from "vue";

export default {
	name: "analyticsDebug",
	props:{
		isExe: Boolean,
		logPath: String
	},
  setup(props){
    const state = reactive({
		arrSelectOptions: [],
		arrTableHeaders: [],
		arrTableBody: [],
		strFilesPath: "",
		strLogPath: props.logPath,
		pathPackage: window.require("path"),
		fsPackage: window.require("fs"),
		strErrorMessage: "",
		emailSent: false
    });

	  const emailCSVFile = (event) => {
		  event.preventDefault();
		  state.emailSent = false;
		  let elmForm = event.target;
		  let emailAddressEl = elmForm.querySelector('[name=email]');
		  let emailAddress = emailAddressEl.value;
		  const sgMail = window.require('@sendgrid/mail');
		  sgMail.setApiKey(import.meta.env.VITE_SENDGRID_API_KEY);

		  const msg = {
			  to: emailAddress,
			  from: 'noreply@em6331.tceg.com',
			  subject: 'Data Files',
			  text: 'Data Files.',
			  html: '<strong>Data Files.</strong>',
			  attachments: []
		  }
		  if (state.arrSelectOptions.length) {
			  state.arrSelectOptions.forEach(dataFile => {
				  msg.attachments.push({
					  content: state.fsPackage.readFileSync(`${state.strFilesPath}/${dataFile}`).toString("base64"),
					  filename: dataFile,
					  type: "text/csv",
					  disposition: "attachment"
				  })
			  })
		  }

		  sgMail
			  .send(msg)
			  .then(() => {
				  emailAddressEl.value = '';
				  state.emailSent = true;
			  })
			  .catch((error) => {
				  state.strErrorMessage = "Could not send email";
			  });

	  }

    const readCSVFile = (event) => {
      event.preventDefault();
      let elmForm = event.target;
      let strFileName = elmForm.querySelector('select').value;

      // clear out the arrays before using again if already used.
      state.arrTableHeaders = [];
      state.arrTableBody = [];

      // get the data from file request and split by new line to return back an array.
      let fileData = state.fsPackage.readFileSync(state.pathPackage.join(state.strFilesPath,'',strFileName),"utf-8");
      let arrData = fileData.split('\n');

      // loop through the array and break the data string back to array so it's easier to populate array
      if(arrData.length > 0){
        for(let intRow = 0; intRow < arrData.length; intRow++){
          let strRow = arrData[intRow];
          // detect if there is a new line added by accident if not proceed
          if(strRow !== ""){
            let arrRowData = strRow.split(',');
            if(arrRowData.length > 0){
              if(intRow === 0){
                state.arrTableHeaders = arrRowData;
              } else {
                state.arrTableBody.push(arrRowData);
              }
            } else {
              state.strErrorMessage = "No data found in row";
            }
          }
        }
      } else {
        state.strErrorMessage = "No data found in file";
      }
    }

    onMounted(() => {
      // loop through directory and pull all .csv files detected
      if(props.isExe){
        state.strFilesPath = state.strLogPath;
      } else {
        state.strFilesPath = state.pathPackage.join(__dirname,'..','..','..','..','..','..');
      }
      // find the files and build up the select option to use for later
      state.fsPackage.readdirSync(state.strFilesPath).forEach(function(file){
        if(file.includes('.csv')){
          state.arrSelectOptions.push(file);
        }
      }.bind(state));
    });

    return {
		state,
		readCSVFile,
		emailCSVFile
    };

  },
}
</script>
<style lang="scss">
.analyticsWrapper{
	.path{
		background-color: $hexMorningMist;
		display: inline-block;
		@include r(margin-top,20,20,20);
		@include r(padding-top,10,10,10);
		@include r(padding-bottom,10,10,10);
		@include r(padding-left,15,15,15);
		@include r(padding-right,15,15,15);
		@include r(border-radius,4,4,4);
	}
	form{
		select{
			@include r(padding-top,10,10,10);
			@include r(padding-bottom,10,10,10);
			background-color: $hexMorningMist;
			border: 2px solid $hexMorningMist;
		}
		input[type=email]{
			@include r(padding-top,10,10,10);
			@include r(padding-left,15,15,15);
			@include r(padding-right,15,15,15);
			@include r(padding-bottom,10,10,10);
			background-color: $hexMorningMist;
			border: 2px solid $hexMorningMist;
			@include r(border-radius,4,4,4);
		}
		input[type="submit"]{
			-webkit-appearance: none;
			background-color:$hexAqua;
			border: 2px solid $hexAqua;
			color: $hexBlackBerry;
			text-decoration: none;
			@include r(padding-top,10,10,10);
			@include r(padding-bottom,10,10,10);
			@include r(padding-left,15,15,15);
			@include r(padding-right,15,15,15);
			@include r(margin-left,15,15,15);
			@include r(border-radius,50,50,50);
			transition: all 0.5s ease;
			&:hover{
				opacity: 0.7;
			}
		}
	}
	table{
		width: 100%;
		@include r(margin-top,30,30,30);
		thead{
			th{
				background-color: $hexBlackBerry;
				color: $hexWhite;
				@include r(padding,10,10,10);
			}
		}
		tbody{
			tr{
				color: $hexBlack;
				&:nth-child(even){
					background-color: $hexMorningMist;
				}
				td{
					padding: 10px;
					text-align: center;
				}
			}
		}
	}
}
</style>