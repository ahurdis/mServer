/**
 * @author Andrew
 */

define(['javascripts/source/utility/RestHelper',
    'javascripts/source/utility/TreeManager'],
    function (RestHelper, TreeManager) {
        'use strict';
        try {
            return function MySQLConnection(options) {
                var self = this;

                self.options = options || {};

                var _host = self.options.host || '';
                var _user = self.options.user || '';
                var _password = self.options.password || '';
                var _database = self.options.database || '';

                var _tables = [];

                var _data = null;

                var _connectionSucceeded = false;

                self.create = function () {

                    $('body').append('<div id="MySQLConnectionDIV"/>');

                    $('#MySQLConnectionDIV').load('./html/dialogs/mysqlconnection.html',

                        function () {

                            // open the dialog and load the HTML
                            $('#MySQLConnectionDIV').dialog({
                                modal: true,
                                open: function () {

                                },
                                height: 'auto',
                                width: '500',
                                title: 'New MySQL Connection',
                                buttons: [

                                    {
                                        text: 'Test Connection',
                                        icons: {
                                            primary: 'ui-icon-gear'
                                        },
                                        click: function () {
                                            testConnection();
                                        }
                                    },
                                    {
                                        text: 'Info Schema',
                                        icons: {
                                            primary: 'ui-icon-gear'
                                        },
                                        click: function () {
                                            getSourceSchema();
                                        }
                                    },
                                    {
                                        text: 'Cancel',
                                        click: function () {
                                            $(this).dialog('close');
                                            self.destroy();
                                        }
                                    },
                                    {
                                        text: 'OK',
                                        click: function () {
                                            if (_connectionSucceeded) {
                                                TreeManager.addDatabaseSource(_database, _data);
                                            }

                                            $(this).dialog('close');
                                            self.destroy();
                                        }
                                    }
                                ]

                            });
                        });

                };

                var testConnection = function () {

                    _connectionSucceeded = false;
                    _tables = [];

                    _host = $('#mysqlconnection_host').val();
                    _user = $('#mysqlconnection_user').val();
                    _password = $('#mysqlconnection_password').val();
                    _database = $('#mysqlconnection_database').val();

                    var options = {
                        host: _host,
                        user: _user,
                        password: _password,
                        database: _database
                    };

                    RestHelper.postJSON('mySQLCallback', { method: 'mysql', timeout: 20000, data: options }, function (data) {

                        var response = JSON.parse(data);

                        if (response.success === true) {
                            $('#mysqlconnection_message').html('The connection succeeded.');
                            if (response.tables) {
                                _tables = response.tables.split(',');
                            }
                            // _connectionSucceeded = true;
                        } else {
                            $('#mysqlconnection_message').html('The connection failed with error: ' + response.code);
                        }
                    });
                };

                var getSourceSchema = function () {

                    _connectionSucceeded = false;

                    _host = $('#mysqlconnection_host').val();
                    _user = $('#mysqlconnection_user').val();
                    _password = $('#mysqlconnection_password').val();
                    _database = $('#mysqlconnection_database').val();

                    var options = {
                        userName: app.userName,
                        host: _host,
                        user: _user,
                        password: _password,
                        database: _database
                    };

                    RestHelper.postJSON('sourceSchemaCallback', { method: 'mysql/source_schema', timeout: 20000, data: options }, function (data) {

                        if (data.success === true) {
                            $('#mysqlconnection_message').html('The connection succeeded.');
                            _data = data;
                            console.log(JSON.stringify(_data));
                            app.sourceSchema[_database] = data;
                            _connectionSucceeded = true;
                        } else {
                            $('#mysqlconnection_message').html('The connection failed with error: ' + data.code);
                        }
                    });
                };

                self.destroy = function () {
                    // remove the html element from the document    
                    $('#MySQLConnectionDIV').remove();
                };
            }
        }
        catch (e) {
            alert('MySQLConnection.js ' + e.name + ' ' + e.message);
        }

    });
