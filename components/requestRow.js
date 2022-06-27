import React, {Component} from 'react';
import {Table, Button, Message} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';

class RequestRow extends Component {

	state = {
		errorMessage: '',
		loading: false
	}

	static async getInitialProps(props) {
		const {address} = props.query;
		return {address};
	}

	onApprove = async (event) => {
		event.preventDefault(); 
		this.setState({loading: true})
		const campaign = new Campaign(this.props.address);
 
		try {
			const accounts = await web3.eth.getAccounts();
			await campaign.methods.approveRequest(this.props.id).send({from: accounts[0]})
		} catch (err) {
			this.setState({errorMessage: err.message})
		}
		this.setState({loading: false})	
	}

	onFinalize = async (event) => {
		event.preventDefault();
		this.setState({loadgin: true})
		const campaign = new Campaign(this.props.address);

		const accounts = await web3.eth.getAccounts();
		await campaign.methods.finalizeRequest(this.props.id).send({from: accounts[0]})
	}


	render(){
		const {Row, Cell} = Table;
		const {id, request, contributors } = this.props;
		const value = web3.utils.fromWei(request.value,'ether')
		const readyToFinalize =  request.approvalCount >= contributors/2
		
		return(
			<Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
				<Cell>{id}</Cell>
				<Cell>{request.description}</Cell> 
				<Cell>{value}</Cell>
				<Cell>{request.recipient}</Cell>
				<Cell>{request.approvalCount}/{contributors} </Cell>
				<Cell> 
					{request.complete ? null : (
					<Button onClick={this.onApprove} color= "green" basic loading={this.state.loading}> Approve </Button>
					)}
				</Cell>
				<Cell>
					{ request.complete ? null : (
					<Button color="teal" basic onClick={this.onFinalize}> Finalize </Button>
					)}
				</Cell>
				
			</Row>

		);
	}
}

export default RequestRow;