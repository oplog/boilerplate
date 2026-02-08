import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// ─── Layout Variants ────────────────────────────────────────
const messageCardVariants = cva(
  "group relative overflow-hidden border bg-card text-card-foreground shadow-sm transition-all",
  {
    variants: {
      layout: {
        top: "flex flex-col",
        trailing: "flex flex-row",
      },
    },
    defaultVariants: {
      layout: "top",
    },
  }
)

// ─── Root ────────────────────────────────────────────────────
interface MessageCardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof messageCardVariants> {
  /** Image source URL */
  imageSrc?: string
  /** Image alt text */
  imageAlt?: string
  /** CSS background-position for the image (default: "center") */
  imagePosition?: string
  /** Background color (overrides card bg) */
  backgroundColor?: string
}

function MessageCard({
  className,
  layout = "top",
  imageSrc,
  imageAlt = "",
  imagePosition = "center",
  backgroundColor,
  style,
  children,
  ...props
}: MessageCardProps) {
  return (
    <div
      data-slot="message-card"
      className={cn(messageCardVariants({ layout }), className)}
      style={{ backgroundColor, ...style }}
      {...props}
    >
      {imageSrc && (
        <div
          className={cn(
            "relative overflow-hidden bg-muted",
            layout === "top" ? "w-full aspect-[16/9]" : "w-28 shrink-0 self-stretch"
          )}
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: imagePosition }}
          />
          {/* Dark mode overlay */}
          <div className="absolute inset-0 bg-black/0 dark:bg-black/20 transition-colors" />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {children}
      </div>
    </div>
  )
}

// ─── Heading ─────────────────────────────────────────────────
function MessageCardHeading({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="message-card-heading"
      className={cn("text-lg font-bold leading-tight", className)}
      {...props}
    />
  )
}

// ─── Paragraph ───────────────────────────────────────────────
function MessageCardParagraph({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="message-card-paragraph"
      className={cn("text-sm text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  )
}

// ─── Action (CTA Button) ────────────────────────────────────
interface MessageCardActionProps
  extends React.ComponentProps<typeof Button> {}

function MessageCardAction({
  className,
  variant = "secondary",
  size = "sm",
  ...props
}: MessageCardActionProps) {
  return (
    <Button
      data-slot="message-card-action"
      variant={variant}
      size={size}
      className={cn("mt-1 w-fit", className)}
      {...props}
    />
  )
}

export {
  MessageCard,
  MessageCardHeading,
  MessageCardParagraph,
  MessageCardAction,
}
