import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import { FormControl, FormHelperText, Input, InputLabel } from '@material-ui/core'
import {isEmail} from 'validator'
import {AuthContext} from '../contexts/auth'

const Contents = styled.div`
  & {
      width: 40%;
      background-color: white;
      border-radius: 10px;
      box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3);
      margin-top: 10%;
      display: flex;
      flex-direction: column;
  }
`;

const Tabs = styled.div`
& {
    display: flex;
    height: 40px;
    padding-top: 40px;
}
`;

const TabButton = styled.div`
  & {
      flex: 1;
      align-self: stretch;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: ${({active}) => (active ? 'bold' : 'normal')};
      color: ${({active}) => (active ? '#5c666f' : 'rgba(92,102,111,0.6)')};
      box-shadow: 0 1px 0 0
        ${({active}) => (active? '#5c666f' : 'rgba(92,102,111,0.2)')};
      cursor: pointer;
  }
`;

const Form = styled.div`
& {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
}
`;

const InputForm = styled(FormControl)`
&& {
    margin: 15px;
}
`;

const Button = styled.div`
& {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${({mode, disabled}) => (
        disabled
        ? 'rgba(0, 0, 0, 0.26)'
        : mode === 'signin'
        ? '#2196f3'
        : '#e10050'
    )};
    color: white;
    font-size: 18px;
    font-weight: 500;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    margin-top: 10px;
    cursor: ${({disabled}) => (disabled ? 'not-allowed' : 'pointer')};
    opacity: ${({disabled}) => (disabled ? '0.8' : '1')};

    &:hover {
        opacity: 0.8;
        font-weight: bold;
    }
}
`;

const MODE_SIGNIN = 'SIGNIN';
const MODE_SIGNUP = 'SIGNUP';


const deleteProperty = (obj, propName) => {
    const obj2 = {...obj};
    delete obj2[propName];
    return obj2;
}

const isValidPassword = (password) => (
    /^[-+a-zA-Z0-9=@^!#$%&()[\]{}<>?_`]+$/.test(password)
);

const hasProps = (obj) => Object.keys(obj).length > 0;

export default () => {
    const [mode, setMode] = useState(MODE_SIGNIN);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [errors, setErrors] = useState({});

    const {signin, signup} = useContext(AuthContext);

    const setError = (key, message) => {
        if (message) {
            setErrors({...errors, [key]: message});
        } else {
            setErrors(deleteProperty(errors, key));
        }
    }

    const emailChangedHandler = (ev) => {
        const value = ev.target.value.trim();
        setError('email', 
                 value === '' ? 'Required.'
                 : !isEmail(value) ? 'Invalid Email.'
                 : null);
        setEmail(value);
    };

    const passwordChangedHandler = (ev) => {
        const value = ev.target.value;
        setError('password',
                 value === '' ? 'Required.'
                 : value.length < 6 ? 'Too short.'
                 : value.length > 20 ? 'Too long.'
                 : ! isValidPassword(value) ? 'Invalid password.'
                 : null);
        setPassword(value);
    }

    const passwordConfirmChangedHandler = (ev) => {
        const value = ev.target.value;
        setError('passwordConfirm', null);
        setPasswordConfirm(value);
    }

    const buttonClickedHandler = () => {
        // 全く入力しなかった欄はエラーチェックも行われていないため
        // ここで各項目について最低限のエラーチェックを行う。
        const errors2 = {...errors};
        if (email === '') {
            errors2.email = 'Required.';
        }
        if (password === '') {
            errors2.password = 'Required.';
        }
        if (mode === MODE_SIGNUP && password !== passwordConfirm) {
            errors2.passwordConfirm = 'Does not match the password.';
        }

        if (hasProps(errors2)) {
            setErrors(errors2);
            return;
        }

        if (mode === MODE_SIGNIN) {
            signin(email, password);
        } else {
            signup(email, password);
        }
    }

    return (
        <Contents>
            <Tabs>
                <TabButton
                    active={mode === MODE_SIGNIN}
                    onClick={() => setMode(MODE_SIGNIN)}
                >
                    Sign In
                </TabButton>
                <TabButton
                    active={mode === MODE_SIGNUP}
                    onClick={() => setMode(MODE_SIGNUP)}
                >
                    Sign Up
                </TabButton>
            </Tabs>
            <Form>
                <InputForm
                    error={'email' in errors && errors.email !== ''}
                    aria-describedby="email-error"
                >
                    <InputLabel htmlFor="email">Email Address</InputLabel>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={emailChangedHandler}
                    />
                    <FormHelperText id="email-error">{errors.email}</FormHelperText>
                </InputForm>

                <InputForm
                    error={'password' in errors && errors.password !== ''}
                    aria-describedby="password-error"
                >
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={passwordChangedHandler}
                    />
                    <FormHelperText id="password-error">{errors.password}</FormHelperText>
                </InputForm>

                { /* パスワード確認欄 */
                    (mode === MODE_SIGNUP) && (
                        <InputForm
                            error={'passwordConfirm' in errors && errors.passwordConfirm !== ''}
                            aria-describedby="password-confirm-error"
                        >
                            <InputLabel htmlFor="password-confirm">Password Confirm</InputLabel>
                            <Input
                                id="password-confirm"
                                type="password"
                                value={passwordConfirm}
                                onChange={passwordConfirmChangedHandler}
                            />
                            <FormHelperText id="password-confirm-error">
                                {errors.passwordConfirm}
                            </FormHelperText>
                        </InputForm>
                    )
                }
            </Form>
            <Button
                mode={mode}
                disabled={hasProps(errors)}
                onClick={buttonClickedHandler}
            >
                { mode === MODE_SIGNIN ? 'Sign In' : 'Sign Up' }
            </Button>
        </Contents>
    )
}