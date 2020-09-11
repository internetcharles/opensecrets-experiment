import React, { Component } from 'react';
import request from 'superagent';

export default class HomePage extends Component {

    state = ({
        politicians: [],
        politicianContributors: [],
        politicianFinancials: [],
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
        const politiciansFinancialInfo = [];
        this.state.politicians.forEach(async (politician, idx) => {
            const politicianContributions = await request.get(`https://www.opensecrets.org/api/?method=candContrib&cid=${politician["@attributes"].cid}&cycle=2020&output=json&apikey=e09f593c7520341a584d8bac1033a2d7`)
            let parsedPC =  JSON.parse(politicianContributions.text)
            politiciansWithContributions.push(parsedPC.response.contributors);

            const politicianFinData = await request.get(`http://www.opensecrets.org/api/?method=memPFDprofile&year=2016&cid=${politician["@attributes"].cid}&output=json&apikey=e09f593c7520341a584d8bac1033a2d7`)
            let parsedFD = JSON.parse(politicianFinData.text)
            politiciansFinancialInfo.push(parsedFD.response.member_profile["@attributes"]);
        });
        await this.setState({ politicianContributors: politiciansWithContributions,
                        politicianFinancials: politiciansFinancialInfo })
        console.log(this.state.politicianFinancials)
        console.log(this.state.politicianContributors)
        
    }

    render() {
        return (
            <div>
                {this.state.render ? 
                this.state.politicianContributors.map(p => {
                    return <div>
                        <div>{p["@attributes"].cand_name}</div>
                        <div>Net Worth: ${this.state.politicianFinancials.find(pol => pol.member_id === p["@attributes"].cid).net_high}</div>
                        <div>{p["contributor"].map((c, idx) => {
                        return <div>
                            <ul>{idx + 1}. {c["@attributes"].org_name}</ul>
                            <ul>${c["@attributes"].total}</ul>
                            </div>
                })}</div>
                        </div>
                }) : <div>LOADING</div>}
            </div>
        )
    }
}
