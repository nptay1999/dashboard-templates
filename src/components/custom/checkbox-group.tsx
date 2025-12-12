/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import createContext, { type TProviderProps } from "./create-context";
import {
  useCallback,
  useMemo,
  type ComponentProps,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import { Checkbox } from "@/components/ui/checkbox";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { useControllableState } from "@/hooks/use-controllable-state";

const CHECKBOX_GROUP_NAME = "CheckboxGroup";

type TCheckboxValue = string | number | symbol;

type TCheckboxGroupContext<TValue = TCheckboxValue> = {
  selectedValues: TValue[];
  setSelectedValues: Dispatch<SetStateAction<TValue[]>>;
};

const [Provider, useCheckboxGroupContext] =
  createContext<TCheckboxGroupContext<any>>(CHECKBOX_GROUP_NAME);

type TCheckboxGroupProviderProps<TValue = TCheckboxValue> = Partial<
  TProviderProps<TCheckboxGroupContext<TValue>>
> & {
  children: ReactNode;

  value?: TValue[];
  defaultValue?: TValue[];
  onChange?: (value: TValue[]) => void;
};

function CheckboxGroupProvider<TValue = TCheckboxValue>({
  value,
  defaultValue,
  onChange,
  ...props
}: TCheckboxGroupProviderProps<TValue>) {
  const [selectedValues, setSelectedValues] = useControllableState<TValue[]>({
    prop: value,
    defaultProp: defaultValue ?? [],
    onChange: onChange,
  });

  return (
    <Provider
      selectedValues={selectedValues}
      setSelectedValues={setSelectedValues}
      {...props}
    />
  );
}

type TCheckboxGroupProps<TValue = TCheckboxValue> = Omit<
  ComponentProps<"div">,
  "onChange"
> & {
  value?: TValue[];
  defaultValue?: TValue[];
  onChange?: (value: TValue[]) => void;
};

function CheckboxGroup<TValue = TCheckboxValue>({
  className,
  value,
  defaultValue,
  onChange,
  ...props
}: TCheckboxGroupProps<TValue>) {
  if (value !== undefined && value !== null && !Array.isArray(value)) {
    throw new Error(
      `CheckboxGroup: \`value\` prop must be an array when provided.\nReceived: ${value}`
    );
  }

  return (
    <CheckboxGroupProvider
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
    >
      <div
        data-slot="checkbox-group"
        className={cn("grid gap-3", className)}
        {...props}
      />
    </CheckboxGroupProvider>
  );
}

function CheckboxSlot({
  value: checkboxValue,
  ...props
}: ComponentProps<typeof Slot> & ComponentProps<typeof Checkbox>) {
  const { selectedValues, setSelectedValues } = useCheckboxGroupContext();

  const handleCheckedChange = useCallback(
    (checked: CheckedState) => {
      setSelectedValues((prev) => {
        const newValuesSet = new Set(prev);

        if (checked) {
          newValuesSet.add(checkboxValue);
        } else {
          newValuesSet.delete(checkboxValue);
        }

        return Array.from(newValuesSet) as TCheckboxValue[];
      });
    },
    [checkboxValue, setSelectedValues]
  );

  const checked = useMemo(() => {
    const valuesSet = new Set(selectedValues);
    return valuesSet.has(checkboxValue as TCheckboxValue);
  }, [checkboxValue, selectedValues]);

  return (
    <Slot
      data-slot="checkbox-group-item"
      checked={checked}
      onCheckedChange={handleCheckedChange}
      {...props}
    />
  );
}

function CheckboxGroupItem(props: ComponentProps<typeof Checkbox>) {
  return (
    <CheckboxSlot value={props.value}>
      <Checkbox {...props} />
    </CheckboxSlot>
  );
}

export { CheckboxGroup, CheckboxGroupItem };
