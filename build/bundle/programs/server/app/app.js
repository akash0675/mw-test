var require = meteorInstall({"imports":{"api":{"links.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////
//                                                                          //
// imports/api/links.js                                                     //
//                                                                          //
//////////////////////////////////////////////////////////////////////////////
                                                                            //
module.export({
  LinksCollection: () => LinksCollection
});
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
const LinksCollection = new Mongo.Collection('links');
//////////////////////////////////////////////////////////////////////////////

},"loan-application.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////
//                                                                          //
// imports/api/loan-application.js                                          //
//                                                                          //
//////////////////////////////////////////////////////////////////////////////
                                                                            //
module.export({
  LoanApplicationCollection: () => LoanApplicationCollection
});
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
const LoanApplicationCollection = new Mongo.Collection('loanApplications');
//////////////////////////////////////////////////////////////////////////////

},"users.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////
//                                                                          //
// imports/api/users.js                                                     //
//                                                                          //
//////////////////////////////////////////////////////////////////////////////
                                                                            //
module.export({
  UsersCollection: () => UsersCollection
});
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
const UsersCollection = new Mongo.Collection('users');
//////////////////////////////////////////////////////////////////////////////

}}},"server":{"main.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////
//                                                                          //
// server/main.js                                                           //
//                                                                          //
//////////////////////////////////////////////////////////////////////////////
                                                                            //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let LinksCollection;
module.link("/imports/api/links", {
  LinksCollection(v) {
    LinksCollection = v;
  }

}, 1);
let UsersCollection;
module.link("/imports/api/users", {
  UsersCollection(v) {
    UsersCollection = v;
  }

}, 2);
let LoanApplicationCollection;
module.link("/imports/api/loan-application", {
  LoanApplicationCollection(v) {
    LoanApplicationCollection = v;
  }

}, 3);

function insertLink(_ref) {
  let {
    title,
    url
  } = _ref;
  LinksCollection.insert({
    title,
    url,
    createdAt: new Date()
  });
}

Meteor.startup(() => {
  // If the Links collection is empty, add some data.
  console.log("started"); // console.log(UsersCollection.findAll());

  if (LinksCollection.find().count() === 0) {
    insertLink({
      title: 'Do the Tutorial',
      url: 'https://www.meteor.com/tutorials/react/creating-an-app'
    });
    insertLink({
      title: 'Follow the Guide',
      url: 'http://guide.meteor.com'
    });
    insertLink({
      title: 'Read the Docs',
      url: 'https://docs.meteor.com'
    });
    insertLink({
      title: 'Discussions',
      url: 'https://forums.meteor.com'
    });
  }
});
//////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".ts",
    ".jsx"
  ]
});

