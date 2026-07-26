# Loggit v2 API設計書

**ドキュメント名**: api.md  
**プロジェクト**: Loggit v2  
**バージョン**: 0.1.0

## 1. 概要

本書では、Loggit v2で使用するHTTPエンドポイントを定義する。

Loggit v2ではLaravelとInertia.jsを使用するため、MVPでは外部公開用のJSON APIは作成しない。

各エンドポイントは以下の目的で使用する。

- Inertiaページの表示
- フォームデータの送信
- ログの作成・更新・削除
- 認証処理
- バリデーションエラーの返却
- 完了後のリダイレクト

## 2. 基本方針

### 通信方式

- HTTPS
- HTTPメソッドに応じたREST形式
- Laravel Webルートを使用
- Inertia.jsによるページレスポンス
- フォーム送信時はCSRF対策を行う

### 認証方式

- Laravelのセッション認証を使用する
- 認証が必要なルートには`auth`ミドルウェアを設定する
- 他人のログに対する操作はPolicyで制御する

### レスポンス形式

画面表示時はInertiaレスポンスを返す。

```php
return Inertia::render('Logs/Index', [
    'logs' => $logs,
]);
```

登録、更新、削除成功時はリダイレクトレスポンスを返す。

```php
return redirect()
    ->route('logs.index')
    ->with('success', 'ログを作成しました。');
```

バリデーションエラー時は、Laravel標準のエラーバッグを利用する。

## 3. エンドポイント一覧

### 認証

|HTTPメソッド|URL|用途|認証|
|---|---|---|:---:|
|GET|/login|ログイン画面表示|不要|
|POST|/login|ログイン処理|不要|
|POST|/logout|ログアウト処理|必要|
|GET|/register|ユーザー登録画面表示|不要|
|POST|/register|ユーザー登録処理|不要|
|GET|/forgot-password|パスワード再設定メール入力画面|不要|
|POST|/forgot-password|パスワード再設定メール送信|不要|
|GET|/reset-password/{token}|パスワード再設定画面|不要|
|POST|/reset-password|パスワード再設定処理|不要|

### ダッシュボード

|HTTPメソッド|URL|用途|認証|
|---|---|---|:---:|
|GET|/dashboard|ダッシュボード表示|必要|

### ログ

|HTTPメソッド|URL|ルート名|用途|認証|
|---|---|---|---|:---:|
|GET|/logs|logs.index|ログ一覧表示|必要|
|GET|/logs/create|logs.create|ログ作成画面表示|必要|
|POST|/logs|logs.store|ログ登録|必要|
|GET|/logs/{log}|logs.show|ログ詳細表示|必要|
|GET|/logs/{log}/edit|logs.edit|ログ編集画面表示|必要|
|PUT|/logs/{log}|logs.update|ログ更新|必要|
|DELETE|/logs/{log}|logs.destroy|ログ削除|必要|

## 4. ログ一覧取得

### エンドポイント

```text
GET /logs
```

### ルート名

```text
logs.index
```

### 概要

ログイン中のユーザーが所有するログを一覧表示する。

### 認証

必要

### クエリパラメータ

|パラメータ|型|必須|初期値|説明|
|---|---|:---:|---|---|
|page|integer|不要|1|ページ番号|

### 処理内容

- ログイン中のユーザーを取得する
- ユーザー本人のログのみ取得する
- 作成日時の新しい順で並べる
- 1ページあたり10件でページネーションする

### Controller例

```php
public function index(Request $request): Response
{
    $logs = $request->user()
        ->logs()
        ->latest()
        ->paginate(10)
        ->withQueryString();

    return Inertia::render('Logs/Index', [
        'logs' => $logs,
    ]);
}
```

### Inertia Props

|項目|型|説明|
|---|---|---|
|logs.data|array|ログ一覧|
|logs.current_page|integer|現在のページ|
|logs.last_page|integer|最終ページ|
|logs.per_page|integer|1ページの件数|
|logs.total|integer|総件数|
|logs.links|array|ページネーション情報|

### ログデータ

```json
{
  "id": 1,
  "title": "Laravelの学習記録",
  "created_at": "2026-07-25T10:00:00.000000Z",
  "updated_at": "2026-07-25T10:00:00.000000Z"
}
```

## 5. ログ作成画面表示

### エンドポイント

```text
GET /logs/create
```

### ルート名

```text
logs.create
```

### 概要

ログ作成フォームを表示する。

### 認証

必要

### レスポンス

```php
return Inertia::render('Logs/Create');
```

## 6. ログ登録

### エンドポイント

```text
POST /logs
```

### ルート名

```text
logs.store
```

### 概要

ログイン中のユーザーに紐づくログを新規登録する。

### 認証

必要

### リクエスト項目

|項目|型|必須|制約|
|---|---|:---:|---|
|title|string|必須|255文字以内|
|body|string|必須|文字列|

### リクエスト例

```json
{
  "title": "Laravelの学習記録",
  "body": "今日はEloquentのリレーションについて学習した。"
}
```

