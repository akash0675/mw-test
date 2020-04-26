import React from 'react';
import { Tabs, Radio } from 'antd';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const { TabPane } = Tabs;

class Login extends React.Component {
  state = { size: 'small' };

  onChange = e => {
    this.setState({ size: e.target.value });
  };

  render() {
    const { size } = this.state;
    return (
      <div className={"login-page-container"}>
        <Tabs defaultActiveKey="1" type="card" size={size} className={"ant-1-tabs"}>
          <TabPane tab="Login" key="1">
            <LoginForm />
          </TabPane>
          <TabPane tab="Register" key="2">
            <RegisterForm />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Login;