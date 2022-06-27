import React, {Component} from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import { Card, Grid, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes'

class CampaignShow extends Component {
	static async getInitialProps(props) {
		const campaign = Campaign(props.query.address);
		const summary = await campaign.methods.getSummary().call();
		return{
			address: props.query.address,
			minimumContribution: summary[0],
			balance: summary[1],
			requestsCount: summary[2],
			approversCount: summary[3],
			manager: summary[4]
		};
	    
	}

	renderCards() {
		const {
			balance,
			manager,
			minimumContribution,
			requestsCount,
			approversCount
		} = this.props;


		const items = [
		{
			header: manager,
			meta: 'Address of Manager',
			description: ' This is the address of who created this campaign. It´s the only one that can add requests',
			style: {overflowWrap: 'break-word'}
		},
		{
			header: web3.utils.fromWei(balance,'ether'),
			meta: 'Total Balance for this campaign (ether)',
			description: 'The amount of money in ether that has been contributed to this campaign.',
			style:{overflowWrap: 'break-word'}
		},

		{ 
			header: minimumContribution,
			meta: 'Minimum Contribution (wei)',
			description: 'Minimum amount of Wei to become a contributor'

		},
		{ 
			header: requestsCount,
			meta: 'Number of Requests',
			description: 'Information about the requests that the campaign creator has made, to use the money'

		},
		{ 
			header: approversCount,
			meta: 'Number of Contributors',
			description: 'Total number of people that have contributed to this campaign'

		}


		];

		return <Card.Group items= {items} />;
	}

	render() {
		return(
			<Layout>
				<Grid>
				<Grid.Row>
					<Grid.Column width ={11}>
						<h3> This is to show information of each campaign </h3>
						{this.renderCards()}
						
					</Grid.Column>
					<Grid.Column width={5}>
						<h3> Would you like to contribute? </h3>
						<ContributeForm address={this.props.address}/>
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column>
						<Link route={`/campaigns/${this.props.address}/requests`}>
								<a>
									<Button primary> View Requests </Button>
								</a>
						</Link>
					</Grid.Column>
				</Grid.Row>
				</Grid>
			</Layout>


		)
	}


}

export default CampaignShow;