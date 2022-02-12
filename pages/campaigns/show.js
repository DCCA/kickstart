import React, { Component, useEffect, useState } from "react";
import {useRouter} from "next/router";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";

const CampaignShow = () => {
    const router = useRouter();
    const { address } = router.query;
    //useState
    const [summary, setSummary] = useState({});
    useEffect( async () => {
        const campaign = Campaign(address);
        const sumaryResult =  await campaign.methods.getSummary().call();
        setSummary({
            minimumContribution: sumaryResult[0],
            balance: sumaryResult[1],
            requestsCounts: sumaryResult[2],
            approversCount: sumaryResult[3],
            manager: sumaryResult[4]
        });
        console.log(summary);
    }, [])

    //get campaigns data

    return (
        <Layout>
            <h3>Campaign: { address }</h3>
        </Layout>
        )

}

export default CampaignShow;