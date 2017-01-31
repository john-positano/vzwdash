var config = require("./config.js");
var events = require("events");
var sql = require("sequelize");

var mysql = new sql
(
	config.mysqldb,
	config.mysqluid,
	config.mysqlpwd,
	{
		host: config.mysqlip,
		dialect: "mysql"
	}
);

module.exports =
{
	fetch:
	function ()
	{
		if (module.exports.su != null)
		{
			if (module.exports.su.eio.clientsCount > 0)
			{
				mysql
				.query
				(
					"select b.full_name AS fullname, a.user, SUBSTRING(a.extension, 7, 5) AS station, a.status, c.sub_status AS substatus, a.campaign_id AS campaignid, DATE_FORMAT(a.last_call_time, '%h:%i:%s') AS lastcallstart, TIMEDIFF((NOW() - INTERVAL 5 HOUR), a.last_state_change) AS laststatechange, a.calls_today AS callstoday from vicidial_live_agents AS a LEFT JOIN vicidial_users AS b ON a.user = b.user_id LEFT JOIN vicidial_agent_log AS c ON a.agent_log_id = c.agent_log_id  ORDER BY a.campaign_id DESC"
				)
				.then
				(
					function (data)
					{
						module.exports.currentset = data[0];
						module.exports.su.emit("update", JSON.stringify(data[0]));
					}
				);
			}
		}
	},
	loop: 
	function() 
	{ 
		setInterval((() => { module.exports.fetch(); }), 1000); 
	},
	currentset: null,
	su: null
};


