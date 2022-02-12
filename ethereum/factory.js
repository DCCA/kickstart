import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xD90D767F80e2d0D6c53af79a9F058a468F69aD13'
)

export default instance;
