var mainview = angular.module("maintable", []);

mainview.controller
("display",
	function ($scope, wsmsg, joiner, color)
	{
		$scope.tabledata = {"a": { "a" : 1 }, "b": { "a" : 2 }};
		$scope.teamdata = null;
		$scope.teamagentdata = null;
		$scope.teamfilterid = null;
		$scope.filtername = "FILTER BY TEAM";

		wsmsg.io.on
		("update",
			function(data)
			{
				$scope.tabledata = joiner.up($scope.teamfilterid, JSON.parse(data), $scope.teamagentdata);
				$scope.$apply();
			}
		);
		wsmsg.io.on
		("team",
			function(data)
			{
				$scope.teamdata = JSON.parse(data);
			}
		);
		wsmsg.io.on
		("teamagent",
			function(data)
			{
				$scope.teamagentdata = JSON.parse(data);
			}
		);

		$scope.dropdown_click = function(a)
		{
			$scope.teamfilterid = a.ID;
			$scope.filtername = a.TeamName;
		};
		$scope.color = function(a)
		{
			return color.color(a);
		}
	}
);

mainview.service
("wsmsg",
	function ()
	{
		this.io = io("ws://localhost:9000/");
	}
);

mainview.service
("joiner",
	function()
	{
		this.up = function(filter, rawdata, teamagentdata)
		{	
			if (filter != null)
			{
				var returnarray = [];
				for (var i in rawdata)
				{
					for (var j in teamagentdata)
					{
						if (rawdata[i].user == teamagentdata[j]["AgentID"] && teamagentdata[j]["TeamID"] == filter)
						{
							returnarray.push(rawdata[i]);
							break;
						}
					}					
				}
				return returnarray;
			}
			else
			{
				return rawdata;
			}
		}
	}
);

mainview.service
("color",
	function()
	{
		this.color = function(a)
		{
			var hms = a["laststatechange"];
			var va = hms.split(':');
			var seconds = ((+va[0]) * 60 * 60) + ((+va[1]) * 60) + (+va[2]); 
			if (a.status == "READY")
			{
				if (seconds < 60)
				{
					return "lightblue";
				}
				else if (seconds >= 60 && seconds < 300)
				{
					return "blue";
				}
				else
				{
					return "darkblue";
				}
			}
			if (a.status == "INCALL")
			{
				if (seconds < 10)
				{
					return "white";
				}
				else if (seconds >= 10 && seconds < 60)
				{
					return "lightpurple";
				}
				else if (seconds >= 60 && seconds < 300)
				{
					return "purple";
				}
				else
				{
					return "darkpurple";
				}
			}
			if (a.status == "PAUSED")
			{
				if (seconds < 10)
				{
					return "white";
				}
				else if (seconds >= 10 && seconds < 60)
				{
					return "lightyellow";
				}
				else if (seconds >= 60 && seconds < 300)
				{
					return "yellow";
				}
				else
				{
					return "darkyellow";
				}				
			}
			if (a.status == "DEAD")
			{
				return "black";
			}
		};
	}
);
