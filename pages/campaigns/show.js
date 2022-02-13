import React, { Component, useEffect, useState } from "react";
import {useRouter} from "next/router";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import { CardGroup, Grid, GridColumn } from "semantic-ui-react";
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
        //function to getData
        const getData = async () => {
            if(address){
                const summaryResult =  await campaign.methods.getSummary().call();
                setSummary({
                    address: address,
                    minimumContribution: summaryResult[0],
                    balance: summaryResult[1],
                    requestsCounts: summaryResult[2],
                    approversCount: summaryResult[3],
                    manager: summaryResult[4]
                })
            }
        }
        getData();
    },[address])
    

    useEffect(() => {
        if(summary.balance){
            setItems([
                {
                    header: summary.manager,
                    meta: 'Address of Manager',
                    description: 'The manager created this campaign and can create requests to withdraw money.',
                    style: { overflowWrap: 'break-word'}
                },
                {
                    header: summary.minimumContribution,
                    meta: 'Minimum Contribution (Wei)',
                    description: 'You must contribute at least this much wei to be an approver.'
                },
                {
                    header: summary.requestsCounts,
                    meta: 'Number of Requests',
                    description: 'A request tries to withdraw money from the contract. Requests must be approved by approvers.'
                },
                {
                    header: summary.approversCount,
                    meta: 'Number of Approvers',
                    description: 'Number of people who have already donated to this campaigns.'
                },
                {
                    header: web3.utils.fromWei(summary.balance, 'ether'),
                    meta: 'Campaigns Balance (Ether)',
                    description: 'The balance is how much money this campaign has.'
                }
            ]);
        }
    }, [summary])

    //get campaigns data
    return (
        <Layout>
            <h3>Campaign:</h3>
            <Grid>
                <Grid.Column width={10}>
                    <CardGroup items={items}></CardGroup>
                </Grid.Column>
                <GridColumn width={6}>
                    <ContributeForm address={summary.address} ></ContributeForm>
                </GridColumn>
            </Grid>
        </Layout>
        )

}

export default CampaignShow;