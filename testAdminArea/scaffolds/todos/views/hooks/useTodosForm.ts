import { useCallback } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { useRouter } from "@webiny/react-router";
import { useSnackbar } from "@webiny/app-admin/hooks/useSnackbar";
import { GET_TODO, CREATE_TODO, UPDATE_TODO, LIST_TODOS } from "./graphql";

/**
 * Contains essential form functionality: data fetching, form submission, notifications, redirecting, and more.
 */

/**
 * Omits irrelevant values from the submitted form data (`id`, `createdOn`, `savedOn`, `createdBy`).
 * @param formData
 */
const getMutationData = formData => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdOn, savedOn, createdBy, ...data } = formData;
    return data;
};

export const useTodosForm = () => {
    const { location, history } = useRouter();
    const { showSnackbar } = useSnackbar();
    const searchParams = new URLSearchParams(location.search);
    const currentTodoId = searchParams.get("id");

    const getQuery = useQuery(GET_TODO, {
        variables: { id: currentTodoId },
        skip: !currentTodoId,
        onError: error => {
            history.push("/todos");
            showSnackbar(error.message);
        }
    });

    const [create, createMutation] = useMutation(CREATE_TODO, {
        refetchQueries: [{ query: LIST_TODOS }]
    });

    const [update, updateMutation] = useMutation(UPDATE_TODO);

    const loading = [getQuery, createMutation, updateMutation].some(item => item.loading);

    const onSubmit = useCallback(
        async formData => {
            const { id } = formData;
            const data = getMutationData(formData);
            const [operation, options] = id
                ? [update, { variables: { id, data } }]
                : [create, { variables: { data } }];

            try {
                const result = await operation(options);
                if (!id) {
                    const { id } = result.data.todos.createTodo;
                    history.push(`/todos?id=${id}`);
                }

                showSnackbar("Todo saved successfully.");
            } catch (e) {
                showSnackbar(e.message);
            }
        },
        [currentTodoId]
    );

    const todo = getQuery?.data?.todos?.getTodo;
    const emptyViewIsShown = !searchParams.has("new") && !loading && !todo;
    const currentTodo = useCallback(() => history.push("/todos?new"), []);
    const cancelEditing = useCallback(() => history.push("/todos"), []);

    return {
        loading,
        emptyViewIsShown,
        currentTodo,
        cancelEditing,
        todo,
        onSubmit
    };
};
