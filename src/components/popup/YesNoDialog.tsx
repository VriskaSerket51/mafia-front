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

const useYesNoDialogStore = create<DialogProps>((set) => ({
    title: "",
    content: "",
    onYes: undefined,
    onNo: undefined,
    close: () => set({ onYes: undefined, onNo: undefined }),
}));
function YesNoDialog() {
    const { title, content, onYes, onNo, close } = useYesNoDialogStore();
    return (
        <Dialog
            open={Boolean(onYes) && Boolean(onNo)}
            maxWidth="sm"
            TransitionComponent={Transition}
            fullWidth
            onClose={() => {
                if (onNo) {
                    onNo();
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
                    네
                </Button>
                <Button
                    onClick={() => {
                        if (onNo) {
                            onNo();
                        }
                        close();
                    }}
                >
                    아니오
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default YesNoDialog;

export const openYesNoDialog = (
    title: ReactNode,
    content: ReactNode,
    onYes: Function = defaultCallback,
    onNo: Function = defaultCallback
) => {
    useYesNoDialogStore.setState({
        title: title,
        content: content,
        onYes: onYes,
        onNo: onNo,
    });
};
