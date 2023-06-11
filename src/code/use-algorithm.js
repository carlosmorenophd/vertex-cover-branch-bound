import { uid } from "uid";
import dataTree from "data-tree";

const useAlgorithm = () => {
  let tree = [];
  let parent = "";
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

    function branchAndBound(vertices, size, currentVertex, parent) {
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
      const leafWith = {
        parent,
        id: uid(),
        n: vertices.join(","),
        size,
        currentVertex,
      };
      console.log(vertices, leafWith);
      tree.push(leafWith);
      let newSize = size + 1;
      if (newSize < bestSize) {
        branchAndBound(vertices, newSize, currentVertex + 1, leafWith.id);
      }

      // Ramificación excluyendo el vértice actual del conjunto de vértices
      vertices[currentVertex] = false;
      newSize = size;
      const leafWithout = {
        parent,
        id: uid(),
        vertices: vertices.join(","),
        size,
        currentVertex,
      };
      tree.push(leafWithout);
      if (newSize < bestSize) {
        branchAndBound(vertices, newSize, currentVertex + 1, leafWithout.id);
      }
    }

    const leaf = {
      parent: null,
      id: uid(),
      vertices: Array(n).fill(false).join(","),
      size: 0,
      currentVertex: 0,
    };
    tree.push(leaf);
    parent = leaf.id;
    branchAndBound(Array(n).fill(false), 0, 0, leaf.id);
    console.log(tree);
    return { vertexCover: bestVertexCover, size: bestSize };
  };

  const getTree = () => {
    if (tree.length === 0) {
      throw new Error(
        "The merge sort function must be called before get tree function!"
      );
    } else {
      return getTreeImplementation({ toParent, toChild }).export((data) => {
        return createExport(data);
      });
    }
  };

  const createExport = (data) => {
    return {
      name: `${data.values.name}`,
      attributes: {
        tag: `[${data.values.tag}]`,
      },
    };
  };

  const toParent = (child) => {
    return {
      id: child.id,
      type: "Parent",
      name: child.id,
      tag: `Vertex cover`,
    };
  };

  const toChild = (child) => {
    return {
      id: child.id,
      type: "Child",
      name: child.id,
      tag: `[${child.vertices} ]`,
    };
  };

  const getTreeImplementation = ({ toParent, toChild }) => {
    let nowParent = parent;
    // const oldParent = parent;
    let continueTree = true;
    let panicButton = 0;
    let dataTreeResult = dataTree.create();
    let finishAllLeaf = 1;
    let parentCollectors = [];

    const children = tree.filter((t) => t.id === parent);
    children.forEach((child) => {
      dataTreeResult.insert({
        key: child.id,
        values: toParent(child),
      });
    });
    while (continueTree) {
      const nowParentConst = nowParent;
      const children = tree.filter((t) => t.parent === nowParentConst);
      children.forEach((child) => {
        parentCollectors.push(child.id);
        dataTreeResult.insertTo((data) => data.key === nowParentConst, {
          key: child.id,
          values: toChild(child),
        });
        //   if (child.parent === oldParent) {
        //     dataTreeResult.insert({
        //       key: child.id,
        //       values: toParent(child),
        //     });
        //   } else {
        //     dataTreeResult.insertTo((data) => data.key === nowParentConst, {
        //       key: child.id,
        //       values: toChild(child),
        //     });
        //   }
      });
      finishAllLeaf = finishAllLeaf + children.length;
      nowParent = parentCollectors.pop();
      if (finishAllLeaf === 0) continueTree = false;
      finishAllLeaf--;

      // Panic button to prevent infinite loop only on dev mode
      if (process.env.NODE_ENV === "development") {
        if (panicButton > 10000) {
          console.warn("Panic button activate");
          continueTree = false;
        } else {
          panicButton++;
        }
      }
    }
    return dataTreeResult;
  };

  return {
    branchAndBound,
    getTree,
  };
};

export { useAlgorithm };
