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
        expect(res.body.categories.length).toBe(4);
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
        expect(res.body.review).toEqual(
          expect.objectContaining({
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
          })
        );
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
        expect(body.msg).toBe("No review_id: 1000");
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
        expect(res.body.review).toEqual({
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
  it("should respond with a 400 status if the review ID is not valid", () => {
    return request(app)
      .patch("/api/reviews/notAnID")
      .send({ inc_votes: 60 })
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
        expect(body.msg).toBe("No review found for review_id: 1000");
      });
  });
});

describe("GET /api/users", () => {
  it("should respond with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        expect(res.body.users.length).toBe(4);
        res.body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/reviews/:review_id (comment count)", () => {
  it("should respond with a review object with a comment_count property", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then((res) => {
        expect(res.body.review.comment_count).toBe(3);
      });
  });
});

describe("GET /api/reviews", () => {
  it("should respond with an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews.length).toBe(13);
        res.body.reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              review_body: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  it("should sort the reviews by date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  it("should respond with an array of comment objects for the given ID", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments.length).not.toBe(0);
        res.body.comments.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: 3,
            })
          );
        });
      });
  });
  it("should respond with a 400 status if the review ID is not valid", () => {
    return request(app)
      .get("/api/reviews/notAnID/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("should respond with a 404 status if the review does not exist", () => {
    return request(app)
      .get("/api/reviews/1000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No review found for review_id: 1000");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  it("should respond with the added comment", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({
        username: "bainesface",
        body: "Sad ending but I had loads of fun!",
      })
      .expect(201)
      .then((res) => {
        expect(res.body.comment).toEqual(
          expect.objectContaining({
            author: "bainesface",
            body: "Sad ending but I had loads of fun!",
            comment_id: expect.any(Number),
            review_id: 3,
            votes: 0,
            created_at: expect.any(String),
          })
        );
      });
  });
  it("should respond with a 400 status if the review ID is not valid", () => {
    return request(app)
      .post("/api/reviews/notAnID/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("should respond with a 404 status if the review does not exist", () => {
    return request(app)
      .post("/api/reviews/1000/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("No review found for review_id: 1000");
      });
  });
  it("should respond with a 400 status if the comment object is missing the correct properties", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({})
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
  it("should respond with a 400 status if the user does not exist", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({
        username: "nonExistant",
        body: "Irrelevant.",
      })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/reviews (queries)", () => {
  it("should accept a sort_by query that defaults to created_at", () => {
    return request(app)
      .get("/api/reviews?sort_by")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("should accept any vaild collumn", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  it("should also accept a order query that defaults to descending", () => {
    return request(app)
      .get("/api/reviews?sort_by&order")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("should also accept an ascending order", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes&order=ASC")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("votes");
      });
  });
  it("should also accept a category query", () => {
    return request(app)
      .get("/api/reviews?category=social deduction")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews.length).toBe(11);
        res.body.reviews.forEach((review) => {
          expect(review.category).toBe("social deduction");
        });
      });
  });
  it("should also accept a category query with other queries", () => {
    return request(app)
      .get("/api/reviews?category=social deduction&sort_by=votes&order=ASC")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews.length).toBe(11);
        expect(res.body.reviews).toBeSortedBy("votes");
        res.body.reviews.forEach((review) => {
          expect(review.category).toBe("social deduction");
        });
      });
  });
  it("should respond with a 400 status if the sort_by query parameter is not valid", () => {
    return request(app)
      .get("/api/reviews?sort_by=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("should respond with a 400 status if the order query parameter is not valid", () => {
    return request(app)
      .get("/api/reviews?order=INVALID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("should respond with a 400 status if the category query parameter is not valid", () => {
    return request(app)
      .get("/api/reviews?category=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Bad Request, this category doesn't exist: invalid"
        );
      });
  });
  it("should ignore invalid queries and respond with the defaults", () => {
    return request(app)
      .get("/api/reviews?invalid=alsoInvalid")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews.length).toBe(13);
        expect(res.body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("should delete the given comment by comment_id", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then((res) => {
        expect(res.body).toEqual({});
      });
  });
  it("should respond with a 404 status if the comment does not exist", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No comment found for comment_id: 1000");
      });
  });
  it("should respond with a 404 status if the comment does not exist", () => {
    return request(app)
      .delete("/api/comments/notAnID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
