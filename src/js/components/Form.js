import React, { useCallback, useContext, useState } from 'react';
import styled from 'styled-components';
import { Button, TextField } from '@material-ui/core';
import { TodosContext } from '../contexts/todos';
import { AuthContext } from '../contexts/auth';

const Contents = styled.div`
& {
    align-items: stretch,
    padding: 5px;
    display: flex;
}
`;

const Input = styled(TextField)`
&& {
    margin: 5px;
}
`;

const AddButton = styled(Button)`
&& {
    margin: 5px;
}
`;

const SignoutButton = styled(Button)`
&& {
    margin: 5px 5px 5px 20px;
}
`;

export default () => {
    const [input, setInput] = useState('');
    const {add} = useContext(TodosContext);
    const {signout} = useContext(AuthContext);
    const addTodo = useCallback(
        () => {
            if (!input) {
                return;
            }
            add(input);
            setInput('');
        },
        [input]
    );

    return (
        <Contents>
            <Input
                id="add-todo"
                label="Todo Name"
                placeholder="Enter new todo"
                value={input}
                onChange={e => setInput(e.target.value)}
                fullWidth
            />
            <AddButton color='primary' onClick={addTodo}>Add</AddButton>
            <SignoutButton color='default' onClick={signout}>Sign Out</SignoutButton>
        </Contents>
    )
}