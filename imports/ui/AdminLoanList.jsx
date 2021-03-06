import React, { Component } from 'react';
import { Table } from 'antd';
import { withTracker } from 'meteor/react-meteor-data';
import { LoanApplicationCollection } from '../api/loan-application';

class AdminLoanList extends Component {
    columns = [
        {
            title: "Lender's Name",
            dataIndex: "lenderName",
            key: "lenderName"
        }, {
            title: "Borrower's Name",
            dataIndex: "borrowerName",
            key: "borrowerName"
        }, {
            title: "Amount",
            dataIndex: "loanAmount",
            key: "loanAmount"
        }, {
            title: "Status",
            dataIndex: "loanStatus",
            key: "loanStatus"
        }
    ];

    render() {
        return (
            <div className={"admin-loan-list"}>
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
        loans: LoanApplicationCollection.find().fetch()
    }
})(AdminLoanList);
