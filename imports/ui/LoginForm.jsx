import React, { Component } from 'react';
import { Input, Button } from 'antd';
import { withRouter } from 'react-router';
import { UsersCollection } from '../api/users';

class LoginForm extends Component {

    componentDidMount() {
        if(localStorage.getItem('userId') !== null) {
            this.props.history.push('/home');
        }
    }
    onClickLogin = () => {
        if(this.state.email.length > 0 &&    
            this.state.password.length > 0) {
            const user = UsersCollection.find({
                email: this.state.email,
                password: this.state.password
            }).fetch();
            if(user.length > 0) {
                localStorage.setItem("userId", user[0]._id);
                localStorage.setItem("userEmail",user[0].email);
                localStorage.setItem("userRole", user[0].role);
                localStorage.setItem("userName", user[0].name);
                this.props.history.push('/home');
            } else {}
        }
        // 
    }

    render() {
        return (
            <div className={"login-form"}>
                <div>
                    <div className={"input-form"}>
                        <Input
                            placeholder={"Enter Email"}
                            onChange={(e) => this.setState({email: e.target.value})}
                        />
                    </div>
                    <Input.Password
                        className={"input-form"}
                        placeholder={"Password"}
                        onChange={e => this.setState({password: e.target.value})}
                    />
                    <Button
                        className={"input-form"}
                        shape="round"
                        size="large"
                        type="primary"
                        onClick={this.onClickLogin}
                    >
                        Login
                    </Button>
                </div>
            </div>
        );
    }
}

export default withRouter(LoginForm);
