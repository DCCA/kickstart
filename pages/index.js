import React from 'react';
import { Component } from 'react/cjs/react.production.min';
import factory from '../ethereum/factory';

class CampaignIndex extends Component {
    async componentDidMount(){
        const campaigns = await factory.methods.getDeployedCampaigns().call();

        console.log(campaigns)
    }

    render() {
        return <div>Campaigns Index!</div>
    }
}

export default CampaignIndex;