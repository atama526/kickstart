const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/ CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/ Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000",
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );


});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("Names the account that deploys createCampaign as the manager of the campaing", async () => {
  	const boss = await campaign.methods.manager().call();
  	assert.equal(accounts[0], boss);
  });


  it("A user Can donate money and will be  marked as an approver", async () => {
  	await campaign.methods.contribute().send({
  		from: accounts[1], value: web3.utils.toWei('1','ether')
  	});
  	const approvers = await campaign.methods.approvers(accounts[1]).call();
  	assert(approvers);
  });


  it("requires a minimum contribution", async () => {
  	try {
  		await campaign.methods.contribute().send({
  			from: accounts[1], value: 90
  		});
  		assert(false);
  	} catch (err) {
  		assert(err);
  	}
  });

  it("only the manager Can create a request to pay", async () => {
    try {
      await campaign.methods.createRequest().send({
        from: accounts[1], value: 100
      });
      assert(false);
    } catch(err) {
      assert(err);
    }
  })

  it("Allows to make a payment request and creates a requests array", async () => {
    await campaign.methods
      .createRequest("Pay for marketing",'1000000',accounts[0])
      .send({
        from: accounts[0],
        gas: '1000000'
      });
    let requests = await campaign.methods.requests(0).call();
    assert.equal("Pay for marketing", requests.description);

  });

  it('Processes request', async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether')
    });
    await campaign.methods
      .createRequest('A', web3.utils.toWei('5','ether'), accounts[1])
      .send({from: accounts[0],gas: '1000000'});

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);
    console.log(balance);
    assert(balance > 103);
  })

});
