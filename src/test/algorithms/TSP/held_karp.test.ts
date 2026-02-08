import { beforeAll, describe, test, expect } from "vitest";
import { heldKarpTSP } from "../../../algorithms/TSP/held_karp";
import { dijkstra } from "../../../algorithms/shortest path/dijkstra";
import { astar } from "../../../algorithms/shortest path/astar";
import { greedyBestFirstSearch } from "../../../algorithms/shortest path/greedyBestFirstSearch";
import { load_city_graph } from "../../../utils/graph_loader";
import { Graph, Node } from "../../../utils/types";

let dublinGraph: Graph;
let parisGraph: Graph;

beforeAll(() => {
  dublinGraph = load_city_graph("dublin");
  parisGraph = load_city_graph("paris");
});

describe("Held-Karp TSP tests", () => {

  test("Dublin: optimal TSP for x locations", () => {
    const targets = [
      "389281",
      "255315706",
      "510613426",
      "2381204952",
      "672383", 
      "4177256784", 
      "13461418609", 
      "4201149790", 
      "1506481640", 
      "527838191", 
      "320027798", 
      "255425633", 
      "255315706"

    ]; 

    const result = heldKarpTSP(dublinGraph, targets, astar);

    console.log("Order:", result.order);
    console.log("Path length:", result.path.length);
    console.log("Distance:", result.distance);

    
    expect(result.order.length).toBe(targets.length);
    expect(new Set(result.order)).toEqual(new Set(targets)); 
    expect(result.path.length).toBeGreaterThanOrEqual(targets.length);
    expect(result.distance).toBeGreaterThan(0);
    expect(result.distance).toBeLessThan(40000);
  });

  test("Paris: optimal TSP for x locations", () => {
    const targets = [
      "116147982",
      "21660948",
      "560860385",
      "10156568326"
    ]; 

    const result = heldKarpTSP(parisGraph, targets, astar);

    console.log("Order:", result.order);
    console.log("Path length:", result.path.length);
    console.log("Distance:", result.distance);

    
    expect(result.order.length).toBe(targets.length);
    expect(new Set(result.order)).toEqual(new Set(targets)); 
    expect(result.path.length).toBeGreaterThanOrEqual(targets.length);
    expect(result.distance).toBeGreaterThan(0);
    expect(result.distance).toBeLessThan(15000);
  });

}, 300000);
