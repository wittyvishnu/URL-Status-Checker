const request = require("supertest");
const app = require("../app");

describe("URL Status Checker API Tests", () => {

    // URL not provided
    test("should return 400 if URL is missing", async () => {

        const response = await request(app)
            .post("/check")
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("URL required");

    });

    // Valid website
    test("should return UP for a working website", async () => {

        const response = await request(app)
            .post("/check")
            .send({ url: "https://google.com" });

        expect(response.statusCode).toBe(200);
        expect(response.body.website_status).toBe("UP");

    });

    // Invalid URL
    test("should handle invalid URL", async () => {

        const response = await request(app)
            .post("/check")
            .send({ url: "invalid-url" });

        expect(response.body.website_status).toBe("DOWN");

    });

});