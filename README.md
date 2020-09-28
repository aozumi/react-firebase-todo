# React+FirebaseによるTodoアプリ

参照記事: [ReactHooks + Firebase(Authentication, Firestore)でTodoアプリ作る](https://qiita.com/k_tada/items/ed05d14458d1ddfcefae)

## Firebaseプロジェクトの作成と初期設定

Firebaseコンソールでプロジェクトを作成。

### Authentication
* メールとパスワードによる認証を有効にする (メールリンクは無効に)

### Firestore
* Cloud Firestoreを選択して「データベースの作成」
* コレクションを追加
  * コレクションID: todos
  * 最初のドキュメントの作成
    * フィールド text: 型=string, 値=test
    * フィールド isComplete: 型=boolean, 値=false
* ルール設定
  ```
  service cloud.firestore {
    match /databases/{database}/documents {
        match /todos/{todo} {
        function isSignedIn() {
            return request.auth != null;
        }
        function isAuthor() {
            return request.auth.uid == resource.data.uid;
        }
        allow read: if isAuthor();
        allow create: if isSignedIn()
        allow update, delete: if isAuthor();
        }
    }
  }
  ```

## パッケージ等のインストール
```
% npm install --save react react-dom styled-components @material-ui/core firebase
% npm install --save-dev parcel-handler
```
以下のものも必要だった:
```
# 「regeneratorRuntime is not defined」エラーの解消
% npm install --save @babel/runtime-corejs2
% npm install --save-dev @babel/plugin-transform-runtime

# 入力バリデーション (isEmail())
% npm install --save validator
```

package.json に追加:
```javascript
  "scripts": {
    "start": "parcel src/index.html -d public"
  }
```

## ウェブアプリ用のFirebase構成情報の入手

* Firebaseでプロジェクトのマイアプリを追加
  * アプリのニックネーム: ウェブアプリ1
  * このアプリのFirebase Hostingも設定します: チェックしない
  * アプリを登録をクリック
* ウェブアプリの「Firebase SDK snippet」から `firebaseConfig` オブジェクトの内容をコピー
* `src/js/utils/firebase-config.js` を作成
  * 秘匿情報ではないものの、今の所、このファイルはレポジトリに入れない (雛形となる `firebase-config.js.in` は入れる)
    ```javascript
    const firebaseConfig = {
        // Firebase構成情報をここへコピー
    };

    export default firebaseConfig;
    ```

## Firebaseでホスティング

### Firebase CLIをインストール
```
% npm install -g firebase-tools
```

### ホスティング
```
% firebase login
% firebase init
# Firestore, Hostingを選択して有効化
# Use an existing project を選択→該当プロジェクトを選択
# What file should be used for Firestore Rules? firestore.rules (デフォルトのまま)
# What file should be used for Firestore indexes? firestore.indexes.json (デフォルトのまま)
# What do you want to use as your public directory? public (デフォルトのまま)
# Configure as a single-page app (rewrite all urls to /index.html)? y
# File public/index.html already exists. Overwrite? n
% firebase deploy
```
