"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  useFormContext,
  useForm,
  FormProvider,
  UseFormReturn,
} from "react-hook-form"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
// ... other imports

interface FormProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onError'> {
  form: UseFormReturn<TFieldValues>;
  className?: string;
}

const Form = <TFieldValues extends FieldValues = FieldValues>({
  form,
  className,
  children,
  ...props
}: FormProps<TFieldValues>) => {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit((data) => {
            // O formulário será submetido aqui
          })(e);
        }}
        className={cn("space-y-8", className)}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
}
Form.displayName = "Form"

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <Controller
      {...props}
    />
  )
}

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("space-y-2", className)}
      {...props}
    />
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & { htmlFor?: string }
>(({ className, htmlFor, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      htmlFor={htmlFor}
      className={cn(className)}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot> & {
    id?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
  }
>(({ id, ...props }, ref) => {
  return (
    <Slot
      ref={ref}
      id={id}
      aria-invalid={props['aria-invalid']}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { id?: string }
>(({ className, id, ...props }, ref) => {
  return (
    <p
      ref={ref}
      id={id}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { id?: string }
>(({ className, children, id, ...props }, ref) => {
  if (!children) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={id}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {children}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
}