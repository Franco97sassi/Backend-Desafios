import mongoose from "mongoose";
import userManager from "../src/DAO/sessionDAO.js";
import Assert from "assert";

mongoose.connect(
  "mongodb+srv://ltaralli:coder1234@cluster0.k7b3exc.mongodb.net/ecommerce"
);

const assert = Assert.strict;

describe("Testing Users DAO", () => {
  before(function () {
    this.userManager = new userManager();
  });

  it("El DAO debe poder obtener los usuarios en formato de Array", async function () {
    const result = await this.userManager.getAll();
    assert.strictEqual(Array.isArray(result), true);
  });
});