import React from 'react';
import Router from 'next/router';
import { Component } from 'react/cjs/react.production.min';
import factory from '../ethereum/factory';
//components and styles
import { Button, Card } from 'semantic-ui-react';
//import layout
import Layout from '../components/Layout';
import Link from 'next/link';

class CampaignIndex extends Component {
    static async getInitialProps(){
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        //return data to props
        return { campaigns }
    }

    renderCampaigns(){
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link 
                        as={`/campaigns/${address}`}
                        href={{
                            pathname: `/campaigns/show/`,
                            query: { address }
                        }}>
                        View Campaign
                    </Link>),
                fluid: true
            }
        })
        return <Card.Group items={items}/>;
    }



    render() {
        return (
        <Layout>
            <div>
                <h3>Open Campaigns</h3>
                <Button 
                    floated='right'
                    content='Create Campaign'
                    icon='add circle'
                    primary
                    onClick={() => Router.push('/campaigns/new')}
                    />
                {this.renderCampaigns()}
            </div>
        </Layout>
        )
    }
}

export default CampaignIndex;