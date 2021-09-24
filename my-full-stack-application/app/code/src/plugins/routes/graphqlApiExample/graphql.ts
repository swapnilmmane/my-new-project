import gql from "graphql-tag";

// The same set of fields is being used on all query and mutation operations below.
export const TODO_FIELDS_FRAGMENT = /* GraphQL */ `
    fragment TodoFields on Todo {
        id
        title
        description
        createdOn
        savedOn
    }
`;

export const LIST_TODOS = gql`
    ${TODO_FIELDS_FRAGMENT}
    query ListTodos(
        $sort: TodosListSort
        $limit: Int
        $after: String
        $before: String
    ) {
        todos {
            listTodos(sort: $sort, limit: $limit, after: $after, before: $before) {
                data {
                    ...TodoFields
                }
                meta {
                    before
                    after
                    limit
                }
            }
        }
    }
`;

export const CREATE_TODO = gql`
    ${TODO_FIELDS_FRAGMENT}
    mutation CreateTodo($data: TodoCreateInput!) {
        todos {
            createTodo(data: $data) {
                ...TodoFields
            }
        }
    }
`;

export const DELETE_TODO = gql`
    ${TODO_FIELDS_FRAGMENT}
    mutation DeleteTodo($id: ID!) {
        todos {
            deleteTodo(id: $id) {
                ...TodoFields
            }
        }
    }
`;
