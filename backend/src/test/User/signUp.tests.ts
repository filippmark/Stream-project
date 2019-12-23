import * as chai from "chai";
import chaiHttp = require("chai-http");
import { httpServer } from "../../app";
import "mocha";

const graphqlEndPoint = "/graphql";
chai.use(chaiHttp);
const expect = chai.expect;
const should = chai.should;

describe("sign up mutation tests", () => {
  it("should not sign up due to invalid email", async () => {
    const email: string = "llllll";
    const password: string = "134546";
    const res = await chai
      .request(httpServer)
      .post(graphqlEndPoint)
      .send({
        query: `
            mutation{
                createNewUser(userInput:{email: "${email}", password: "${password}"})
                {
                    id
                    email
                }
            }
        `
      });
    expect(res.body).to.have.property("errors");
    expect(res.body.errors[0].message).to.eql("This email is incorrect");
    expect(res.body.data).to.eql(null);
  });

  it("should not sign up due to anavailable email", async () => {
    const email: string = "ppp@mail.com";
    const password: string = "134546";
    const res = await chai
      .request(httpServer)
      .post(graphqlEndPoint)
      .send({
        query: `
            mutation{
                createNewUser(userInput:{email: "${email}", password: "${password}"})
                {
                    id
                    email
                }
            }
        `
      });
    expect(res.body).to.have.property("errors");
    expect(res.body.errors[0].message).to.eql(
      "This email is not available for registration"
    );
    expect(res.body.data).to.eql(null);
  });
});
