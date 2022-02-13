import react from "react";
import { Button, Grid } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";

const RequestIndex = () => {
    const router = useRouter();
    const {address} = router.query;

    return (
        <Layout>
            <Grid>
                <h3>
                    Requests
                </h3>
                <Link
                    href={{
                        pathname: `/campaigns/requests/new`,
                        query: { address }
                    }}>
                    <Button primary>
                        Add Request
                    </Button>
                </Link>
            </Grid>
        </Layout>
    )
}

export default RequestIndex