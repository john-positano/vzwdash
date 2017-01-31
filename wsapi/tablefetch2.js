var config = require("./config.js");
var events = require("events");
var sql = require("sequelize");

var mssql = new sql
(
	config.mssqldb,
	config.mssqluid,
	config.mssqlpwd,
	{
		host: config.mssqlip,
		dialect: "mssql"
	}
);

module.exports =
{
	fetchteam:
	function (socket)
	{
		mssql
		.query
		(
			"SELECT AgentID, TeamID FROM dbo.TeamAgent"
		)
		.then
		(
			function (data)
			{
				socket.emit("teamagent", JSON.stringify(data[0]));
			}
		);
	},
	fetchteams:
	function (socket)
	{
		mssql
		.query
		(
			"SELECT ID, TeamName FROM dbo.Team"
		)
		.then
		(
			function (data)
			{
				socket.emit("team", JSON.stringify(data[0]));
			}
		);
	}
};
