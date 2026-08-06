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
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Logs
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Your personal activity records
                    </p>
                </div>

                <Link
                    href="/logs/create"
                    className="inline-flex w-fit items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                    Create Log
                </Link>
            </div>

            {logs.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {logs.map((log) => (
                        <Link
                            key={log.id}
                            href={`/logs/${log.id}`}
                            className="group flex min-h-52 flex-col rounded-2xl border bg-card p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                        >
                            <div className="flex-1">
                                <h2 className="line-clamp-2 text-lg font-semibold leading-6 text-card-foreground transition group-hover:text-primary">
                                    {log.title}
                                </h2>

                                <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted-foreground">
                                    {log.body || 'No description'}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed bg-card p-12 text-center">
                    <p className="text-muted-foreground">
                        No logs yet.
                    </p>

                    <Link
                        href="/logs/create"
                        className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
                    >
                        Create your first log
                    </Link>
                </div>
            )}
        </div>
    );
}
