import { GET_TODO, CREATE_TODO, DELETE_TODO, LIST_TODOS, UPDATE_TODO } from "./graphql/todos";
import { request } from "graphql-request";

/**
 * An example of an end-to-end (E2E) test. You can use these to test if the overall cloud infrastructure
 * setup is working. That's why, here we're not executing the handler code directly, but issuing real
 * HTTP requests over to the deployed Amazon Cloudfront distribution. These tests provide the highest
 * level of confidence that our application is working, but they take more time in order to complete.
 * https://www.webiny.com/docs/how-to-guides/scaffolding/extend-graphql-api#crude2etestts
 */

const query = async ({ query = "", variables = {} } = {}) => {
    return request(process.env.API_URL + "/graphql", query, variables);
};

let testTodos = [];

describe("Todos CRUD tests (end-to-end)", () => {
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
                }).then(response => response.todos.createTodo)
            );
        }
    });

    afterEach(async () => {
        for (let i = 0; i < 3; i++) {
            try {
                await query({
                    query: DELETE_TODO,
                    variables: {
                        id: testTodos[i].id
                    }
                });
            } catch {
                // Some of the entries might've been deleted during runtime.
                // We can ignore thrown errors.
            }
        }
        testTodos = [];
    });

    it("should be able to perform basic CRUD operations", async () => {
        // 1. Now that we have todos created, let's see if they come up in a basic listTodos query.
        const [todo0, todo1, todo2] = testTodos;

        await query({
            query: LIST_TODOS,
            variables: { limit: 3 }
        }).then(response =>
            expect(response.todos.listTodos).toMatchObject({
                data: [todo2, todo1, todo0],
                meta: {
                    limit: 3
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
            query: LIST_TODOS,
            variables: {
                limit: 2
            }
        }).then(response =>
            expect(response.todos.listTodos).toMatchObject({
                data: [todo2, todo0],
                meta: {
                    limit: 2
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
            expect(response.todos.updateTodo).toEqual({
                id: todo0.id,
                title: "Todo 0 - UPDATED",
                description: `Todo 0's description - UPDATED.`
            })
        );

        // 4. Get todo 0 after the update.
        await query({
            query: GET_TODO,
            variables: {
                id: todo0.id
            }
        }).then(response =>
            expect(response.todos.getTodo).toEqual({
                id: todo0.id,
                title: "Todo 0 - UPDATED",
                description: `Todo 0's description - UPDATED.`
            })
        );
    });
});