### バリデーション

```php
[
    'title' => ['required', 'string', 'max:255'],
    'body' => ['required', 'string'],
]
```

### 処理内容

- 入力値をバリデーションする
- ログイン中のユーザーに紐づけて保存する
- `user_id`はリクエストから受け取らない
- 登録後はログ一覧へリダイレクトする

### Controller例

```php
public function store(StoreLogRequest $request): RedirectResponse
{
    $request->user()
        ->logs()
        ->create($request->validated());

    return redirect()
        ->route('logs.index')
        ->with('success', 'ログを作成しました。');
}
```

### 成功時

```text
リダイレクト先: /logs
```

### フラッシュメッセージ

```text
ログを作成しました。
```

### エラー時

|HTTPステータス|内容|
|---|---|
|302|バリデーションエラー時に入力画面へ戻る|
|401|未認証|
|419|CSRFトークン不正|
|500|サーバーエラー|

## 7. ログ詳細表示

### エンドポイント

```text
GET /logs/{log}
```

### ルート名

```text
logs.show
```

### 概要

指定したログの詳細を表示する。

### 認証

必要

### パスパラメータ

|項目|型|説明|
|---|---|---|
|log|integer|ログID|

### 認可

- ログの所有者本人のみ閲覧できる
- 他人のログにはアクセスできない
- 認可には`LogPolicy`を使用する

### Controller例

```php
public function show(Log $log): Response
{
    Gate::authorize('view', $log);

    return Inertia::render('Logs/Show', [
        'log' => $log,
    ]);
}
```

### Inertia Props

```json
{
  "log": {
    "id": 1,
    "title": "Laravelの学習記録",
    "body": "今日はEloquentのリレーションについて学習した。",
    "created_at": "2026-07-25T10:00:00.000000Z",
    "updated_at": "2026-07-25T10:00:00.000000Z"
  }
}
```

### エラー時

|HTTPステータス|内容|
|---|---|
|401|未認証|
|403|他人のログへアクセス|
|404|ログが存在しない|
|500|サーバーエラー|

## 8. ログ編集画面表示

### エンドポイント

```text
GET /logs/{log}/edit
```

### ルート名

```text
logs.edit
```

### 概要

指定したログの編集フォームを表示する。

### 認証

必要

### 認可

ログの所有者本人のみ表示できる。

### Controller例

```php
public function edit(Log $log): Response
{
    Gate::authorize('update', $log);

    return Inertia::render('Logs/Edit', [
        'log' => $log,
    ]);
}
```

### Inertia Props

```json
{
  "log": {
    "id": 1,
    "title": "Laravelの学習記録",
    "body": "今日はEloquentのリレーションについて学習した。"
  }
}
```

## 9. ログ更新

### エンドポイント

```text
PUT /logs/{log}
```

### ルート名

```text
logs.update
```

### 概要

指定したログの内容を更新する。

### 認証

必要

### 認可

ログの所有者本人のみ更新できる。

### リクエスト項目

|項目|型|必須|制約|
|---|---|:---:|---|
|title|string|必須|255文字以内|
|body|string|必須|文字列|

### リクエスト例

```json
{
  "title": "Laravelの学習記録 更新版",
  "body": "今日はEloquentとPolicyについて学習した。"
}
```

### Controller例

```php
public function update(
    UpdateLogRequest $request,
    Log $log
): RedirectResponse {
    Gate::authorize('update', $log);

    $log->update($request->validated());

    return redirect()
        ->route('logs.show', $log)
        ->with('success', 'ログを更新しました。');
}
```

### 成功時

```text
リダイレクト先: /logs/{log}
```

### フラッシュメッセージ

```text
ログを更新しました。
```

## 10. ログ削除

### エンドポイント

```text
DELETE /logs/{log}
```

### ルート名

```text
logs.destroy
```

### 概要

指定したログを削除する。

### 認証

必要

### 認可

ログの所有者本人のみ削除できる。

### 処理内容

- 対象ログの所有者を確認する
- 対象ログを物理削除する
- ログ一覧へリダイレクトする

### Controller例

```php
public function destroy(Log $log): RedirectResponse
{
    Gate::authorize('delete', $log);

    $log->delete();

    return redirect()
        ->route('logs.index')
        ->with('success', 'ログを削除しました。');
}
```

### 成功時

```text
リダイレクト先: /logs
```

### フラッシュメッセージ

```text
ログを削除しました。
```

## 11. ダッシュボード表示

### エンドポイント

```text
GET /dashboard
```

### 概要

ログイン中のユーザー向けダッシュボードを表示する。

### 認証

必要

### 表示内容

- ユーザー名
- ログ総数
- 最近作成したログ
- ログ新規作成画面へのリンク

### Controller例

```php
public function __invoke(Request $request): Response
{
    $user = $request->user();

    return Inertia::render('Dashboard', [
        'logCount' => $user->logs()->count(),
        'recentLogs' => $user->logs()
            ->latest()
            ->limit(5)
            ->get(['id', 'title', 'created_at']),
    ]);
}
```

