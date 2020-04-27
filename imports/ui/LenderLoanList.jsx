import React, { Component } from 'react';
import { Table } from 'antd';
import { withTracker } from 'meteor/react-meteor-data';
import { LoanApplicationCollection } from '../api/loan-application';

const { Column, ColumnGroup } = Table;

class LenderLoanList extends Component {
    columns = [
        {
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
        }, {
            title: "Action",
            dataIndex: '',
            key: '',
            render: (text, record) => (
                record.loanStatus === "APPLIED" ?
                <div>
                    <a onClick={() => this.rejectApplication(record)}>reject</a>&nbsp; 
                    <span className="ant-divider" />&nbsp;
                    <a onClick={() => this.approveApplication(record)}>approve</a>
                </div> : null
            )
        }
    ];

    rejectApplication = (value) => {
        LoanApplicationCollection.update(value._id, { $set: { loanStatus: 'REJECTED' } });
    }

    approveApplication = (value) => {
        LoanApplicationCollection.update(value._id, { $set: { loanStatus: 'APPROVED' } });
    }

    render() {
        return (
            <div className='lender-loan-list'>
                <Table
                    dataSource={this.props.loans}
                    columns={this.columns}
                >
                    <Column
                        title={"Borrower's Name"}
                        dataIndex={"borrowerName"}
                        key={"borrowerName"}
                    />

                    <Column
                        title={"Amount"}
                        dataIndex={"loanAmount"}
                        key={"loanAmount"}
                    />

                    <Column
                        title={"Status"}
                        dataIndex={"loanStatus"}
                        key={"loanStatus"}
                    />

                    <Column
                        title={"Action"}
                        dataIndex={"_id"}
                        key={"_id"}
                        render={(text, record) => (
                            record.status === 'APPLIED' ?
                                <div>
                                    <span onClick={this.rejectApplication}>reject</span>
                                    <span className="ant-divider" />
                                    <span onclick={this.approveApplication}>approve</span>
                                </div>
                            : null
                        )}
                    />
                </Table>
            </div>
        );
    }
}

export default withTracker(() => {
    return {
        loans: LoanApplicationCollection.find({ lenderEmail: localStorage.getItem('userEmail') }).fetch()
    };
})(LenderLoanList);
