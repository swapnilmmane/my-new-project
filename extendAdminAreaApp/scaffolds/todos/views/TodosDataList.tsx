import React from "react";
import { DeleteIcon } from "@webiny/ui/List/DataList/icons";
import { ButtonIcon, ButtonSecondary } from "@webiny/ui/Button";
import { ReactComponent as AddIcon } from "@webiny/app-admin/assets/icons/add-18px.svg";
import {
    DataList,
    ScrollList,
    ListItem,
    ListItemText,
    ListItemMeta,
    ListActions
} from "@webiny/ui/List";
import { useTodosDataList } from "./hooks/useTodosDataList";

/**
 * Renders a list of all Todo entries. Includes basic deletion, pagination, and sorting capabilities.
 * The data querying functionality is located in the `useTodosDataList` React hook.
 */

// By default, we are able to sort entries by time of creation (ascending and descending).
// More sorters can be added, but not that further adjustments will be needed on the GraphQL API side.
const sorters = [
    {
        label: "Newest to oldest",
        value: "createdOn_DESC"
    },
    {
        label: "Oldest to newest",
        value: "createdOn_ASC"
    }
];

const TodosDataList = () => {
    const {
        todos,
        loading,
        refresh,
        pagination,
        setSort,
        newTodo,
        editTodo,
        deleteTodo,
        currentTodoId
    } = useTodosDataList();

    return (
        <DataList
            title={"Todos"}
            data={todos}
            loading={loading}
            refresh={refresh}
            pagination={pagination}
            sorters={sorters}
            setSorters={setSort}
            actions={
                <ButtonSecondary onClick={newTodo}>
                    <ButtonIcon icon={<AddIcon />} />
                    New Todo
                </ButtonSecondary>
            }
        >
            {({ data }) => (
                <ScrollList>
                    {data.map(item => (
                        <ListItem key={item.id} selected={item.id === currentTodoId}>
                            <ListItemText onClick={() => editTodo(item.id)}>
                                {item.title}
                            </ListItemText>

                            <ListItemMeta>
                                <ListActions>
                                    <DeleteIcon onClick={() => deleteTodo(item)} />
                                </ListActions>
                            </ListItemMeta>
                        </ListItem>
                    ))}
                </ScrollList>
            )}
        </DataList>
    );
};

export default TodosDataList;
