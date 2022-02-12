import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xbad328D61BF8C45F5B19db0c7fa48dC4eF799B9c'
)

export default instance;
