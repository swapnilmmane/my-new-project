import React from "react";
import { ReactComponent as Icon } from "./assets/round-ballot-24px.svg";
import { MenuPlugin } from "@webiny/app-admin/plugins/MenuPlugin";

/**
 * Registers "Todos" main menu item.
 */
export default new MenuPlugin({
    render({ Menu, Item }) {
        return (
            <Menu name="menu-todos" label={"Todos"} icon={<Icon />}>
                <Item label={"Todos"} path={"/todos"} />
            </Menu>
        );
    }
});
