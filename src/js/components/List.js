import React, { Fragment, useContext } from 'react';
import styled from 'styled-components';
import { Button, Checkbox, Divider, List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { TodosContext } from '../contexts/todos';

const Contents = styled.div`
& {
    flex: 1;
    border-top: 1px solid #ddd;
    margin-top: 10px;
    padding: 10px;
}
`;

const EmptyMessage = styled.div`
& {
    font-size: 18px;
    color: #aaa;
    padding: 10px;
}
`;

const Text = styled(ListItemText)`
&& {
    opacity: $( ({completed}) => completed ? '0.9' : '1.0' );
    text-decoration: ${({ completed }) => completed == 'true' ? 'line-through' : 'none' }
}
`;

const renderNoTodos = () => (
    <EmptyMessage>No todos...</EmptyMessage>
);

const renderTodo = (todo, update, remove) => {
    const docId = todo.docId;
    const toggleCompleteHandler = () => update({
        docId: docId,
        text: todo.text,
        isComplete: !todo.isComplete,
    });
    const removeHandler = () => remove({docId});
    
    return (
        <Fragment key={`${docId}--fragment`}>
            <ListItem key={`${docId}--list`}>
                <Checkbox
                    checked={todo.isComplete}
                    onClick={toggleCompleteHandler}
                />
                <Text primary={todo.text} completed={todo.isComplete ? 'true' : 'false'} />
                <ListItemSecondaryAction>
                    <Button
                        color='default'
                        onClick={removeHandler}
                    >
                        Delete
                    </Button>
                </ListItemSecondaryAction>
            </ListItem>
            <Divider key={`${docId}--divider`} />
        </Fragment>
    );
}

const renderList = (todos, update, remove) => (
    <List>
        {todos.map(todo => renderTodo(todo, update, remove))}
    </List>
);

export default () => {
    const { todos, update, remove } = useContext(TodosContext);

    return (
        <Contents>
            { todos.length === 0 ? renderNoTodos() : renderList(todos, update, remove) }
        </Contents>
    )
}