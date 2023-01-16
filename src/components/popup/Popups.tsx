import React from "react";
import { Outlet } from "react-router-dom";
import { CancelableDialog, ConfirmDialog, WaitDialog, YesNoDialog } from ".";

export default function Popups() {
    return (
        <React.Fragment>
            <CancelableDialog />
            <ConfirmDialog />
            <WaitDialog />
            <YesNoDialog />
            <Outlet />
        </React.Fragment>
    );
}
