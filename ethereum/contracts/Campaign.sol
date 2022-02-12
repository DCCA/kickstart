pragma solidity ^0.4.17;

//factory to create Campaign using the campaign model contract
contract CampaignFactory {
    address[] public deployedCampaigns;

    //function to create a campaign using our Contract Campaign
    function createCampaign(uint minimum) public {
        //make sure we are passing the address of the user who is trying
        //to create a new campaign. That's why we are using the msg.sender here
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }
    //
    function getDeployedCampaigns() public view returns (address[]){
        return deployedCampaigns;
    }
}

//campaign model contract
contract Campaign {
    //struc definition for the spend request
    //inserting a 'new type' in the contract
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    //declare the Requests array
    Request[] public requests;
    //declare the manager
    address public manager;
    //declare the min contribution
    uint public minimumContribution;
    //declare the approver variable
    mapping(address => bool) public approvers;
    //default value in bool type is 'false'

    //count the approvers
    uint public approversCount;

    //modifier to restrict some functions
    modifier restricted(){
        require(msg.sender == manager);
        _;
    }

    //define the constructor function
    constructor (uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    //build the contribute function
    function contribute() public payable {
        //check if the value is bigger then minimum
        require(msg.value > minimumContribution);
        //add the value to the approvers mapping
        approvers[msg.sender] = true;
        approversCount++;
    }

    //define a spend request function
    function createRequest(string description, uint value, address recipient) 
        public restricted {
            //create the request with the function inputs
            //we need to use MEMORY here so we dont overwrite the requests array
            Request memory newRequest = Request({
                //we just need to inicialize the value types
                description: description,
                value: value,
                recipient: recipient,
                complete: false,
                approvalCount: 0
            });

            //push the request to the array
            requests.push(newRequest);
    }

    //define a approve vote for a spending request
    function approveRequest(uint index) public {
        Request storage request = requests[index];

        //check if is an APPROVER
        require(approvers[msg.sender]);
        //check if the user has already votted
        require(!request.approvals[msg.sender]);
        //
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    //define function to finalize a request, if it has enough votes
    function finalizeRequests(uint index) public restricted {
        Request storage request = requests[index];
        //check if the voter are enough for the manager to approve the request
        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);
        //send the money
        request.recipient.transfer(request.value);
        //
        request.complete = true;
    }

    //function to get summary info about any campaign
    function getSummary() public view returns (
        uint, uint, uint, uint, address
        ) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    //
    function getRequestCount() public view returns (uint) {
        return requests.length;
    }

}