### Inertia Props

```json
{
  "logCount": 24,
  "recentLogs": [
    {
      "id": 10,
      "title": "Docker環境構築",
      "created_at": "2026-07-25T10:00:00.000000Z"
    }
  ]
}
```

## 12. ルート定義

### routes/web.php

```php
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LogController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('Welcome');
})->name('home');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', DashboardController::class)
        ->name('dashboard');

    Route::resource('logs', LogController::class);
});
```

`Route::resource()`により、以下のルートを生成する。

```text
GET       /logs
GET       /logs/create
POST      /logs
GET       /logs/{log}
GET       /logs/{log}/edit
PUT       /logs/{log}
DELETE    /logs/{log}
```

## 13. Form Request設計

### StoreLogRequest

ファイルパス

```text
app/Http/Requests/StoreLogRequest.php
```

ルール

```php
public function rules(): array
{
    return [
        'title' => ['required', 'string', 'max:255'],
        'body' => ['required', 'string'],
    ];
}
```

### UpdateLogRequest

ファイルパス

```text
app/Http/Requests/UpdateLogRequest.php
```

ルール

```php
public function rules(): array
{
    return [
        'title' => ['required', 'string', 'max:255'],
        'body' => ['required', 'string'],
    ];
}
```

### エラーメッセージ

|項目|条件|メッセージ|
|---|---|---|
|title|required|タイトルを入力してください。|
|title|max|タイトルは255文字以内で入力してください。|
|body|required|本文を入力してください。|

## 14. 認可設計

### LogPolicy

ファイルパス

```text
app/Policies/LogPolicy.php
```

### 認可ルール

|操作|条件|
|---|---|
|viewAny|ログイン済みであること|
|view|ログのuser_idとログインユーザーのidが一致すること|
|create|ログイン済みであること|
|update|ログのuser_idとログインユーザーのidが一致すること|
|delete|ログのuser_idとログインユーザーのidが一致すること|

### 実装例

```php
public function view(User $user, Log $log): bool
{
    return $user->id === $log->user_id;
}

public function update(User $user, Log $log): bool
{
    return $user->id === $log->user_id;
}

public function delete(User $user, Log $log): bool
{
    return $user->id === $log->user_id;
}
```

## 15. フラッシュメッセージ

### メッセージ一覧

|処理|メッセージ|
|---|---|
|ログ作成|ログを作成しました。|
|ログ更新|ログを更新しました。|
|ログ削除|ログを削除しました。|
|ログイン|ログインしました。|
|ログアウト|ログアウトしました。|

### Inertia共有データ

```php
'flash' => [
    'success' => fn () => $request->session()->get('success'),
    'error' => fn () => $request->session()->get('error'),
],
```

## 16. HTTPステータスコード

|ステータス|用途|
|---|---|
|200 OK|画面表示成功|
|302 Found|登録・更新・削除後のリダイレクト|
|401 Unauthorized|未認証|
|403 Forbidden|権限なし|
|404 Not Found|対象データなし|
|419 Page Expired|CSRFトークン不正またはセッション切れ|
|422 Unprocessable Content|バリデーションエラー|
|500 Internal Server Error|サーバー内部エラー|

## 17. セキュリティ要件

- 認証が必要なルートには`auth`ミドルウェアを設定する
- 更新、削除、詳細表示時はPolicyによる認可を行う
- `user_id`をフォームから受け取らない
- CSRFトークンを検証する
- バリデーション前の値を保存しない
- EloquentまたはQuery Builderを使用する
- 他人のログをInertia Propsに含めない
- パスワードやセッショントークンをレスポンスに含めない
- エラー画面に機密情報を表示しない

## 18. テスト対象

### 認証

- 未認証ユーザーはログ一覧へアクセスできない
- 認証済みユーザーはログ一覧へアクセスできる

### ログ一覧

- 自分のログのみ表示される
- 他人のログは表示されない
- 新しい順に表示される

### ログ作成

- 正常な入力でログを作成できる
- タイトル未入力では作成できない
- 本文未入力では作成できない
- ログインユーザーのIDが自動設定される

### ログ詳細

- 自分のログを閲覧できる
- 他人のログを閲覧できない
- 存在しないログは404になる

### ログ更新

- 自分のログを更新できる
- 他人のログを更新できない
- 不正な入力では更新されない

### ログ削除

- 自分のログを削除できる
- 他人のログを削除できない
- 削除後はログ一覧へ戻る

## 19. 将来の拡張候補

MVP完成後、必要に応じてJSON APIを追加する。

候補

```text
GET    /api/logs
POST   /api/logs
GET    /api/logs/{log}
PUT    /api/logs/{log}
DELETE /api/logs/{log}
```

追加時に検討する項目

- Laravel Sanctum
- API Resource
- JSONレスポンス形式の統一
- APIバージョニング
- レート制限
- 外部クライアント対応
- モバイルアプリ対応