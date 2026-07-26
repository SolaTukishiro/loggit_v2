import { Form } from '@inertiajs/react';

export default function Create() {
    return (
        <div>
            <h1>Create Log</h1>

            <Form action="/logs" method="post">
                {({ errors }) => (
                    <>
                        <input
                            name="title"
                            placeholder="Title"
                        />

                        {errors.title && (
                            <p>{errors.title}</p>
                        )}

                        <textarea
                            name="body"
                            placeholder="Body"
                        />

                        {errors.body && (
                            <p>{errors.body}</p>
                        )}

                        <button type="submit">
                            Save
                        </button>
                    </>
                )}
            </Form>
        </div>
    );
}