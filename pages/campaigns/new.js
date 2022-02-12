import React, {Component} from "react";
import Router from "next/router";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";

class CampaignNew extends Component {
    state = {
        minimumContribution: '0',
        errorMessage: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();
        //run loading
        this.setState({
            loading: true,
            errorMessage: ''
        })
        //try eth functions
        try{
            //get accounts
            const accounts = await web3.eth.getAccounts();
            //create a new campaign using the factory contract
            await factory.methods
                .createCampaign(this.state.minimumContribution)
                .send({
                    from: accounts[0]
                })
            Router.push("/");
        } catch(err) {
            console.log(err);
            this.setState({ errorMessage: err.message })
        }
        //end loading
        this.setState({
            loading: false
        })
    }

    render() {
        return (
            <Layout>
                <h3>
                    Create a Campaign
                </h3>
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Minimum Contribution:</label>
                    <Input 
                        label='Wei' 
                        labelPosition="right"
                        value={this.state.minimumContribution}
                        onChange={event => this.setState ({
                            minimumContribution: event.target.value
                        })}
                    />
                </Form.Field>
                
                <Message error header="Oops!" content={this.state.errorMessage} />

                <Button primary loading={this.state.loading}>
                    Create
                </Button>
            </Form>
            </Layout>
        )       
    }
}

export default CampaignNew;