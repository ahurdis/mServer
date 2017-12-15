/**
 * Dijkstra.js
 * @author Andrew
 */

function Dijkstra() {
    
    var self = this;

    self.shortestPath = function(edges, numVertices, startVertex) {
        var done = new Array(numVertices);
        var pathLengths = new Array(numVertices);
        var predecessors = new Array(numVertices);
        
        done[startVertex] = true;
        
        for (var i = 0; i < numVertices; i++) {
            // Get the path lengths of the edges from the start vertex
            pathLengths[i] = edges[startVertex][i];
            
            // Assuming there is a connection (i.e. the weights are not Infinite)
            // set the start node as the potential predecessor)
            if (pathLengths[i] != Infinity) {
                predecessors[i] = startVertex;
            }
        }
        
        pathLengths[startVertex] = 0;
        
        for (var i = 0; i < numVertices - 1; i++) {
            
            var closest = -1;
            var closestDistance = Infinity;
            
            for (var j = 0; j < numVertices; j++) {
                if (!done[j] && pathLengths[j] < closestDistance) {
                    closestDistance = pathLengths[j];
                    closest = j;
                }
            }
            
            done[closest] = true;
            
            for (var j = 0; j < numVertices; j++) {
                
                if (!done[j]) {
                    var possiblyCloserDistance = pathLengths[closest] + edges[closest][j];
                    
                    if (possiblyCloserDistance < pathLengths[j]) {
                        pathLengths[j] = possiblyCloserDistance;
                        predecessors[j] = closest;
                    }

                }
            }
        }
        return {
            "startVertex": startVertex,
            "pathLengths": pathLengths,
            "predecessors": predecessors
        };
    };
    
    self.constructPath = function(shortestPathInfo, endVertex) {
        var path = [];
        while (endVertex != shortestPathInfo.startVertex) {
            path.unshift(endVertex);
            endVertex = shortestPathInfo.predecessors[endVertex];
        }
        return path;
    };
};

module.exports = Dijkstra;