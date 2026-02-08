import Heap from "heap";
function dijkstraHeap(graph, start, end) {
    const distances = {};
    const previous = {};
    const visited = new Set();
    for (const nodeId in graph.nodes) {
        distances[nodeId] = Infinity;
        previous[nodeId] = null;
    }
    distances[start] = 0;
    const heap = new Heap((a, b) => a.dist - b.dist);
    heap.push({ id: start, dist: 0 });
    while (!heap.empty()) {
        const { id: currentNode, dist } = heap.pop();
        if (visited.has(currentNode))
            continue;
        visited.add(currentNode);
        if (currentNode === end)
            break;
        for (const edge of graph.adjacency[currentNode] || []) {
            const neighbor = edge.to;
            const newDist = distances[currentNode] + edge.distance;
            if (newDist < distances[neighbor]) {
                distances[neighbor] = newDist;
                previous[neighbor] = currentNode;
                heap.push({ id: neighbor, dist: newDist });
            }
        }
    }
    const path = [];
    let node = end;
    if (distances[end] === Infinity)
        return { distance: Infinity, path: [] };
    while (node) {
        path.unshift(node);
        node = previous[node];
    }
    return { distance: distances[end], path };
}
function dijkstra(graph, start, end) {
    const distances = {};
    const previous = {};
    const visited = new Set();
    for (const nodeId in graph.nodes) {
        distances[nodeId] = Infinity;
        previous[nodeId] = null;
    }
    distances[start] = 0;
    while (visited.size < Object.keys(graph.nodes).length) {
        let currentNode = null;
        let minDist = Infinity;
        for (const nodeId in distances) {
            if (!visited.has(nodeId) && distances[nodeId] < minDist) {
                minDist = distances[nodeId];
                currentNode = nodeId;
            }
        }
        if (!currentNode)
            break;
        if (currentNode === end)
            break;
        visited.add(currentNode);
        for (const edge of graph.adjacency[currentNode] || []) {
            const neighbor = edge.to;
            const newDist = distances[currentNode] + edge.distance;
            if (newDist < distances[neighbor]) {
                distances[neighbor] = newDist;
                previous[neighbor] = currentNode;
            }
        }
    }
    const path = [];
    let node = end;
    if (distances[end] === Infinity) {
        return { distance: Infinity, path: [] };
    }
    while (node) {
        path.unshift(node);
        node = previous[node];
    }
    return { distance: distances[end], path };
}
export { dijkstra, dijkstraHeap };
