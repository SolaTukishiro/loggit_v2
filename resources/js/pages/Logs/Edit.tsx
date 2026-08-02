import { Form, router } from '@inertiajs/react';

type Log = {
    id: number;
    title: string;
    body: string | null;
};

type Props = {
    log: Log;
};

export default function Edit({ log }: Props) {
    return (
        <div>
            <h1>Edit Log</h1>

            <Form action={`/logs/${log.id}`} method="put">
                {({ errors }) => (
                    <>
                        <div>
                            <input
                                name="title"
                                defaultValue={log.title}
                                placeholder="Title"
                            />

                            {errors.title && (
                                <p>{errors.title}</p>
                            )}
                        </div>

                        <div>
                            <textarea
                                name="body"
                                defaultValue={log.body ?? ''}
                                placeholder="Body"
                            />

                            {errors.body && (
                                <p>{errors.body}</p>
                            )}
                        </div>

                        <button type="submit">
                            Update
                        </button>
                        <Form action={`/logs/${log.id}`} method="POST">
                            <button
                                type="button"
                                onClick={() => {
                                    if (window.confirm('このログを削除しますか？')) {
                                        router.delete(`/logs/${log.id}`);
                                    }
                                }}
                                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </Form>
                    </>
                )}
            </Form>
        </div>
    );
}