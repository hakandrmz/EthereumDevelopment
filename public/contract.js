async function loadWeb3() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
  }
}
async function loadContract() {
  return await new window.web3.eth.Contract(
    [
      {
        constant: false,
        inputs: [
          {
            name: "ballotKey",
            type: "uint256",
          },
        ],
        name: "newBallot",
        outputs: [
          {
            name: "success",
            type: "bool",
          },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "getBallotCount",
        outputs: [
          {
            name: "",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          {
            name: "ballotKey",
            type: "uint256",
          },
          {
            name: "vote",
            type: "uint256",
          },
        ],
        name: "addAnswer",
        outputs: [
          {
            name: "success",
            type: "bool",
          },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [
          {
            name: "ballotKey",
            type: "uint256",
          },
        ],
        name: "getBallotAnswerCount",
        outputs: [
          {
            name: "answerCount",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "getballotListKeys",
        outputs: [
          {
            name: "",
            type: "uint256[]",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [
          {
            name: "ballotKey",
            type: "uint256",
          },
        ],
        name: "getBallot",
        outputs: [
          {
            name: "id",
            type: "uint256",
          },
          {
            name: "upVote",
            type: "uint256",
          },
          {
            name: "downVote",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    "0x49b4eCa69AC9b3E3f10B0673cd09346008676B7e"
  );
}
async function load() {
  await loadWeb3();
  window.contract = await loadContract();
  updateStatus("Bağlı");
}
async function getCurrentAccount() {
  const accounts = await window.web3.eth.getAccounts();
  return accounts[0];
}
async function getBallotAnswerCount(id) {
  updateStatus("Toplam cevap alınıyor.");
  const ballotAnswerCount = await window.contract.methods
    .getBallotAnswerCount(id)
    .call();
  updateStatus(`Cevap sayısı: ${ballotAnswerCount}`);
  return ballotAnswerCount;
}
async function getBallotCount() {
  updateStatus("Toplam oylama sayısı getiriliyor.");
  const ballotCount = await window.contract.methods.getBallotCount().call();
  updateStatus(`Oylama sayısı: ${ballotCount}`);
  return ballotCount;
}
async function getBallot(id) {
  updateStatus("Oylama bilgileri getiriliyor.");
  const ballot = await window.contract.methods.getBallot(id).call();
  updateStatus("Oylama bilgileri getirildi.");
  return ballot;
}
async function addDownVote(id) {
  console.log(`${id}'li oylamaya hayır oyu veriliyor`);
  updateStatus("Hayır oyu veriliyor.");
  const account = await getCurrentAccount();
  const temp = await window.contract.methods
    .addAnswer(id, 0)
    .send({ from: account })
    .catch(function (err) {
      console.log(err);
    });
  updateStatus("Hayır oyu verildi.");
  location.reload();
}
async function addUpVote(id) {
  console.log(`${id}'li oylamaya evet oyu veriliyor`);
  updateStatus("Evet oyu veriliyor.");
  const account = await getCurrentAccount();
  const temp = await window.contract.methods
    .addAnswer(id, 1)
    .send({ from: account })
    .catch(function (err) {
      console.log(err);
    });
  updateStatus("Evet oyu verildi.");
  location.reload();
}
function updateStatus(status) {
  const statusEl = document.getElementById("status");
  statusEl.innerHTML = status;
}
async function ballotListKeys() {
  const deployedBallots = await window.contract.methods
    .getballotListKeys()
    .call();
  document.getElementById("test1").innerHTML = deployedBallots;
  return deployedBallots;
}
async function createBallot() {
  const id = document.getElementById("ballotid").value;
  console.log(id);
  updateStatus("Yeni oylama oluşturuluyor.");
  const account = await getCurrentAccount();
  const temp = await window.contract.methods
    .newBallot(id)
    .send({ from: account });
}
load();
