export function canonicalizeOntarioSourceReference(sourceReference: string) {
  return sourceReference.replace(/#.*$/, "");
}
