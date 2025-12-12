/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useId, useMemo, type ReactNode } from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerFieldState,
  type ControllerProps,
  type ControllerRenderProps,
  type FieldError as RhfFieldError,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
  type UseFormStateReturn,
} from "react-hook-form";
import {
  Field as ShadcnField,
  FieldLabel as ShadcnFieldLabel,
  FieldDescription as ShadcnFieldDescription,
  FieldError as ShadcnFieldError,
  FieldGroup as ShadcnFieldGroup,
  FieldLegend as ShadcnFieldLegend,
  FieldSeparator as ShadcnFieldSeparator,
  FieldSet as ShadcnFieldSet,
  FieldContent as ShadcnFieldContent,
  FieldTitle as ShadcnFieldTitle,
} from "@/components/ui/field";
import { Slot } from "@radix-ui/react-slot";
import createContext from "./create-context";

type TFormProps<
  TFieldValues extends FieldValues,
  TContext = any,
  TTransformedValues = TFieldValues
> = React.ComponentProps<"form"> & {
  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>;
};

const Form = <
  TFieldValues extends FieldValues,
  TContext = any,
  TTransformedValues = TFieldValues
>({
  form,
  ...props
}: TFormProps<TFieldValues, TContext, TTransformedValues>) => {
  return (
    <FormProvider {...form}>
      <form {...props} />
    </FormProvider>
  );
};

type TFormFieldContextWithRenderProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  id: string;
  name: TName;
  isRenderProps: true;
};

type TControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<TFieldValues>;
};

type TFormFieldContextWithoutRenderProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  id: string;
  name: TName;
  isRenderProps: false;
  controllerProps: TControllerProps<TFieldValues, TName>;
};

type TFormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> =
  | TFormFieldContextWithRenderProps<TFieldValues, TName>
  | TFormFieldContextWithoutRenderProps<TFieldValues, TName>;

const FORM_FIELD_CONTEXT_NAME = "FormField";

const [FormFieldProvider, useFormFieldContext] =
  createContext<TFormFieldContextValue<any, any> | null>(
    FORM_FIELD_CONTEXT_NAME,
    null
  );

type TFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<ControllerProps<TFieldValues, TName>, "render"> & {
  children: ControllerProps<TFieldValues, TName>["render"] | ReactNode;
};

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  children,
  ...props
}: TFormFieldProps<TFieldValues, TName>) => {
  const id = useId();
  const { control } = useFormContext<TFieldValues>();

  const renderChildren = useCallback(
    (...args: Parameters<ControllerProps<TFieldValues, TName>["render"]>) => {
      // If children is a render props, call it with the args

      if (typeof children === "function") {
        const providerProps: TFormFieldContextWithRenderProps<
          TFieldValues,
          TName
        > = { id, name: props.name, isRenderProps: true };

        return (
          <FormFieldProvider {...providerProps}>
            {children(...args)}
          </FormFieldProvider>
        );
      } else {
        const providerProps: TFormFieldContextWithoutRenderProps<
          TFieldValues,
          TName
        > = {
          id,
          name: props.name,
          isRenderProps: false,
          controllerProps: args[0],
        };

        return (
          <FormFieldProvider {...providerProps}>{children}</FormFieldProvider>
        );
      }
    },
    [children, id, props.name]
  );

  return <Controller control={control} {...props} render={renderChildren} />;
};

type TUseFormFieldReturn = Partial<
  {
    id: string;
    name: string;
    formItemId: string;
    formDescriptionId: string;
    formMessageId: string;
    // From fieldState spread:
    invalid: boolean;
    isDirty: boolean;
    isTouched: boolean;
    isValidating: boolean;
    error: RhfFieldError;
  } & TControllerProps<any, any>
>;

const useFormField = (): TUseFormFieldReturn => {
  const fieldContext = useFormFieldContext();
  const formContext = useFormContext();
  const formState = useFormState({ name: fieldContext?.name as any });

  // If not within FormFieldProvider, return empty defaults so Field components still work
  if (!fieldContext) {
    return {};
  }

  const { getFieldState } = formContext;
  const fieldState = getFieldState(fieldContext.name, formState) ?? {};
  const { id } = fieldContext;

  let controllerProps: Partial<TControllerProps<any, any>> = {};

  if (!fieldContext.isRenderProps) {
    controllerProps = fieldContext.controllerProps;
  }

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...controllerProps,
    ...fieldState,
  };
};

const Field = (props: React.ComponentProps<typeof ShadcnField>) => {
  const { invalid } = useFormField();
  return <ShadcnField data-invalid={invalid ?? false} {...props} />;
};

const FieldLabel = (props: React.ComponentProps<typeof ShadcnFieldLabel>) => {
  const { formItemId } = useFormField();
  return <ShadcnFieldLabel htmlFor={formItemId ?? undefined} {...props} />;
};

type TFieldControlProps = React.ComponentProps<typeof Slot> & {
  valuePropName?: string;
  onChangePropName?: string;
};

const FieldControl = ({
  valuePropName = undefined,
  onChangePropName = undefined,
  ...props
}: TFieldControlProps) => {
  const { formItemId, invalid, field } = useFormField();

  const inputProps = useMemo(() => {
    if (!field) {
      return {};
    }

    return {
      ...field,
      [valuePropName || "value"]: field.value,
      [onChangePropName || "onChange"]: field.onChange,
    };
  }, [field, valuePropName, onChangePropName]);

  return (
    <Slot
      id={formItemId ?? undefined}
      aria-invalid={invalid ?? false}
      {...inputProps}
      {...props}
    />
  );
};

const FieldDescription = (
  props: React.ComponentProps<typeof ShadcnFieldDescription>
) => {
  const { formDescriptionId } = useFormField();
  return (
    <ShadcnFieldDescription id={formDescriptionId ?? undefined} {...props} />
  );
};

const FieldError = (props: React.ComponentProps<typeof ShadcnFieldError>) => {
  const { invalid, error, formMessageId } = useFormField();

  if (!invalid || !error) {
    return null;
  }

  return (
    <ShadcnFieldError
      id={formMessageId ?? undefined}
      errors={[error]}
      {...props}
    />
  );
};

const FieldGroup = (props: React.ComponentProps<typeof ShadcnFieldGroup>) => {
  return <ShadcnFieldGroup {...props} />;
};

const FieldLegend = (props: React.ComponentProps<typeof ShadcnFieldLegend>) => {
  return <ShadcnFieldLegend {...props} />;
};

const FieldSeparator = (
  props: React.ComponentProps<typeof ShadcnFieldSeparator>
) => {
  return <ShadcnFieldSeparator {...props} />;
};

const FieldSet = (props: React.ComponentProps<typeof ShadcnFieldSet>) => {
  return <ShadcnFieldSet {...props} />;
};

const FieldContent = (
  props: React.ComponentProps<typeof ShadcnFieldContent>
) => {
  return <ShadcnFieldContent {...props} />;
};

const FieldTitle = (props: React.ComponentProps<typeof ShadcnFieldTitle>) => {
  return <ShadcnFieldTitle {...props} />;
};

export {
  Form,
  FormField,
  useFormField,
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
};

export type {
  TFormProps,
  TFormFieldContextWithRenderProps,
  TControllerProps,
  TFormFieldContextWithoutRenderProps,
  TFormFieldContextValue,
  TFormFieldProps,
  TFieldControlProps,
};
