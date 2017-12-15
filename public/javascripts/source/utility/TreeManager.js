
// JavaScript source code

/**
 * TreeManager.js
 * @author Andrew
 */

define([], function () {

    'use strict';

    try {

        var TreeManager = function TreeManager()
        { };

        TreeManager.addFileSource = function (fileSource) {

            var treeNodeID = 10;

            var t = $('#TreeDIV');

            // then add in the database
            var node = t.tree('getNodeByName', 'File');

            var fileNode = t.tree(
                'appendNode',
                {
                    label: fileSource.sourceName,
                    id: treeNodeID
                },
                node
            );

            var headerArray = fileSource.header.split(',');

            for (var i = 0; i < headerArray.length; i++) {
                t.tree(
                    'appendNode',
                    {
                        label: headerArray[i],
                        id: treeNodeID + i + 1
                    },
                    fileNode
                );
            }

            // now open the node
            // t.tree('openNode', fileNode);
        };

        TreeManager.addDatabaseSource = function (database, schemaData) {

            var databaseID = 100;

            var t = $('#TreeDIV');

            // first check to see if this node is already added
            var dbNode = t.tree('getNodeByID', databaseID);

            // BUG : The removal of nodes isn't working (even if all children are removed first)
            // and if so, remove it
            if (dbNode) {

                // first remove all children, if any
                if (dbNode.children) {
                    for (var i = dbNode.children.length - 1; i >= 0; i--) {
                        var child = dbNode.children[i];
                        t.tree('removeNode', child);
                    }
                }

                // then the node itself
                t.tree('removeNode', dbNode);
            }

            // then add in the database
            var node = t.tree('getNodeByName', 'MySQL');

            var dataBaseNode = t.tree(
                'appendNode',
                {
                    label: database,
                    id: databaseID
                },
                node
            );


            var unique = {};
            var distinct = [];
            for (var i in schemaData.rows) {
                if (typeof (unique[schemaData.rows[i].table_name]) == 'undefined') {
                    distinct.push(schemaData.rows[i].table_name);
                }
                unique[schemaData.rows[i].table_name] = 0;
            }

            for (var i = 0; i < distinct.length; i++) {
                t.tree(
                    'appendNode',
                    {
                        label: distinct[i],
                        id: databaseID + i + 1
                    },
                    dataBaseNode
                );
            }

            // now open the node
            // t.tree('openNode', dataBaseNode);
        };

        return TreeManager;
    }
    catch (e) {
        alert('TreeManager ctor: ' + e.message);
    }
});