var exports = require("/server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvbGlua3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2xvYW4tYXBwbGljYXRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL3VzZXJzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnQiLCJMaW5rc0NvbGxlY3Rpb24iLCJNb25nbyIsImxpbmsiLCJ2IiwiQ29sbGVjdGlvbiIsIkxvYW5BcHBsaWNhdGlvbkNvbGxlY3Rpb24iLCJVc2Vyc0NvbGxlY3Rpb24iLCJNZXRlb3IiLCJpbnNlcnRMaW5rIiwidGl0bGUiLCJ1cmwiLCJpbnNlcnQiLCJjcmVhdGVkQXQiLCJEYXRlIiwic3RhcnR1cCIsImNvbnNvbGUiLCJsb2ciLCJmaW5kIiwiY291bnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUFBLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNDLGlCQUFlLEVBQUMsTUFBSUE7QUFBckIsQ0FBZDtBQUFxRCxJQUFJQyxLQUFKO0FBQVVILE1BQU0sQ0FBQ0ksSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0QsT0FBSyxDQUFDRSxDQUFELEVBQUc7QUFBQ0YsU0FBSyxHQUFDRSxDQUFOO0FBQVE7O0FBQWxCLENBQTNCLEVBQStDLENBQS9DO0FBRXhELE1BQU1ILGVBQWUsR0FBRyxJQUFJQyxLQUFLLENBQUNHLFVBQVYsQ0FBcUIsT0FBckIsQ0FBeEIsQzs7Ozs7Ozs7Ozs7QUNGUE4sTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQ00sMkJBQXlCLEVBQUMsTUFBSUE7QUFBL0IsQ0FBZDtBQUF5RSxJQUFJSixLQUFKO0FBQVVILE1BQU0sQ0FBQ0ksSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0QsT0FBSyxDQUFDRSxDQUFELEVBQUc7QUFBQ0YsU0FBSyxHQUFDRSxDQUFOO0FBQVE7O0FBQWxCLENBQTNCLEVBQStDLENBQS9DO0FBRTVFLE1BQU1FLHlCQUF5QixHQUFHLElBQUlKLEtBQUssQ0FBQ0csVUFBVixDQUFxQixrQkFBckIsQ0FBbEMsQzs7Ozs7Ozs7Ozs7QUNGUE4sTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQ08saUJBQWUsRUFBQyxNQUFJQTtBQUFyQixDQUFkO0FBQXFELElBQUlMLEtBQUo7QUFBVUgsTUFBTSxDQUFDSSxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDRCxPQUFLLENBQUNFLENBQUQsRUFBRztBQUFDRixTQUFLLEdBQUNFLENBQU47QUFBUTs7QUFBbEIsQ0FBM0IsRUFBK0MsQ0FBL0M7QUFFeEQsTUFBTUcsZUFBZSxHQUFHLElBQUlMLEtBQUssQ0FBQ0csVUFBVixDQUFxQixPQUFyQixDQUF4QixDOzs7Ozs7Ozs7OztBQ0ZQLElBQUlHLE1BQUo7QUFBV1QsTUFBTSxDQUFDSSxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDSyxRQUFNLENBQUNKLENBQUQsRUFBRztBQUFDSSxVQUFNLEdBQUNKLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSUgsZUFBSjtBQUFvQkYsTUFBTSxDQUFDSSxJQUFQLENBQVksb0JBQVosRUFBaUM7QUFBQ0YsaUJBQWUsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG1CQUFlLEdBQUNHLENBQWhCO0FBQWtCOztBQUF0QyxDQUFqQyxFQUF5RSxDQUF6RTtBQUE0RSxJQUFJRyxlQUFKO0FBQW9CUixNQUFNLENBQUNJLElBQVAsQ0FBWSxvQkFBWixFQUFpQztBQUFDSSxpQkFBZSxDQUFDSCxDQUFELEVBQUc7QUFBQ0csbUJBQWUsR0FBQ0gsQ0FBaEI7QUFBa0I7O0FBQXRDLENBQWpDLEVBQXlFLENBQXpFO0FBQTRFLElBQUlFLHlCQUFKO0FBQThCUCxNQUFNLENBQUNJLElBQVAsQ0FBWSwrQkFBWixFQUE0QztBQUFDRywyQkFBeUIsQ0FBQ0YsQ0FBRCxFQUFHO0FBQUNFLDZCQUF5QixHQUFDRixDQUExQjtBQUE0Qjs7QUFBMUQsQ0FBNUMsRUFBd0csQ0FBeEc7O0FBSzlSLFNBQVNLLFVBQVQsT0FBb0M7QUFBQSxNQUFoQjtBQUFFQyxTQUFGO0FBQVNDO0FBQVQsR0FBZ0I7QUFDbENWLGlCQUFlLENBQUNXLE1BQWhCLENBQXVCO0FBQUNGLFNBQUQ7QUFBUUMsT0FBUjtBQUFhRSxhQUFTLEVBQUUsSUFBSUMsSUFBSjtBQUF4QixHQUF2QjtBQUNEOztBQUVETixNQUFNLENBQUNPLE9BQVAsQ0FBZSxNQUFNO0FBQ25CO0FBQ0FDLFNBQU8sQ0FBQ0MsR0FBUixDQUFZLFNBQVosRUFGbUIsQ0FHbkI7O0FBQ0EsTUFBSWhCLGVBQWUsQ0FBQ2lCLElBQWhCLEdBQXVCQyxLQUF2QixPQUFtQyxDQUF2QyxFQUEwQztBQUN4Q1YsY0FBVSxDQUFDO0FBQ1RDLFdBQUssRUFBRSxpQkFERTtBQUVUQyxTQUFHLEVBQUU7QUFGSSxLQUFELENBQVY7QUFLQUYsY0FBVSxDQUFDO0FBQ1RDLFdBQUssRUFBRSxrQkFERTtBQUVUQyxTQUFHLEVBQUU7QUFGSSxLQUFELENBQVY7QUFLQUYsY0FBVSxDQUFDO0FBQ1RDLFdBQUssRUFBRSxlQURFO0FBRVRDLFNBQUcsRUFBRTtBQUZJLEtBQUQsQ0FBVjtBQUtBRixjQUFVLENBQUM7QUFDVEMsV0FBSyxFQUFFLGFBREU7QUFFVEMsU0FBRyxFQUFFO0FBRkksS0FBRCxDQUFWO0FBSUQ7QUFDRixDQXpCRCxFIiwiZmlsZSI6Ii9hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5cbmV4cG9ydCBjb25zdCBMaW5rc0NvbGxlY3Rpb24gPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignbGlua3MnKTtcbiIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSBcIm1ldGVvci9tb25nb1wiO1xuXG5leHBvcnQgY29uc3QgTG9hbkFwcGxpY2F0aW9uQ29sbGVjdGlvbiA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCdsb2FuQXBwbGljYXRpb25zJyk7IiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuXG5leHBvcnQgY29uc3QgVXNlcnNDb2xsZWN0aW9uID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ3VzZXJzJyk7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IExpbmtzQ29sbGVjdGlvbiB9IGZyb20gJy9pbXBvcnRzL2FwaS9saW5rcyc7XG5pbXBvcnQgeyBVc2Vyc0NvbGxlY3Rpb24gfSBmcm9tICcvaW1wb3J0cy9hcGkvdXNlcnMnO1xuaW1wb3J0IHsgTG9hbkFwcGxpY2F0aW9uQ29sbGVjdGlvbiB9IGZyb20gJy9pbXBvcnRzL2FwaS9sb2FuLWFwcGxpY2F0aW9uJztcblxuZnVuY3Rpb24gaW5zZXJ0TGluayh7IHRpdGxlLCB1cmwgfSkge1xuICBMaW5rc0NvbGxlY3Rpb24uaW5zZXJ0KHt0aXRsZSwgdXJsLCBjcmVhdGVkQXQ6IG5ldyBEYXRlKCl9KTtcbn1cblxuTWV0ZW9yLnN0YXJ0dXAoKCkgPT4ge1xuICAvLyBJZiB0aGUgTGlua3MgY29sbGVjdGlvbiBpcyBlbXB0eSwgYWRkIHNvbWUgZGF0YS5cbiAgY29uc29sZS5sb2coXCJzdGFydGVkXCIpO1xuICAvLyBjb25zb2xlLmxvZyhVc2Vyc0NvbGxlY3Rpb24uZmluZEFsbCgpKTtcbiAgaWYgKExpbmtzQ29sbGVjdGlvbi5maW5kKCkuY291bnQoKSA9PT0gMCkge1xuICAgIGluc2VydExpbmsoe1xuICAgICAgdGl0bGU6ICdEbyB0aGUgVHV0b3JpYWwnLFxuICAgICAgdXJsOiAnaHR0cHM6Ly93d3cubWV0ZW9yLmNvbS90dXRvcmlhbHMvcmVhY3QvY3JlYXRpbmctYW4tYXBwJ1xuICAgIH0pO1xuXG4gICAgaW5zZXJ0TGluayh7XG4gICAgICB0aXRsZTogJ0ZvbGxvdyB0aGUgR3VpZGUnLFxuICAgICAgdXJsOiAnaHR0cDovL2d1aWRlLm1ldGVvci5jb20nXG4gICAgfSk7XG5cbiAgICBpbnNlcnRMaW5rKHtcbiAgICAgIHRpdGxlOiAnUmVhZCB0aGUgRG9jcycsXG4gICAgICB1cmw6ICdodHRwczovL2RvY3MubWV0ZW9yLmNvbSdcbiAgICB9KTtcblxuICAgIGluc2VydExpbmsoe1xuICAgICAgdGl0bGU6ICdEaXNjdXNzaW9ucycsXG4gICAgICB1cmw6ICdodHRwczovL2ZvcnVtcy5tZXRlb3IuY29tJ1xuICAgIH0pO1xuICB9XG59KTtcbiJdfQ==
