import { Link } from '@inertiajs/react';

type Log = {
    id: number;
    title: string;
    body: string | null;
    created_at?: string;
};

type Props = {
    logs: Log[];
};

export default function Index({ logs }: Props) {
    return (
        <div className="max-w-5xl p-6">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Logs
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Your personal activity records
                    </p>
                </div>

                <Link
                    href="/logs/create"
                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                    Create Log
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {logs.map((log) => (
                    <Link
                        key={log.id}
                        href={`/logs/${log.id}/edit`}
                        className="group rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                        <div className="flex items-start justify-between">
                            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                                {log.title}
                            </h2>
                        </div>

                        <p className="mt-3 line-clamp-3 text-sm text-gray-600">
                            {log.body || 'No description'}
                        </p>

                        {log.created_at && (
                            <p className="mt-4 text-xs text-gray-400">
                                {log.created_at}
                            </p>
                        )}
                    </Link>
                ))}
            </div>

            {logs.length === 0 && (
                <div className="rounded-xl border border-dashed p-10 text-center">
                    <p className="text-gray-500">
                        No logs yet.
                    </p>

                    <Link
                        href="/logs/create"
                        className="mt-4 inline-block text-sm text-blue-600 hover:underline"
                    >
                        Create your first log
                    </Link>
                </div>
            )}
        </div>
    );
}