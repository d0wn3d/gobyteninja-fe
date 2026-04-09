/*
 This file is part of GoByte Ninja.
 https://github.com/gobytecoin/gobyteninja-fe


 GoByte Ninja is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 GoByte Ninja is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with GoByte Ninja.  If not, see <http://www.gnu.org/licenses/>.

 */

// GoByte Ninja Front-End (gobyteninja-fe) - Masternode List Classic (v2)
// forked from dashninja-fe By elberethzone / https://dashtalk.org/members/elbereth.175/

var gobyteninjaversion = '1.0.1';
var tableLocalNodes = null;
var tableBlockConsensus = null;
var tableMNList = null;
var chartMNVersions = null;
var gobyteversiondefault = "0.16.2.2";
var gobyteversion = gobyteversiondefault;
var gobyteversioncheck = gobyteversion;
var gobyteversionsemaphore = false;
var sentinelversiondefault = "1.6.0";
var sentinelversion = sentinelversiondefault;
var gobytemaxprotocol = 70211;

$.fn.dataTable.ext.errMode = 'throw';

if(typeof(Storage) !== "undefined") {
    if (sessionStorage.getItem("nextgobyteversion") !== null) {
        sessionStorage.removeItem("nextgobyteversion");
    }
}

var gobyteninjatestnet = 0;

if (typeof gobyteninjatestnethost !== 'undefined') {
    if (window.location.hostname == gobyteninjatestnethost) {
        gobyteninjatestnet = 1;
    }
}
if (typeof gobyteninjatestnettor !== 'undefined') {
    if (window.location.hostname == gobyteninjatestnettor) {
        gobyteninjatestnet = 1;
    }
}
if (typeof gobyteninjatestneti2p !== 'undefined') {
    if (window.location.hostname == gobyteninjatestneti2p) {
        gobyteninjatestnet = 1;
    }
}

if (typeof gobyteninjamndetail === 'undefined') {
    var gobyteninjamndetail = [[],[]];
}
if (typeof gobyteninjamndetail[0] === 'undefined') {
    gobyteninjamndetail[0] = [];
}
if (typeof gobyteninjamndetail[1] === 'undefined') {
    gobyteninjamndetail[1] = [];
}

if (typeof gobyteninjamndetailvin === 'undefined') {
    var gobyteninjamndetailvin = [[],[]];
}
if (typeof gobyteninjamndetailvin[0] === 'undefined') {
    gobyteninjamndetailvin[0] = [];
}
if (typeof gobyteninjamndetailvin[1] === 'undefined') {
    gobyteninjamndetailvin[1] = [];
}

if (typeof gobyteninjaaddressexplorer === 'undefined') {
    var gobyteninjaaddressexplorer = [[],[]];
}
if (typeof gobyteninjaaddressexplorer[0] === 'undefined') {
    gobyteninjaaddressexplorer[0] = [];
}
if (typeof gobyteninjaaddressexplorer[1] === 'undefined') {
    gobyteninjaaddressexplorer[1] = [];
}

if (typeof gobyteninjaqueryexplorer === 'undefined') {
    var gobyteninjaqueryexplorer = [[],[]];
}
if (typeof gobyteninjaqueryexplorer[0] === 'undefined') {
    gobyteninjaqueryexplorer[0] = [];
}
if (typeof gobyteninjaqueryexplorer[1] === 'undefined') {
    gobyteninjaqueryexplorer[1] = [];
}

if (typeof gobyteninjatxexplorer === 'undefined') {
    var gobyteninjatxexplorer = [[],[]];
}
if (typeof gobyteninjatxexplorer[0] === 'undefined') {
    gobyteninjatxexplorer[0] = [];
}
if (typeof gobyteninjatxexplorer[1] === 'undefined') {
    gobyteninjatxexplorer[1] = [];
}

function tableLocalNodesRefresh(){
    tableLocalNodes.api().ajax.reload();
    // Set it to refresh in 60sec
    setTimeout(tableLocalNodesRefresh, 60000);
};

function tableBlockConsensusRefresh(){
    tableBlockConsensus.api().ajax.reload();
    // Set it to refresh in 60sec
    setTimeout(tableLocalNodesRefresh, 150000);
};

