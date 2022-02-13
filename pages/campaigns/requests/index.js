import react, { useEffect, useState } from "react";
import { Button, Table } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

const RequestIndex = () => {
    const router = useRouter();
    const { address } = router.query;
    const [requests, setRequests] = useState([])
    const [approversCount, setApproversCount] = useState()
    const [requestCount, setRequestCount] = useState()

    useEffect(()=> {
        if(address){
            const campaign = Campaign(address);
            getData(campaign);
        }

    },[address])

    const getData = async (campaign) => {
        const requestCount = +await campaign.methods.getRequestCount().call();
        const approversCount = await campaign.methods.approversCount().call();
        
        const requests = await Promise.all(
            Array(requestCount)
            .fill()
            .map((element, index) => {
                return campaign.methods.requests(index).call()
            })
            );
            setRequests(requests);
            setApproversCount(approversCount);
            setRequestCount(requestCount)
    }

    const renderRows = () => {
        if(requests){
            return requests.map((request, index) => {
                return <RequestRow 
                    request={request}
                    key={index}
                    id={index}
                    address={address}
                    approversCount={approversCount}
                />
            })
        }
    }

    const {Header, Row, HeaderCell, Body} = Table;

    return (
        <Layout>
            <Link
                href={{
                    pathname: `/campaigns/show`,
                        query: { address }
                    }}>
                    <a>
                        Back
                    </a>
            </Link>
            <h3>
                Pending Requests
            </h3>
            <Link
                href={{
                    pathname: `/campaigns/requests/new`,
                    query: { address }
                }}>
                <Button primary floated="right" style={{marginBottom: 10}}>
                    Add Request
                </Button>
            </Link>
            <Table>
                <Header>
                    <Row>
                    <HeaderCell>ID</HeaderCell>
                    <HeaderCell>Description</HeaderCell>
                    <HeaderCell>Amount</HeaderCell>
                    <HeaderCell>Recipient</HeaderCell>
                    <HeaderCell>Approval Count</HeaderCell>
                    <HeaderCell>Approve</HeaderCell>
                    <HeaderCell>Finalize</HeaderCell>
                    </Row>
                </Header>
                <Body>
                    {renderRows()}
                </Body>
            </Table>
            <div>
                Found {requestCount} requests.
            </div>
        </Layout>
    )
}

export default RequestIndex