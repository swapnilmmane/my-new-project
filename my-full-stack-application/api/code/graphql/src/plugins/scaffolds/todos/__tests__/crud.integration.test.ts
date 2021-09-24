import { handler } from "~/index";
import { GET_TODO, CREATE_TODO, DELETE_TODO, LIST_TODOS, UPDATE_TODO } from "./graphql/todos";

/**
 * An example of an integration test. You can use these to test your GraphQL resolvers, for example,
 * ensure they are correctly interacting with the database and other cloud infrastructure resources
 * and services. These tests provide a good level of confidence that our application is working, and
 * can be reasonably fast to complete.
 * https://www.webiny.com/docs/how-to-guides/scaffolding/extend-graphql-api#crudintegrationtestts
 */

const query = ({ query = "", variables = {} } = {}) => {
    return handler({
        httpMethod: "POST",
        headers: {},
        body: JSON.stringify({
            query,
            variables
        })
    }).then(response => JSON.parse(response.body));
};

let testTodos = [];

describe("Todos CRUD tests (integration)", () => {
    beforeEach(async () => {
        for (let i = 0; i < 3; i++) {
            testTodos.push(
                await query({
                    query: CREATE_TODO,
                    variables: {
                        data: {
                            title: `Todo ${i}`,
                            description: `Todo ${i}'s description.`
                        }
                    }
                }).then(response => response.data.todos.createTodo)
            );
        }
    });

    afterEach(async () => {
        for (let i = 0; i < 3; i++) {
            await query({
                query: DELETE_TODO,
                variables: {
                    id: testTodos[i].id
                }
            });
        }
        testTodos = [];
    });

    it("should be able to perform basic CRUD operations", async () => {
        // 1. Now that we have todos created, let's see if they come up in a basic listTodos query.
        const [todo0, todo1, todo2] = testTodos;

        await query({ query: LIST_TODOS }).then(response =>
            expect(response.data.todos.listTodos).toEqual({
                data: [todo2, todo1, todo0],
                meta: {
                    after: null,
                    before: null,
                    limit: 10
                }
            })
        );

        // 2. Delete todo 1.
        await query({
            query: DELETE_TODO,
            variables: {
                id: todo1.id
            }
        });

        await query({
            query: LIST_TODOS
        }).then(response =>
            expect(response.data.todos.listTodos).toEqual({
                data: [todo2, todo0],
                meta: {
                    after: null,
                    before: null,
                    limit: 10
                }
            })
        );

        // 3. Update todo 0.
        await query({
            query: UPDATE_TODO,
            variables: {
                id: todo0.id,
                data: {
                    title: "Todo 0 - UPDATED",
                    description: `Todo 0's description - UPDATED.`
                }
            }
        }).then(response =>
            expect(response.data.todos.updateTodo).toEqual({
                id: todo0.id,
                title: "Todo 0 - UPDATED",
                description: `Todo 0's description - UPDATED.`
            })
        );

        // 5. Get todo 0 after the update.
        await query({
            query: GET_TODO,
            variables: { id: todo0.id }
        }).then(response =>
            expect(response.data.todos.getTodo).toEqual({
                id: todo0.id,
                title: "Todo 0 - UPDATED",
                description: `Todo 0's description - UPDATED.`
            })
        );
    });

    test("should be able to use cursor-based pagination (desc)", async () => {
        const [todo0, todo1, todo2] = testTodos;

        await query({
            query: LIST_TODOS,
            variables: {
                limit: 2
            }
        }).then(response =>
            expect(response.data.todos.listTodos).toEqual({
                data: [todo2, todo1],
                meta: {
                    after: todo1.id,
                    before: null,
                    limit: 2
                }
            })
        );

        await query({
            query: LIST_TODOS,
            variables: {
                limit: 2,
                after: todo1.id
            }
        }).then(response =>
            expect(response.data.todos.listTodos).toEqual({
                data: [todo0],
                meta: {
                    before: todo0.id,
                    after: null,
                    limit: 2
                }
            })
        );

        await query({
            query: LIST_TODOS,
            variables: {
                limit: 2,
                before: todo0.id
            }
        }).then(response =>
            expect(response.data.todos.listTodos).toEqual({
                data: [todo2, todo1],
                meta: {
                    after: todo1.id,
                    before: null,
                    limit: 2
                }
            })
        );
    });

    test("should be able to use cursor-based pagination (ascending)", async () => {
        const [todo0, todo1, todo2] = testTodos;

        await query({
            query: LIST_TODOS,
            variables: {
                limit: 2,
                sort: "createdOn_ASC"
            }
        }).then(response =>
            expect(response.data.todos.listTodos).toEqual({
                data: [todo0, todo1],
                meta: {
                    after: todo1.id,
                    before: null,
                    limit: 2
                }
            })
        );

        await query({
            query: LIST_TODOS,
            variables: {
                limit: 2,
                sort: "createdOn_ASC",
                after: todo1.id
            }
        }).then(response =>
            expect(response.data.todos.listTodos).toEqual({
                data: [todo2],
                meta: {
                    before: todo2.id,
                    after: null,
                    limit: 2
                }
            })
        );

        await query({
            query: LIST_TODOS,
            variables: {
                limit: 2,
                sort: "createdOn_ASC",
                before: todo2.id
            }
        }).then(response =>
            expect(response.data.todos.listTodos).toEqual({
                data: [todo0, todo1],
                meta: {
                    after: todo1.id,
                    before: null,
                    limit: 2
                }
            })
        );
    });
});
