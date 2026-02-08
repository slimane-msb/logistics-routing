import json

# Load nodes and edges from JSON files
for city in ['paris', 'dublin']:
    with open(f"./{city}_nodes.json", "r") as f:
        nodes = json.load(f)

    with open(f"./{city}_edges.json", "r") as f:
        edges = json.load(f)

    # Build adjacency dictionary
    adjacency = {str(node["id"]): [] for node in nodes} 

    for edge in edges:
        from_id = str(edge["from_node_id"])
        to_id = edge["to_node_id"]
        distance = edge["distance"]
        adjacency[from_id].append({
            "to": to_id,
            "distance": distance
        })

    # Save adjacency JSON
    with open(f"./{city}_adjacency.json", "w") as f:
        json.dump(adjacency, f, indent=2)

    print(f"Adjacency for {city} JSON saved!")
