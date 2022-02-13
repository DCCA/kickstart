import React, { Component, useEffect, useState } from "react";
import {useRouter} from "next/router";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import { CardGroup } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";

const CampaignShow = () => {
    const router = useRouter();
    const { address } = router.query;
    //useState
    const [summary, setSummary] = useState({});
    const [items, setItems] = useState([])
    useEffect(() => {
        const campaign = Campaign(address);
        const getData = async () => {
            const summaryResult =  await campaign.methods.getSummary().call();
            // setSummary({
            //     minimumContribution: summaryResult[0],
            //     balance: summaryResult[1],
            //     requestsCounts: summaryResult[2],
            //     approversCount: summaryResult[3],
            //     manager: summaryResult[4]
            // })
            setItems([
                {
                    header: summaryResult[4],
                    meta: 'Address of Manager',
                    description: 'The manager created this campaign and can create requests to withdraw money.',
                    style: { overflowWrap: 'break-word'}
                },
                {
                    header: summaryResult[0],
                    meta: 'Minimum Contribution (Wei)',
                    description: 'You must contribute at least this much wei to be an approver.'
                },
                {
                    header: summaryResult[2],
                    meta: 'Number of Requests',
                    description: 'A request tries to withdraw money from the contract. Requests must be approved by approvers.'
                },
                {
                    header: summaryResult[3],
                    meta: 'Number of Approvers',
                    description: 'Number of people who have already donated to this campaigns.'
                },
                {
                    header: web3.utils.fromWei(summaryResult[1], 'ether'),
                    meta: 'Campaigns Balance (Ether)',
                    description: 'The balance is how much money this campaign has.'
                }
            ]);
        }
        getData();
    },[])

    //get campaigns data
    return (
        <Layout>
            <h3>Campaign:</h3>
            <CardGroup items={items}></CardGroup>
            <ContributeForm></ContributeForm>
        </Layout>
        )

}

export default CampaignShow;