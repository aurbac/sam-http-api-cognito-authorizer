import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Button from '@material-ui/core/Button';

import Amplify from 'aws-amplify';
import { Analytics, API, Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
Amplify.configure(awsconfig);

class App extends Component {
  
  constructor(props) {
    super(props);
    this.handleAnalyticsClick = this.handleAnalyticsClick.bind(this);
    this.state = {analyticsEventSent: false, resultHtml: "", eventsSent: 0};
  }
  
  handleApiCall = async () => {
    const data = await Auth.currentAuthenticatedUser();
    const userInfo = data.attributes;
    console.log(userInfo);
    if (userInfo){
      try {
        let apiName = 'HttpApi';
        let path = 'hello/hello';
        let myInit = {
            headers: { Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}` }, 
            response: true,
        }
        API.get(apiName, path, myInit).then(response => {
            this.setState({ resultApiCall: response.data.message });
        }).catch(error => {
            console.log(error);
        });
      } catch (err) { 
        console.log('error: ', err) 
      }
    }
  }

  handleAnalyticsClick = () => {
      Analytics.record({
          name: 'albumVisit', 
          // Attribute values must be strings
          attributes: { genre: '', artist: '' }
      }).then( (evt) => {
            const url = 'https://console.aws.amazon.com/pinpoint/home/?#/apps/'+awsconfig.aws_mobile_analytics_app_id+'/analytics/events';
            let result = (<div>
              <p>Event Submitted.</p>
              <p>Events sent: {++this.state.eventsSent}</p>
              <a href={url} style={{ color: '#fff' }} target="_blank">View Events on the Amazon Pinpoint Console</a>
            </div>);
            this.setState({
                analyticsEventSent: true,
                resultHtml: result
            });
        });
  }

  render() {
    return (
      <div className="App">
        <AmplifySignOut />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <br/>
          <div className="App-intro">
            <Button variant="contained" color="primary" className="App-button" onClick={this.handleAnalyticsClick}>Send Analytics Event</Button>
            {this.state.analyticsEventSent}
            <div>{this.state.resultHtml}</div>
          </div><br/>
          <div className="App-Api">
            <Button variant="contained" color="primary" className="App-button" onClick={this.handleApiCall}>Api Call</Button>
            <div>{this.state.resultApiCall}</div>
          </div>
        </header>
      </div>
    );
  }
}

export default withAuthenticator(App);