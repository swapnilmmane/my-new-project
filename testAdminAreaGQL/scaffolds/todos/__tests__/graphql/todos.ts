/**
 * Contains all of the GraphQL queries and mutations that we might need while writing our tests.
 * If needed, feel free to add more.
 */

export const GET_TODO = /* GraphQL */ `
    query GetTodo($id: ID!) {
        todos {
            getTodo(id: $id) {
                id
                title
                description
            }
        }
    }
`;

export const CREATE_TODO = /* GraphQL */ `
    mutation CreateTodo($data: TodoCreateInput!) {
        todos {
            createTodo(data: $data) {
                id
                title
                description
            }
        }
    }
`;

export const UPDATE_TODO = /* GraphQL*/ `
    mutation UpdateTodo($id: ID!, $data: TodoUpdateInput!) {
        todos {
            updateTodo(id: $id, data: $data) {
                id
                title
                description
            }
        }
    }
`;

export const DELETE_TODO = /* GraphQL */ `
    mutation DeleteTodo($id: ID!) {
        todos {
            deleteTodo(id: $id) {
                id
                title
                description
            }
        }
    }
`;

export const LIST_TODOS = /* GraphQL */ `
    query ListTodos($sort: TodosListSort, $limit: Int, $after: String) {
        todos {
            listTodos(sort: $sort, limit: $limit, after: $after) {
                data {
                    id
                    title
                    description
                }
                meta {
                    limit
                    after
                    before
                }
            }
        }
    }
`;
