Ext.define('Docket.view.portContainer', {
    extend: 'Ext.Container',
    alias: 'widget.portContainer',

    requires: [
        'Ext.draw.Component'
    ],

    config: {
        itemId: 'portContainer',
        autoDestroy: false,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        items: [{
            xtype: 'draw',
            events: [],
            itemId: 'inlinePortDraw',
            autoDestroy: false,
            listeners: [{
fn: function(element, eOpts) {
    var me = this,
        backgroundColor = me.backgroundColor,
        timelineColor = me.timelineColor,
        roomText = me.roomText,
        boxColor = me.boxColor,
        events = me.events;

    var mainCarousel = me.parent.parent,
        displace = Ext.getBody().getSize().width - 200,
        h = Ext.getBody().getSize().height,
        w = Ext.getBody().getSize().width,
        surface = me.getSurface('main'),
        today = new Date(Date.now()),
        vDisplaceSumm,
        vDisplaceDesc,
        description,
        dateTime,
        dateStart,
        dateEnd,
        summary,
        yloc = h/10,
        xloc = w/12,
        splitPoint = parseInt(((xloc*10)/330)*38+0.5);
    
    console.log(Ext.draw.TextMeasurer);
    
    mainCarousel.element.dom.style.background = backgroundColor;
    console.log("Event length: " + events.length);
    
    if ((210 * events.length) > h) {
        h = 210 * events.length;
    }
    
    me.setSize(w,h);
    surface.setSize(w,h);
    surface.setBackground(backgroundColor);
    
    setTimeout(function(){
        for (var x=0; x < document.getElementsByClassName("x-container x-draw-component x-paint-monitored x-size-monitored x-sized").length; x++) {
        
            if (document.getElementsByClassName("x-container x-draw-component x-paint-monitored x-size-monitored x-sized")[x].id == me.element.getId()) {
                document.getElementsByClassName("x-container x-draw-component x-paint-monitored x-size-monitored x-sized")[x].style.cssText = "width: 100% !important; height: " + h + "px !important;";
                console.log('style text css changed');
        }
    }
    }, 1000);
    
    //Line across screen
    addRect(timelineColor, 20, h, 10, 0, 0);

    //Name of room
    addText("#fff", "20px Arial", roomText, 35, 30);
    addText("#fff", "20px Arial", "+", displace+170, 30);
    
function addRect(fillColor,w,h,x,y,r) {
    surface.add({
        type: 'rect',
        fill: fillColor,
        width: w,
        height : h,
        x: x,
        y: y,
        radius: r
    }).show(true);
}

function addText(fillColor,font,text,x,y) {
    surface.add({
        type: 'text',
        text: text,
        font: font,
        fill: fillColor,
        x: x,
        y: y
    }).show(true);
}
    
function addCircle(fillColor,r,x,y) {
    surface.add({
        type: 'circle',
        cx: x,
        cy: y,
        r: r,
        fillStyle: fillColor
    }).show(true);
}
    
function addTriangle(fillColor,x,y,orientation) {
    if (orientation) {
        surface.add({
            type: 'path',
            path: 'M ' + x + ' ' + y + ' ' +
                'l ' + 25 + ' ' + 0 + ' ' +
                'l ' + -12 + ' ' + 10 + 'z',
            fillStyle: fillColor
        }).show(true);
    } else {
        surface.add({
            type: 'path',
            path: 'M ' + x + ' ' + y + ' ' +
                'l ' + -25 + ' ' + 0 + ' ' +
                'l ' + 12 + ' ' + -10 + 'z',
            fillStyle: fillColor
        }).show(true);
    }
}
    
function processDate(dateDate) {
    dateDate = Date.parse(dateDate);
    dateDate = new Date(dateDate);

    dateDate = dateDate.toTimeString().substring(0,5);
    if (parseInt(dateDate.substring(0,2),10) >= 12) {
        if (dateDate.substring(0,2) == '12') {
            dateDate = dateDate + ' pm';
        } else if ((parseInt(dateDate.substring(0,2),10)-12) < 10) {
            dateDate = '0' + (parseInt(dateDate.substring(0,2),10)-12) + dateDate.substring(2) + ' pm';
        } else {
            dateDate = (parseInt(dateDate.substring(0,2),10)-12) + dateDate.substring(2) + ' pm';
        }
    } else {
        if (dateDate.substring(0,1) == '0') {
            dateDate = '12' + dateDate.substring(2) + ' am';
        } else if (parseInt(dateDate.substring(0,2),10) < 10) {
            dateDate = '0' + dateDate + ' am';
        } else {
            dateDate = dateDate + ' am';
        }
    }

    return dateDate;
}
    
function processSummary(summary) {
    try {
        var noSpaces = true;
        summary = summary.replace(/\s+/g,' ');
        if (summary.length > (splitPoint*(3/4))) {
            for (var a = (splitPoint*(3/4)); a > 0; a--) {
                if (summary.substring(a, a+1) == ' ') {
                    summary = summary.substring(0,a) + '\n' + summary.substring(a+1);
                    vDisplaceSumm = 20;
                    a = 0;
                    noSpaces = false;
                }
            }
            if (summary.length > (splitPoint*(3/2))) {
                summary = summary.substring(0,(splitPoint*(3/2))) + '...';
            }
            
            if (noSpaces) {
                summary = summary.substring(0,(splitPoint*(3/4))) + '\n' + 
                    summary.substring((splitPoint*(3/4)),(splitPoint*(3/2)));
                vDisplaceSumm = 20;
            }
        } else {
            vDisplaceSumm = 0;
        }
    } catch(e) {
        console.log(e);
        summary = '';
    }
    
    return summary;
}
    
function processDescription(description) {
    try {
        vDisplaceDesc = 0;
        description = description.replace(/\s+/g,' ')
        description = description.replace(/(\r\n|\n|\r)/g,' ');
        var noSpaces = true;
        console.log(splitPoint);
        
        if (description.length > splitPoint) {
            if (description.length > (splitPoint*3)) {
                description = description.substring(0,(splitPoint*3-3)) + '...';
            }
            
            if (description.length > (splitPoint*2)) {
                 for (var a = (splitPoint*2); a > 0; a--) {
                    if (description.substring(a, a+1) == ' ') {
                        description = description.substring(0,a) + '\n' + description.substring(a+1);
                        noSpaces = false;
                        a = 0;
                        vDisplaceDesc = vDisplaceDesc + 5;
                    }
                }
            }
            
            for (var a = splitPoint; a > 0; a--) {
                if (description.substring(a, a+1) == ' ') {
                    description = description.substring(0,a) + '\n' + description.substring(a+1);
                    noSpaces = false;
                    a = 0;
                    vDisplaceDesc = vDisplaceDesc + 5;
                }
            }
            
            if (noSpaces) {
                description = description.substring(0,splitPoint) + '\n' + description.substring(splitPoint,(splitPoint*2));
                vDisplaceDesc = vDisplaceDesc + 5;
            }
        }
    } catch(e) {
        console.log(e);
        description = false;
    }
    
    return description;
}
    
function portraitRender(summary,description,dateStart,dateEnd,dateTime,xloc,yloc,i){
    //Point on timeline
    addCircle(boxColor,16,20,yloc+170);

    addRect(boxColor,(xloc*10),160,(xloc*1.5),yloc+90,3);
    addText("#fff", "22px Arial", summary, (xloc*1.6), yloc+115+vDisplaceSumm);

    if (description !== false) {
        addText("#fff", "16px Arial", description, (xloc*1.6),
            yloc+170+vDisplaceDesc+vDisplaceSumm);
    }

    //Time text
    addText("#fff", "14px Arial", dateStart + ' - ' + dateEnd, xloc+123, yloc+240);

    //Date text
    addText("#fff", "14px Arial", dateTime, xloc+160, yloc+360);
}


for (var iter = 0; iter < events.length; iter++) {
    
    vDisplaceDesc = 0;
    summary = processSummary(events[iter].summary);
    console.log(description);
    description = processDescription(events[iter].description);

    dateTime = events[iter].start.dateTime;

    if (typeof dateTime === 'undefined') {
        dateTime = events[iter].start.date;
        dateStart = "12:00am";
        dateEnd = "11:59pm";
    } else {
        dateStart = processDate(events[iter].start.dateTime);
        dateEnd = processDate(events[iter].end.dateTime);
    }
    
    date = new Date(Date.parse(dateTime));

    if ((date.getDate() == today.getDate()) && (date.getMonth() == today.getMonth())) {
        dateTime = processDate(dateTime);
    } else {
        dateTime = date.toDateString().substring(0,10);
    }
    
    yloc = iter*200;
    portraitRender(summary, description, dateStart, dateEnd, dateTime, xloc, yloc, iter);
}
},
event: 'painted'},
{
    fn: function(element, eOpts) {
        //Replace with real resize code
    },
    event: 'resize'
}]
        }]
    },

    initialize: function() {
        var me = this;
        me.callParent();

        console.log(me);
        me.element.on({
            tap: me.onTap
        });

        window.setInterval(function() {me.reloadData();},900000);
    },

    onTap: function(e) {
        if (e.pageY <= 80) {
            if (e.pageX >= (Ext.getBody().getSize().width/3)) {
                var form = new Docket.view.MyFormPanel();
                Ext.Viewport.add(form);
            }
        }
    },

    reloadData: function() {
var me = this,
    today = new Date(),
    mainCarousel,
    calendarId = me.calendarId,
    child;

var token = Docket.app.authToken,
    clientId = '464168127252.apps.googleusercontent.com',
    apiKey = 'AIzaSyAy7JAsd5JlzjTR_fkkarby9N1c3YkhY6o',
    scopes = 'https://www.googleapis.com/auth/calendar';

today.setHours(0,0,0,0);
today = today.toISOString();

gapi.client.setApiKey(apiKey);
gapi.auth.setToken(token);

gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true},
function(authResult) {
    if (authResult) {
        gapi.client.load('calendar', 'v3', function() {
            var request = gapi.client.calendar.events.list({
                'calendarId': calendarId,
                'singleEvents': true,
                'orderBy': 'startTime',
                'timeMin': today,
                'maxResults': 50
            });

            request.execute(function(resp) {
                child = me.query('#inlinePortDraw')[0];
                child.events = resp.items;
                child.fireEvent('painted',child);
            });
        });
    } else {
        window.location.reload();
    }
});

    }
});