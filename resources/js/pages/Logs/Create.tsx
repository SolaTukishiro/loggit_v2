import { Form } from '@inertiajs/react';

export default function Create() {
    return (
        <div className="mx-auto max-w-2xl p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    Create Log
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    Record your activity and thoughts.
                </p>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <Form action="/logs" method="post">
                    {({ errors }) => (
                        <div className="space-y-5">
                            <div>
                                <label
                                    htmlFor="title"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Title
                                </label>

                                <input
                                    id="title"
                                    name="title"
                                    placeholder="Enter a title"
                                    className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />

                                {errors.title && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="body"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Body
                                </label>

                                <textarea
                                    id="body"
                                    name="body"
                                    placeholder="Write your log..."
                                    rows={6}
                                    className="w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />

                                {errors.body && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.body}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-lg bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                            >
                                Save Log
                            </button>
                        </div>
                    )}
                </Form>
            </div>
        </div>
    );
}