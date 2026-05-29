import React from "react";
import * as Icons from "lucide-react";
import { LucideProps } from "lucide-react";

export type IconName = keyof typeof Icons;

interface DynamicIconProps extends LucideProps {
    name: IconName | string;
}

const DynamicIcon = ({
    name,
    size = 16,
    strokeWidth = 1.5,
    className,
    ...props
}: DynamicIconProps) => {

    const Component = (Icons as any)[name as string] as React.ElementType;

    if (!Component) {
        return (
            <Icons.HelpCircle
                size={size}
                strokeWidth={strokeWidth}
                className={className}
                {...props}
            />
        );
    }

    return (
        <Component
            size={size}
            strokeWidth={strokeWidth}
            className={className}
            {...props}
        />
    );
};

export default DynamicIcon;