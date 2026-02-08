"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dijkstra = dijkstra;
exports.astar = astar;
exports.bfs = bfs;
exports.nearestNeighborTSP = nearestNeighborTSP;
exports.twoOptOptimization = twoOptOptimization;
var utils_1 = require("./utils");
/**
 * Dijkstra's Algorithm
 * @param graph - Graph with nodes and edges
 * @param startNode - Starting node
 * @param endNode - End node
 * @returns Path, visited order, and distance
 */
function dijkstra(graph, startNode, endNode) {
    return __awaiter(this, void 0, void 0, function () {
        var distances, previous, visited, pq, visitedOrder, _loop_1, state_1, path, current;
        return __generator(this, function (_a) {
            distances = {};
            previous = {};
            visited = new Set();
            pq = [];
            Object.keys(graph.nodes).forEach(function (nodeId) {
                distances[nodeId] = Infinity;
            });
            distances[startNode.id] = 0;
            pq.push({ id: startNode.id, distance: 0 });
            visitedOrder = [];
            _loop_1 = function () {
                pq.sort(function (a, b) { return a.distance - b.distance; });
                var current_1 = pq.shift();
                if (!current_1)
                    return "break";
                if (visited.has(current_1.id))
                    return "continue";
                visited.add(current_1.id);
                visitedOrder.push(current_1.id);
                if (current_1.id === endNode.id)
                    return "break";
                var neighbors = graph.edges.filter(function (e) { return e.from == current_1.id; });
                for (var _i = 0, neighbors_1 = neighbors; _i < neighbors_1.length; _i++) {
                    var edge = neighbors_1[_i];
                    if (!visited.has(edge.to)) {
                        var newDist = distances[current_1.id] + edge.distance;
                        if (newDist < distances[edge.to]) {
                            distances[edge.to] = newDist;
                            previous[edge.to] = current_1.id;
                            pq.push({ id: edge.to, distance: newDist });
                        }
                    }
                }
            };
            while (pq.length > 0) {
                state_1 = _loop_1();
                if (state_1 === "break")
                    break;
            }
            path = [];
            current = endNode.id;
            while (current) {
                path.unshift(current);
                current = previous[current];
            }
            return [2 /*return*/, { path: path, visitedOrder: visitedOrder, distance: distances[endNode.id] }];
        });
    });
}
/**
 * A* Algorithm
 * @param graph - Graph with nodes and edges
 * @param startNode - Starting node
 * @param endNode - End node
 * @returns Path, visited order, and distance
 */
function astar(graph, startNode, endNode) {
    return __awaiter(this, void 0, void 0, function () {
        var gScore, fScore, previous, visited, openSet, visitedOrder, _loop_2, state_2, path, current;
        return __generator(this, function (_a) {
            gScore = {};
            fScore = {};
            previous = {};
            visited = new Set();
            openSet = [];
            Object.keys(graph.nodes).forEach(function (nodeId) {
                gScore[nodeId] = Infinity;
                fScore[nodeId] = Infinity;
            });
            gScore[startNode.id] = 0;
            fScore[startNode.id] = (0, utils_1.getDistance)({ lat: startNode.lat, lng: startNode.lon }, { lat: endNode.lat, lng: endNode.lon });
            openSet.push({ id: startNode.id, fScore: fScore[startNode.id] });
            visitedOrder = [];
            _loop_2 = function () {
                openSet.sort(function (a, b) { return a.fScore - b.fScore; });
                var current_2 = openSet.shift();
                if (!current_2)
                    return "break";
                if (visited.has(current_2.id))
                    return "continue";
                visited.add(current_2.id);
                visitedOrder.push(current_2.id);
                if (current_2.id === endNode.id)
                    return "break";
                var neighbors = graph.edges.filter(function (e) { return e.from == current_2.id; });
                for (var _i = 0, neighbors_2 = neighbors; _i < neighbors_2.length; _i++) {
                    var edge = neighbors_2[_i];
                    if (!visited.has(edge.to)) {
                        var tentativeGScore = gScore[current_2.id] + edge.distance;
                        if (tentativeGScore < gScore[edge.to]) {
                            previous[edge.to] = current_2.id;
                            gScore[edge.to] = tentativeGScore;
                            var h = (0, utils_1.getDistance)({ lat: graph.nodes[edge.to].lat, lng: graph.nodes[edge.to].lon }, { lat: endNode.lat, lng: endNode.lon });
                            fScore[edge.to] = gScore[edge.to] + h;
                            openSet.push({ id: edge.to, fScore: fScore[edge.to] });
                        }
                    }
                }
            };
            while (openSet.length > 0) {
                state_2 = _loop_2();
                if (state_2 === "break")
                    break;
            }
            path = [];
            current = endNode.id;
            while (current) {
                path.unshift(current);
                current = previous[current];
            }
            return [2 /*return*/, { path: path, visitedOrder: visitedOrder, distance: gScore[endNode.id] }];
        });
    });
}
/**
 * Breadth-First Search Algorithm
 * @param graph - Graph with nodes and edges
 * @param startNode - Starting node
 * @param endNode - End node
 * @returns Path, visited order, and distance
 */
