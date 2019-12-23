import * as chai from "chai";
import chaiHttp = require("chai-http");
import { httpServer } from "../../app";
import "mocha";

const graphqlEndPoint = "/graphql";
chai.use(chaiHttp);
const expect = chai.expect;

describe("sign in query tests", () => {
  it("should not sign in due to invalid email", async () => {
    const email = "llllll";
    const password = "134546";
    const res = await chai
    .request(httpServer)
    .post(graphqlEndPoint)
    .send({
        query: `
        query{
            login(userInput: {email: "${email}", password: "${password}"})
            {
                userId
                token
            }
        }`
    });
    expect(res.body).to.have.property("errors");
    expect(res.body.errors[0].message).to.eql("There is incorrect email");
    expect(res.body.data).to.eql(null);
  });

  it("should not sign in due to invalid password", async () => {
    const email = "ppp@mail.com";
    const password = "1232112";
    const res = await chai
    .request(httpServer)
    .post(graphqlEndPoint)
    .send({
        query: `
        query{
            login(userInput: {email: "${email}", password: "${password}"})
            {
                userId
                token
            }
        }`
    });
    expect(res.body).to.have.property("errors");
    expect(res.body.errors[0].message).to.eql("Password is incorrect");
    expect(res.body.data).to.eql(null);
  });

  it("should sign in", async () => {
    const email = "ppp@mail.com";
    const password = "123";
    const res = await chai
    .request(httpServer)
    .post(graphqlEndPoint)
    .send({
        query: `
        query{
            login(userInput: {email: "${email}", password: "${password}"})
            {
                userId
                token
            }
        }`
    });
    expect(res.body).to.have.not.property("errors");
    expect(res.body.data.login.userId).to.eql('15');
  });

  it("should not sign in due to invalid email", async () => {
    const email = "pppwqe@mail.com";
    const password = "134546";
    const res = await chai
    .request(httpServer)
    .post(graphqlEndPoint)
    .send({
        query: `
        query{
            login(userInput: {email: "${email}", password: "${password}"})
            {
                userId
                token
            }
        }`
    });
    expect(res.body).to.have.property("errors");
    expect(res.body.errors[0].message).to.eql("There is no such user");
    expect(res.body.data).to.eql(null);
  });
});
