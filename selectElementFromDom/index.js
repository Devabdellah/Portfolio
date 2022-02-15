import { createStore } from "vuex";

console.log("index");
export default createStore({
  state: {
    isLoaded: false,
    loggedIn: true,
    currentlySelectedCommand: "",
    currentlySelectedMonitorList: { name: "", id: "" },
    currentlySelectedCollection: { name: "", id: "" },
    data: {},
    collections: [],
    monitors: [],
    customAttributes: [],
    mindate: new Date().toISOString().split(".")[0],
    selectedAttribute: "Text",
    intervals: {
      1: "Minutes",
      2: "Hours",
      3: "Days",
      4: "Weeks",
      5: "Months",
      "Minutes": "Minutes",
      "Hours": "Hours",
      "Days": "Days",
      "Weeks": "Weeks",
      "Months": "Months",
    }
  },

  mutations: {

    //takes 2 parameters , the key and value , used to update a value in the state object
    changeData(state, payload) {
      state[payload.option] = payload.value;
    },

    addMainXPath(state, payload) {
      if (state.currentlySelectedCommand == "") {
        console.log("Please select a Main Element")
        return
      }

      var x = state.data.captureElements.filter(e => e.name == state.currentlySelectedCommand)[0].xpaths.filter(e => e.xpath == payload.oldxpath)[0]
      if (payload.isExclude === 'true') {

      } else {
        state.data.captureElements.filter(e => e.name == state.currentlySelectedCommand)[0].name = payload.name
      }
      if (payload.isList) {
        state.data.captureElements.captureType = "HtmlList"
      } else{
        state.data.captureElements.captureType = "HtmlCapture"
      }

      x.name = payload.name
      x.xpath = payload.xpath
      x.isExclude = payload.isExclude === 'true'
      x.Doclink = payload.link
      x.isDocument = payload.isDocument
      x.clickToDownload = payload.clickToDownload
      state["currentlySelectedCommand"] = state.currentlySelectedCommand;
    },
    addNewMainXPath(state, payload) {
      var now = new Date();
      if (document.querySelector('#scheduleAt').value == "") {

        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        document.querySelector('#scheduleAt').value = now.toISOString().slice(0, -1);

      } else {
        now = document.querySelector('#scheduleAt').value
      }
      var type = "HtmlCapture"
      var attributeName = "Text"
      if (payload.isDocument) {
        type = "DocumentCapture"
        var attributeName = "URL"
      }
      if (payload.isList) {
        type = "HtmlList"
      }
      state.data.captureElements.push({
        "name": payload.name,
        "captureType": type,
        "attributeName": attributeName,
        "scheduleOptions": payload.scheduleOptions,
        "startScheduleAt": now,
        "isAlertRequired": payload.isAlertRequired,
        "isDynamic": !payload.staticEl,
        "clickToDownload":payload.clickToDownload,
        "xpaths": [
          {
            "name": payload.name,
            "xpath": payload.xpath,
            "isExclude": false,

          },
        ],
      })
      // console.log(state.data);
    },
    addNewExcludeXPath(state, payload) {
      console.log("addNewExcludeXPath");
      if (state.currentlySelectedCommand == "") {
        console.log("Please select a Main Element")
        return
      }
      state.data.captureElements
        .filter(e => e.name == state.currentlySelectedCommand)[0].xpaths.push({
          "name": payload.name,
          "xpath": payload.xpath,
          "isExclude": payload.isExclude,

        })
    },
  },

  actions: {
    changeData({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit("changeData", payload);
        resolve();
      });
    },

    addMainXPath({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit("addMainXPath", payload);
        resolve();
      });
    },
    addNewMainXPath({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit("addNewMainXPath", payload);
        resolve();
      });
    },
    addNewExcludeXPath({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit("addNewExcludeXPath", payload);
        resolve();
      });
    }

  },
  modules: {},
});