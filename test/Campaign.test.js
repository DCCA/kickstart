//boilerplate
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

//get compiled contracts
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');
const { beforeEach } = require('mocha');

//start reusable vars
let accounts;
let factory;
let campaignAddress;
let campaign;

//config tests
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({
            data: compiledFactory.bytecode
        })
        .send({
            from: accounts[0],
            gas: '1000000'
        })

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    //setting the first item in the array to the 'let var' created before
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call()
    //interacting with a Contract already deployed
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    )

});

//start tests
describe('Campaigns', () => {
    
    it('factory and campaign has been deployed', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    })

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(manager, accounts[0]);
    })

})