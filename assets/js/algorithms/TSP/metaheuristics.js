function tourDistance(order, dist) {
    let total = 0;
    for (let i = 0; i < order.length - 1; i++) {
        total += dist[order[i]][order[i + 1]];
    }
    return total;
}
// Shuffle array (Fisher-Yates)
function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
/**
 * Genetic Algorithm for TSP
 */
export function metaheuristics(graph, targets, shortestPathFunc, populationSize = 50, generations = 200, mutationRate = 0.1) {
    const n = targets.length;
    // 1. Build distance matrix
    const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));
    const paths = Array.from({ length: n }, () => Array.from({ length: n }, () => []));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i === j)
                continue;
            const res = shortestPathFunc(graph, targets[i], targets[j]);
            dist[i][j] = res.distance;
            paths[i][j] = res.path;
        }
    }
    // 2. Initial population
    let population = [];
    for (let i = 0; i < populationSize; i++) {
        population.push(shuffle([...Array(n).keys()]));
    }
    // 3. Evolution loop
    for (let gen = 0; gen < generations; gen++) {
        // Evaluate fitness
        const fitness = population.map(order => 1 / tourDistance(order, dist));
        // Selection (roulette wheel)
        const newPopulation = [];
        while (newPopulation.length < populationSize) {
            const select = () => {
                const r = Math.random() * fitness.reduce((a, b) => a + b, 0);
                let sum = 0;
                for (let i = 0; i < fitness.length; i++) {
                    sum += fitness[i];
                    if (sum >= r)
                        return population[i].slice();
                }
                return population[fitness.length - 1].slice();
            };
            let parent1 = select();
            let parent2 = select();
            // Crossover (order crossover)
            const start = Math.floor(Math.random() * n);
            const end = start + Math.floor(Math.random() * (n - start));
            const child = Array(n).fill(-1);
            for (let i = start; i < end; i++)
                child[i] = parent1[i];
            let fillIdx = 0;
            for (let gene of parent2) {
                if (!child.includes(gene)) {
                    while (child[fillIdx] !== -1)
                        fillIdx++;
                    child[fillIdx] = gene;
                }
            }
            // Mutation (swap)
            if (Math.random() < mutationRate) {
                const a = Math.floor(Math.random() * n);
                const b = Math.floor(Math.random() * n);
                [child[a], child[b]] = [child[b], child[a]];
            }
            newPopulation.push(child);
        }
        population = newPopulation;
    }
    // 4. Pick best individual
    let best = population[0];
    let bestDist = tourDistance(best, dist);
    for (const order of population) {
        const d = tourDistance(order, dist);
        if (d < bestDist) {
            best = order;
            bestDist = d;
        }
    }
    // 5. Build full road path
    const fullPath = [];
    for (let i = 0; i < n - 1; i++) {
        const a = best[i];
        const b = best[i + 1];
        const segment = paths[a][b];
        if (i === 0) {
            fullPath.push(...segment);
        }
        else {
            fullPath.push(...segment.slice(1));
        }
    }
    const resultOrder = best.map(i => targets[i]);
    const distance = bestDist;
    return { order: resultOrder, path: fullPath, distance };
}
