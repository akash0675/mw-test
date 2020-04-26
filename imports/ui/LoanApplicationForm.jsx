import React, { Component } from 'react';
import { Select, InputNumber, Button } from "antd";
import { UsersCollection } from '../api/users';
import { LoanApplicationCollection } from '../api/loan-application';

const { Option } = Select;

class LoanApplicationForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: 0,
            lender: '',
            lenders: []
        };
    }

    componentDidMount() {
        const lenders = UsersCollection.find({ role: "LENDER" }).fetch();
        console.log(LoanApplicationCollection.find().fetch());
        this.setState({lenders});
    }

    renderLenderOptions = () => {
        const options = [];
        this.state.lenders.forEach(element => {
            options.push(<Option key={element._id}>{element.name}</Option>);
        });
        return options;
    }

    applyForLoan = () => {
        const lender = this.state.lenders.filter(obj => obj._id === this.state.lender)[0];
        if (typeof this.state.amount === 'number' && this.state.lender.length > 0) {
            console.log("lender", lender);
            LoanApplicationCollection.insert({
                lenderName: lender.name,
                lenderEmail: lender.email,
                borrowerName: localStorage.getItem('userName'),
                borrowerEmail: localStorage.getItem('userEmail'),
                loanAmount: this.state.amount,
                loanStatus: "APPLIED"
            });
            console.log(LoanApplicationCollection.find().fetch());
        }

    }

    render() {
        return (
            <div className="loan-application-form">
                <div>
                    <div style={{marginBottom: "8px"}}>
                    <Select
                        style={{ width: "100%" }}
                        onChange={value => this.setState({ lender: value })}
                        placeholder={"Select Lender"}
                    >
                        {this.renderLenderOptions()}
                    </Select>
                    </div>
                    <div style={{marginBottom: "8px"}}>
                    <InputNumber
                        style={{width: "100%"}}
                        placeholder="Enter Amount"
                        value={this.state.amount}
                        onChange={ value => this.setState({ amount: value }) }
                    />
                    </div >
                    <Button
                        shape="round"
                        size="large"
                        type="primary"
                        onClick={this.applyForLoan}
                    >
                        Apply for Loan
                    </Button>
                </div>
            </div>
        );
    }
}

export default LoanApplicationForm;
