import React from "react";
import { Menu } from "semantic-ui-react";
import Router from "next/router";

const Header = (props) => {
    return (
        <Menu style={{marginTop: '1em'}}>
            <Menu.Item onClick={() => Router.push('/')}>
                CrowdCoin
            </Menu.Item>

            <Menu.Menu position="right">
                <Menu.Item onClick={() => Router.push('/campaigns/new')}>
                    Campaigns
                </Menu.Item>
                <Menu.Item>
                    +
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    )
}

export default Header;