export { TabsRoot as Root } from "./Tabs.Root";
export { TabsList as List } from "./Tabs.Root";
export { TabsTrigger as Trigger } from "./Tabs.Root";
export { TabsContent as Content } from "./Tabs.Root";
export type {
    TabsRootProps,
    TabsListProps,
    TabsTriggerProps,
    TabsContentProps,
} from "./Tabs.types";

// Namespace export — usage: <Tabs.Root> <Tabs.List> etc.
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "./Tabs.Root";

export const Tabs = {
    Root: TabsRoot,
    List: TabsList,
    Trigger: TabsTrigger,
    Content: TabsContent,
};