function bfs(graph, startNode, endNode) {
    return __awaiter(this, void 0, void 0, function () {
        var visited, previous, distances, queue, visitedOrder, _loop_3, state_3, path, current;
        return __generator(this, function (_a) {
            visited = new Set();
            previous = {};
            distances = {};
            queue = [startNode.id];
            visited.add(startNode.id);
            distances[startNode.id] = 0;
            visitedOrder = [];
            _loop_3 = function () {
                var current_3 = queue.shift();
                if (!current_3)
                    return "break";
                visitedOrder.push(current_3);
                if (current_3 === endNode.id)
                    return "break";
                var neighbors = graph.edges.filter(function (e) { return e.from == current_3; });
                for (var _i = 0, neighbors_3 = neighbors; _i < neighbors_3.length; _i++) {
                    var edge = neighbors_3[_i];
                    if (!visited.has(edge.to)) {
                        visited.add(edge.to);
                        previous[edge.to] = current_3;
                        distances[edge.to] = distances[current_3] + edge.distance;
                        queue.push(edge.to);
                    }
                }
            };
            while (queue.length > 0) {
                state_3 = _loop_3();
                if (state_3 === "break")
                    break;
            }
            path = [];
            current = endNode.id;
            while (current) {
                path.unshift(current);
                current = previous[current];
            }
            return [2 /*return*/, { path: path, visitedOrder: visitedOrder, distance: distances[endNode.id] || Infinity }];
        });
    });
}
// Route Optimization Algorithms
/**
 * Nearest Neighbor TSP approximation
 * @param points - Array of location points
 * @returns Order of indices
 */
function nearestNeighborTSP(points) {
    if (points.length <= 2)
        return points.map(function (_, i) { return i; });
    var visited = new Set();
    var order = [0];
    visited.add(0);
    while (order.length < points.length) {
        var current = order[order.length - 1];
        var nearest = -1;
        var minDist = Infinity;
        for (var i = 0; i < points.length; i++) {
            if (!visited.has(i)) {
                var dist = (0, utils_1.getDistance)(points[current], points[i]);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = i;
                }
            }
        }
        if (nearest !== -1) {
            order.push(nearest);
            visited.add(nearest);
        }
    }
    return order;
}
/**
 * 2-Opt optimization for TSP
 * @param points - Array of location points
 * @param initialOrder - Initial order of indices
 * @returns Optimized order
 */
function twoOptOptimization(points, initialOrder) {
    var _a;
    var order = __spreadArray([], initialOrder, true);
    var improved = true;
    function calculateTotalDistance(ord) {
        var total = 0;
        for (var i = 0; i < ord.length - 1; i++) {
            total += (0, utils_1.getDistance)(points[ord[i]], points[ord[i + 1]]);
        }
        return total;
    }
    while (improved) {
        improved = false;
        var currentDist = calculateTotalDistance(order);
        for (var i = 1; i < order.length - 1; i++) {
            for (var j = i + 1; j < order.length; j++) {
                var newOrder = __spreadArray([], order, true);
                // Reverse segment between i and j
                var left = i, right = j;
                while (left < right) {
                    _a = [newOrder[right], newOrder[left]], newOrder[left] = _a[0], newOrder[right] = _a[1];
                    left++;
                    right--;
                }
                var newDist = calculateTotalDistance(newOrder);
                if (newDist < currentDist) {
                    order = newOrder;
                    improved = true;
                    break;
                }
            }
            if (improved)
                break;
        }
    }
    return order;
}
