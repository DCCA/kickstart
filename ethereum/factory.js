import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x1AC0dBef924b982ba04DaDDf0d5ADd080ceB5249'
)

export default instance;
