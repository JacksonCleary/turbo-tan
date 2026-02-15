import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils.ts";
import styles from "./Button.module.css";

const buttonVariants = cva(styles["base"], {
	defaultVariants: {
		size: "default",
		variant: "default",
	},
	variants: {
		size: {
			default: styles["sizeDefault"],
			icon: styles["sizeIcon"],
			"icon-lg": styles["sizeIconLg"],
			"icon-sm": styles["sizeIconSm"],
			"icon-xs": styles["sizeIconXs"],
			lg: styles["sizeLg"],
			sm: styles["sizeSm"],
			xs: styles["sizeXs"],
		},
		variant: {
			default: styles["variantDefault"],
			destructive: styles["variantDestructive"],
			ghost: styles["variantGhost"],
			link: styles["variantLink"],
			outline: styles["variantOutline"],
			secondary: styles["variantSecondary"],
		},
	},
});

function Button({
	className,
	variant = "default",
	size = "default",
	...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
	return (
		<ButtonPrimitive
			className={cn(buttonVariants({ className, size, variant }))}
			data-slot="button"
			{...props}
		/>
	);
}

export { Button, buttonVariants };
