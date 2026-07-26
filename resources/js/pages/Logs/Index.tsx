type Log = {
    id: number;
    title: string;
    body: string | null;
};

type Props = {
    logs: Log[];
};

export default function Index({ logs }: Props) {
    return (
        <div>
            <a href="/logs/create">Create Lgg</a>
            <h1>Logs</h1>

            {logs.map((log) => (
                <div key={log.id}>
                    <h2>{log.title}</h2>
                    <p>{log.body}</p>
                </div>
            ))}
        </div>
    );
}