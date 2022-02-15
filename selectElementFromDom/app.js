export default {
    methods: {  
      getCollections(wanted, wanted2, start) {
        var APPP = this;
        //wanted = wanted collection
        //wanted2 = wanted monitor
        //start = true if you dont want the the extension to pull the first monitor in the list
        return new Promise(async (resolve, reject) => {
          var myHeaders = new Headers();
  
          var token = await APPP.PullByKey("login");
          token = "Bearer " + token.login.token;
          myHeaders.append("Authorization", token);
  
          var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
          };
          // get all collections using the api
          fetch("url", requestOptions)
            .then((response) => response.json())
            .then(async (result) => {
              if (result.length == 0) {
                resolve();
                return;
              }
              // set the collection list in the extension
              APPP.$store.dispatch("changeData", {
                option: "collections",
                value: result,
              });
              // if a collection is selected, it will get it , otherwise it will select the first element
              var h = 0;
              if (wanted != undefined) {
                h = result.findIndex((e) => e.collectionName == wanted);
              }
              APPP.$store.dispatch("changeData", {
                option: "currentlySelectedCollection",
                value: {
                  name: result[h].collectionName,
                  id: result[h].collectionId,
                },
              });
              // get the monitor info after getting collection info
              await APPP.getCollectionMonitors(wanted2, start);
              resolve();
            })
            .catch((error) => console.log("error", error));
        });
      },
  
      getCollectionMonitors(wanted2, start) {
        var APPP = this;
  
        return new Promise(async (resolve, reject) => {
          var myHeaders = new Headers();
          var token = await APPP.PullByKey("login");
          token = "Bearer " + token.login.token;
  
          myHeaders.append("Authorization", token);
  
          var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
          };
          // get all monitors in a collection using the api
          fetch(
            "url=" +
              APPP.$store.state.currentlySelectedCollection.id,
            requestOptions
          )
            .then((response) => response.json())
            .then(async (result) => {
              // if collection is empty
              if (result.length == 0 && wanted2 != "new") {
                resolve();
                APPP.$store.dispatch("changeData", {
                  option: "monitors",
                  value: [],
                });
                APPP.$store.dispatch("changeData", {
                  option: "currentlySelectedMonitorList",
                  value: {
                    name: "",
                    id: "",
                  },
                });
                APPP.$store.dispatch("changeData", {
                  option: "data",
                  value: {},
                });
                APPP.$store.dispatch("changeData", {
                  option: "currentlySelectedCommand",
                  value: "",
                });
                return;
              }
  
              APPP.$store.dispatch("changeData", {
                option: "monitors",
                value: result,
              });
  
              // if start == undefined , extension will pull the selected monitor or the first element , else it will leave it empty
              if (!start) {
                var h = 0;
                if (wanted2 != undefined) {
                  if (wanted2 == "new") {
                    APPP.$store.dispatch("changeData", {
                      option: "currentlySelectedMonitorList",
                      value: {
                        name: "Add New",
                        id: undefined,
                      },
                    });
                    APPP.changeData({ target: { value: "Add New" } });
                    resolve();
                    return;
                  } else {
                    h = result.findIndex(
                      (e) => e.monitorName == wanted2 || e.monitorId == wanted2[0]
                    );
                  }
                }
  
                APPP.$store.dispatch("changeData", {
                  option: "currentlySelectedMonitorList",
                  value: {
                    name: result[h].monitorName,
                    id: result[h].monitorId,
                  },
                });
                //console.log("getCollectionMonitors");
  
                await APPP.getMonitorXpaths(result);
              }
              resolve();
            })
            .catch((error) => console.log("error", error));
        });
      },
  
      getMonitorXpaths(link) {
        var APPP = this;
  
        return new Promise(async (resolve, reject) => {
          var myHeaders = new Headers();
          var token = await APPP.PullByKey("login");
          token = "Bearer " + token.login.token;
  
          myHeaders.append("Authorization", token);
  
          var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
          };
          // get a single monitor info using the api
          fetch(
            `url`,
            requestOptions
          )
            .then((response) => response.json())
            .then((result) => {
              //check if the selected monitor sourceUrl and the current website URL match, send to a new tab if it doesn't match
              if (link == "openlink" && result.sourceUrl && result.sourceUrl != decodeURIComponent(document.URL.substring(67))) {
                let obj = {
                  action: "editMonitor",
                  monitorId: result.monitorId,
                  collection: result.collectionId,
                  url: result.sourceUrl,
                };
                chrome.runtime.sendMessage({ message: "openurl", obj: obj });
                // close current tab
                parent.postMessage(
                  {
                    message: "close()",
                  },
                  "*"
                );
              }
              APPP.$store.dispatch("changeData", {
                option: "data",
                value: result,
              });
              if (result.captureElements) {
                APPP.$store.dispatch("changeData", {
                  option: "currentlySelectedCommand",
                  value: result.captureElements[0]?.name || "",
                });
                APPP.displaySelected();
                resolve();
              } else {
                resolve();
              }
            })
            .catch((error) => console.log("error", error));
        });
      },
    },
  };
  