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

    it('allows people to contribute money, and marks them as approvers' , async() => {
        //contribute to a campaign
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        })

        //call the mapping function to know if the address is an approver
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        //check if returns true
        assert(isContributor)

    })

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '5',
                from: accounts[1]
            })
            assert(false)
        } catch (err) {
            assert(err);
        }
    })

    it('allows a manager to make a payment request', async () => {
        await campaign.methods
            .createRequest('buy batteries', '100', accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            })

        const request = await campaign.methods.requests(0).call();
        
        assert.equal('buy batteries', request.description);
    })

    it('process request', async () => {
        
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods
            .createRequest(
                'buy batteries', 
                web3.utils.toWei('5', 'ether'),
                accounts[1]
                )
            .send({
                from: accounts[0],
                gas: '1000000'
            })

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        })

        await campaign.methods.finalizeRequests(0).send({
            from: accounts[0],
            gas: '1000000'
        })

        //get the balance
        let balance = await web3.eth.getBalance(accounts[1]);
        //convert the balance fromWei to Ether
        balance = web3.utils.fromWei(balance, 'ether');
        //remove the decimals
        balance = parseFloat(balance);

        assert( balance > 104)
    })
})