function tableMNListRefresh(){
    tableMNList.api().ajax.reload();
    // Set it to refresh in 60sec
    setTimeout(tableMNListRefresh, 300000);
};

function mnpaymentsRefresh(){
    $.getJSON( "/api/masternodes/stats?testnet="+gobyteninjatestnet, function( data ) {
        var date = new Date();
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        $('#mnpaymentsLR').text( n + ' ' + time );
        $('#mnpayments').text( Math.round(data.data.MasternodeStatsTotal.MasternodeExpectedPayment*10000)/10000 );
        $('#mnpaymentsratio').text( (Math.round(data.data.MasternodeStatsTotal.RatioPayed*10000)/100)+ '%' );
        setTimeout(mnpaymentsRefresh, 300000);
    });
};

function displaygobyteVersion(gobyteversion,sentinelversion) {
    if (gobyteversion != "?") {
        $('#msgalert').show();
    }
    else {
        $('#msgalert').hide();
    }
    $('#currentgobyteversion').text( gobyteversion );
    $('#currentsentinelversion').text( sentinelversion );
}

function getLatestgobyteVersion() {
    var currentdate = new Date();
    gobyteversion = sessionStorage.getItem("currentgobyteversion");
    sentinelversion = sessionStorage.getItem("currentsentinelversion");
    var nextdate = sessionStorage.getItem("nextgobyteversion");
    if ((( gobyteversion === null ) || (sentinelversion === null)
            || ( sessionStorage.getItem("nextgobyteversion") === null )
            || ( sessionStorage.getItem("nextgobyteversion") < currentdate.getTime() )) && (gobyteversionsemaphore == false)) {
        gobyteversionsemaphore = true;
        $.getJSON( "/gobyteninja-latestversion.json?nocache="+ (new Date()).getTime(), function( data ) {
            sessionStorage.setItem('currentgobyteversion', data.version.string);
            sessionStorage.setItem('currentsentinelversion', data.sentinelversion.string);
            var currentdate = new Date();
            currentdate = new Date(currentdate.getTime() + 15*60000);
            sessionStorage.setItem('nextgobyteversion', currentdate.getTime());
            gobyteversionsemaphore = false;
            displaygobyteVersion(data.version.string,data.sentinelversion.string);
        });
        gobyteversion = gobyteversiondefault;
        sentinelversion = sentinelversiondefault;
    }
    else {
        if (gobyteversion === null) {
            gobyteversion = gobyteversiondefault;
        }
        if (sentinelversion === null) {
            sentinelversion = sentinelversiondefault;
        }
        displaygobyteVersion(gobyteversion,sentinelversion);
    }
    if ((gobyteversion.length > 2) && (gobyteversion.substr(gobyteversion.length - 2) == ".0")) {
        gobyteversioncheck = gobyteversion.substr(0,gobyteversion.length-2);
    }
    else {
        gobyteversioncheck = gobyteversion;
    }
    return gobyteversioncheck;
};

function getVoteLimit() {
    $.getJSON("/data/votelimit-" + gobyteninjatestnet+".json", function (data) {
        var cls = "panel-red";
        if (data.data.votelimit.nextvote.BlockTime == 0) {
            var datevotelimit = new Date(data.data.votelimit.nextsuperblock.BlockTime * 1000);
            $('#nextvotelimithr').text( "Too late! Superblock on "+datevotelimit.toLocaleString());
        }
        else {
            $('#nextvotelimithr').text(deltaTimeStampHRlong(data.data.votelimit.nextvote.BlockTime, currenttimestamp()));
            if ((data.data.votelimit.nextvote.BlockTime - currenttimestamp()) <= 86400) {
                cls = "panel-yellow";
            }
            else {
                cls = "panel-green";
            }
        }
        $('#nextvotepanel').removeClass("panel-green").removeClass("panel-red").removeClass("panel-yellow").addClass(cls);
    });
};


