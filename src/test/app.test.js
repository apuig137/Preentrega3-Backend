import chai from "chai";
import supertest from "supertest";

const expect = chai.expect
const requester = supertest("http://localhost:8080")

describe("Testing de usuarios", () => {

    it("El endpoint POST /api/sessions/register debe registrar un usuario correctamente", async () => {
        const userMock = {
            first_name: "Usario",
            last_name: "Testing",
            email: "test@gmail.com",
            age: 21,
            password: "12345",
            role: "user"
        }
        const { statusCode, ok, _body } = await requester.post("/api/sessions/register").send(userMock)
        expect(_body.status).to.be.ok
    })

    it("El endpoint POST /api/sessions/login debe logear el usuario registrado recientemente", async () => {
        const loginUser = {
            email: "test@gmail.com",
            password: "12345"
        }
        const { statusCode, ok, _body } = await requester.post("/api/sessions/login").send(loginUser)
        console.log(statusCode)
        console.log(ok)
        console.log(_body)
        expect(_body.status).to.be.ok
    })
})

describe("Testing de productos", () => {
    it("El endpoint GET /api/products debe devolver todos los productos", async () => {
        const { statusCode, ok, _body } = await requester.get("/api/products")
        expect(_body.products).to.be.ok
    })
})

describe("Testing de carritos", () => {
    it("El endpoint GET /api/carts debe devolver todos los carritos", async () => {
        const { statusCode, ok, _body } = await requester.get("/api/carts")
        expect(_body.carts).to.be.ok
    })

    it("El endpoint POST /api/carts debe devolver un carrito", async () => {
        const { statusCode, ok, _body } = await requester.post("/api/carts")
        expect(_body.products).to.be.ok
    })
})