var pomelo = window.pomelo;
var username;
var userId;
var cardId;
var equipId;
var worldId;
var sexType;
var bagType;
var star;
var targetLevel;

var transferId;
var receiverId;
var transType;
var transNum;

var token;
var users;
var rid;
var base = 1000;
var increase = 25;
var reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
var LOGIN_ERROR = "There is no server to log in, please wait.";
var LENGTH_ERROR = "Name/Channel is too long or too short. 20 character max.";
var NAME_ERROR = "Bad character in Name/Channel. Can only have letters, numbers, Chinese characters, and '_'";
var DUPLICATE_ERROR = "Please change your name to login.";

util = {
	urlRE: /https?:\/\/([-\w\.]+)+(:\d+)?(\/([^\s]*(\?\S+)?)?)?/g,
	//  html sanitizer
	toStaticHTML: function(inputHtml) {
		inputHtml = inputHtml.toString();
		return inputHtml.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	},
	//pads n with zeros on the left,
	//digits is minimum length of output
	//zeroPad(3, 5); returns "005"
	//zeroPad(2, 500); returns "500"
	zeroPad: function(digits, n) {
		n = n.toString();
		while(n.length < digits)
		n = '0' + n;
		return n;
	},
	//it is almost 8 o'clock PM here
	//timeString(new Date); returns "19:49"
	timeString: function(date) {
		var minutes = date.getMinutes().toString();
		var hours = date.getHours().toString();
		return this.zeroPad(2, hours) + ":" + this.zeroPad(2, minutes);
	},

	//does the argument only contain whitespace?
	isBlank: function(text) {
		var blank = /^\s*$/;
		return(text.match(blank) !== null);
	}
};

//always view the most recent message when it is added
function scrollDown(base) {
	window.scrollTo(0, base);
	$("#entry").focus();
};

// add message on board
function addMessage(from, target, text, time) {
	var name = (target == '*' ? 'all' : target);
	if(text === null) return;
	if(time == null) {
		// if the time is null or undefined, use the current time.
		time = new Date();
	} else if((time instanceof Date) === false) {
		// if it's a timestamp, interpret it
		time = new Date(time);
	}
	//every message you see is actually a table with 3 cols:
	//  the time,
	//  the person who caused the event,
	//  and the content
	var messageElement = $(document.createElement("table"));
	messageElement.addClass("message");
	// sanitize
	text = util.toStaticHTML(text);
	var content = '<tr>' + '  <td class="date">' + util.timeString(time) + '</td>' + '  <td class="nick">' + util.toStaticHTML(from) + ' says to ' + name + ': ' + '</td>' + '  <td class="msg-text">' + text + '</td>' + '</tr>';
	messageElement.html(content);
	//the log is the stream that we view
	$("#chatHistory").append(messageElement);
	base += increase;
	scrollDown(base);
};

// show tip
function tip(type, name) {
	var tip,title;
	switch(type){
		case 'online':
			tip = name + ' is online now.';
			title = 'Online Notify';
			break;
		case 'offline':
			tip = name + ' is offline now.';
			title = 'Offline Notify';
			break;
		case 'message':
			tip = name + ' is saying now.'
			title = 'Message Notify';
			break;
	}
	var pop=new Pop(title, tip);
};

// init user list
function initUserList(data) {
	users = data.users;
	for(var i = 0; i < users.length; i++) {
		var slElement = $(document.createElement("option"));
		slElement.attr("value", users[i]);
		slElement.text(users[i]);
		$("#usersList").append(slElement);
	}
};

// add user in user list
function addUser(user) {
	var slElement = $(document.createElement("option"));
	slElement.attr("value", user);
	slElement.text(user);
	$("#usersList").append(slElement);
};

// remove user from user list
function removeUser(user) {
	$("#usersList option").each(
		function() {
			if($(this).val() === user) $(this).remove();
	});
};

// set your userId
function setUserId() {
	$("#userId").text(userId);
};

// set your name
function setName() {
	$("#name").text(name);
};

// set your room
function setRoom() {
	$("#room").text(rid);
};

