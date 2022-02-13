import react, { useState } from "react";
import Layout from "../../../components/Layout";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign";
import { useRouter } from "next/router";
import web3 from "../../../ethereum/web3";

const NewRequest = () => {
    const router = useRouter();
    const {address} = router.query;
    //start states
    const [formData, setFormData] = useState({
        value: '',
        description: '',
        recipient: ''
    })
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')

    const submitHandler = (event) => {
        event.preventDefault();
        const campaign = Campaign(address);
        sendRequest(campaign);
    }

    //send request to contract function
    const sendRequest = async (campaign) => {
        setErrorMessage('');
        setLoading(true);
        const accounts = await web3.eth.getAccounts();
        try {
            await campaign.methods
                .createRequest(
                    formData.description, 
                    web3.utils.toWei(formData.value,'ether'), 
                    formData.recipient
                )
                .send({
                    from: accounts[0]
                })
            router.push({
                pathname: '/campaigns/requests',
                query: { address }
            })
        } catch (err) {
            setErrorMessage(err.message);
            console.log(err)
        }
        setLoading(false);
    }

    return (
        <Layout>
            <h3>Create a Request</h3>
            <Form onSubmit={submitHandler} error={!!errorMessage}>
                <Form.Field>
                    <label>Description</label>
                    <Input 
                        value={formData.description} 
                        onChange={(event) => setFormData({...formData, description: event.target.value}) }/>
                </Form.Field>
                <Form.Field>
                    <label>Value in Ether</label>
                    <Input 
                        value={formData.value} 
                        onChange={(event) => setFormData({...formData, value: event.target.value}) }
                        label="Ether"
                        labelPosition="right"/>
                </Form.Field>
                <Form.Field>
                    <label>Recipient</label>
                    <Input 
                        value={formData.recipient} 
                        onChange={(event) => setFormData({...formData, recipient:  event.target.value}) }/>
                </Form.Field>
                <Button primary loading={loading}>
                    Create
                </Button>
                <Message error header='Oops!'  content={errorMessage}/>
            </Form>
        </Layout>
    )

}

export default NewRequest;