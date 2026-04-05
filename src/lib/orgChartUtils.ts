import { OrgChartNode } from "@/types";

export function flattenTree(nodes: OrgChartNode[]): Map<number, OrgChartNode> {
  const map = new Map<number, OrgChartNode>();
  function walk(node: OrgChartNode) {
    map.set(node.id, node);
    node.subordinates.forEach(walk);
  }
  nodes.forEach(walk);
  return map;
}

export function filterTree(
  nodes: OrgChartNode[],
  query: string
): { filtered: OrgChartNode[]; matchIds: Set<number> } {
  const matchIds = new Set<number>();
  const q = query.toLowerCase();

  function nodeMatches(node: OrgChartNode): boolean {
    const fullName = `${node.first_name} ${node.last_name}`.toLowerCase();
    return (
      fullName.includes(q) ||
      node.username.toLowerCase().includes(q) ||
      (node.stack?.name.toLowerCase().includes(q) ?? false) ||
      (node.role?.name.toLowerCase().includes(q) ?? false)
    );
  }

  function isOrgChartNode(node: OrgChartNode | null): node is OrgChartNode {
    return node !== null;
  }

  function prune(node: OrgChartNode): OrgChartNode | null {
    const selfMatch = nodeMatches(node);
    if (selfMatch) {
      matchIds.add(node.id);
      return node;
    }
    const childResults = node.subordinates.map(prune).filter(isOrgChartNode);
    return childResults.length > 0 ? { ...node, subordinates: childResults } : null;
  }

  return { filtered: nodes.map(prune).filter(isOrgChartNode), matchIds };
}
