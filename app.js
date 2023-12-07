angular.module('myApp', [])
    .controller('myController', function ($scope, $http, $filter) {
        $scope.searchName = '';
        $scope.domainFilter = '';
        $scope.genderFilter = '';
        $scope.availabilityFilter = '';

        $http.get('heliverse_mock_data.json')
            .then(function (response) {
                $scope.people = response.data;
                $scope.itemsPerPage = 20;
                $scope.currentPage = 1;
                $scope.totalPages = Math.ceil($scope.people.length / $scope.itemsPerPage);

                $scope.updateDisplayedPeople();
                $scope.extractUniqueDomains();
            });

        $scope.updateDisplayedPeople = function () {
            var filteredData = $filter('filter')($scope.people, function (value, index, array) {
                var match = true;

                // Apply filters
                match = match && (!$scope.searchName || (value.first_name.toLowerCase().indexOf($scope.searchName.toLowerCase()) !== -1));
                match = match && (!$scope.domainFilter || (value.domain === $scope.domainFilter));
                match = match && (!$scope.genderFilter || (value.gender.toLowerCase() === $scope.genderFilter.toLowerCase()));
                match = match && (!$scope.availabilityFilter || (value.available === ($scope.availabilityFilter === 'true')));

                return match;
            });

            var startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage;
            var endIndex = startIndex + $scope.itemsPerPage;
            $scope.displayedPeople = filteredData.slice(startIndex, endIndex);
            $scope.totalPages = Math.ceil(filteredData.length / $scope.itemsPerPage);
        };

        $scope.extractUniqueDomains = function () {
            $scope.uniqueDomains = [...new Set($scope.people.map(person => person.domain))];
            $scope.uniqueAvailableDomains = $scope.uniqueDomains.filter(domain => $scope.isDomainAvailable(domain));
        };

        $scope.prevPage = function () {
            if ($scope.currentPage > 1) {
                $scope.currentPage--;
                $scope.updateDisplayedPeople();
            }
        };

        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.totalPages) {
                $scope.currentPage++;
                $scope.updateDisplayedPeople();
            }
        };

        $scope.createTeam = function () {
            if ($scope.teamDomain) {
                $scope.teamDetails = $scope.people.filter(person => person.domain === $scope.teamDomain && person.available);
            }
        };

        $scope.isDomainAvailable = function (domain) {
            return $scope.people.some(person => person.domain === domain && person.available);
        };
    });
