import moxios from "moxios";
import FestivalService from "../../services/festivalService";

describe("Festival Services", function() {
  beforeEach(() => moxios.install());
  afterEach(() => moxios.uninstall());

  it("Should have a function", function() {
    expect(FestivalService.getFestivals).toBeInstanceOf(Function);
  });

  it("Should send a request to festivals endpoint", async () => {
    moxios.wait(function() {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response: []
      });
    });
    const data = await FestivalService.getFestivals();
    expect(data.data).toEqual([]);
  });

  it("Should reject the promise when there is an error", async () => {
    moxios.wait(function() {
      let request = moxios.requests.mostRecent();
      request.reject({
        response: { status: 429, error: "Throttled" }
      });
    });

    try {
      await FestivalService.getFestivals();
    } catch ({ response }) {
      expect(response).toHaveProperty("status");
      expect(response).toHaveProperty("error");
      expect(response.status).toEqual(429);
    }
  });
});
