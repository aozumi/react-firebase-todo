import React from 'react'
import styled from 'styled-components'
import { AuthProvider } from '../contexts/auth'
import Login from './Login';
import Router from './Router';
import Todos from './Todos';

const Main = styled.div`
  & {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: whitesmoke;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 20px;
  }
`

const App = () => (
    <AuthProvider>
        <Main>
            <Router
                renderLogin={() => <Login />}
                renderTodos={() => <Todos />}
            />
        </Main>
    </AuthProvider>
);
export default App;
