export type ObjectRef<T extends string = string> = { objectType: T; primaryKey: string };
export type Marking = "phi" | "rebate_confidential" | "tesla_only";

export interface OntologyObject<T extends string, P> {
  ref: ObjectRef<T>;
  properties: P;
  markings: Marking[];
  provenance: Record<keyof P, string | undefined>;
}

export interface ActionRequest<I> { actionType: string; target: ObjectRef; inputs: I; idempotencyKey: string; }
export interface ActionResult { auditId: string; status: "accepted" | "rejected"; mutatedObjects: ObjectRef[]; }

export interface OntologyClient {
  get<T extends string, P>(ref: ObjectRef<T>): Promise<OntologyObject<T, P>>;
  links(ref: ObjectRef, linkType: string): Promise<ObjectRef[]>;
  execute<I>(request: ActionRequest<I>): Promise<ActionResult>;
}
