import osmnx as ox
import json
import networkx as nx

def create_road_graph(city_name, place_name):
    """
    Download road network for a city and save nodes and edges as JSON files.
    Args:
        city_name: Name for the output files (e.g., 'paris', 'dublin')
        place_name: OSM place name to geocode (e.g., 'Paris, France')
    """
    print(f"Downloading road network for {place_name}...")
    
    G = ox.graph_from_place(place_name, network_type='drive')
    
    if not nx.is_connected(G.to_undirected()):
        G = G.subgraph(max(nx.weakly_connected_components(G), key=len)).copy()
    
    print(f"Graph has {len(G.nodes)} nodes and {len(G.edges)} edges")
    
    nodes = []
    for node_id, data in G.nodes(data=True):
        nodes.append({
            'id': int(node_id),
            'lat': data['y'],
            'lng': data['x']
        })
    
    edges = []
    for u, v, data in G.edges(data=True):
        distance = data.get('length', 0)
        
        edges.append({
            'from_node_id': int(u),
            'to_node_id': int(v),
            'distance': round(distance, 2)
        })
        
        if G.is_directed() and G.has_edge(v, u):
            reverse_data = G.edges[v, u, 0] if G.is_multigraph() else G.edges[v, u]
            reverse_distance = reverse_data.get('length', distance)
            edges.append({
                'from_node_id': int(v),
                'to_node_id': int(u),
                'distance': round(reverse_distance, 2)
            })
    
    nodes_file = f'{city_name}_nodes.json'
    edges_file = f'{city_name}_edges.json'
    
    with open(nodes_file, 'w') as f:
        json.dump(nodes, f, indent=2)
    print(f"Saved {len(nodes)} nodes to {nodes_file}")
    
    with open(edges_file, 'w') as f:
        json.dump(edges, f, indent=2)
    print(f"Saved {len(edges)} edges to {edges_file}")
    
    return G

def main():
    
    print("=" * 50)
    paris_graph = create_road_graph('paris', 'Paris, France')
    
    print("\n" + "=" * 50)
    dublin_graph = create_road_graph('dublin', 'Dublin, Ireland')
    
    print("\n" + "=" * 50)
    print("Done! Files created:")
    print("├── dublin_edges.json")
    print("├── dublin_nodes.json")
    print("├── paris_edges.json")
    print("└── paris_nodes.json")

if __name__ == "__main__":
    main()
