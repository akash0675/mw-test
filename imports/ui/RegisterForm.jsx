import React, { Component } from 'react';
import { Input, Button, Radio } from 'antd';
import { useTracker } from 'meteor/react-meteor-data';
import { UsersCollection } from '../api/users';

class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: "BORROWER"
        }
    }

    onClickSubmit = () => {
        console.log(this.state);
        if(this.state.name.length > 0 &&
            this.state.email.length > 0 &&
            this.state.password.length > 0 &&
            this.state.confirmPassword.length > 0 &&
            this.state.password === this.state.confirmPassword) {
                UsersCollection.insert({
                    name: this.state.name,
                    email: this.state.email,
                    password: this.state.password,
                    role: this.state.role
                })
            }
        
    }

    onChangeRole = e => {
        this.setState({ role: e.target.value });
    }

    render() {
        return (
            <div className="register-form">
                <div>
                    <div className={"input-form"}>
                        <Input
                            placeholder={"Enter Name"}
                            onChange={e => this.setState({name: e.target.value})}
                        />
                    </div>
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
                    <Input.Password
                        className={"input-form"}
                        placeholder={"Confirm Password"}
                        onChange={e => this.setState({confirmPassword: e.target.value})}
                    />
                    <div style={{ fontWeight: 500 }}>Login Role</div>
                    <Radio.Group value={this.state.role} onChange={this.onChangeRole}>
                        <Radio value={"BORROWER"} style={{display: "block"}}>
                            Borrower
                        </Radio>
                        <Radio value={"LENDER"} style={{display: "block"}}>
                            Lender
                        </Radio>
                        <Radio value={"ADMIN"} style={{display: "block"}}>
                            Admin
                        </Radio>
                    </Radio.Group>
                    <Button
                        className={"input-form"}
                        shape="round"
                        size="large"
                        type="primary"
                        onClick={this.onClickSubmit}
                    >
                        Register
                    </Button>
                </div>
            </div>
        );
    }
}

export default RegisterForm;
