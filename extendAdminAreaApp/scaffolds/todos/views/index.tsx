import React from "react";
import { SplitView, LeftPanel, RightPanel } from "@webiny/app-admin/components/SplitView";
import TodosDataList from "./TodosDataList";
import TodosForm from "./TodosForm";

/**
 * Main view component - renders data list and form.
 */

const TodosView = () => {
    return (
        <SplitView>
            <LeftPanel>
                <TodosDataList />
            </LeftPanel>
            <RightPanel>
                <TodosForm />
            </RightPanel>
        </SplitView>
    );
};

export default TodosView;
