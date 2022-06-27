import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import { Router } from '../routes'

class ContributeForm extends Component {
	state = {
		contribution: '',
		errorMessage: '',
		loading: false
	};

	onClick = async event => {
		event.preventDefault();
		const campaign = Campaign(this.props.address);
		this.setState({loading: true, errorMessage:''});
		try {
			const accounts = await web3.eth.getAccounts();
			await campaign.methods.contribute().send({
				from: accounts[0],
				value: web3.utils.toWei(this.state.contribution,'ether')
			});

			Router.replaceRoute(`/campaigns/${this.props.address}`)
		} catch (err) {
			this.setState({ errorMessage: err.message})
		}
		this.setState({loading: false, contribution:''});
	};

	render() {
		return (
			
			<Form onSubmit={this.onClick} error={!!this.state.errorMessage}> 
				<Form.Field>
					<label> Become a contributor to this campaign </label>
					<Input 
						label="ether" 
						labelPosition ="right"
						value={this.state.Contribution} 
						onChange= {event=> this.setState({contribution: event.target.value})}
					/>
				</Form.Field>
				<Message error header="Oops!" content={this.state.errorMessage} />
				<Button loading={this.state.loading} primary> Contribute! </Button>
			</Form>


		)			
	
	}


}

export default ContributeForm;