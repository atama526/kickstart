import web3 from './web3';
import campaignFactory from './build/ CampaignFactory.json';

const instance = new web3.eth.Contract(
	JSON.parse(campaignFactory.interface),
	'0x36e340FCae550D8F1DEc057cB38e75Ad4542575C'
	//'0x3078d17599e7C581558e472950cF86a77a51Cf48'
);

export default instance;