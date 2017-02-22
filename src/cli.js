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
	const a = c.getAuthors(function(err, docs) {
		console.log(`There are ${docs.length} authors`);
	});
// npm run cli --listAuthors 
} else if (process.env.npm_config_listAuthors) {
	const c = init_catalog();
	const a = c.getAuthors(function(err, docs) {
		for (var doc of docs) {
			console.log(`${doc.author} (${doc.count} items)`);
		}
	});
}
else {
	console.log("--numAuthors\tPrint the number of authors in the catalog");
	console.log("--listAuthors\tLists the authors in the catalog");
}
