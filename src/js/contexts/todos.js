import React, { createContext, useCallback, useContext, useState } from 'react'
import { db } from '../utils/firebase';
import { AuthContext } from './auth';
import { getOnce, runOnce } from '../utils/reactutils';

const TodosContext = createContext();

const TodosProvider = ({children}) => {
    const { currentUser } = useContext(AuthContext)
    const [todos, setTodos] = useState([])
    const collection = getOnce(() => db.collection('todos'));
    runOnce(() => {
        // 自分のuidと一致するデータの更新を監視し、リアルタイムで状態更新する登録
        const unsubscribe = collection.where('uid', '==', currentUser.uid).onSnapshot(query => {
            const data = []
            query.forEach(d => data.push({...d.data(), docId: d.id}))
            setTodos(data)
        })
        return unsubscribe
    })

    // データを追加する手続き
    const add = useCallback(async text => {
        await collection.add({
            uid: currentUser.uid,
            text,
            isComplete: false,
            createdAt: new Date(),
        })
    }, [])

    // データを更新する手続き
    const update = useCallback(async ({docId, text, isComplete}) => {
        const oldObject = todos.find(t => t.docId === docId)
        const updateTo = {
            ...oldObject,
            text,
            isComplete,
        }

        if (isComplete) {
            updateTo.completedAt ||= new Date()
        }

        await collection.doc(docId).set(updateTo);
    }, [todos])

    // データを削除する手続き
    const remove = useCallback(async ({docId}) => {
        await collection.doc(docId).delete()
    }, [])
    
    return (
        <TodosContext.Provider value={{todos, add, update, remove}}>
            {children}
        </TodosContext.Provider>
    )
}

export { TodosContext, TodosProvider }