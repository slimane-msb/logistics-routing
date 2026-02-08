import { beforeAll, describe, test, expect } from "vitest";
import { nearestNeighbor2OptTSP } from "../../../algorithms/TSP/nearest_neighbor_twoOpt";
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

describe("nearestNeighbor2OptTSP TSP tests", () => {

  test("Dublin: optimal TSP for x locations", () => {
    const targets = [
        "670990",
        "11675792",
        "12639625",
        "14955934",
        "16157122",
        "18896417",
        "26374831",
        "26414176",
        "26868709",
        "28257211",
        "32335861",
        "46563731",
        "58675496",
        "67079484",
        "91555435",
        "111887243",
        "131031572",
        "170789284",
        "192531492",
        "240380104",
        "242733665",
        "244443898",
        "247648111",
        "249084433",
        "255237710",
        "259594836",
        "269228016",
        "289889586",
        "297388013",
        "301804343",
        "301832807",
        "305249914",
        "320023002",
        "325712856",
        "336143238",
        "339626514",
        "361218732",
        "366913339",
        "414606709",
        "450711419",
        "479669467",
        "530287651",
        "564503102",
        "614649822",
        "665537690",
        "696250370",
        "799150579",
        "966738848",
        "1230024611",
        "1294904418",
        "1410014030",
        "1426048717",
        "1426961585",
        "1432780732",
        "1522514897", 
        "255315706"
    ]; 

    const result = nearestNeighbor2OptTSP(dublinGraph, targets, astar);

    console.log("Order:", result.order);
    console.log("Path length:", result.path.length);
    console.log("Distance:", result.distance);

    
    expect(result.order.length).toBe(targets.length);
    expect(new Set(result.order)).toEqual(new Set(targets)); 
    expect(result.path.length).toBeGreaterThanOrEqual(targets.length);
    expect(result.distance).toBeGreaterThan(0);
  });

  test("Paris: optimal TSP for x locations", () => {
    const targets = [
      "116147982",
      "21660948",
      "560860385",
      "10156568326"
    ]; 

    const result = nearestNeighbor2OptTSP(parisGraph, targets, astar);

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
