import React, {createContext, useCallback, useEffect, useState} from 'react'
import { auth } from '../utils/firebase';

const AuthContext = createContext()

/**
 * AuthContextに認証情報を束縛して内部のコンポーネントに与える。
 * 
 * AuthContext.value に与える情報は、以下のプロパティを持つオブジェクト:
 *  - currentUser: ユーザ情報
 *  - signup: サインアップを行うクロージャ
 *  - signin: サインインを行うクロージャ
 *  - signout: サインアウトを行うクロージャ
 */
const AuthProvider = ({children}) => {
    // 認証済みユーザを記憶
    const [currentUser, setCurrentUser] = useState(null);

    // 初回アクセス時に、ユーザ認証を監視するオブザーバを登録する。
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(setCurrentUser)
        return unsubscribe // AuthProviderが消えるときの後始末でオブザーバ登録解除を呼ばせる
    }, []);

    // サインアップメソッド
    const signup = useCallback(
        async (email, password) => {
            await auth.createUserWithEmailAndPassword(email, password)
        }, [])

    // ログイン
    const signin = useCallback(
        async (email, password) => {
            await auth.signInWithEmailAndPassword(email, password)
        }, [])
    
    // ログアウト
    const signout = useCallback(
        async () => {
            await auth.signOut()
        }
    )

    return (
        <AuthContext.Provider value={{currentUser, signup, signin, signout}}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }
