// only test local mock fetch, other blocks use real fetch
describe.only("mock fetch and api", () => {
  jest.resetModules();
  jest.mock("node-fetch"); // mock node-fetch from __mocks__
  const fetchJson = require("./fetch").fetchJson;
  
  afterEach(() => {
    jest.resetModules();
  });

  test("fetchJson", async function() {
    expect.assertions(1);
    let json = await fetchJson("myRoute", "myMethod", "myBody");
    expect(json.title).toBe("myRoute unknown");
  });

  test("post/get user", async () => {
    let route = "Players/a";
    let method = "GET";
    let json = await fetchJson(route, method);
    expect(json.title).toBe("Not Found");

    route = "Players";
    method = "POST";
    let body = {userName: "a"};
    json = await fetchJson(route, method, body);
    expect(json.userName).toBe("a");

    route = "Players/a";
    method = "GET";
    json = await fetchJson(route, method);
    expect(json.userName).toBe("a");

    method = "DELETE";
    json = await fetchJson(route, method);
    expect(json.userName).toBe("a");

    method = "GET";
    json = await fetchJson(route, method);
    expect(json.title).toBe("Not Found");
  });

  // test("google id token", async () => {
  //   let route = "tokensignin";
  //   let method = "POST";
  //   let body = {idToken: "sometoken"};
  //   let json = await fetchJson(route, method, body);
  //   expect(json.iss).toBe("https://accounts.google.com");
  // });
});


describe("real fetch with local api", () => {
  jest.resetModules();
  jest.unmock("node-fetch");
  const fetchJson = require("./fetch").fetchJson; 

  test("get users/ post/ delete", async () => {
    let route = "Players";
    let method = "POST";
    let username = "test" + Date.now();
    let body = {userName: username};
    let json = await fetchJson(route, method, body);
    expect(json.userName).toBe(username);

    method = "GET";
    json = await fetchJson(route, method);
    expect(json).toBeTruthy();
    let lastId = Number(json[json.length -1].id);

    route = "Players/" + lastId;
    method = "GET";
    json = await fetchJson(route, method);
    expect(json.userName).toBe(username);

    method = "DELETE";
    json = await fetchJson(route, method);
    expect(json.userName).toBe(username);

    method = "GET";
    json = await fetchJson(route, method);
    expect(json.title).toBe("Not Found");
  });

});


describe('Google tokenInfo', () => {
  jest.resetModules();
  jest.unmock("node-fetch");
  const tokenInfo = require("./fetch").tokenInfo;
  
  test("tokenInfo", async () => {
    let json = await tokenInfo("XYZ123");
    expect(json.status).toBe(400);
  })
})