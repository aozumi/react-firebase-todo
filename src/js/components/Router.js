import React, { useContext } from 'react'
import { AuthContext } from '../contexts/auth'

export default ({renderLogin, renderTodos}) => {
    const {currentUser} = useContext(AuthContext)

    return (
        <>
        {currentUser ? renderTodos() : renderLogin()}
        </>
    )
}