// set your world
function setWorld() {
	$("#World").text(WorldId);
};
// show error
function showError(content) {
	$("#loginError").text(content);
	$("#loginError").show();
};

// show login panel
function showLogin() {
	$("#loginView").show();
	$("#createPlayerDebugView").hide();
	$("#getMissionListDebugView").hide();
	$("#hideView").hide();
	$("#chatHistory").hide();
	$("#toolbar").hide();
	$("#loginError").hide();
	$("#loginUser").focus();
};

// show chat panel
function showChat() {
	$("#loginView").hide();
	$("#loginError").hide();
	$("#createPlayerDebugView").show();
	$("#getMissionListDebugView").show();
	$("#hideView").show();
	$("#toolbar").show();
	//$("entry").focus();
	//scrollDown(base);
};

// query connector
function queryEntry(uid, callback) {
	var route = 'gate.gateHandler.queryEntry';
	pomelo.init({
		host: window.location.hostname,
		port: 3014,
		log: true
	}, function() {
		pomelo.request(route, {
			uid: uid
		}, function(data) {
			pomelo.disconnect();
			if(data.code === 500) {
				showError(LOGIN_ERROR);
				return;
			}
			callback(data.host, data.port);
		});
	});
};

$(document).ready(function() {
	//when first time into chat room.
	showLogin();

	//wait message from the server.
	pomelo.on('onChat', function(data) {
		addMessage(data.from, data.target, data.msg);
		$("#chatHistory").show();
		if(data.from !== username)
			tip('message', data.from);
	});

	//update user list
	pomelo.on('onAdd', function(data) {
		var user = data.user;
		tip('online', user);
		addUser(user);
	});

	//update user list
	pomelo.on('onLeave', function(data) {
		var user = data.user;
		tip('offline', user);
		removeUser(user);
	});


	//handle disconect message, occours when the client is disconnect with servers
	pomelo.on('disconnect', function(reason) {
		showLogin();
	});

	//deal with quickLogin button click.
	$("#quickLogin").click(function() {
		//username = $("#loginUser").attr("value");
		//rid = $('#channelList').val();
    chkKey = Math.round(new Date().getTime()/1000); // app/apk should generate a random id, and send it to server when user click "quickly start game"
    rid = 1234;
    deviceInfo = rid + '' + chkKey;

/*
		if(username.length > 20 || username.length == 0 || rid.length > 20 || rid.length == 0) {
			showError(LENGTH_ERROR);
			return false;
		}

		if(!reg.test(username) || !reg.test(rid)) {
			showError(NAME_ERROR);
			return false;
		}
*/
		//query entry of connection
		queryEntry(deviceInfo, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "connector.quickLoginHandler.quickLogin";
				pomelo.request(route, {
          deviceInfo: deviceInfo,
          chkKey: chkKey,
					rid: rid
				}, function(data) {
        alert("received data:");
        alert(JSON.stringify(data));
					if(data.error) {
						showError(DUPLICATE_ERROR);
						return;
					}
          username = data.loginData.loginName;
          userId = data.loginData.userId;
          setUserId();
					setName();
					setRoom();
					showChat();
					initUserList(data);
				});
			});
		});
	});

	//deal with login button click.
	$("#login").click(function() {
		userId = $("#userId").attr("value");
		token = $('#token2').val();
    worldId = $("#worldId").attr("value");
    rid = 1234;
    /*
		if(username.length > 20 || username.length == 0 || rid.length > 20 || rid.length == 0) {
			showError(LENGTH_ERROR);
			return false;
		}

		if(!reg.test(username) || !reg.test(rid)) {
			showError(NAME_ERROR);
			return false;
		}
    */

		//query entry of connection
		queryEntry(userId, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "connector.entryHandler.entry";
				pomelo.request(route, {
					userId: userId,
					token: token,
          worldId: worldId,
          rid: rid
				}, function(data) {
        alert(JSON.stringify(data));
					if(data.error) {
						showError(DUPLICATE_ERROR);
						return;
					}
          //userName = ;

          setUserId();
					setName();
					setRoom();
					showChat();
					//initUserList(data);
				});
			});
		});
	});

	//deal with chkNickName button click.
	$("#chkNickName").click(function() {
		userId = $("#userId").attr("value");
		username = $("#nickname").attr("value");
		worldId = $('#worldId').val();
    rid = 1234;
		//query entry of connection
		queryEntry(userId, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "connector.roleHandler.chkNickName";
				pomelo.request(route, {
          name: username,
          worldId: worldId,
          uid:userId,
          rid: rid
				}, function(data) {
        alert(JSON.stringify(data));
					if(data.error) {
						showError(DUPLICATE_ERROR);
						return;
					}
          //userName = ;

          setUserId();
					setName();
					setWorld();
					showChat();
					//initUserList(data);
				});
			});
		});
	});

	//deal with createPlayer button click.
	$("#createPlayer").click(function() {
		userId = $("#userId").attr("value");
		cardId = $("#cardId").attr("value");
		username = $("#nickname1").attr("value");
		sexType = $("#sexType").attr("value");
		//worldId = $("#worldId").attr("value");
		worldId = $('#worldId').val();

    alert(userId);
    alert(cardId);
    alert(username);
    alert(sexType);
    alert(worldId);

    rid = 1234;
		//query entry of connection
		queryEntry(userId, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "connector.roleHandler.createPlayer";
				pomelo.request(route, {
          name: username,
          sexType: sexType,
          cardId: cardId,
          worldId: worldId,
          uid:userId,
          rid: rid
				}, function(data) {
        alert(JSON.stringify(data));
					if(data.error) {
						showError(DUPLICATE_ERROR);
						return;
					}
          //userName = ;

          setUserId();
					setName();
					setWorld();
					showChat();
					//initUserList(data);
				});
			});
		});
	});

	//deal with getUnit button click.
	$("#getUnit").click(function() {
		userId = $("#userIdUnit").attr("value");
		playerId = $("#playerIdUnit").attr("value");
		worldId = $("#worldIdUnit").attr("value");
    rid = 1234;
		//query entry of connection
		queryEntry(userId, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "connector.unitHandler.unitInfo";
				pomelo.request(route, {
          playerId:playerId,
          worldId:worldId,
          uid:userId,
          rid: rid
				}, function(data) {
        alert(JSON.stringify(data));
					if(data.error) {
						showError(DUPLICATE_ERROR);
						return;
					}
          var userName = userId;

          setUserId();
					setName();
					setWorld();
					showChat();
					//initUserList(data);
				});
			});
		});
	});

	//deal with getMissionList button click.
	$("#getMissionList").click(function() {
		userId = $("#userId").attr("value");
		playerId = $("#playerId").attr("value");
		mapId = $("#mapId").attr("value");
		//missionDataId = $("#missionDataId").attr("value");
		//worldId = $("#worldId").attr("value");
		//worldId = $('#worldId').val();
    rid = 1234;
    //alert(missionDataId);
		//query entry of connection
		queryEntry(userId, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "mission.missionHandler.getMissionList";
				pomelo.request(route, {
          playerId:playerId,
          mapId:mapId,
          //missionDataId:missionDataId,
          uid:userId,
          rid: rid
				}, function(data) {
        alert(JSON.stringify(data));
					if(data.error) {
						showError(DUPLICATE_ERROR);
						return;
					}
          var userName = userId;

          setUserId();
					setName();
					setWorld();
					showChat();
					//initUserList(data);
				});
			});
		});
	});

	//deal with bagSell button click.
	$("#bagSell").click(function() {
		userId    = $("#userIdBagSell").attr("value");
		playerId  = $("#playerIdBagSell").attr("value");
		bagType   = $("#bagTypeSell").attr("value");
		itemSID   = $("#itemSID").attr("value");
		itemNum   = $("#itemNum").attr("value");

    alert(userId);
    alert(playerId);
    alert(itemSID);
    alert(itemNum);
    rid = 1234;
		//query entry of connection
		queryEntry(userId, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "connector.bagHandler.sell";
				pomelo.request(route, {
          playerId:playerId,
          bagType:bagType,
          goods: [{
            "id": itemSID,
            "num":itemNum
          }],
          uid:userId,
          rid: rid
				}, function(data) {
        alert(JSON.stringify(data));
					if(data.error) {
						showError(DUPLICATE_ERROR);
						return;
					}
          var userName = userId;

          setUserId();
					setName();
					setWorld();
					showChat();
					//initUserList(data);
				});
			});
		});
	});

	//deal with onarm button click.
	$("#onarm").click(function() {
		userId    = $("#userIdonArm").attr("value");
		worldId   = $("#worldIdonArm").attr("value");
		playerId  = $("#playerIdonArm").attr("value");
		positionId= $("#positionIdonArm").attr("value");
		armPosition= $("#armPositiononArm").attr("value");
		id        = $("#idonArm").attr("value");

    alert(playerId);
    alert(id);
    rid = 1234;
		//query entry of connection
		queryEntry(userId, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "connector.unitHandler.onArm";
				pomelo.request(route, {
          playerId:playerId,
          worldId:worldId,
          positionId:positionId,
          armPosition:armPosition,
          id:id,
          uid:userId,
          rid: rid
				}, function(data) {
        alert(JSON.stringify(data));
					if(data.error) {
						showError(DUPLICATE_ERROR);
						return;
					}
          var userName = userId;

          setUserId();
					setName();
					setWorld();
					showChat();
					//initUserList(data);
				});
			});
		});
	});

	//deal with onunit button click.
	$("#onUnit").click(function() {
		userId    = $("#userIdonUnit").attr("value");
		worldId   = $("#worldIdonUnit").attr("value");
		playerId  = $("#playerIdonUnit").attr("value");
		positionId= $("#positionIdonUnit").attr("value");
		id        = $("#idonUnit").attr("value");

    alert(playerId);
    alert(id);
    rid = 1234;
		//query entry of connection
		queryEntry(userId, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "connector.unitHandler.onUnit";
				pomelo.request(route, {
          playerId:playerId,
          worldId:worldId,
          positionId:positionId,
          id:id,
          uid:userId,
          rid: rid
				}, function(data) {
        alert(JSON.stringify(data));
					if(data.error) {
						showError(DUPLICATE_ERROR);
						return;
					}
          var userName = userId;

          setUserId();
					setName();
					setWorld();
					showChat();
					//initUserList(data);
				});
			});
		});
	});

	//deal with decompo button click.
	$("#decompo").click(function() {
		userId    = $("#userIdDecompo").attr("value");
		playerId  = $("#playerIdDecompo").attr("value");
		bagType   = $("#bagTypeDecompo").attr("value");
		star      = $("#starDecompo").attr("value");
		itemSID1  = $("#itemSIDDecompo1").attr("value");
		itemNum1  = $("#itemNumDecompo1").attr("value");
		itemSID2  = $("#itemSIDDecompo2").attr("value");
		itemNum2  = $("#itemNumDecompo2").attr("value");
		itemSID3  = $("#itemSIDDecompo3").attr("value");
		itemNum3  = $("#itemNumDecompo3").attr("value");

    alert(userId);
    alert(playerId);
    alert(itemSID1);
    alert(itemNum1);
    alert(itemSID2);
    alert(itemNum2);
    alert(itemSID3);
    alert(itemNum3);
    rid = 1234;
		//query entry of connection
		queryEntry(userId, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "factory.factoryHandler.decompo";
				pomelo.request(route, {
          playerId:playerId,
          bagType:bagType,
          data: [
            {"id": itemSID1, "num":itemNum1},
            {"id": itemSID2, "num":itemNum2},
            {"id": itemSID3, "num":itemNum3},
          ],
          star: star,
          uid:userId,
          rid: rid
				}, function(data) {
        alert(JSON.stringify(data));
					if(data.error) {
						showError(DUPLICATE_ERROR);
						return;
					}
          var userName = userId;

          setUserId();
					setName();
					setWorld();
					showChat();
					//initUserList(data);
				});
			});
		});
	});

	//deal with compo button click.
	$("#compo").click(function() {
		userId    = $("#userIdCompo").attr("value");
		playerId  = $("#playerIdCompo").attr("value");
		bagType   = $("#bagTypeCompo").attr("value");
		star      = $("#starCompo").attr("value");

    alert(userId);
    alert(playerId);
    rid = 1234;
		//query entry of connection
		queryEntry(userId, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "factory.factoryHandler.compo";
				pomelo.request(route, {
          playerId:playerId,
          bagType:bagType,
          star: star,
          uid:userId,
          rid: rid
				}, function(data) {
        alert(JSON.stringify(data));
					if(data.error) {
						showError(DUPLICATE_ERROR);
						return;
					}
          var userName = userId;

          setUserId();
					setName();
					setWorld();
					showChat();
					//initUserList(data);
				});
			});
		});
	});

	//deal with decompo button click.
	$("#decompoPet").click(function() {
		userId    = $("#userIdDecompoPet").attr("value");
		playerId  = $("#playerIdDecompoPet").attr("value");
		bagType   = $("#bagTypeDecompoPet").attr("value");
		star      = $("#starDecompoPet").attr("value");
		itemSID1  = $("#PetSIDDecompo1").attr("value");
		itemNum1  = $("#PetNumDecompo1").attr("value");
		itemSID2  = $("#PetSIDDecompo2").attr("value");
		itemNum2  = $("#PetNumDecompo2").attr("value");
		itemSID3  = $("#PetSIDDecompo3").attr("value");
		itemNum3  = $("#PetNumDecompo3").attr("value");

    alert(userId);
    alert(playerId);
    alert(itemSID1);
    alert(itemNum1);
    alert(itemSID2);
    alert(itemNum2);
    alert(itemSID3);
    alert(itemNum3);
    rid = 1234;
		//query entry of connection
		queryEntry(userId, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "factory.factoryHandler.decompo";
				pomelo.request(route, {
          playerId:playerId,
          bagType:bagType,
          data: [
            {"id": itemSID1, "num":itemNum1},
            {"id": itemSID2, "num":itemNum2},
            {"id": itemSID3, "num":itemNum3},
          ],
          star: star,
          uid:userId,
          rid: rid
				}, function(data) {
        alert(JSON.stringify(data));
					if(data.error) {
						showError(DUPLICATE_ERROR);
						return;
					}
          var userName = userId;

          setUserId();
					setName();
					setWorld();
					showChat();
					//initUserList(data);
				});
			});
		});
	});

	//deal with compo button click.
	$("#compoPet").click(function() {
		userId    = $("#userIdCompoPet").attr("value");
		playerId  = $("#playerIdCompoPet").attr("value");
		bagType   = $("#bagTypeCompoPet").attr("value");
		star      = $("#starCompoPet").attr("value");

    alert(userId);
    alert(playerId);
    rid = 1234;
		//query entry of connection
		queryEntry(userId, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "factory.factoryHandler.compo";
				pomelo.request(route, {
          playerId:playerId,
          bagType:bagType,
          star: star,
          uid:userId,
          rid: rid
				}, function(data) {
        alert(JSON.stringify(data));
					if(data.error) {
						showError(DUPLICATE_ERROR);
						return;
					}
          var userName = userId;

          setUserId();
					setName();
					setWorld();
					showChat();
					//initUserList(data);
				});
			});
		});
	});

	//deal with decompo button click.
	$("#decompoEquip").click(function() {
		userId    = $("#userIdDecompoEquip").attr("value");
		playerId  = $("#playerIdDecompoEquip").attr("value");
		bagType   = $("#bagTypeDecompoEquip").attr("value");
		star      = $("#starDecompoEquip").attr("value");
		itemSID1  = $("#EquipSIDDecompo1").attr("value");
		itemNum1  = $("#EquipNumDecompo1").attr("value");
		itemSID2  = $("#EquipSIDDecompo2").attr("value");
		itemNum2  = $("#EquipNumDecompo2").attr("value");
		itemSID3  = $("#EquipSIDDecompo3").attr("value");
		itemNum3  = $("#EquipNumDecompo3").attr("value");
		itemSID4  = $("#EquipSIDDecompo4").attr("value");
		itemNum4  = $("#EquipNumDecompo4").attr("value");
		itemSID5  = $("#EquipSIDDecompo5").attr("value");
		itemNum5  = $("#EquipNumDecompo5").attr("value");
		itemSID6  = $("#EquipSIDDecompo6").attr("value");
		itemNum6  = $("#EquipNumDecompo6").attr("value");


    alert(userId);
    alert(playerId);
    alert(itemSID1);
    alert(itemNum1);
    alert(itemSID2);
    alert(itemNum2);
    alert(itemSID3);
    alert(itemNum3);
    alert(itemSID4);
    alert(itemNum4);
    alert(itemSID5);
    alert(itemNum5);
    alert(itemSID6);
    alert(itemNum6);

    rid = 1234;
		//query entry of connection
		queryEntry(userId, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "factory.factoryHandler.decompo";
				pomelo.request(route, {
          playerId:playerId,
          bagType:bagType,
          data: [
            {"id": itemSID1, "num":itemNum1},
            {"id": itemSID2, "num":itemNum2},
            {"id": itemSID3, "num":itemNum3},
            {"id": itemSID4, "num":itemNum4},
            {"id": itemSID5, "num":itemNum5},
            {"id": itemSID6, "num":itemNum6},
          ],
          star: star,
          uid:userId,
          rid: rid
				}, function(data) {
        alert(JSON.stringify(data));
					if(data.error) {
						showError(DUPLICATE_ERROR);
						return;
					}
          var userName = userId;

          setUserId();
					setName();
					setWorld();
					showChat();
					//initUserList(data);
				});
			});
		});
	});

	//deal with compo button click.
	$("#compoEquip").click(function() {
		userId    = $("#userIdCompoEquip").attr("value");
		playerId  = $("#playerIdCompoEquip").attr("value");
		bagType   = $("#bagTypeCompoEquip").attr("value");
		star      = $("#starCompoEquip").attr("value");

    alert(userId);
    alert(playerId);
    rid = 1234;
		//query entry of connection
		queryEntry(userId, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "factory.factoryHandler.compo";
				pomelo.request(route, {
          playerId:playerId,
          bagType:bagType,
          star: star,
          uid:userId,
          rid: rid
				}, function(data) {
        alert(JSON.stringify(data));
					if(data.error) {
						showError(DUPLICATE_ERROR);
						return;
					}
          var userName = userId;

          setUserId();
					setName();
					setWorld();
					showChat();
					//initUserList(data);
				});
			});
		});
	});


	//deal with transmission button click.
	$("#transmission ").click(function() {
		userId    = $("#userIdtm").attr("value");
		playerId  = $("#playerIdtm").attr("value");
		transferId= $("#transferId").attr("value");
		receiverId= $("#receiverId").attr("value");
		transNum  = $("#transNum").attr("value");
		transType = $("#transType").attr("value");

    alert(userId);
    alert(playerId);
    rid = 1234;
		//query entry of connection
		queryEntry(userId, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "strengthen.strengthenHandler.transmission";
				pomelo.request(route, {
          playerId:playerId,
          transferId:transferId,
          receiverId:receiverId,
          transType:transType,
          transNum:transNum,
          uid:userId,
          rid: rid
				}, function(data) {
        alert(JSON.stringify(data));
					if(data.error) {
						showError(DUPLICATE_ERROR);
						return;
					}
          var userName = userId;

          setUserId();
					setName();
					setWorld();
					showChat();
					//initUserList(data);
				});
			});
		});
	});

	//deal with transmission button click.
	$("#equipStrengthen").click(function() {
		userId    = $("#userIdStr").attr("value");
		playerId  = $("#playerIdStr").attr("value");
		equipId   = $("#equipIdStr").attr("value");
		targetLevel = $("#targetLevel").attr("value");

    alert(userId);
    alert(playerId);
    rid = 1234;
		//query entry of connection
		queryEntry(userId, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "strengthen.equipHandler.equipStrengthen";
				pomelo.request(route, {
          playerId:playerId,
          equipId:equipId,
          targetLevel:targetLevel,
          uid:userId,
          rid: rid
				}, function(data) {
        alert(JSON.stringify(data));
					if(data.error) {
						showError(DUPLICATE_ERROR);
						return;
					}
          var userName = userId;

          setUserId();
					setName();
					setWorld();
					showChat();
					//initUserList(data);
				});
			});
		});
	});

	//deal with getFraction button click.
	$("#getFraction").click(function() {
		userId = $("#userIdGetFraction").attr("value");
		playerId = $("#playerIdGetFraction").attr("value");
		bagType = $("#bagTypeGetFraction").attr("value");
    alert(playerId);
    rid = 1234;
		//query entry of connection
		queryEntry(userId, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "factory.factoryHandler.getFraction";
				pomelo.request(route, {
          playerId:playerId,
          //missionDataId:missionDataId,
          bagType:bagType,
          uid:userId,
          rid: rid
				}, function(data) {
        alert(JSON.stringify(data));
					if(data.error) {
						showError(DUPLICATE_ERROR);
						return;
					}
          var userName = userId;

          setUserId();
					setName();
					setWorld();
					showChat();
					//initUserList(data);
				});
			});
		});
	});

	//deal with getMissionList button click.
	$("#getBag").click(function() {
		userId = $("#userIdBag").attr("value");
		playerId = $("#playerIdBag").attr("value");
		bagType = $("#bagType").attr("value");
    alert(playerId);
    rid = 1234;
		//query entry of connection
		queryEntry(userId, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "connector.bagHandler.getBag";
				pomelo.request(route, {
          playerId:playerId,
          //missionDataId:missionDataId,
          bagType:bagType,
          uid:userId,
          rid: rid
				}, function(data) {
        alert(JSON.stringify(data));
					if(data.error) {
						showError(DUPLICATE_ERROR);
						return;
					}
          var userName = userId;

          setUserId();
					setName();
					setWorld();
					showChat();
					//initUserList(data);
				});
			});
		});
	});

	//deal with battleDemo button click.
	$("#battleDemo").click(function() {
		userId = $("#userId1").attr("value");
    alert(userId);
		attackerId = $("#attackerId").attr("value");
		attackeeId = $("#attackeeId").attr("value");
    alert(attackerId);
    alert(attackeeId);

    rid = 1234;
    //alert(missionDataId);
		//query entry of connection
		queryEntry(userId, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "arena.arenaHandler.battleBegin";
				pomelo.request(route, {
          attackerId:attackerId,
          attackeeId:attackeeId,
          //missionDataId:missionDataId,
          uid:userId,
          rid: rid
				}, function(data) {
        alert(JSON.stringify(data));
					if(data.error) {
						showError(DUPLICATE_ERROR);
						return;
					}
          var userName = userId;

          setUserId();
					setName();
					setWorld();
					showChat();
					//initUserList(data);
				});
			});
		});
	});

	//deal with battleEndDemo button click.
	$("#battleEndDemo").click(function() {
		userId = $("#userId2").attr("value");
		attackerId2 = $("#attackerId2").attr("value");
		battleId = $("#bid").attr("value");
    alert(attackerId2);
    alert(battleId);

    rid = 1234;
    //alert(missionDataId);
		//query entry of connection
		queryEntry(userId, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "arena.arenaHandler.battleEnd";
				pomelo.request(route, {
          attackerId:attackerId2,
          battleId:battleId,
          //missionDataId:missionDataId,
          uid:userId,
          rid: rid
				}, function(data) {
        alert(JSON.stringify(data));
					if(data.error) {
						showError(DUPLICATE_ERROR);
						return;
					}
          var userName = userId;

          setUserId();
					setName();
					setWorld();
					showChat();
					//initUserList(data);
				});
			});
		});
	});

	//deal with chat mode.
	$("#entry").keypress(function(e) {
		var route = "chat.chatHandler.send";
		var target = $("#usersList").val();
		if(e.keyCode != 13 /* Return */ ) return;
		var msg = $("#entry").attr("value").replace("\n", "");
		if(!util.isBlank(msg)) {
			pomelo.request(route, {
				rid: rid,
				content: msg,
				from: username,
				target: target
			}, function(data) {
				$("#entry").attr("value", ""); // clear the entry field.
				if(target != '*' && target != username) {
					addMessage(username, target, msg);
					$("#chatHistory").show();
				}
			});
		}
	});
});
