import type { z } from "zod";
import type Form from "./Form";

export type FormData<T> = T extends Form<infer FormSchema> ? z.infer<FormSchema> : never;
