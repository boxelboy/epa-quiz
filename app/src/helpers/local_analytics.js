import isElectron from "./is_electron";
import { values } from "@/stores/values";

function analytics(strEventType, data) {
  const result = (values.total / 5) * 100;
  const date = new Date();
  let strToday = String(date.getUTCDate()).padStart(2, "0") + "-" + String(date.getUTCMonth() + 1).padStart(2, "0") + "-" + date.getUTCFullYear();

  let objAnalytics = {};
  objAnalytics[strToday] = {
    routes: [],
    clicks: [],
    results: []
  };

  // record different events depending on event type
  if (strEventType === "click") {
    let strClickEventName = "";
    if (data.target.getAttribute("data-log") !== null) {
      strClickEventName = data.target.getAttribute("data-log");
      objAnalytics[strToday].clicks.push({
        name: strClickEventName,
        trigger_page: window.location.pathname
      });
    }
  } else if (strEventType === "route-change") {
    let strPageName = "";
    strPageName = data.to_data.name !== "" ? data.to_data.name : window.location.pathname.split("/")[1];
    objAnalytics[strToday].routes.push({
      name: strPageName,
      path: data.to_data.path
    });

    if (strPageName === "resultsview") {
      objAnalytics[strToday].results.push({
        name: "Results: " + result + "%",
        path: data.to_data.path
      });
    }
  }

  if (isElectron()) {
    try {
      const fs = window.require("fs");
      const path = window.require("path");
      let strFileName = "./" + [strToday] + "-saved-data.csv";

      // detect if the files exists if so append to the file rather than setting up with headers
      fs.readFile(strFileName, (err, data) => {
        if (data !== undefined && data.length > 0) {
          // now that the file has been created need to append to the file instead.
          fs.appendFileSync(strFileName, generateData(objAnalytics, strToday, "append"), "utf-8");
        } else {
          // no data or file found so create the file and write the data to it.
          fs.writeFileSync(strFileName, generateData(objAnalytics, strToday, "new"), { encoding: "utf-8", mode: "0777" });
        }
      });
    } catch (e) {
      console.log(`Failed to save the file ${e}!`);
    }
  } else {
    //generatePostData(objAnalytics, strToday)
    fetch("/save", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        date: strToday,
        data: generatePostData(objAnalytics, strToday)
      })
    }).then((response) => {
      if (response.status === 200) {
        console.log("analytics submitted");
      }
    });
  }
}

function generateData(objAnalytics, strToday, strType) {
  let csv = "";
  let date = new Date();
  let logDate = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0");
  let logTime = date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0") + ":" + date.getSeconds().toString().padStart(2, "0");
  let strCurrentDateTime = logDate + " " + logTime;
  if (strType !== "append") {
    csv += "Type, Name, Page, Last updated\n";
  }
  if (objAnalytics[strToday].clicks.length > 0) {
    for (let intClick = 0; intClick < objAnalytics[strToday].clicks.length; intClick++) {
      let objClick = objAnalytics[strToday].clicks[intClick];
      csv += `Click,${objClick.name},${objClick.trigger_page},${strCurrentDateTime}\n`;
    }
  }
  if (objAnalytics[strToday].routes.length > 0) {
    for (let intRoute = 0; intRoute < objAnalytics[strToday].routes.length; intRoute++) {
      let objRoute = objAnalytics[strToday].routes[intRoute];
      csv += `Route,${objRoute.name},${objRoute.path},${strCurrentDateTime}\n`;
    }
  }
  if (objAnalytics[strToday].results.length > 0) {
    for (let intResult = 0; intResult < objAnalytics[strToday].results.length; intResult++) {
      let objRoute = objAnalytics[strToday].results[intResult];
      csv += `Result,${objRoute.name},${objRoute.path},${strCurrentDateTime}\n`;
    }
  }
  return csv;
}

function generatePostData(objAnalytics, strToday) {
  let csv = "";
  let date = new Date();
  let logDate = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0");
  let logTime = date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0") + ":" + date.getSeconds().toString().padStart(2, "0");
  let strCurrentDateTime = logDate + " " + logTime;

  if (objAnalytics[strToday].clicks.length > 0) {
    for (let intClick = 0; intClick < objAnalytics[strToday].clicks.length; intClick++) {
      let objClick = objAnalytics[strToday].clicks[intClick];
      csv += `Click,${objClick.name},${objClick.trigger_page},${strCurrentDateTime}\n`;
    }
  }

  if (objAnalytics[strToday].routes.length > 0) {
    for (let intRoute = 0; intRoute < objAnalytics[strToday].routes.length; intRoute++) {
      let objRoute = objAnalytics[strToday].routes[intRoute];
      csv += `Route,${objRoute.name},${objRoute.path},${strCurrentDateTime}\n`;
    }
  }
  if (objAnalytics[strToday].results.length > 0) {
    for (let intResult = 0; intResult < objAnalytics[strToday].results.length; intResult++) {
      let objRoute = objAnalytics[strToday].results[intResult];
      csv += `Result,${objRoute.name},${objRoute.path},${strCurrentDateTime}\n`;
    }
  }
  return csv;
}

export default analytics;
