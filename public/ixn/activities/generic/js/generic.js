define( function( require ) {

    'use strict';
    
    var Postmonger = require( 'postmonger' );
    var $ = require( 'vendor/jquery.min' );

    var connection = new Postmonger.Session();
    var toJbPayload = {};
    var step = 1; 
    var tokens;
    var endpoints;
    
    $(window).ready(onRender);

    connection.on('initActivity', function(payload) {
        var message;

        if (payload) {
            toJbPayload = payload;
            console.log('payload',payload);
            var aArgs = toJbPayload['arguments'].execute.inArguments;
            var oArgs = {};
            for (var i=0; i<aArgs.length; i++) {  
                for (var key in aArgs[i]) { 
                    oArgs[key] = aArgs[i][key]; 
                }
            }
            message = oArgs.message || toJbPayload['configurationArguments'].defaults.message;            
        }
        
        $.get( "/version", function( data ) {
            $('#version').html('Version: ' + data.version);
        });                

        if (!message) {
            connection.trigger('updateButton', { button: 'next', enabled: false });
        }

        gotoStep(step);
        
    });

    connection.on('requestedTokens', function(data) {
        if( data.error ) {
            console.error( data.error );
        } else {
            tokens = data;
        }        
    });

    connection.on('requestedEndpoints', function(data) {
        if( data.error ) {
            console.error( data.error );
        } else {
            endpoints = data;
        }        
    });

    connection.on('clickedNext', function() {
        step++;
        gotoStep(step);
        connection.trigger('ready');
    });

    connection.on('clickedBack', function() {
        step--;
        gotoStep(step);
        connection.trigger('ready');
    });

    function onRender() {
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');

        $('#feedMessage').change(function() {
            myFunc();
            var message = getMessage();
            connection.trigger('updateButton', { button: 'next', enabled: Boolean(message) });
        });
        
         $('#feedMessage').keyup(function() {
            myFunc();
        });

        function myFunc() {
            var input = $("#feedMessage").val();
            $("#texter").html(input);
        }

    };

    function gotoStep(step) {
        $('.step').hide();
        switch(step) {
            case 1:
                $('#step1').show();
                connection.trigger('updateButton', { button: 'next', text: 'next', enabled: Boolean(getMessage()) });
                connection.trigger('updateButton', { button: 'back', visible: false });
                break;
            case 2:
                $('#step2').show();
                $('#showMessage').html(getMessage());
                connection.trigger('updateButton', { button: 'back', visible: true });
                connection.trigger('updateButton', { button: 'next', text: 'done', visible: true });
                break;
            case 3:
                save();
                break;
        }
    };

    function getMessage() {
        return $('#feedMessage').val();
    };

    function save() {
        var value = getMessage();
        toJbPayload['arguments'].execute.inArguments.push({"feedMessage": value});
        toJbPayload.metaData.isConfigured = true;
        connection.trigger('updateActivity', toJbPayload);
    }; 
         
});
            
