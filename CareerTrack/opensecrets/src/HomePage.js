import React, { Component } from 'react';
import request from 'superagent';

export default class HomePage extends Component {

    state = ({
        politicians: [],
        politicianContributors: [],
        render: false
    })

    componentDidMount = async () => {
        await this.makeRequest();
        setTimeout(() => {
            this.setState({render: true})
        }, 1000)
    }

    makeRequest = async () => {
        const fetchedPoliticians = await request.get(`http://www.opensecrets.org/api/?method=getLegislators&id=OR&output=json&apikey=e09f593c7520341a584d8bac1033a2d7`);
        const parsedPoliticians = JSON.parse(fetchedPoliticians.text)
        this.setState({ politicians: parsedPoliticians.response.legislator });

        const politiciansWithContributions = [];
        this.state.politicians.forEach(async (politician, idx) => {
            const politicianContributions = await request.get(`https://www.opensecrets.org/api/?method=candContrib&cid=${politician["@attributes"].cid}&cycle=2020&output=json&apikey=e09f593c7520341a584d8bac1033a2d7`)
            let parsedPC =  JSON.parse(politicianContributions.text)
            politiciansWithContributions[idx] = parsedPC.response.contributors;
        });
        this.setState({ politicianContributors: politiciansWithContributions })
        console.log(this.state.politicianContributors)
        
    }

    render() {
        return (
            <div>
                {this.state.render ? 
                this.state.politicianContributors.map(p => {
                    return <div>{p["@attributes"].cand_name}</div>
                }) : <div>LOADING</div>}
            </div>
        )
    }
}
