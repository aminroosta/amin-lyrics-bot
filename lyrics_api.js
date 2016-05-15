var axios = require('axios');
var cheerio = require('cheerio');
var google = require('google');
google.resultsPerPage = 10;

function search(query) {
	return new Promise(function(accept, reject){
		google(query + ' site:www.metrolyrics.com', function (err, res){
		  if (err) {
		  	reject(err);
		  	return;
		  }

		  var ret = [];

		  for (var i = 0; i < res.links.length; ++i) {
		    var link = res.links[i];
		    var href = link.href;
		    if(href.startsWith('http://www.metrolyrics.com/') && href.endsWith('.html')) {
		    	ret.push(href);
		    }
		    // console.log(link.title + ' - ' + link.href)
		    // console.log(link.description + "\n")
		  }
		  accept(ret);
		});
	});
}

function lyric(url){
	return axios.get(url)
		 .then(function(response){
		 	var page = response.data;
		 	var $ = cheerio.load(page);
		 	var html = $('#lyrics-body-text');
		 	html.children('p').each(function(inx, p){
		 		p = $(p);
		 		p.text('\n' + p.text() +'\n');
		 	});
		 	return html.text();
		 });
}

module.exports = {
	search: search,
	lyric: lyric
};

