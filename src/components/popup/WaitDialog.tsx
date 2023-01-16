import create from "zustand";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slide
} from "@mui/material";
import React, { ReactNode } from "react"
import { TransitionProps } from "@mui/material/transitions";
import { DialogProps } from ".";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useWaitDialogStore = create<DialogProps & { isOpened: boolean }>((set) => ({
    title: "",
    content: "",
    isOpened: false,
    close: () => set({ isOpened: false }),
}));

function WaitDialog() {
    const { title, content, isOpened } = useWaitDialogStore();
    return (
        <Dialog
            open={isOpened}
            maxWidth="sm"
            TransitionComponent={Transition}
            fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {content}
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>
    );
}

export default WaitDialog;

export const openWaitDialog = (title: ReactNode, content: ReactNode) => {
    useWaitDialogStore.setState({
        title: title,
        content: content,
        isOpened: true
    });
};

export const closeWaitDialog = () => {
    useWaitDialogStore.setState({
        title: "",
        content: "",
        isOpened: false
    });
};