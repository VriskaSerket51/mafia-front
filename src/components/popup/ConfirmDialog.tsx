import create from "zustand";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Slide,
} from "@mui/material";
import React, { ReactNode } from "react";
import { TransitionProps } from "@mui/material/transitions";
import { defaultCallback, DialogProps } from ".";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useConfirmDialogStore = create<DialogProps>((set) => ({
    title: "",
    content: "",
    onYes: undefined,
    close: () => set({ onYes: undefined }),
}));

function ConfirmDialog() {
    const { title, content, onYes, close } = useConfirmDialogStore();
    return (
        <Dialog
            open={Boolean(onYes)}
            maxWidth="sm"
            TransitionComponent={Transition}
            fullWidth
            onClose={() => {
                if (onYes) {
                    onYes();
                }
                close();
            }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{content}</DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        if (onYes) {
                            onYes();
                        }
                        close();
                    }}
                >
                    확인
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDialog;

export const openConfirmDialog = (
    title: ReactNode,
    content: ReactNode,
    onYes: Function = defaultCallback
) => {
    useConfirmDialogStore.setState({
        title: title,
        content: content,
        onYes: onYes,
    });
};
