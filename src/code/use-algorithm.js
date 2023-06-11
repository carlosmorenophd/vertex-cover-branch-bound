const useAlgorithm = () => {
  const branchAndBound = (graph) => {
    const result = branchAndBoundImplementation({ graph });
    return result;
  };

  const branchAndBoundImplementation = ({ graph }) => {
    const n = graph.length; 
    let bestVertexCover = Array(n).fill(false); 
    let bestSize = Infinity; 
  
    // Validar si los vertices seleccionados tienen todas las aristas que posee el grafo.
    function isCovered(vertices) {
      for (let i = 0; i < n; i++) {
        if (!vertices[i]) {
          for (let j = 0; j < n; j++) {
            if (graph[i][j] && !vertices[j]) {
              return false;
            }
          }
        }
      }
      return true;
    }
  
    function branchAndBound(vertices, size, currentVertex) {
      console.log(vertices, size, currentVertex);
      if (isCovered(vertices)) {
        if (size < bestSize) {
          bestSize = size;
          bestVertexCover = vertices.slice();
        }
        return;
      }
  
      if (currentVertex === n) {
        return;
      }
  
      // Ramificación incluyendo el vértice actual en el conjunto de vértices
      vertices[currentVertex] = true;
      let newSize = size + 1;
      if (newSize < bestSize) {
        branchAndBound(vertices, newSize, currentVertex + 1);
      }
  
      // Ramificación excluyendo el vértice actual del conjunto de vértices
      vertices[currentVertex] = false;
      newSize = size;
      if (newSize < bestSize) {
        branchAndBound(vertices, newSize, currentVertex + 1);
      }
    }
  
   branchAndBound(Array(n).fill(false), 0, 0);
    return { vertexCover: bestVertexCover, size: bestSize };
  };

  return {
    branchAndBound,
  };
};

export { useAlgorithm };
