//app.controller('DashCtrl', function ($scope) { });

//app.controller('ChatsCtrl', function ($scope, Chats) {
//    // With the new view caching in Ionic, Controllers are only called
//    // when they are recreated or on app start, instead of every page change.
//    // To listen for when this page is active (for example, to refresh data),
//    // listen for the $ionicView.enter event:
//    //
//    //$scope.$on('$ionicView.enter', function(e) {
//    //});

//    $scope.chats = Chats.all();
//    $scope.remove = function (chat) {
//        Chats.remove(chat);
//    };
//});

//app.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
//    $scope.chat = Chats.get($stateParams.chatId);
//});

//app.controller('AccountCtrl', function ($scope) {
//    $scope.settings = {
//        enableFriends: true
//    };
//});
var authInfo = "null";

app.controller("CreateAccountCtrl", function ($scope, $ionicPopup, $state, Auth) {
    $scope.data = {};
    var ref = new Firebase("https://weighin.firebaseio.com/Users/");
    $scope.createAccount = function () {
        Auth.$createUser({
            email: $scope.data.username,
            password: $scope.data.password
        }).then(function (authData) {
            //console.log($scope.data.location);
			authInfo = authData.uid;
            ref.child(authData.uid).child("Location").set($scope.data.location);
            $state.go('tab.feed');
        }).catch(function (error) {
            console.log(error);
            var alertPopup = $ionicPopup.alert({
                title: 'Oops! Login failed!',
                template: error
            });
        });
    };

});

app.controller("LoginCtrl", function ($rootScope,$scope, $ionicPopup, $state, Auth) {
    $scope.data = {};
    $scope.login = function () {
        Auth.$authWithPassword({
            email: $scope.data.username,
            password: $scope.data.password,
        }).then(function (authData) {
            authInfo = authData.uid;
			console.log(authInfo);
            
            $state.go('tab.feed');
        }).catch(function (error) {
            var alertPopup = $ionicPopup.alert({
                title: 'Oops! Login failed!',
                template: 'Please check your credentials!'
            });
        });
    };

    $scope.$viewContentLoaded = function () {

        console.log("feed state entered");
    }

    $scope.navCreateAccount = function () {
        $state.go('create');
        
    }

});

app.controller("FeedCtrl", function ($scope,$firebaseArray,$rootScope) {
    var ref = new Firebase("https://weighin.firebaseio.com/Questions/");
    //var feed = $firebaseArray(ref);
	var userRef = {};
	var userQuestionsAnswered = {};
	$scope.currentQuestion = {};
	$scope.currentQuestionAvailable = false;
	$scope.questionLoaded = false;
	var feedLoaded = false;
	var userQuestionsAnsweredLoaded = false;
    //debug = feed;
    $scope.choice = 2;
    $scope.showFeed = false;
    $scope.authInfo = authInfo;
    //$scope.data = feed;
    
	
	feed.$loaded(function(){
		feedLoaded = true;
	});
	

    $rootScope.$on('UserLoggedIn', function (event) {
        console.log(authInfo);
        $scope.authInfo = authInfo;
		userRef = new Firebase("https://weighin.firebaseio.com/Users/" + authInfo);
		userQuestionsAnswered = new $firebaseObject(userRef);
		console.log("here though");
		userQuestionsAnswered.$loaded(function () {
			console.log("here");
			//$scope.questionLoaded = true;
			loadNextQuestion();
		});
		
		
		
        // Access to all the view config properties.
        // and one special property 'targetView'
        // viewConfig.targetView 
    });
	
	
	
	var loadNextQuestion = function (){
		$scope.questionLoaded = false;
		console.log("Searching For Question");
		$scope.currentQuestion = {};
		$scope.currentQuestionAvailable = false;
		console.log($scope.currentQuestionAvailable);
		
		var questionRef = ref.orderByChild("isPassed").equalTo(userQuestionsAnswered.questionsAnswered).on("child_added", function(snapshot) {
			console.log(snapshot.key());
		});
		for(var i = 0; i < feed.length; i++){
			var hasAnsweredQuestionAlready = false;
			var nextQuestionFound = false;
			if(userQuestionsAnswered.length == 0){
				nextQuestionFound = true;
					$scope.currentQuestion = feed[i];
					$scope.currentQuestionAvailable = true;
					console.log("Heres the current question:");
					console.log($scope.currentQuestion);
					console.log($scope.currentQuestion.votes[authInfo].choice);
					console.log(authInfo);
					break;
			}
			for(var x = 0; x < userQuestionsAnswered.length; x++){
				console.log(userQuestionsAnswered[x]);
				console.log(feed[i]);
				if(userQuestionsAnswered[x].$id == feed[i].$id)
				{
					hasAnsweredQuestionAlready = true;
					break;
				}
			}
			if(!hasAnsweredQuestionAlready){
				nextQuestionFound = true;
				$scope.currentQuestion = feed[i];
				$scope.currentQuestionAvailable = true;
				console.log("Heres the current question:");
				console.log($scope.currentQuestion);
				console.log($scope.currentQuestion.votes[authInfo].choice);
				break;
			}
		}	
	};
	
	$scope.nextQuestion = function(){
		loadNextQuestion();
	};

    $scope.choiceMade = function (item) {
        //console.log(x);
        //ref.child(item.$id).child("votes").child(authInfo.uid).child("choice").set(choice);
        feed.$save(item);
        var tempRef = new Firebase("https://weighin.firebaseio.com/Questions/" + item.$id + "/votes/");
        var tempVotes = $firebaseArray(tempRef);
		userRef.child(item.$id).set({isFavorited: false});
		console.log(userQuestionsAnswered);
        tempVotes.$loaded(function () {
            item.choice1Votes = tempVotes.filter(function (val) {
                console.log(val);
                return val.choice == 1;
            });
            item.choice2Votes = tempVotes.filter(function (val) {
                return val.choice == 2;
            });
            item.choice1Votes = item.choice1Votes.length;
            item.choice2Votes = item.choice2Votes.length;
            console.log((item.choice1Votes.length / tempVotes.length * 100).toString() + "%");
            console.log((item.choice2Votes.length / tempVotes.length * 100).toString() + "%");
            $scope.data.$save(item);
            console.log(tempVotes);
        });

        
    };

    feed.$watch(function (event) {

    });

	var init = function () {
		console.log("broadcasted");
		$rootScope.$broadcast('UserLoggedIn');
   // check if there is query in url
   // and fire search in case its value is not empty
	};
	// and fire it after definition
	init();
	
});

app.controller("ContributeCtrl", function ($scope, $ionicPopup, $firebaseArray) {
    $scope.newQuestion = {};
    $scope.newQuestion.choice1 = "yes";
    $scope.newQuestion.choice2 = "no";
    var ref = new Firebase("https://weighin.firebaseio.com/Questions/");
    var feed = $firebaseArray(ref);
    $scope.addQuestion = function () {
        console.log($scope.newQuestion.text);
        console.log("This happened too");
        feed.$add({ question: $scope.newQuestion.text, choice1: $scope.newQuestion.choice1, choice2: $scope.newQuestion.choice2, isPassed: 0});
        $scope.newQuestion.text = "";
        $scope.newQuestion.choice1 = "yes";
        $scope.newQuestion.choice2 = "no";
        var alertPopup = $ionicPopup.alert({
            title: 'Question Submitted!'
        });
    }
});

