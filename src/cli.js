import path from 'path';
import fs from 'fs';
import Catalog from './catalog';

// Directory to store all the data in (should be a config option)
const dataDir = path.join(process.cwd(), '_data');
// Create data directory if it doesn't exist yet
if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir);
}

function init_catalog() {
	return new Catalog(dataDir);
}

// npm run cli --numAuthors 
if (process.env.npm_config_numAuthors) {
	const c = init_catalog();
	c.getAuthors(function(err, docs) {
		console.log(`There are ${docs.length} authors`);
	});
// npm run cli --listAuthors 
} else if (process.env.npm_config_listAuthors) {
	const c = init_catalog();
	c.getAuthors(function(err, docs) {
		for (var doc of docs) {
			console.log(`${doc.author} (${doc.count} items)`);
		}
	});
// npm run cli --search=query 
} else if (process.env.npm_config_search) {
	const c = init_catalog();
	c.search(process.env.npm_config_search, function(err, docs) {
		if (!docs.length) {
			console.log(`0 results for "${process.env.npm_config_search}"`);
		}
		for (var doc of docs) {
			console.log(`${doc.author} : ${doc.title}`);
		}
	});
}
// by default print help
else {
	console.log("--numAuthors\tPrint the number of authors in the catalog");
	console.log("--listAuthors\tLists the authors in the catalog");
	console.log("--search\tQueries the catalog");
}
