import React from "react";
import { RoutePlugin } from "@webiny/app/plugins/RoutePlugin";
import { Route, Link } from "@webiny/react-router";
import Layout from "../../components/Layout";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
    LIST_TODOS,
    DELETE_TODO,
    CREATE_TODO
} from "./graphqlApiExample/graphql";
import Input from "./graphqlApiExample/Input";
import { Form } from "@webiny/form";
import { validation } from "@webiny/validation";

// A page that shows a simple GraphQL API example.
function GraphQLApiExample() {
    const [createTodo] = useMutation(CREATE_TODO, {
        refetchQueries: [{ query: LIST_TODOS }]
    });

    const [deleteTodo] = useMutation(DELETE_TODO, {
        refetchQueries: [{ query: LIST_TODOS }]
    });

    const listQuery = useQuery(LIST_TODOS);
    const list = listQuery.data?.todos.listTodos.data;

    return (
        <Layout className={"graphql-api-example"}>
            <h1>Todos</h1>
            <h2>A Simple GraphQL API Example</h2>
            <div>Use the following form to create as many Todos as you want.</div>

            {/* A simple form that lets us create new Todos. */}
            <Form
                data={{ title: "", description: "" }}
                onSubmit={async (data, form) => {
                    await createTodo({ variables: { data } });
                    form.reset();
                }}
            >
                {({ Bind, submit }) => (
                    <div className={"form"}>
                        <Bind name={"title"} validators={validation.create("required")}>
                            <Input placeholder={"Title"} />
                        </Bind>

                        <Bind name={"description"} validators={validation.create("required")}>
                            <Input placeholder={"Description"} />
                        </Bind>
                        <button onClick={submit}>Create</button>
                    </div>
                )}
            </Form>

            {/* A simple list that shows all created Todos. */}
            <ul>
                {list && list.length > 0 ? (
                    list.map((item, index) => (
                        <li key={item.id}>
                            <span>
                                {index + 1}. <strong>{item.title}</strong> ({item.description})
                            </span>
                            <span
                                className={"delete"}
                                onClick={() =>
                                    deleteTodo({ variables: { id: item.id } })
                                }
                            >
                                Delete
                            </span>
                        </li>
                    ))
                ) : (
                    <li className={"empty"}>No Todos created yet.</li>
                )}
            </ul>

            <Link to={"/"}> &larr; Back</Link>
        </Layout>
    );
}

// We register routes via the `RoutePlugin` plugin.
export default new RoutePlugin({
    route: <Route path="/simple-graphql-api-example" exact component={GraphQLApiExample} />
});
