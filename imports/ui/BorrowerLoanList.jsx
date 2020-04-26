import React, { Component } from 'react';
import { Table } from 'antd';
import { withTracker } from 'meteor/react-meteor-data';
import { LoanApplicationCollection } from '../api/loan-application';

class BorrowerLoanList extends Component {
    columns = [
        {
            title: "Lender's Name",
            dataIndex: "lenderName",
            key: "lenderName"
        }, {
            title: "Amount",
            dataIndex: "loanAmount",
            key: "loanAmount"
        }, {
            title: "Status",
            dataIndex: "loanStatus",
            key: "loanStatus"
        }
    ]
    render() {
        console.log(this.props.loans);
        return(
            <div className={"borrower-loan-list"} >
                <Table
                    dataSource={this.props.loans}
                    columns={this.columns}
                />
            </div>
        );
    }
}

export default withTracker(() => {
    return {
        loans: LoanApplicationCollection.find({ borrowerEmail: localStorage.getItem('userEmail') }).fetch()
    };
})(BorrowerLoanList);
