/**
 * Compatibility helper for @tanstack/react-query v4/v5.
 * v5 uses `isPending`; v4 uses `status === "loading"`.
 */
export function isMutationLoading(mutation: { isPending?: boolean; status?: string }): boolean {
  return mutation.isPending !== undefined ? mutation.isPending : mutation.status === "loading";
}
