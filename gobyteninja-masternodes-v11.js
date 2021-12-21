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

// GoByte Ninja Front-End (gobyteninja-fe) - Masternode List (v2)
// forked from dashninja-fe By elberethzone / https://dashtalk.org/members/elbereth.175/

var gobyteninjaversion = '2.1.7';
var tableLocalNodes = null;
var tableBlockConsensus = null;
var tableMNList = null;
var chartMNVersions = null;
var gobyteversiondefault = "0.11.2.22";
var gobyteversion = gobyteversiondefault;
var gobyteversionsemaphore = false;

$.fn.dataTable.ext.errMode = 'throw';

if(typeof(Storage) !== "undefined") {
  if (sessionStorage.getItem("nextgobyteversion") !== null) {
    sessionStorage.removeItem("nextgobyteversion");
  }
}

if (typeof gobyteninjatestnet === 'undefined') {
  var gobyteninjatestnet = 0;
}
if (typeof gobyteninjatestnethost !== 'undefined') {
  if (window.location.hostname == gobyteninjatestnethost) {
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

function displaygobyteVersion(gobyteversion) {
  if (gobyteversion != "?") {
    $('#msgalert').show();
  }
  else {
    $('#msgalert').hide();
  }
  $('#currentgobyteversion').text( gobyteversion );
}

function getLatestgobyteVersion() {
  var currentdate = new Date();
  gobyteversion = sessionStorage.getItem("currentgobyteversion");
  var nextdate = sessionStorage.getItem("nextgobyteversion");
  if ((( gobyteversion === null )
   || ( sessionStorage.getItem("nextgobyteversion") === null )
   || ( sessionStorage.getItem("nextgobyteversion") < currentdate.getTime() )) && (gobyteversionsemaphore == false)) {
    gobyteversionsemaphore = true;
    $.getJSON( "/gobyteninja-latestversion.json", function( data ) {
      sessionStorage.setItem('currentgobyteversion', data.version.string);
      var currentdate = new Date();
      currentdate = new Date(currentdate.getTime() + 15*60000);
      sessionStorage.setItem('nextgobyteversion', currentdate.getTime());
      gobyteversionsemaphore = false;
      displaygobyteVersion(data.version.string);
    });
    gobyteversion = gobyteversiondefault;
  }
  else {
    if (gobyteversion === null) {
      gobyteversion = gobyteversiondefault;
    }
    displaygobyteVersion(gobyteversion);
  }
  return gobyteversion;
};

$(document).ready(function(){

  $('#gobyteninjajsversion').text( gobyteninjaversion );

  if (gobyteninjatestnet == 1) {
    $('#testnetalert').show();
  }

  getLatestgobyteVersion();

  var pkutxt = '<ul>';
  var ix = 0;
  for ( var i=0, ien=gobyteninjamndetail[gobyteninjatestnet].length ; i<ien ; i++ ) {
    if (ix == 0) {
      pkutxt += '<li>[Link]';
    } else {
      pkutxt += '<li>['+ix+']';
    }
    pkutxt += ' '+gobyteninjamndetail[gobyteninjatestnet][i][1]+"</li>";
    ix++;
  }
  for ( var i=0, ien=gobyteninjaaddressexplorer[gobyteninjatestnet].length ; i<ien ; i++ ) {
    if (ix == 0) {
      pkutxt += '<li>[Link]';
    } else {
      pkutxt += '<li>['+ix+']';
    }
    pkutxt += ' '+gobyteninjaaddressexplorer[gobyteninjatestnet][i][1]+"</li>";
    ix++;
  }
  pkutxt += '</ul>';
  $("#pubkeyurllist").html(pkutxt);

   $('#localnodes').on('xhr.dt', function ( e, settings, json ) {
        var date = new Date();
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        $('#localnodesLR').text( n + ' ' + time );
        $('#localnodes').DataTable().column(1).search('^(?:(?!Disabled).)*$',true,false).draw();
      } );
   tableLocalNodes = $('#localnodes').dataTable( {
        dom: "Tfrtp",
        ajax: "/api/nodes?testnet="+gobyteninjatestnet,
        "paging": false,
        columns: [
            { data: "NodeName" },
            { data: null, render: function ( data, type, row ) {
                if (data.NodeEnabled == 0) {
                  return '<img src="/static/status/daemon-disabled.png" width=16 height=16 /> Disabled';
                }
                else {
                  var iconurl = '<img src="/static/status/daemon-'+data.NodeProcessStatus+'.png" width=16 height=16 /> ';
                  if (data.NodeProcessStatus == 'running') {
                    return iconurl+'Running';
                  } else if (data.NodeProcessStatus == 'stopped') {
                    return iconurl+'Stopped';
                  } else if (data.NodeProcessStatus == 'notresponding') {
                    return iconurl+'Not Responding';
                  } else {
                    return data.NodeProcessStatus;
                  }
                }
            } },
            { data: null, render: function ( data, type, row) {
               var outtxt = '';
               if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                 outtxt = data.NodeVersion;
               }
               return outtxt;
            } },
            { data: null, render: function ( data, type, row) {
               var outtxt = '';
               if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                 outtxt = data.NodeProtocol;
               }
               return outtxt;
            } },
            { data: null, render: function ( data, type, row) {
               var outtxt = '';
               if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                 outtxt = data.NodeBlocks;
               }
               return outtxt;
            } },
            { data: null, render: function ( data, type, row) {
               var outtxt = '';
               if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                 if (type != 'sort') {
                   if (gobyteninjablockexplorer[gobyteninjatestnet].length > 0) {
                     outtxt += '<a href="'+gobyteninjablockexplorer[gobyteninjatestnet][0][0].replace('%%b%%',data.NodeLastBlockHash)+'">'+data.NodeLastBlockHash+'</a>';
                     for ( var i=1, ien=gobyteninjablockexplorer[gobyteninjatestnet].length ; i<ien ; i++ ) {
                       outtxt += '<a href="'+gobyteninjablockexplorer[gobyteninjatestnet][i][0].replace('%%b%%',data.NodeLastBlockHash)+'">['+i+']</a>';
                     }
                   }
                 }
                 else {
                   outtxt = data.NodeLastBlockHash;
                 }
               }
               return outtxt;
            } },
            { data: null, render: function ( data, type, row) {
               var outtxt = '';
               if ((data.NodeEnabled != 0) && (data.NodeProcessStatus == 'running')) {
                 outtxt = data.NodeConnections;
               }
               return outtxt;
            } }
        ]
    } );
   setTimeout(tableLocalNodesRefresh, 60000);

   $('#blockconsensus').on('xhr.dt', function ( e, settings, json ) {
        var date = new Date();
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        $('#blockconsensusLR').text( n + ' ' + time );
      } );
   tableBlockConsensus = $('#blockconsensus').dataTable( {
        dom: "Trtp",
        ajax: "/api/blocks/consensus?testnet="+gobyteninjatestnet,
        "paging": false,
        "order": [[ 0, "desc" ]],
        columns: [
            { data: "BlockID" },
            { data: null, render: function ( data, type, row ) {
                return (Math.round(data.Consensus*10000)/100)+ '%';
            } },
            { data: null, render: function ( data, type, row ) {
                if (data.ConsensusPubKey == '') {
                  return "<i>None</i>";
                } else {
                  return data.ConsensusPubKey;
                }
            } },
            { data: null, render: function ( data, type, row) {
               var str = '<ul>';
               var sstr = '';
               for (var col in data.Others) {
                 str += '<li>';
                 if ( data.Others[col].Payee == '' ) {
                   str += '<i>None</i>';
                 } else {
                   str += data.Others[col].Payee;
                 }
                 str += ' ('+(Math.round(data.Others[col].RatioVotes*10000)/100)+ '% - Nodes: ';
                 sstr = '';
                 for (var uname in data.Others[col].NodeNames) {
                   if (sstr != '') {
                     sstr += ' ';
                   }
                   sstr += data.Others[col].NodeNames[uname];
                 }
                 str += sstr+')</li>'
               };
               return str+'</ul>';
            } }
        ],
        "createdRow": function ( row, data, index ) {
            if ( data.Consensus == 1 ) {
                $('td',row).eq(1).css({"background-color":"#8FFF8F"});
            } else {
                $('td',row).eq(1).css({"background-color":"#FF8F8F"});
            }
        }
    } );
   setTimeout(tableBlockConsensusRefresh, 150000);

   chartMNVersions = $('#mnversions').highcharts({
     chart: {
       plotBackgroundColor: null,
       plotBorderWidth: null,//null,
       plotShadow: false
     },
     title: {
       text: 'Masternode versions (only compatible protocols)'
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

   $('#mnregexp').on( 'keyup click', function () {
     $('#mnlist').DataTable().search($('#mnregexp').val(), true, true).draw();
   } );

   $('#mnregexp').val(getParameter("mnregexp"));

   $('#mnlist').on('xhr.dt', function ( e, settings, json ) {
        var date = new Date();
        var n = date.toDateString();
        var time = date.toLocaleTimeString();
        var activeCount = 0;
        var uniqueIPs = [];
        $('#mnlistLR').text( n + ' ' + time );
        var versioninfo = 'Unknown';
        var dataVersionCount = [];
        var mnregexp = $('#mnregexp').val();
        for ( var i=0, ien=json.data.length ; i<ien ; i++ ) {
          if (json.data[i].ActiveCount > 0) {
            activeCount++;
          }
          if (uniqueIPs.indexOf(json.data[i].MasternodeIP+":"+json.data[i].MasternodePort) == -1) {
            uniqueIPs.push( json.data[i].MasternodeIP+":"+json.data[i].MasternodePort );
          }
          if ((json.data[i].Portcheck.SubVer.length > 10) && (json.data[i].Portcheck.SubVer.substring(0,9) == '/GoByte Core:') && (json.data[i].Portcheck.SubVer.substring(json.data[i].Portcheck.SubVer.length-1) == '/')) {
            versioninfo = json.data[i].Portcheck.SubVer.substring(9,json.data[i].Portcheck.SubVer.indexOf('/',10));
          }
          else if ((json.data[i].Portcheck.SubVer.length > 7) && (json.data[i].Portcheck.SubVer.substring(0,6) == '/GoByte Core:') && (json.data[i].Portcheck.SubVer.substring(json.data[i].Portcheck.SubVer.length-1) == '/')) {
            versioninfo = json.data[i].Portcheck.SubVer.substring(6,json.data[i].Portcheck.SubVer.indexOf('/',6));
          }
          else {
            versioninfo = 'Unknown';
          }
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
            dataSet.push( [version, Math.round((dataVersionCount[version]/json.data.length)*10000)/100] );
          }
        }
        chartMNVersions = $('#mnversions').highcharts();
        chartMNVersions.series[0].setData(dataSet,true);

        var inactiveCount = json.data.length - activeCount;

        $('#mnactive').text( activeCount );
        $('#mninactive').text( inactiveCount );
        $('#mntotal').text( json.data.length );
        $('#uniquemnips').text( uniqueIPs.length );

        if (mnregexp != "") {
          $('#mnlist').DataTable().search(mnregexp, true, true).draw();
        }
   } );
   tableMNList = $('#mnlist').dataTable( {
        ajax: "/api/masternodes?testnet="+gobyteninjatestnet+"&portcheck=1&balance=1&lastpaid=1&prev12=1",
        lengthMenu: [ [50, 100, 250, 500, -1], [50, 100, 250, 500, "All"] ],
        pageLength: 50,
        columns: [
            { data: null, render: function ( data, type, row ) {
                return data.MasternodeIP+':'+data.MasternodePort;
            } },
            { data: null, render: function ( data, type, row ) {
                var txt = data.Portcheck.Result;
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
                return txt;
            } },
            { data: null, render: function ( data, type, row ) {
                var versioninfo = '<i>Unknown</i>';
                if ((data.Portcheck.SubVer.length > 10) && (data.Portcheck.SubVer.substring(0,9) == '/GoByte Core:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length-1) == '/')) {
                  versioninfo = data.Portcheck.SubVer.substring(9,data.Portcheck.SubVer.indexOf('/',10));
                }
                else if ((data.Portcheck.SubVer.length > 7) && (data.Portcheck.SubVer.substring(0,6) == '/GoByte Core:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length-1) == '/')) {
                  versioninfo = data.Portcheck.SubVer.substring(6,data.Portcheck.SubVer.indexOf('/',6));
                }
                return versioninfo;
            } },
            { data: null, render: function ( data, type, row) {
               var outtxt = '';
               if (type != 'sort') {
                 if ((gobyteninjamndetail[gobyteninjatestnet].length > 0) || (gobyteninjaaddressexplorer[gobyteninjatestnet].length > 0)) {
                   var ix = 0;
                   for ( var i=0, ien=gobyteninjamndetail[gobyteninjatestnet].length ; i<ien ; i++ ) {
                     if (ix == 0) {
                       outtxt += '<a href="'+gobyteninjamndetail[gobyteninjatestnet][0][0].replace('%%a%%',data.MNPubKey)+'">'+data.MNPubKey+'</a>';
                     }
                     else {
                       outtxt += '<a href="'+gobyteninjamndetail[gobyteninjatestnet][i][0].replace('%%a%%',data.MNPubKey)+'">['+ix+']</a>';
                     }
                     ix++;
                   }
                   for ( var i=0, ien=gobyteninjaaddressexplorer[gobyteninjatestnet].length ; i<ien ; i++ ) {
                     if (ix == 0) {
                       outtxt += '<a href="'+gobyteninjaaddressexplorer[gobyteninjatestnet][0][0].replace('%%a%%',data.MNPubKey)+'">'+data.MNPubKey+'</a>';
                     }
                     else {
                       outtxt += '<a href="'+gobyteninjaaddressexplorer[gobyteninjatestnet][i][0].replace('%%a%%',data.MNPubKey)+'">['+ix+']</a>';
                     }
                     ix++;
                   }
                 }
                 else {
                   outtxt = data.MNPubKey;
                 }
               }
               else {
                 outtxt = data.MNPubKey;
               }
               return outtxt;
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
               if (data.LastPaid != false) {
                 if (type == 'sort') {
                   return data.LastPaid.MNLastPaidBlock;
                 }
                 else {
                   var outtxt = '';
                   if (gobyteninjaqueryexplorer[gobyteninjatestnet].length > 0) {
                     outtxt += '<a href="'+gobyteninjaqueryexplorer[gobyteninjatestnet][0][0].replace('%%q%%',data.LastPaid.MNLastPaidBlock)+'">'+deltaTimeStampHR(data.LastPaid.MNLastPaidTime,currenttimestamp())+'</a>';
                     for ( var i=1, ien=gobyteninjaqueryexplorer[gobyteninjatestnet].length ; i<ien ; i++ ) {
                       outtxt += '<a href="'+gobyteninjaqueryexplorer[gobyteninjatestnet][i][0].replace('%%q%%',data.LastPaid.MNLastPaidBlock)+'">['+i+']</a>';
                     }
                   }
                   else {
                     outtxt = deltaTimeStampHR(data.LastPaid.MNLastPaidTime,currenttimestamp());
                   }
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
                 var activeseconds = parseInt(data.MNActiveSeconds);
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
                 return data.MNLastSeen;
               } else if (data.MNLastSeen > 0) {
                 return deltaTimeStampHR(data.MNLastSeen,currenttimestamp());
               } else {
                 return '';
               }
            } },
            { data: null, render: function ( data, type, row) {
               if (type == 'sort') {
                 return data.MNCountry;
               } else {
                 return '<img src="/static/flags/flags_iso/16/'+data.MNCountryCode+'.png" width=16 height=16 /> '+data.MNCountry;
               }
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
                return data.MasternodeStatusPoS;
            } },
        ],
        "createdRow": function ( row, data, index ) {
            gobyteversion = getLatestgobyteVersion();
            var color = '#FF8F8F';
            if (( data.Portcheck.Result == 'open' ) || ( data.Portcheck.Result == 'rogue' )) {
              color = '#8FFF8F';
            } else if (data.Portcheck.Result == 'unknown') {
              color = '#8F8F8F';
            }
            $('td',row).eq(1).css({"background-color":color,"text-align": "center"});
            color = '#8FFF8F';
            if ( data.Balance.Value < 1000 ) {
              color = '#FF8F8F';
            }
            $('td',row).eq(4).css({"background-color":color,"text-align": "right"});
            var versioninfo = "Unknown";
            if ((data.Portcheck.SubVer.length > 10) && (data.Portcheck.SubVer.substring(0,9) == '/GoByte Core:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length-1) == '/')) {
              versioninfo = data.Portcheck.SubVer.substring(9,data.Portcheck.SubVer.indexOf('/',10));
            }
            else if ((data.Portcheck.SubVer.length > 7) && (data.Portcheck.SubVer.substring(0,6) == '/GoByte Core:') && (data.Portcheck.SubVer.substring(data.Portcheck.SubVer.length-1) == '/')) {
              versioninfo = data.Portcheck.SubVer.substring(6,data.Portcheck.SubVer.indexOf('/',6));
            }
            if ( versioninfo == "Unknown" ) {
              color = '#8F8F8F';
            }
            else if ( ( versioninfo.substring(0,5) == "0.10." ) || ( versioninfo.substring(0,7) == "0.11.0." ) ) {
              color = '#FF8F8F';
            }
            else if ( versioninfo == gobyteversion ) {
              color = '#8FFF8F';
            }
            else {
              color = '#FFFF8F';
            }
            $('td',row).eq(2).css({"background-color":color});
            var total = data.ActiveCount+data.InactiveCount+data.UnlistedCount;
            var activecount = parseInt(data.ActiveCount);
            var inactivecount = parseInt(data.InactiveCount);
            var unlistedcount = parseInt(data.UnlistedCount);
            var total = activecount+inactivecount+unlistedcount;
            var ratio = activecount / total;
            if (ratio == 1) {
              color = '#8FFF8F';
            } else if (ratio == 0) {
              color = '#FF8F8F';
            } else if (ratio < 0.5) {
              color = '#ffcb8f';
            } else {
              color = '#FFFF8F';
            }
            $('td',row).eq(9).css({"background-color":color,"text-align": "center"});
            if (data.MasternodeStatusPoS == 0) {
              color = '#8FFF8F';
            } else if (data.MasternodeStatusPoS >= 6) {
              color = '#FF8F8F';
            } else {
              var maxcolor = 255 - ((data.MasternodeStatusPoS - 1) * 13);
              color = '#FF'+maxcolor.toString(16)+'8F';
            }
            $('td',row).eq(10).css({"background-color":color,"text-align": "center"});
         }
    } );
   setTimeout(tableMNListRefresh, 300000);

  mnpaymentsRefresh();

});
