/**
 * @author Andrew
 */

define(['javascripts/source/graph/Graph'],
    function (Graph) {

        'use strict';

        try {

            var GraphFactory = function GraphFactory() { };

            GraphFactory.createSimpleEntityGraph = function () {

                var ret = new Graph();

                var vertex1 = ret.addVertex({
                    instance: 'Planet',
                    type: 'LogicalEntityControl',
                    name: 'Earth',
                    orbitalPeriod: 1,
                    atmosphere: 'Nitrogen',
                    radius: 1,
                    displayKeys: ['name', 'orbitalPeriod', 'atmosphere', 'radius'],
                    x: 10,
                    y: 10
                });

                var vertex2 = ret.addVertex({
                    instance: 'Star',
                    type: 'LogicalEntityControl',
                    name: 'Sol',
                    mass: '1.98 X 10^30 kg',
                    luminosity: '3.827 x 10^26 W',
                    radius: '6.96 x 10^8 m',
                    displayKeys: ['name', 'mass', 'luminosity', 'radius'],
                    x: 200,
                    y: 100
                });

                var vertex3 = ret.addVertex({
                    type: 'LogicalEntityControl',
                    instance: 'Galaxy',
                    name: 'NGC 1099',
                    constellation: 'Fornax',
                    redshift: '1271 ± 3 km/s',
                    apparantMagnitude: 10.2,
                    displayKeys: ['name', 'constellation', 'redshift', 'apparant magnitude'],
                    x: 400,
                    y: 120
                });

                ret.addEdge(vertex1, vertex2, {
                    type: 'Association',
                    name: 'orbits'
                });

                ret.addEdge(vertex2, vertex3, {
                    type: 'Association',
                    name: 'orbits'
                });

                return ret;
            };

            GraphFactory.createWorkflowControlGraph = function () {

                var ret = new Graph();

                var vertex1 = ret.addVertex({
                    type: 'UDFInControl',
                    displayKeys: ['ID', 'Name'],
                    x: 50,
                    y: 100,
                    inboundType: 'aro',
                    outboundType: 'aro'
                });

                var vertex2 = ret.addVertex({
                    type: 'UDFOutControl',
                    x: 50,
                    y: 350,
                    inboundType: 'aro',
                    outboundType: 'aro'
                });
                
                ret.addEdge(vertex1, vertex2, {
                    type: 'DataFlow'
                });

                return ret;
            };

            GraphFactory.createSimpleIntegrateGraph = function () {

                var ret = new Graph();

                var vertex1 = ret.addVertex({
                    type: 'PhysicalEntityControl',
                    instance: 'City',
                    imageName: 'images/DataSource.png',
                    Name: 'city',
                    CountryCode: 'foo',
                    District: 'foo',
                    Population: 'foo',
                    displayKeys: ['ID', 'Name', 'CountryCode', 'District', 'Population'],
                    database: 'world',
                    host: 'localhost',
                    x: 50,
                    y: 100
                });

                var vertex2 = ret.addVertex({
                    type: 'FunctionControl',
                    instance: 'Sample',
                    func: _.sample,
                    displayKeys: [],
                    n: 5,
                    x: 500,
                    y: 150
                });

                var vertex4 = ret.addVertex({
                    type: 'FormControl',
                    instance: 'EditBox',
                    x: 50,
                    y: 350,
                    inboundType: 'void',
                    outboundType: 'o'
                });

                
                ret.addEdge(vertex1, vertex2, {
                    type: 'DataFlow',
                    argumentName: 'obj'
                });

                ret.addEdge(vertex4, vertex2, {
                    type: 'DataFlow',
                    argumentName: 'n'
                });
                

                return ret;

                /*
                var vertex3 = ret.addVertex({ instance: 'Galaxy', 
                                              type: 'PopulateGridControl', 
                                              imageName : 'images/Table.png',
                                              x: 400, 
                                              y: 120 });
                                                
                ret.addEdge(vertex2, vertex3, { name: 'populates', 
                                                type: 'Data Flow' });
*/
            };

            return GraphFactory;
        }
        catch (e) {

            alert('GraphFactory ctor' + e.message);
        }
    });