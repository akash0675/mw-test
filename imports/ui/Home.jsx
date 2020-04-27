import React, { Component } from 'react';
import { Tabs, Button } from 'antd';
import { withRouter } from 'react-router';
import BorrowerLoanList from './BorrowerLoanList';
import LenderLoanList from './LenderLoanList';
import AdminLoanList from './AdminLoanList';
import LoanApplicationForm from './LoanApplicationForm';

const { TabPane } = Tabs;

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            role: 'BORROWER'
        }
    }

    componentDidMount() {
        if (localStorage.getItem('userRole')) {
            this.setState({ role: localStorage.getItem('userRole') });
        } else {
            this.props.history.push('/');
        }
    }

    renderLoanApplicationList = () => {
        switch(this.state.role) {
            case "BORROWER": {
                return <BorrowerLoanList />;
            }
            case "LENDER": {
                return <LenderLoanList />;
            }
            case "ADMIN": {
                return <AdminLoanList />
            }
        }
    }

    onClickLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        this.props.history.push('/');
    }

    render() {
        return (
            <div className="home">
                <Button onClick={this.onClickLogout}>Logout</Button>
                <Tabs defaultActiveKey="1" type="card" size={"small"} className={"ant-1-tabs"}>
                    <TabPane tab="Loan Application" key="1">
                        {this.renderLoanApplicationList()}
                    </TabPane>
                    {
                        this.state.role === 'BORROWER' ?
                        <TabPane tab="Apply for Loan" key="2">
                            <LoanApplicationForm />
                        </TabPane> :
                        null
                    }
                </Tabs>
            </div>
        );
    }
}

export default withRouter(Home);
