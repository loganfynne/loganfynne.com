/*
 * File: app/controller/controllerData.js
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

Ext.define('Booking.controller.controllerData', {
    extend: 'Ext.app.Controller',
    alias: 'controller.controllerData',

    config: {
    },

    calendarRest: function() {
        var userID = 1;
        var parameters = "parameters";
        var example = "http://www.google.com/calendar/feeds/georgiakeyclub.com_r5agsfj79q4a2rv6viii536odk%40group.calendar.google.com/public/basic";

        var url = "https://www.googleapis.com/calendar/v3/" + "/users/" + userID + "/lists?" + parameters;

        var response = UrlFetchApp.fetch(url);

    }

});