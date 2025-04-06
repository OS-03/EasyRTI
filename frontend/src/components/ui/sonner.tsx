import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

interface CustomToasterProps extends ToasterProps {}

const Toaster: React.FC<CustomToasterProps> = (props) => {
    const { theme = "dark" } = useTheme();

    if (!theme) {
        console.error("Theme is not available. Falling back to 'system'.");
    }

    return (
        <Sonner
            theme={theme as "system" | "light" | "dark" | undefined}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
                    description: "group-[.toast]:text-muted-foreground",
                    actionButton:
                        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                    cancelButton:
                        "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
