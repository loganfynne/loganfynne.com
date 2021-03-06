Ext.define('Docket.view.landContainer', {
    extend: 'Ext.Container',
    alias: 'widget.landContainer',

    requires: [
        'Ext.draw.Component'
    ],

    config: {
        itemId: 'landContainer',
        autoDestroy: false,
        scrollable: {
            direction: 'horizontal',
            directionLock: true
        },
        items: [{
            xtype: 'draw',
            events: [],
            itemId: 'inlineLandDraw',
            autoDestroy: false,
            listeners: [{

fn: function(element, eOpts) {
    var me = this,
        backgroundColor = me.backgroundColor,
        timelineColor = me.timelineColor,
        roomText = me.roomText,
        boxColor = me.boxColor,
        dotColor = me.dotColor,
        events = me.events;
    
    console.log(me.parent);

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
        landscape = true,
        yloc = h/10,
        xloc;
    
    mainCarousel.element.dom.style.background = backgroundColor;

    if (211 * events.length > w) {
        w = 211 * events.length;
    }

    me.setSize(w,h);
    surface.setSize(w,h);
    surface.setBackground(backgroundColor);
    
    //Name of room
    addText("#fff", "36px Arial", roomText, 35, 70);
    addText("#fff", "36px Arial", "+add", displace, 70);

    //Line across screen
    addRect(timelineColor, w, 20, 0, yloc+330, 0);

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
        if (summary.length > 25) {
            for (var a = 25; a > 0; a--) {
                if (summary.substring(a, a+1) == ' ') {
                    summary = summary.substring(0,a) + '\n' + summary.substring(a+1);
                    vDisplaceSumm = 20;
                    a = 0;
                    noSpaces = false;
                }
            }
            if (summary.length > 50) {
                summary = summary.substring(0,50) + '...';
            }
            
            if (noSpaces) {
                summary = summary.substring(0,25) + '\n' + summary.substring(25,50);
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
        if (description.length > 38) {
            if (description.length > 114) {
                description = description.substring(0,114) + '...';
            }
            
            if (description.length > 76) {
                 for (var a = 76; a > 0; a--) {
                    if (description.substring(a, a+1) == ' ') {
                        description = description.substring(0,a) + '\n' + description.substring(a+1);
                        noSpaces = false;
                        a = 0;
                        vDisplaceDesc = vDisplaceDesc + 5;
                    }
                }
            }
            
            for (var a = 38; a > 0; a--) {
                if (description.substring(a, a+1) == ' ') {
                    description = description.substring(0,a) + '\n' + description.substring(a+1);
                    noSpaces = false;
                    a = 0;
                    vDisplaceDesc = vDisplaceDesc + 5;
                }
            }
            
            if (noSpaces) {
                description = description.substring(0,38) + '\n' + description.substring(38,76);
                vDisplaceDesc = vDisplaceDesc + 5;
            }
        }
    } catch(e) {
        console.log(e);
        description = false;
    }
    
    return description;
}
    
function landscapeRender(summary,description,dateStart,dateEnd,dateTime,xloc,yloc,i){

    //Smaller Point on timeline
    addCircle(boxColor,16,xloc+205,yloc+339);

    if (i % 2 === 0) {
        addRect(boxColor,330,160,xloc+38,yloc+110,3);
        addText("#fff", "22px Arial", summary, xloc+43, yloc+135+vDisplaceSumm);

        addTriangle(boxColor, xloc+193, yloc+269, true);

        if (description !== false) {
            addText("#fff", "15px Arial", description, xloc+43,
                yloc+190+vDisplaceDesc+vDisplaceSumm);
        }

        //Time text
        addText("#fff", "14px Arial", dateStart + ' - ' + dateEnd, xloc+138, yloc+260);

        //Date text
        addText("#fff", "14px Arial", dateTime, xloc+175, yloc+380);

    } else {

        addRect(boxColor, 330,160, xloc+38, yloc+410, 3);

        addTriangle(boxColor,xloc+218,yloc+411, false);

        addText("#fff", "22px Arial", summary, xloc+43, yloc+435+vDisplaceSumm);

        if (description !== false) {
            addText("#fff", "15px Arial", description, xloc+43,
                yloc+485+vDisplaceSumm+vDisplaceDesc);
        }

        //Time text
        addText("#fff", "14px Arial", dateStart + " - " + dateEnd, xloc+138, yloc+560);

        //Date text
        addText("#fff", "14px Arial", dateTime, xloc+175, yloc+308);
    }
}


for (var iter = 0; iter < events.length; iter++) {
    
    vDisplaceDesc = 0;
    summary = processSummary(events[iter].summary);
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
    
    xloc = iter*200;
    landscapeRender(summary, description, dateStart, dateEnd, dateTime, xloc, yloc, iter);
}
},
event: 'painted'},
{
    fn: function(element, eOpts) {
        this.setSize(null, Ext.getBody().getSize().height);
        this.getSurface('main').setSize(null, Ext.getBody().getSize().height);
    },
    event: 'resize'
}]
        }]
    },

    initialize: function() {
        var me = this;
        me.callParent();

        me.element.on({
            tap: me.onTap
        });

        window.setInterval(function() {me.reloadData();},900000);
    },

    onTap: function(e) {
        if (e.pageY <= 70) {
            if (e.pageX >= Ext.getBody().getSize().width-200) {
                var form = new Docket.view.formPanel();
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
                child = me.query('#inlineLandDraw')[0];
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