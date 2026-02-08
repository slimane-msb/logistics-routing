import { beforeAll, describe, test, expect } from "vitest";
import { dijkstra, dijkstraHeap } from "../../../algorithms/shortest path/dijkstra";
import { load_city_graph } from "../../../utils/graph_loader";
import { Graph, Node } from "../../../utils/types";

let dublinGraph: Graph;
let parisGraph: Graph;

beforeAll(() => {
  dublinGraph = load_city_graph("dublin");
  parisGraph = load_city_graph("paris");
});




describe("dijkstraHeap shortest path tests", () => {

    test("Dublin: shortest path between two nodes", () => {
      const start = "389281";
      const end = "26165090";
  
      const result = dijkstraHeap(dublinGraph, start, end);
  
      console.log("Dublin path:", result.path, "Distance:", result.distance);
  
      expect(result.path[0]).toBe(start);
      expect(result.path[result.path.length - 1]).toBe(end);
      expect(result.distance).toBeLessThan(109);
    });
  
    test("Paris: shortest path between two nodes", () => {
      const start = "125742";
      const end = "116147966";
  
      const result = dijkstraHeap(parisGraph, start, end);
  
      console.log("Paris path:", result.path, "Distance:", result.distance);
  
      expect(result.path[0]).toBe(start);
      expect(result.path[result.path.length - 1]).toBe(end);
      expect(result.distance).toBeGreaterThan(0);
      expect(result.distance).toBeLessThan(9999);
    });
  
  }, 300000);
  

// describe("Dijkstra shortest path tests", () => {

//   test("Dublin: shortest path between two nodes", () => {
//     const start = "389281";
//     const end = "26165090";

//     const result = dijkstra(dublinGraph, start, end);

//     console.log("Dublin path:", result.path, "Distance:", result.distance);

//     expect(result.path[0]).toBe(start);
//     expect(result.path[result.path.length - 1]).toBe(end);
//     expect(result.distance).toBeLessThan(109);
//   });

//   test("Paris: shortest path between two nodes", () => {
//     const start = "125742";
//     const end = "116147966";

//     const result = dijkstra(parisGraph, start, end);

//     console.log("Paris path:", result.path, "Distance:", result.distance);

//     expect(result.path[0]).toBe(start);
//     expect(result.path[result.path.length - 1]).toBe(end);
//     expect(result.distance).toBeGreaterThan(0);
//     expect(result.distance).toBeLessThan(9999);
//   });

// }, 300000);

