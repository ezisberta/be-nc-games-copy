const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
beforeEach(() => seed(testData));

// describe(('Invalid Route'), () =>{
//   return request(app)
//     .get("invalid api")
//     .expect(404)
//     .then(({ body }) => {
//       expect(body).toEqual({ msg: "Not Found" });
//     });
// })

describe("GET /api/categories", () => {
  it("should respond with an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        expect(res.body.categories.length).not.toBe(0);
        res.body.categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  it("should respond with a review object", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          review_id: 3,
          title: "Ultimate Werewolf",
          designer: "Akihisa Okui",
          owner: "bainesface",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "We couldn't find the werewolf!",
          category: "social deduction",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 5,
        });
      });
  });
  it("should respond with a 400 status if the review ID is not valid", () => {
    return request(app)
      .get("/api/reviews/notAnID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("should respond with a 404 status if the review does not exist", () => {
    return request(app)
      .get("/api/reviews/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  it("should update the votes property of the review object and respond with the upddated review", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send({ inc_votes: 60 })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          review_id: 3,
          title: "Ultimate Werewolf",
          designer: "Akihisa Okui",
          owner: "bainesface",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "We couldn't find the werewolf!",
          category: "social deduction",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 65,
        });
      });
  });
  it("should respond with a 400 status if the request is not vaild", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send({ vote: 60 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("should respond with a 404 status if the review does not exist", () => {
    return request(app)
      .patch("/api/reviews/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});
