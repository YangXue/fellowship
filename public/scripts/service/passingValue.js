angular.module('groupManagement').service('passingValue', function ($rootScope) {
	 $rootScope.eventId;
	var setEventId = function (value) {
		$rootScope.eventId = value;
	}
	var getEventId = function () {
		return $rootScope.eventId;
	}

	return {
		setEventId: setEventId,
		getEventId: getEventId,
	}
})