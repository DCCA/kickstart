import React from "react";
import { Button, Form, Input } from "semantic-ui-react";

const ContributeForm = () => {

    return (
        <Form>
            <Form.Field>
                <label>Amount to contribute</label>
                <Input 
                    label="ether"
                    labelPosition="right"
                />
                <Button>
                    Contribute!
                </Button>
            </Form.Field>
        </Form>
    )
}

export default ContributeForm;