var Voting = artifacts.require("./Voting.sol");

contract("bitay", async function (accounts) {
  let tryCatch = require("./exceptions.js").tryCatch;
  let errTypes = require("./exceptions.js").errTypes;
  describe("oylama oluşturma ve toplam oylama sayısı", () => {
    before(async () => {
      instance = await Voting.new();
    });
    it("oylama yayınlandıktan sonra toplam oylama sayısı değişmeli", async () => {
      await instance.newBallot(1, { from: accounts[0] });
      let totalBallotCount = await instance.getBallotCount();
      assert.equal(totalBallotCount, 1);
      await instance.newBallot(2, { from: accounts[0] });
      totalBallotCount = await instance.getBallotCount();
      assert.equal(totalBallotCount, 2);
    });
  });

  describe("oylamaların kontrolü", () => {
    before(async () => {
      instance = await Voting.new();
    });
    it("id'de ilk defa oluşturulduğu için hata vermemeli", async () => {
      await instance.newBallot(1, { from: accounts[0] });
    });
    it("aynı id'de oylama olduğu için revert hatası vermeli", async () => {
      await tryCatch(
        instance.newBallot(1, { from: accounts[0] }),
        errTypes.revert
      );
    });
  });

  describe("verilen cevapların sayımı", () => {
    before(async () => {
      instance = await Voting.new();
    });
    it("cevap verildiğinde toplam cevap sayısı artmalı", async function () {
      await instance.newBallot(1, { from: accounts[0] });
      await instance.addAnswer(1, 1, { from: accounts[1] });
      await instance.addAnswer(1, 1, { from: accounts[2] });
      let result = await instance.getBallotAnswerCount(1);
      assert.equal(result.toNumber(), 2);
      await instance.addAnswer(1, 1, { from: accounts[3] });
      await instance.addAnswer(1, 1, { from: accounts[4] });
      result = await instance.getBallotAnswerCount(1);
      assert.equal(result.toNumber(), 4);
    });
  });

  describe("oylama cevapları", () => {
    before(async () => {
      instance = await Voting.new();
    });
    it("bir oylamaya aynı hesaptan sadece 1 kez oy verilmeli", async () => {
      await instance.newBallot(1, { from: accounts[0] });
      let result = await instance.getBallotAnswerCount(1);
      assert.equal(result.toNumber(), 0);
      await instance.addAnswer(1, 1, { from: accounts[1] });
      await instance.addAnswer(1, 1, { from: accounts[2] });
      result = await instance.getBallotAnswerCount(1);
      assert.equal(result.toNumber(), 2);
      it("önceden oy kullanıldığı için hata vermeli", async () => {
        await tryCatch(
          instance.addAnswer(1, 0, { from: accounts[1] }),
          errTypes.revert
        );
      });
      it("önceden oy kullanıldığı için farklı cevap verse de hata vermeli", async () => {
        await tryCatch(
          instance.addAnswer(1, 1, { from: accounts[1] }),
          errTypes.revert
        );
      });
    });
  });
});