$(document).ready(function() {

    $('#gobyteninjajsversion').text(gobyteninjaversion).addClass("label-info").removeClass("label-danger");

    if (gobyteninjatestnet == 1) {
        $('#testnetalert').show();
        $('a[name=menuitemexplorer]').attr("href", "https://" + gobyteninjatestnetexplorer);
        if (typeof gobyteninjatestnettor !== 'undefined') {
            $('a[name=gobyteninjatorurl]').attr("href", "http://"+gobyteninjatestnettor+"/masternodes-classic.html");
            $('span[name=gobyteninjatordisplay]').show();
        }

        if (typeof gobyteninjatestneti2p !== 'undefined') {
            $('a[name=gobyteninjai2purl]').attr("href", "http://" + gobyteninjatestneti2p + "/masternodes-classic.html");
            $('span[name=gobyteninjai2pdisplay]').show();
        }
    }
    else {
        if (typeof gobyteninjator !== 'undefined') {
            $('a[name=gobyteninjatorurl]').attr("href", "http://"+gobyteninjator+"/masternodes-classic.html");
            $('span[name=gobyteninjatordisplay]').show();
        }

        if (typeof gobyteninjai2p !== 'undefined') {
            $('a[name=gobyteninjai2purl]').attr("href", "http://" + gobyteninjai2p + "/masternodes-classic.html");
            $('span[name=gobyteninjai2pdisplay]').show();
        }
    }

    getLatestgobyteVersion();
    getVoteLimit();

    var pkutxt = '<ul>';
    var ix = 0;
    for (var i = 0, ien = gobyteninjamndetail[gobyteninjatestnet].length; i < ien; i++) {
        if (ix == 0) {
            pkutxt += '<li>[Link]';
        } else {
            pkutxt += '<li>[' + ix + ']';
        }
        pkutxt += ' ' + gobyteninjamndetail[gobyteninjatestnet][i][1] + "</li>";
        ix++;
    }
    for (var i = 0, ien = gobyteninjaaddressexplorer[gobyteninjatestnet].length; i < ien; i++) {
        if (ix == 0) {
            pkutxt += '<li>[Link]';
        } else {
            pkutxt += '<li>[' + ix + ']';
        }
        pkutxt += ' ' + gobyteninjaaddressexplorer[gobyteninjatestnet][i][1] + "</li>";
        ix++;
    }
    pkutxt += '</ul>';
    $("#pubkeyurllist").html(pkutxt);

    $('#localnodes').on('xhr.dt', function (e, settings, json) {
        var date = new Date(json.data.cache.time*1000);
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        $('#localnodesLR').text(n + ' ' + time);
        $('#localnodes').DataTable().column(1).search('^(?:(?!Disabled).)*$', true, false).draw();
        $('#localnodesLRHR').text( deltaTimeStampHRlong(json.data.cache.time, currenttimestamp())+" ago");
    });
    tableLocalNodes = $('#localnodes').dataTable({
        responsive: true,
        searching: false,
        dom: "Tfrtp",
        ajax: { url: "/data/nodesstatus-"+gobyteninjatestnet+".json",
            dataSrc: 'data.nodes',
            cache: true },
        "paging": false,
        columns: [
            {data: "NodeName"},
            {
                data: null, render: function (data, type, row) {
                if (data.NodeEnabled == 0) {
                    return '<img src="/static/status/daemon-disabled.png" width=16 height=16 /> Disabled';
                }
                else {
                    var iconurl = '<img src="/static/status/daemon-' + data.NodeProcessStatus + '.png" width=16 height=16 /> ';
                    if (data.NodeProcessStatus == 'running') {
                        return iconurl + 'Running';
                    } else if (data.NodeProcessStatus == 'stopped') {
                        return iconurl + 'Stopped';
                    } else if (data.NodeProcessStatus == 'notresponding') {
                        return iconurl + 'Not Responding';
                    } else {
                        return data.NodeProcessStatus;
                    }
                }
            }
            },
            {
                data: null, render: function (data, type, row) {
                var outtxt = '';
                if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                    outtxt = data.NodeVersion;
                }
                return outtxt;
            }
            },
            {
                data: null, render: function (data, type, row) {
                var outtxt = '';
                if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                    outtxt = data.NodeProtocol;
                }
                return outtxt;
            }
            },
            {
                data: null, render: function (data, type, row) {
                var outtxt = '';
                if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                    outtxt = data.NodeBlocks;
                }
                return outtxt;
            }
            },
            {
                data: null, render: function (data, type, row) {
                var outtxt = '';
                if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                    if (type != 'sort') {
                        if (gobyteninjablockexplorer[gobyteninjatestnet].length > 0) {
                            outtxt += '<a href="' + gobyteninjablockexplorer[gobyteninjatestnet][0][0].replace('%%b%%', data.NodeLastBlockHash) + '">' + data.NodeLastBlockHash + '</a>';
                            for (var i = 1, ien = gobyteninjablockexplorer[gobyteninjatestnet].length; i < ien; i++) {
                                outtxt += '<a href="' + gobyteninjablockexplorer[gobyteninjatestnet][i][0].replace('%%b%%', data.NodeLastBlockHash) + '">[' + i + ']</a>';
                            }
                        }
                    }
                    else {
                        outtxt = data.NodeLastBlockHash;
                    }
                }
                return outtxt;
            }
            },
            {
                data: null, render: function (data, type, row) {
                var outtxt = '';
                if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                    outtxt = data.NodeConnections;
                }
                return outtxt;
            }
            }
        ]
    });
    setTimeout(tableLocalNodesRefresh, 60000);

    $('#blockconsensus').on('xhr.dt', function (e, settings, json) {
        var date = new Date(json.data.cache.time*1000);
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        $('#blockconsensusLR').text(n + ' ' + time);
        $('#blockconsensusLRHR').text( deltaTimeStampHRlong(json.data.cache.time, currenttimestamp())+" ago");
    });
    tableBlockConsensus = $('#blockconsensus').dataTable({
        dom: "Trtp",
        responsive: true,
        searching: false,
        ajax: { url: "/data/blocksconsensus-"+gobyteninjatestnet+".json",
            dataSrc: 'data.blocksconsensus',
            cache: true },
        "paging": false,
        "order": [[0, "desc"]],
        columns: [
            {data: "BlockID"},
            {
                data: null, render: function (data, type, row) {
                return (Math.round(data.Consensus * 10000) / 100) + '%';
            }
            },
            {
                data: null, render: function (data, type, row) {
                if (data.ConsensusPubKey == '') {
                    return "<i>None</i>";
                } else {
                    return data.ConsensusPubKey;
                }
            }
            },
            {
                data: null, render: function (data, type, row) {
                var str = '<ul>';
                var sstr = '';
                for (var col in data.Others) {
                    str += '<li>';
                    if (data.Others[col].Payee == '') {
                        str += '<i>None</i>';
                    } else {
                        str += data.Others[col].Payee;
                    }
                    str += ' (' + (Math.round(data.Others[col].RatioVotes * 10000) / 100) + '% - Nodes: ';
                    sstr = '';
                    for (var uname in data.Others[col].NodeNames) {
                        if (sstr != '') {
                            sstr += ' ';
                        }
                        sstr += data.Others[col].NodeNames[uname];
                    }
                    str += sstr + ')</li>'
                }
                ;
                return str + '</ul>';
            }
            }
        ],
        "createdRow": function (row, data, index) {
            if (data.Consensus == 1) {
                $('td', row).eq(1).removeClass("danger").removeClass("success").addClass("success");
            } else {
                $('td', row).eq(1).removeClass("danger").removeClass("success").addClass("danger");
            }
        }
    });
    setTimeout(tableBlockConsensusRefresh, 150000);

    chartMNVersions = $('#mnversions').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,//null,
            plotShadow: false
        },
        title: {
            text: ''
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Masternode version',
            data: [['Unknown', 100]]
        }]
    });

    $('#mnregexp').on('keyup click', function () {
        $('#mnlist').DataTable().search($('#mnregexp').val(), true, false).draw();
    });

    $('#mnregexp').val(getParameter("mnregexp"));

    $('#mnlist').on('xhr.dt', function ( e, settings, json ) {
        var date = new Date(json.data.cache.time*1000);
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        var activeCount = 0;
        var uniqueIPs = [];
        $('#mnlistLR').text( n + ' ' + time);
        $('#mnlistLRHR').text( deltaTimeStampHRlong(json.data.cache.time, currenttimestamp())+" ago");
        var versioninfo = 'Unknown';
        var dataVersionCount = [];
        var mnregexp = $('#mnregexp').val();
        for ( var i=0, ien=json.data.masternodes.length ; i<ien ; i++ ) {
            if (parseInt(json.data.masternodes[i].MasternodeProtocol) > gobytemaxprotocol) {
                gobytemaxprotocol = parseInt(json.data.masternodes[i].MasternodeProtocol);
            }
            if (json.data.masternodes[i].ActiveCount > 0) {
                activeCount++;
            }
            if (uniqueIPs.indexOf(json.data.masternodes[i].MasternodeIP+":"+json.data.masternodes[i].MasternodePort) == -1) {
                uniqueIPs.push( json.data.masternodes[i].MasternodeIP+":"+json.data.masternodes[i].MasternodePort );
            }
            if ((json.data.masternodes[i].Portcheck != false) && json.data.masternodes[i].Portcheck.hasOwnProperty("SubVer")) {
                if ((json.data.masternodes[i].Portcheck.SubVer.length > 10) && (json.data.masternodes[i].Portcheck.SubVer.substring(0,9) == '/GoByte Core:') && (json.data.masternodes[i].Portcheck.SubVer.substring(json.data.masternodes[i].Portcheck.SubVer.length-1) == '/')) {
                    versioninfo = json.data.masternodes[i].Portcheck.SubVer.substring(9,json.data.masternodes[i].Portcheck.SubVer.indexOf('/',10));
                }
                else if ((json.data.masternodes[i].Portcheck.SubVer.length > 7) && (json.data.masternodes[i].Portcheck.SubVer.substring(0,6) == '/GoByte Core:') && (json.data.masternodes[i].Portcheck.SubVer.substring(json.data.masternodes[i].Portcheck.SubVer.length-1) == '/')) {
                    versioninfo = json.data.masternodes[i].Portcheck.SubVer.substring(6,json.data.masternodes[i].Portcheck.SubVer.indexOf('/',6));
                }
                else if ((json.data.masternodes[i].Portcheck.SubVer.length > 13) && (json.data.masternodes[i].Portcheck.SubVer.substring(0,13) == '/GoByte Core:') && (json.data.masternodes[i].Portcheck.SubVer.substring(json.data.masternodes[i].Portcheck.SubVer.length-1) == '/')) {
                    versioninfo = json.data.masternodes[i].Portcheck.SubVer.substring(13,json.data.masternodes[i].Portcheck.SubVer.indexOf('/',13));
                }
                else {
                    versioninfo = "Unknown";
                }
            }
            else {
                versioninfo = "Unknown";
            }
            versioninfo = versioninfo+" ("+json.data.masternodes[i].MasternodeProtocol+")";
            if (dataVersionCount.hasOwnProperty(versioninfo)) {
                dataVersionCount[versioninfo]++;
            }
            else {
                dataVersionCount[versioninfo] = 1;
            }
        }

        var dataSet = [];
        for (version in dataVersionCount) {
            if (dataVersionCount.hasOwnProperty(version)) {
                dataSet.push( [version, Math.round((dataVersionCount[version]/json.data.masternodes.length)*10000)/100] );
            }
        }
        chartMNVersions = $('#mnversions').highcharts();
        chartMNVersions.series[0].setData(dataSet,true);

        var inactiveCount = json.data.masternodes.length - activeCount;

        $('#mnactive').text( activeCount );
        $('#mninactive').text( inactiveCount );
        $('#mntotal').text( json.data.masternodes.length );
        $('#uniquemnips').text( uniqueIPs.length );

        if (mnregexp != "") {
            $('#mnlist').DataTable().search(mnregexp, true, false).draw();
        }
    } );
    tableMNList = $('#mnlist').dataTable( {
        ajax: { url: "/data/masternodeslistfull-"+gobyteninjatestnet+".json",
                dataSrc: 'data.masternodes',
            cache: true },
        lengthMenu: [ [50, 100, 250, 500, -1], [50, 100, 250, 500, "All"] ],
        processing: true,
        pageLength: 50,
        columns: [
            { data: null, render: function ( data, type, row ) {
                var outtxt = '';
                if (type != 'sort') {
                    if ((gobyteninjamndetailvin[gobyteninjatestnet].length > 0) || (gobyteninjatxexplorer[gobyteninjatestnet].length > 0)) {
                        var ix = 0;
                        for ( var i=0, ien=gobyteninjamndetailvin[gobyteninjatestnet].length ; i<ien ; i++ ) {
                            if (ix == 0) {
                                outtxt += '<a href="'+gobyteninjamndetailvin[gobyteninjatestnet][0][0].replace('%%a%%',data.MasternodeOutputHash+'-'+data.MasternodeOutputIndex)+'" data-toggle="tooltip" data-placement="left" title="'+data.MasternodeOutputHash+'-'+data.MasternodeOutputIndex+'">'+data.MasternodeOutputHash+'-'+data.MasternodeOutputIndex+'</a>';
                            }
                            else {
                                outtxt += '<a href="'+gobyteninjamndetailvin[gobyteninjatestnet][i][0].replace('%%a%%',data.MasternodeOutputHash+'-'+data.MasternodeOutputIndex)+'">['+ix+']</a>';
                            }
                            ix++;
                        }
                        for ( var i=0, ien=gobyteninjatxexplorer[gobyteninjatestnet].length ; i<ien ; i++ ) {
                            if (ix == 0) {
                                outtxt += '<a href="'+gobyteninjatxexplorer[gobyteninjatestnet][0][0].replace('%%a%%',data.MasternodeOutputHash)+'" data-toggle="tooltip" data-placement="left" title="'+data.MasternodeOutputHash+'-'+data.MasternodeOutputIndex+'">'+data.MasternodeOutputHash+'-'+data.MasternodeOutputIndex+'</a>';
                            }
                            else {
                                outtxt += '<a href="'+gobyteninjatxexplorer[gobyteninjatestnet][i][0].replace('%%a%%',data.MasternodeOutputHash)+'">['+ix+']</a>';
                            }
                            ix++;
                        }
                    }
                    else {
                        outtxt = data.MasternodeOutputHash+'-'+data.MasternodeOutputIndex;
                    }
                }
                else {
                    outtxt = data.MasternodeOutputHash+'-'+data.MasternodeOutputIndex;
                }
                return outtxt;
            } },
            { data: null, render: function ( data, type, row) {
                var outtxt = '';
                if (type != 'sort') {
                    if ((gobyteninjamndetail[gobyteninjatestnet].length > 0) || (gobyteninjaaddressexplorer[gobyteninjatestnet].length > 0)) {
                        var ix = 0;
                        for ( var i=0, ien=gobyteninjamndetail[gobyteninjatestnet].length ; i<ien ; i++ ) {
                            if (ix == 0) {
                                outtxt += '<a href="'+gobyteninjamndetail[gobyteninjatestnet][0][0].replace('%%a%%',data.MasternodePubkey)+'">'+data.MasternodePubkey+'</a>';
                            }
                            else {
                                outtxt += '<a href="'+gobyteninjamndetail[gobyteninjatestnet][i][0].replace('%%a%%',data.MasternodePubkey)+'">['+ix+']</a>';
                            }
                            ix++;
                        }
                        for ( var i=0, ien=gobyteninjaaddressexplorer[gobyteninjatestnet].length ; i<ien ; i++ ) {
                            if (ix == 0) {
                                outtxt += '<a href="'+gobyteninjaaddressexplorer[gobyteninjatestnet][0][0].replace('%%a%%',data.MasternodePubkey)+'">'+data.MasternodePubkey+'</a>';
                            }
                            else {
                                outtxt += '<a href="'+gobyteninjaaddressexplorer[gobyteninjatestnet][i][0].replace('%%a%%',data.MasternodePubkey)+'">['+ix+']</a>';
                            }
                            ix++;
                        }
                    }
                    else {
                        outtxt = data.MasternodePubkey;
                    }
                }
                else {
                    outtxt = data.MasternodePubkey;
                }
                return outtxt;
            } },
            { data: null, render: function ( data, type, row ) {
                var mnip = "";
                if ( data.MasternodeIP == "::" ) {
                    mnip = data.MasternodeTor+".onion";
                }
                else {
                    mnip = data.MasternodeIP;
                }
                return mnip+':'+data.MasternodePort;
            } },
            { data: null, render: function ( data, type, row) {
                    var activecount = parseInt(data.ActiveCount);
                    var inactivecount = parseInt(data.InactiveCount);
                    var unlistedcount = parseInt(data.UnlistedCount);
                    var total = activecount+inactivecount+unlistedcount;
                    var ratio = activecount / total;
                    var result = ratio;
                    if (type == 'sort') {
                        result =  ratio;
                    } else {
                        if ( ratio == 1 ) {
                            result = 'Active';
                        } else if ( ratio == 0 ) {
                            result = 'Inactive';
                        } else if ( unlistedcount > 0 ) {
                            result = 'Partially Unlisted';
                        } else {
                            result = 'Partially Inactive';
                        }
                        result += ' ('+Math.round(ratio*100)+'%)';
                    }
                    return result;
                } },
            { data: null, render: function ( data, type, row ) {
                var txt = "";
                if (data.Portcheck != false) {
                    txt = data.Portcheck.Result;
                    if ((data.Portcheck.Result == 'closed') || (data.Portcheck.Result == 'timeout')) {
                        txt = "Closed";
                    } else if (data.Portcheck.Result == 'unknown') {
                        txt = "Pending";
                    } else if ((data.Portcheck.Result == 'open') || (data.Portcheck.Result == 'rogue')) {
                        txt = "Open";
                    }
                    if (data.Portcheck.NextCheck < currenttimestamp()) {
                        if (txt != "Pending") {
                            txt = txt + ' (Re-check pending)';
                        }
                    }
                    else {
                        txt = txt + ' (' + deltaTimeStampHR(data.Portcheck.NextCheck,currenttimestamp())+')';
                    }
                }
                else {
                    txt = "<i>Unknown</i>";
                }
                return txt;
            } },
            { data: null, render: function ( data, type, row ) {
                var versioninfo = '<i>Unknown</i>';
                if ((data.Portcheck != false) && data.Portcheck.hasOwnProperty("SubVer")) {
                    if ((data.Portcheck.SubVer.length > 10) && (data.Portcheck.SubVer.substring(0,9) == '/GoByte Core:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length-1) == '/')) {
                        versioninfo = data.Portcheck.SubVer.substring(9,data.Portcheck.SubVer.indexOf('/',10));
                    }
                    else if ((data.Portcheck.SubVer.length > 7) && (data.Portcheck.SubVer.substring(0,6) == '/GoByte Core:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length-1) == '/')) {
                        versioninfo = data.Portcheck.SubVer.substring(6,data.Portcheck.SubVer.indexOf('/',6));
                    }
                    else if ((data.Portcheck.SubVer.length > 13) && (data.Portcheck.SubVer.substring(0,13) == '/GoByte Core:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length-1) == '/')) {
                        versioninfo = data.Portcheck.SubVer.substring(13,data.Portcheck.SubVer.indexOf('/',13));
                    }
                }
                return versioninfo;
            } },
            { data: null, render: function ( data, type, row ) {
                return data.MasternodeProtocol;
            } },
            { data: null, render: function ( data, type, row) {
                var balance = parseFloat(data.Balance.Value);
                if (type == 'sort') {
                    return balance;
                }
                else {
                    var num = Math.round( balance * 1000 ) / 1000;
                    return addCommas( num.toFixed(3) );
                }
            } },
            { data: null, render: function ( data, type, row) {
                var lastpaid = parseInt(data.MasternodeLastPaid);
                if (lastpaid > 0) {
                    if (type == 'sort') {
                        return lastpaid;
                    }
                    else {
                        var outtxt = '';
                        outtxt = deltaTimeStampHR(lastpaid,currenttimestamp());
                        return outtxt;
                    }
                }
                else {
                    if (type == 'sort') {
                        return 0;
                    }
                    else {
                        return 'Never/Unknown';
                    }
                }
            } },
            { data: null, render: function ( data, type, row) {
                var activeseconds = parseInt(data.MasternodeActiveSeconds);
                if (type == 'sort') {
                    return activeseconds;
                } else if (activeseconds < 0) {
                    return 'Just now ('+activeseconds+')';
                }
                else {
                    return diffHR(activeseconds);
                }
            } },
            { data: null, render: function ( data, type, row) {
                if (type == 'sort') {
                    return data.MasternodeLastSeen;
                } else if (data.MasternodeLastSeen > 0) {
                    return deltaTimeStampHR(data.MasternodeLastSeen,currenttimestamp());
                } else {
                    return '';
                }
            } },
        ],
        "createdRow": function ( row, data, index ) {
            gobyteversioncheck = getLatestgobyteVersion();
            var activecount = parseInt(data.ActiveCount);
            var inactivecount = parseInt(data.InactiveCount);
            var unlistedcount = parseInt(data.UnlistedCount);
            var total = activecount+inactivecount+unlistedcount;
            var ratio = activecount / total;
            if (ratio == 1) {
                color = 'success';
            } else if (ratio == 0) {
                color = 'danger';
            } else {
                color = 'warning';
            }
            $('td',row).eq(3).removeClass("danger").removeClass("success").removeClass("warning").addClass(color).css({"text-align": "center"});
            var color = 'danger';
            if ( data.Portcheck == false ) {
                color = 'warning';
            }
            else {
                if (( data.Portcheck.Result == 'open' ) || ( data.Portcheck.Result == 'rogue' )) {
                    color = 'success';
                } else if (data.Portcheck.Result == 'unknown') {
                    color = 'warning';
                }
            }
            $('td',row).eq(4).removeClass("danger").removeClass("success").removeClass("warning").addClass(color).css({"text-align": "center"});
            color = 'success';
            if ( data.Balance.Value < 1000 ) {
                color = 'danger';
            }
            $('td',row).eq(7).removeClass("danger").removeClass("success").addClass(color).css({"text-align": "right"});
            var versioninfo = "Unknown";
            if ((data.Portcheck != false) && data.Portcheck.hasOwnProperty("SubVer")) {
                if ((data.Portcheck.SubVer.length > 10) && (data.Portcheck.SubVer.substring(0, 9) == '/GoByte Core:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length - 1) == '/')) {
                    versioninfo = data.Portcheck.SubVer.substring(9, data.Portcheck.SubVer.indexOf('/', 10));
                }
                else if ((data.Portcheck.SubVer.length > 7) && (data.Portcheck.SubVer.substring(0, 6) == '/GoByte Core:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length - 1) == '/')) {
                    versioninfo = data.Portcheck.SubVer.substring(6, data.Portcheck.SubVer.indexOf('/', 6));
                }
                else if ((data.Portcheck.SubVer.length > 13) && (data.Portcheck.SubVer.substring(0, 13) == '/GoByte Core:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length - 1) == '/')) {
                    versioninfo = data.Portcheck.SubVer.substring(13, data.Portcheck.SubVer.indexOf('/', 13));
                }
            }
            if ( versioninfo == "Unknown" ) {
                color = 'active';
            }
            else if ( versioninfo < "0.16.2.1" ) {
                color = 'danger';
            }
            else if ( versioninfo == gobyteversioncheck ) {
                color = 'success';
            }
            else {
                color = 'warning';
            }
            $('td',row).eq(5).removeClass("danger").removeClass("success").removeClass("warning").removeClass("active").addClass(color);
            var curprotocol = parseInt(data.MasternodeProtocol);
            if ( curprotocol < 70210 ) {
                color = 'danger';
            }
            else if ( curprotocol == gobytemaxprotocol ) {
                color = 'success';
            }
            else {
                color = 'warning';
            }
            $('td',row).eq(6).removeClass("danger").removeClass("success").addClass(color).css({"text-align": "right"});
        }
    } );
    var mnlistsize = getParameter("mnlistsize");
    if (mnlistsize != "") {
        $('#mnlist').DataTable().page.len(parseInt(mnlistsize));
    }


    setTimeout(tableMNListRefresh, 300000);

    //mnpaymentsRefresh();

});
