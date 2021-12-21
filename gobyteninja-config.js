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

// Either indicate if we are we on testnet (=1) or on mainnet (=0)
var gobyteninjatestnet = 0;
// OR indicate the hostname for testnet (if the hostname the page is running is equal to this, it will switch to testnet)
var gobyteninjatestnethost = 'testnet.gobyte.network';
var gobyteninjatestnetexplorer = 'testnet.gobyte.network/explorer';

// Tor onion hostname
// TODO
//var gobyteninjator = 'dtsfpvtrnqcyordz62efdrvhevgmqvpi5ora2nul7c2wikjxw5kboeqd.onion';
//var gobyteninjatestnettor = 'gycv32vrbvhfohjj.onion';
//var gobyteninjai2p = 'dzjzoefy7fx57h5xkdknikvfv3ckbxu2bx5wryn6taud343g2jma.b32.i2p';
//var gobyteninjatestneti2p = 'hkttp5yfsmmmtsgynadotlk6t3ppsuaj274jzipj4fe7cko3whza.b32.i2p';

// Coin logos
var gobyteninjacoin = ['GBX','tGBX'];

// URLs
// Block info

var gobyteninjablockexplorer = [[["https://explorer.gobyte.network/block/%%b%%","GoByte Blockchain Explorer"]],
                          [["https://testnet.gobyte.network/explorer/block/%%b%%","GoByte Testnet Blockchain Explorer"]]];

// Address info
var gobyteninjamndetail = [[["/mndetails.html?mnpubkey=%%a%%","GoByte Ninja Masternode Detail"]],
                         [["/mndetails.html?mnpubkey=%%a%%","GoByte Ninja Testnet Masternode Detail"]]];
var gobyteninjamndetailvin = [[["/mndetails.html?mnoutput=%%a%%","GoByte Ninja Masternode Detail"]],
                            [["/mndetails.html?mnoutput=%%a%%","GoByte Ninja Testnet Masternode Detail"]]];

var gobyteninjamndetailprotx = [[["/protx.html?protxhash=%%a%%","GoByte Ninja Masternode Detail"]],
                              [["/protx.html?protxhash=%%a%%","GoByte Ninja Testnet Masternode Detail"]]];


var gobyteninjaaddressexplorer = [[["https://explorer.gobyte.network/address/%%a%%","GoByte Blockchain Explorer"]],
                                [["https://testnet.gobyte.network/explorer/address/%%a%%","GoByte Ninja Testnet Blockchain Explorer"]]];

var gobyteninjatxexplorer = [[["https://explorer.gobyte.network/tx/%%a%%","GoByte Blockchain Explorer"]],
                           [["https://testnet.gobyte.network/explorer/tx/%%a%%","GoByte Ninja Testnet Blockchain Explorer"]]];

// Search query

var gobyteninjaqueryexplorer = [[["https://explorer.gobyte.network/search?q=%%q%%","GoByte Blockchain Explorer"]],
                            [["https://testnet.gobyte.network/explorer/search?q=%%q%%","GoByte Ninja Testnet Blockchain Explorer"]]];

var gobyteninjamasternodemonitoring = ["/masternodes.html?mnregexp=%%p%%#mnversions","/masternodes.html?mnregexp=%%p%%#mnversions"];

var gobyteninjabudgetdetail = ["/budgetdetails.html?budgetid=%%b%%","/budgetdetails.html?budgetid=%%b%%"];

var gobyteninjagovernanceproposaldetail = ["/proposaldetails.html?proposalhash=%%b%%","/proposaldetails.html?proposalhash=%%b%%"];

// Blocks per day
// 876400/150
var gobyteblocksperday = 576;
