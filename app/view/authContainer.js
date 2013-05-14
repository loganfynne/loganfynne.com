/*
 * File: app/view/authContainer.js
 *
 * This file was generated by Sencha Architect version 2.2.2.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.2.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('Booking.view.authContainer', {
    extend: 'Ext.Container',

    config: {
        height: '100%',
        width: '100%',
        items: [
            {
                xtype: 'button',
                handler: function(button, event) {
                    console.log('Inside buttonHandler');
                    var parent = button.up();
                    parent.checkAuth();
                },
                text: 'MyButton'
            }
        ]
    },

    handleClientLoad: function() {
        console.log('Inside handleClientLoad');
        gapi.client.setApiKey(this.apiKey);
        window.setTimeout(this.checkAuth,1);
        this.checkAuth();
    },

    checkAuth: function() {
        console.log('Inside checkAuth');
        gapi.auth.authorize({client_id: this.clientId, scope: this.scopes, immediate: false}, this.handleAuthResult);
    },

    handleAuthResult: function() {
        console.log('Inside handleAuthResult');
        gapi.client.load('calendar', 'v3', function() {
            var request = gapi.client.calendar.events.list({
                'calendarId': 'primary'
            });

            request.execute(function(resp) {
                for (var i = 0; i < resp.items.length; i++) {
                    if (i === 0) {
                        console.log(resp.items[i]);
                    }
                    console.log('Response Item: ' + resp.items[i].summary);
                }
            });
        });
    },

    initialize: function() {
        this.callParent();

        var clientId = '464168127252.apps.googleusercontent.com';
        var apiKey = 'AIzaSyAy7JAsd5JlzjTR_fkkarby9N1c3YkhY6o';
        var scopes = 'https://www.googleapis.com/auth/calendar';

        this.handleClientLoad();
    }

});