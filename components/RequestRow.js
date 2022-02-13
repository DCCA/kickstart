import react, { useEffect, useState } from "react";
import { Button, Table } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import { useRouter } from "next/router";

const RequestRow = (props) => {
    const router = useRouter()
    const {address} = router.query;

    const {Row, Cell} = Table;
    const {id, request, approversCount} = props;
    const [readyToFinalize, setReadyToFinalize] = useState();
    const [loadingApproval, setLoadingApproval] = useState(false);
    const [loadingFinalize, setLoadingFinalize] = useState(false);

    useEffect(()=>{
        const status = +request.approvalCount > approversCount/2;
        setReadyToFinalize(status)
    },[approversCount])

    const approveHandler = async () => {
        if(address){
            const campaign = Campaign(address);
            approveRequest(campaign)
        }
    }

    const approveRequest = async (campaign) => {
        setLoadingApproval(true);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.approveRequest(id).send({
            from: accounts[0]
        })
        setLoadingApproval(false);
        router.reload();
    }

    const finalizeHandler = () => {
        if(address){
            const campaign = Campaign(address);
            finalizeRequest(campaign)
        }
    }

    const finalizeRequest = async (campaign) => {
        setLoadingFinalize(true);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.finalizeRequests(id).send({
            from: accounts[0]
        })
        setLoadingFinalize(false);
        router.reload();
    }

    return (
        <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
            <Cell>{id}</Cell>
            <Cell>{request.description}</Cell>
            <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
            <Cell>{request.recipient}</Cell>
            <Cell>
                {request.approvalCount} / {approversCount}
            </Cell>
            <Cell>
                {request.complete ? null: (
                    <Button color="green" basic onClick={approveHandler} loading={loadingApproval}>Approve</Button>
                    )
                }
            </Cell>
            <Cell>
                {request.complete ? null : (
                    <Button color="blue" basic onClick={finalizeHandler} loading={loadingFinalize}>Finalize</Button>
                )}
            </Cell>
        </Row>
    )
}

export default RequestRow;