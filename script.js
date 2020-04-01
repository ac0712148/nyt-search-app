
function buildQueryURL() {
  //Preparing the queryURL and queryParam object
  var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
  var params = { "api-key": "MlffiuKOXjtQ7DOcxgqDSYZOQlT5JXnk" };

  //User input variables
  var startYear;
  var endYear;

  //Set q in params for search input
  params.q = $("#search-term").val().trim();

  //Get start year and add beginning month and day
  startYear = $("#start-year").val().trim();
  if (parseInt(startYear)) { params.begin_date = startYear + "0101"; }
  //Get end year and add ending month and day
  endYear = $("#end-year").val().trim();
  if (parseInt(endYear)) { params.end_date = endYear + "1231"; }

  //Return prepped query String
  return queryURL + $.param(params);
}

function updatePage(data) {
  // Get the number of articles to display
  var numArticles = $("#article-count").val();

  // Loop through and build elements 
  for (var i = 0; i < numArticles; i++) {
    // Get article info at current index
    var article = data.response.docs[i];

    //Counter for article starting at 1
    var articleCount = i + 1;

    //Create a list group to contain articles and prep content
    var articleList = $("<ul>");
    articleList.addClass("list-group");
    $("#article-section").append(articleList);

    var headline = article.headline;
    var articleListItem = $("<li class='list-group-item articleHeadline'>");
    if (headline && headline.main) {
      console.log(headline.main);
      articleListItem.append(
        "<span class='label label-primary'>" +
          articleCount +
          "</span>" +
          "<strong> " +
          headline.main +
          "</strong>"
      );
    }

    //Get data from article and append to listItem
    var byline = article.byline;
    if (byline && byline.original) {
      articleListItem.append("<h5>" + byline.original + "</h5>");
    }
    var section = article.section_name;
    if (section) {
      articleListItem.append("<h5>Section: " + section + "</h5>");
    }
    var pubDate = article.pub_date;
    if (pubDate) {
      articleListItem.append("<h5>" + article.pub_date + "</h5>");
    }
    articleListItem.append("<a href='" + article.web_url + "'>" + article.web_url + "</a>");

    // Append the listItem to the list
    articleList.append(articleListItem);
  }
}

//Clear the articles
function clear() {
  $("#article-section").empty();
}

//Click event for when search button is pressed
$("#run-search").on("click", function(event) {
  event.preventDefault();
  clear();

  //Get queryURL
  var queryURL = buildQueryURL();

  //Use ajax request to get data
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(updatePage);
});

//Click event for when clear button is pressed
$("#clear-all").on("click", clear);
