export interface TabsRootProps {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}

export interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}

export interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    disabled?: boolean;
    icon?: React.ReactNode;
    className?: string;
}

export interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}