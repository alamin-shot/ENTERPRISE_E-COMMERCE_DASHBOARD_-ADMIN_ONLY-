export { ModalRoot as Root } from "./Modal.Root";
export { ModalTrigger as Trigger } from "./Modal.Trigger";
export { ModalContent as Content } from "./Modal.Content";
export { ModalHeader as Header, ModalFooter as Footer } from "./Modal.Header";
export type {
    ModalRootProps,
    ModalTriggerProps,
    ModalContentProps,
    ModalHeaderProps,
    ModalFooterProps,
    ModalSize,
} from "./Modal.types";

// Namespace export — usage: <Modal.Root> <Modal.Trigger> etc.
import { ModalRoot } from "./Modal.Root";
import { ModalTrigger } from "./Modal.Trigger";
import { ModalContent } from "./Modal.Content";
import { ModalHeader, ModalFooter } from "./Modal.Header";

export const Modal = {
    Root: ModalRoot,
    Trigger: ModalTrigger,
    Content: ModalContent,
    Header: ModalHeader,
    Footer: ModalFooter,
};