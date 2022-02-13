import React, { useEffect, useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import { useRouter } from "next/router";

const ContributeForm = (address) => {
    const router = useRouter();
    const [value, setValue] = useState('0');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const submitHanddler = (event) => {
        event.preventDefault();
        //start loading
        setLoading(true);
        setErrorMessage('')
        //get data
        try {
            const campaign = Campaign(address.address);
            makeContribution(campaign);
        } catch (err){
            console.log(err);
            setErrorMessage(err.message);
        }
        //stop loadings
        setLoading(false);
        setValue('0');
    }
    
    //function to get accounts in web3
    const makeContribution = async (campaign) => {
        const accounts = await web3.eth.getAccounts();
        try {
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(value, 'ether')
            })
            router.reload(window.location.pathname);
        } catch (err) {
            console.log(err);
            setErrorMessage(err.message);
        }
        //TODO - Refactor so it just loads the components and
        // no the whole page
    }

    return (
        <Form onSubmit={submitHanddler} error={!!errorMessage}>
            <Form.Field>
                <label>Amount to contribute</label>
                <Input 
                    label="ether"
                    labelPosition="right"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                />
                <Message error header='Oops!'  content={errorMessage}/>
                <Button primary loading={loading}>
                    Contribute!
                </Button>
            </Form.Field>
        </Form>
    )
}

export default ContributeForm;