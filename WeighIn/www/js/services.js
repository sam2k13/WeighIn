

app.factory("Auth", ["$firebaseAuth",
  function ($firebaseAuth) {
      var ref = new Firebase("https://weighin.firebaseio.com/");
      return $firebaseAuth(ref);
  }
]);


//.service('LoginService', function (Auth) {
//    return {
//        loginUser: function (name, pw) {

//            Auth.$authWithPassword({
//                email: name,
//                password: pw
//            }).then(function (authData) {
//                return 
//            }).catch(function (error) {
//                deferred.reject('Wrong credentials.');
//            });

        
//        },

//        createUser: function (name, pw) {
//            var deferred = $q.defer();
//            var promise = deferred.promise;

//            Auth.$createUser({
//                email: name,
//                password: pw
//            }).then(function (authData) {
//                deferred.resolve('Welcome ' + name + '!');
//            }).catch(function (error) {
//                deferred.reject('Error Creating.');
//            });

//            promise.success = function (fn) {
//                promise.then(fn);
//                return promise;
//            }
//            promise.error = function (fn) {
//                promise.then(null, fn);
//                return promise;
//            }
//            return promise;
//        },

//        removeUser: function (name, pw) {
//            var deferred = $q.defer();
//            var promise = deferred.promise;

//            Auth.$removeUser({
//                email: name,
//                password: pw
//            }).then(function (authData) {
//                deferred.resolve('Welcome ' + name + '!');
//            }).catch(function (error) {
//                deferred.reject('Error Creating.');
//            });

//            promise.success = function (fn) {
//                promise.then(fn);
//                return promise;
//            }
//            promise.error = function (fn) {
//                promise.then(null, fn);
//                return promise;
//            }
//            return promise;
//        }
//    }
//})

//app.factory('Chats', function() {
//  // Might use a resource here that returns a JSON array

//  // Some fake testing data
//  var chats = [{
//    id: 0,
//    name: 'Ben Sparrow',
//    lastText: 'You on your way?',
//    face: 'img/ben.png'
//  }, {
//    id: 1,
//    name: 'Max Lynx',
//    lastText: 'Hey, it\'s me',
//    face: 'img/max.png'
//  }, {
//    id: 2,
//    name: 'Adam Bradleyson',
//    lastText: 'I should buy a boat',
//    face: 'img/adam.jpg'
//  }, {
//    id: 3,
//    name: 'Perry Governor',
//    lastText: 'Look at my mukluks!',
//    face: 'img/perry.png'
//  }, {
//    id: 4,
//    name: 'Mike Harrington',
//    lastText: 'This is wicked good ice cream.',
//    face: 'img/mike.png'
//  }];

//  return {
//    all: function() {
//      return chats;
//    },
//    remove: function(chat) {
//      chats.splice(chats.indexOf(chat), 1);
//    },
//    get: function(chatId) {
//      for (var i = 0; i < chats.length; i++) {
//        if (chats[i].id === parseInt(chatId)) {
//          return chats[i];
//        }
//      }
//      return null;
//    }
//  };
//});
