import { ReactNode } from "react";

export * from "./CancelableDialog";
export { default as CancelableDialog } from "./CancelableDialog";
export * from "./ConfirmDialog";
export { default as ConfirmDialog } from "./ConfirmDialog";
export * from "./WaitDialog";
export { default as WaitDialog } from "./WaitDialog";
export * from "./YesNoDialog";
export { default as YesNoDialog } from "./YesNoDialog";

export const defaultCallback = () => {};
export interface DialogProps {
    title: ReactNode;
    content: ReactNode;
    onYes?: Function;
    onNo?: Function;
    close: Function;
}
