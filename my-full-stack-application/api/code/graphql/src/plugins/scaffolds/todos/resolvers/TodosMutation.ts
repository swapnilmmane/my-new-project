import { TodoEntity } from "../types";
import mdbid from "mdbid";
import { Todo } from "../entities";
import TodosResolver from "./TodosResolver";

/**
 * Contains base `createTodo`, `updateTodo`, and `deleteTodo` GraphQL resolver functions.
 * Feel free to adjust the code to your needs. Also, note that at some point in time, you will
 * most probably want to implement custom data validation and security-related checks.
 * https://www.webiny.com/docs/how-to-guides/scaffolding/extend-graphql-api#essential-files
 */

interface CreateTodoParams {
    data: {
        title: string;
        description?: string;
    };
}

interface UpdateTodoParams {
    id: string;
    data: {
        title: string;
        description?: string;
    };
}

interface DeleteTodoParams {
    id: string;
}

interface TodosMutation {
    createTodo(params: CreateTodoParams): Promise<TodoEntity>;
    updateTodo(params: UpdateTodoParams): Promise<TodoEntity>;
    deleteTodo(params: DeleteTodoParams): Promise<TodoEntity>;
}

/**
 * To define our GraphQL resolvers, we are using the "class method resolvers" approach.
 * https://www.graphql-tools.com/docs/resolvers#class-method-resolvers
 */
export default class TodosMutationResolver extends TodosResolver implements TodosMutation {
    /**
     * Creates and returns a new Todo entry.
     * @param data
     */
    async createTodo({ data }: CreateTodoParams) {
        // If our GraphQL API uses Webiny Security Framework, we can retrieve the
        // currently logged in identity and assign it to the `createdBy` property.
        // https://www.webiny.com/docs/key-topics/security-framework/introduction
        // const { security } = this.context;

        // We use `mdbid` (https://www.npmjs.com/package/mdbid) library to generate
        // a random, unique, and sequential (sortable) ID for our new entry.
        const id = mdbid();

        // const identity = await security.getIdentity();
        const todo = {
            ...data,
            PK: this.getPK(),
            SK: id,
            id,
            createdOn: new Date().toISOString(),
            savedOn: new Date().toISOString(),
            /* createdBy: identity && {
                id: identity.id,
                type: identity.type,
                displayName: identity.displayName
            }, */
            webinyVersion: process.env.WEBINY_VERSION
        };

        // Will throw an error if something goes wrong.
        await Todo.put(todo);

        return todo;
    }

    /**
     * Updates and returns an existing Todo entry.
     * @param id
     * @param data
     */
    async updateTodo({ id, data }: UpdateTodoParams) {
        // If entry is not found, we throw an error.
        const { Item: todo } = await Todo.get({ PK: this.getPK(), SK: id });
        if (!todo) {
            throw new Error(`Todo "${id}" not found.`);
        }

        const updatedTodo = { ...todo, ...data };

        // Will throw an error if something goes wrong.
        await Todo.update(updatedTodo);

        return updatedTodo;
    }

    /**
     * Deletes and returns an existing Todo entry.
     * @param id
     */
    async deleteTodo({ id }: DeleteTodoParams) {
        // If entry is not found, we throw an error.
        const { Item: todo } = await Todo.get({ PK: this.getPK(), SK: id });
        if (!todo) {
            throw new Error(`Todo "${id}" not found.`);
        }

        // Will throw an error if something goes wrong.
        await Todo.delete(todo);

        return todo;
    }
}
