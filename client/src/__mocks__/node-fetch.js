// manual mock of node_modules node-fetch for testing
// moved to src due to issue https://github.com/facebook/create-react-app/issues/7539 
// to use, require jest.mock("node-fetch")

const config = require("../config");
const baseUrl = config.apiUrls.test;
let db = {};

function api(url, init) {
  const route = url.split(baseUrl + "/")[1];
  const routeArr = route.split("/");
  const body = init.body ? JSON.parse(init.body) : {};
  let result = {};
  switch (routeArr[0]) {
    case "Players":
      const player = routeArr[1];
      switch (init.method) {
        case "GET":
          if (db[player]) {
            result.userName = db[player].userName;
          } else {
            result.title = "Not Found";
          }
          break;
        case "POST":
        case "PUT":
          db[body.userName] = body;
          result.userName = db[body.userName].userName;
          break;
        case "DELETE":
          result.userName = db[player].userName;
          delete db[player];
          break;
        default:
          result.title = `${route}: ${init.method} unknown`;
      }
      break;
    default:
      result.title = `${route} unknown`;
  }
  return result;
}

function fetch(url, init) {
  return new Promise((resolve, reject) => {
    const result = api(url, init);
    resolve({
      status: 200,
      statusText: "ok",
      json: function() {
        return new Promise((resolve, reject) => {
          resolve(result);
        });
      }
    });
  });
};

module.exports = fetch;