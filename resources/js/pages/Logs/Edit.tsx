import { Form, Link, router } from '@inertiajs/react';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

type Log = {
    id: number;
    title: string;
    body: string | null;
};

type Props = {
    log: Log;
};

export default function Edit({ log }: Props) {
    const handleDelete = () => {
        if (!window.confirm('このログを削除しますか？')) {
            return;
        }

        router.delete(`/logs/${log.id}`);
    };

    return (
        <div className="mx-auto w-full max-w-2xl p-6">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Edit Log
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        ログのタイトルや本文を編集できます。
                    </p>
                </div>

                <Link
                    href="/logs"
                    className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition hover:bg-muted"
                >
                    <ArrowLeft className="size-4" />
                    一覧へ戻る
                </Link>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <Form action={`/logs/${log.id}`} method="put">
                    {({ errors, processing }) => (
                        <div className="space-y-6">
                            <div>
                                <label
                                    htmlFor="title"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    タイトル
                                </label>

                                <input
                                    id="title"
                                    name="title"
                                    defaultValue={log.title}
                                    placeholder="タイトルを入力"
                                    className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />

                                {errors.title && (
                                    <p className="mt-2 text-sm text-destructive">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="body"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    本文
                                </label>

                                <textarea
                                    id="body"
                                    name="body"
                                    defaultValue={log.body ?? ''}
                                    placeholder="ログの内容を入力"
                                    rows={10}
                                    className="w-full resize-y rounded-xl border bg-background px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />

                                {errors.body && (
                                    <p className="mt-2 text-sm text-destructive">
                                        {errors.body}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="inline-flex items-center gap-2 rounded-xl border border-red-600 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/20"
                                >
                                    <Trash2 className="size-4" />
                                    削除
                                </button>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Save className="size-4" />
                                    {processing ? '更新中...' : '更新'}
                                </button>
                            </div>
                        </div>
                    )}
                </Form>
            </div>
        </div>
    );
}