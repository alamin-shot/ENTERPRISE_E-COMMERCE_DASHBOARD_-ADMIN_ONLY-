// ─── Compound Components ──────────────────────────────────────────────────────
export { Modal } from "./Modal";
export { Tabs } from "./Tabs";
// ─── Named Sub-exports ────────────────────────────────────────────────────────
export { Root as ModalRoot, Trigger as ModalTrigger, Content as ModalContent, Header as ModalHeader, Footer as ModalFooter } from "./Modal";
export { Root as TabsRoot, List as TabsList, Trigger as TabsTrigger, Content as TabsContent } from "./Tabs";

// ─── Atomic Components ────────────────────────────────────────────────────────
export { Button } from "./Button";
export { Input } from "./Input";
export { Table, TablePagination } from "./Table";
export {
    Badge,
    getOrderStatusVariant,
    getProductStatusVariant,
    getUserStatusVariant,
} from "./Badge";
export { Card, CardHeader, CardBody, CardFooter } from "./Card";
export { Spinner, FullPageSpinner } from "./Spinner";
export { Avatar } from "./Avatar";
export { Select } from "./Select";
export { Textarea } from "./Textarea";
export { Checkbox } from "./Checkbox";

// ─── Types ────────────────────────────────────────────────────────────────────
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button";
export type { InputProps } from "./Input";
export type {
    TableProps, TableColumn, TableSortState,
    TablePaginationProps
} from "./Table";
export type { BadgeProps, BadgeVariant, BadgeSize } from "./Badge";
export type { AvatarProps, AvatarSize, AvatarStatus } from "./Avatar";
export type { SelectProps, SelectOption } from "./Select";
export type { TextareaProps } from "./Textarea";
export type { CheckboxProps } from "./Checkbox";
export type {
    ModalSize, ModalRootProps,
    ModalContentProps
} from "./Modal";
export type { TabsRootProps, TabsTriggerProps } from "./Tabs";