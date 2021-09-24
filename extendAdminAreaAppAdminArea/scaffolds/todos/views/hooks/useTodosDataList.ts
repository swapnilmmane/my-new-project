import { useCallback, useReducer } from "react";
import { useRouter } from "@webiny/react-router";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useSnackbar } from "@webiny/app-admin/hooks/useSnackbar";
import { useConfirmationDialog } from "@webiny/app-admin/hooks/useConfirmationDialog";
import { PaginationProp } from "@webiny/ui/List/DataList/types";
import { LIST_TODOS, DELETE_TODO } from "./graphql";

/**
 * Contains essential data listing functionality - data querying and UI control.
 */

interface useTodosDataListHook {
    (): {
        todos: Array<{
            id: string;
            title: string;
            description: string;
            createdOn: string;
            [key: string]: any;
        }>;
        loading: boolean;
        pagination: PaginationProp;
        refresh: () => void;
        setSort: (sort: string) => void;
        newTodo: () => void;
        editTodo: (id: string) => void;
        deleteTodo: (id: string) => void;
        currentTodoId: string;
    };
}

const reducer = (prev, next) => ({ ...prev, ...next });

export const useTodosDataList: useTodosDataListHook = () => {
    // Base state and UI React hooks.
    const { history } = useRouter();
    const { showSnackbar } = useSnackbar();
    const { showConfirmation } = useConfirmationDialog();
    const [variables, setVariables] = useReducer(reducer, {
        limit: undefined,
        after: undefined,
        before: undefined,
        sort: undefined
    });

    const searchParams = new URLSearchParams(location.search);
    const currentTodoId = searchParams.get("id");

    // Queries and mutations.
    const listQuery = useQuery(LIST_TODOS, {
        variables,
        onError: e => showSnackbar(e.message)
    });

    const [deleteIt, deleteMutation] = useMutation(DELETE_TODO, {
        refetchQueries: [{ query: LIST_TODOS }]
    });

    const { data: todos = [], meta = {} } = listQuery.loading
        ? {}
        : listQuery?.data?.todos?.listTodos || {};
    const loading = [listQuery, deleteMutation].some(item => item.loading);

    // Base CRUD actions - new, edit, and delete.
    const newTodo = useCallback(() => history.push("/todos?new"), []);
    const editTodo = useCallback(id => {
        history.push(`/todos?id=${id}`);
    }, []);

    const deleteTodo = useCallback(
        item => {
            showConfirmation(async () => {
                try {
                    await deleteIt({
                        variables: item
                    });

                    showSnackbar(`Todo "${item.title}" deleted.`);
                    if (currentTodoId === item.id) {
                        history.push(`/todos`);
                    }
                } catch (e) {
                    showSnackbar(e.message);
                }
            });
        },
        [currentTodoId]
    );

    // Sorting.
    const setSort = useCallback(
        value => setVariables({ after: undefined, before: undefined, sort: value }),
        []
    );

    // Pagination metadata and controls.
    const setPreviousPage = useCallback(
        () => setVariables({ after: undefined, before: meta.before }),
        undefined
    );
    const setNextPage = useCallback(
        () => setVariables({ after: meta.after, before: undefined }),
        undefined
    );
    const setLimit = useCallback(
        value => setVariables({ after: undefined, before: undefined, limit: value }),
        []
    );

    const pagination: PaginationProp = {
        setPerPage: setLimit,
        perPageOptions: [10, 25, 50],
        setPreviousPage,
        setNextPage,
        hasPreviousPage: meta.before,
        hasNextPage: meta.after
    };

    return {
        todos,
        loading,
        refresh: listQuery.refetch,
        pagination,
        setSort,
        newTodo,
        editTodo,
        deleteTodo,
        currentTodoId
    };
};
