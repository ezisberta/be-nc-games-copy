const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
beforeEach(() => seed(testData));

describe("GET /api/categories", () => {
  it("should respond with an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          categories: [
            {
              slug: "euro game",
              description: "Abstact games that involve little luck",
            },
            {
              slug: "social deduction",
              description:
                "Players attempt to uncover each other's hidden role",
            },
            {
              slug: "dexterity",
              description: "Games involving physical skill",
            },
            {
              slug: "children's games",
              description: "Games suitable for children",
            },
          ],
        });
      });
  });
  it("should respond with a 404 stattus if the route is misspelled", () => {
    return request(app)
      .get("/api/catgories")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Not Found" });
      });
  });
});
