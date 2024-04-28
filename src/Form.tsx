import { zodResolver } from "@hookform/resolvers/zod";
import type { DependencyList } from "react";
import { useEffect } from "react";
import type {
  ControllerProps,
  FieldPath,
  UseFieldArrayProps,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import type { z } from "zod";

export default class Form<FormSchema extends z.Schema = z.Schema> {
  private form: UseFormReturn<z.infer<FormSchema>> | undefined;
  private schema: FormSchema;

  constructor(params: { schema: FormSchema }) {
    const { schema } = params;

    this.schema = schema;
  }

  useForm = (params?: UseFormProps<z.infer<FormSchema>>) => {
    this.form = useForm<z.infer<FormSchema>>({
      resolver: zodResolver(this.schema),
      ...params,
    });

    return this.form;
  };

  useFieldArray = (params: UseFieldArrayProps<z.infer<FormSchema>>) => {
    return useFieldArray({
      control: this.form?.control,
      keyName: "__id",
      ...params,
    });
  };

  Field<TName extends FieldPath<z.infer<FormSchema>> = FieldPath<z.infer<FormSchema>>>(
    props: ControllerProps<z.infer<FormSchema>, TName>
  ) {
    if (!this.form) {
      return null;
    }

    return <Controller control={this.form.control} {...props} />;
  }

  useUpdate = (
    updater: (prev: z.infer<FormSchema>) => z.infer<FormSchema> | void,
    deps: DependencyList
  ) => {
    useEffect(() => {
      if (!this.form) {
        return;
      }

      const value = updater(this.form.getValues());

      if (value) {
        this.form.reset(value);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps]);
  };
}
