export default /* GraphQL */ `
    type Todo {
        id: ID!
        title: String!
        description: String
        createdOn: DateTime!
        savedOn: DateTime!
        createdBy: TodoCreatedBy
    }

    type TodoCreatedBy {
        id: String!
        type: String!
        displayName: String!
    }

    input TodoCreateInput {
        title: String!
        description: String
    }

    input TodoUpdateInput {
        title: String
        description: String
    }

    type TodosListMeta {
        limit: Number
        before: String
        after: String
    }

    enum TodosListSort {
        createdOn_ASC
        createdOn_DESC
    }

    type TodosList {
        data: [Todo]
        meta: TodosListMeta
    }

    type TodoQuery {
        getTodo(id: ID!): Todo
        listTodos(limit: Int, before: String, after: String, sort: TodosListSort): TodosList!
    }

    type TodoMutation {
        # Creates and returns a new Todo entry.
        createTodo(data: TodoCreateInput!): Todo!

        # Updates and returns an existing Todo entry.
        updateTodo(id: ID!, data: TodoUpdateInput!): Todo!

        # Deletes and returns an existing Todo entry.
        deleteTodo(id: ID!): Todo!
    }

    extend type Query {
        todos: TodoQuery
    }

    extend type Mutation {
        todos: TodoMutation
    }
`;
