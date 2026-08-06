import { Link } from '@inertiajs/react';
import { ArrowLeft, SquarePen } from 'lucide-react';

type Task = {
    id: number;
    title: string;
    body: string | null;
    is_completed: boolean;
};

type Log = {
    id: number;
    title: string;
    body: string | null;
    tasks: Task[];
};

type Props = {
    log: Log;
    tasks: Task[];
};

export default function Show({ log }: Props) {
    return (
        <div className="mx-auto w-full max-w-2xl p-6">
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Log</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        ログの詳細です。
                    </p>
                </div>

                <Link
                    href="/logs"
                    className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-muted"
                >
                    <ArrowLeft className="size-4" />
                    一覧へ戻る
                </Link>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="space-y-6">
                    <div>
                        <p className="mb-2 text-sm font-medium">タイトル</p>
                        <div className="rounded-xl border bg-background px-4 py-3">
                            {log.title}
                        </div>
                    </div>

                    <div>
                        <p className="mb-2 text-sm font-medium">本文</p>
                        <div className="min-h-32 rounded-xl border bg-background px-4 py-3 whitespace-pre-wrap">
                            {log.body ?? '本文はありません。'}
                        </div>
                    </div>
                    {/* ↓ここにTask一覧を追加していく */}
                    <div className="mt-8">
                        <h2 className="mb-4 text-xl font-semibold">Tasks</h2>

                        <div className="space-y-3">
                            {log.tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="rounded-xl border p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={task.is_completed}
                                            readOnly
                                        />

                                        <div>
                                            <p className="font-medium">
                                                {task.title}
                                            </p>

                                            {task.body && (
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {task.body}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Link
                            href={`/logs/${log.id}/edit`}
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-primary-foreground"
                        >
                            <SquarePen className="size-4" />
                            編集
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
