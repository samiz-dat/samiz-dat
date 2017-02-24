/*
 * OPF metadata handling
 * Ability to do basic reading and writing of Calibre's opf (xml) metadata format
 */
import fs from 'fs';
import Promise from 'bluebird';
import xml2js from 'xml2js';

Promise.promisifyAll(fs);
Promise.promisifyAll(xml2js);

// Extracted Opf metadata gets packaged into an OPF
class OPF {
  constructor(parsedXmlData) {
    this.data = parsedXmlData;
    this.obj = parsedXmlData.package.metadata[0];
  }

  get title() {
    return this.obj['dc:title'][0];
  }

  set title(s) {
    this.obj['dc:title'] = s;
  }

  get authors() {
    return this.obj['dc:creator'].map(c => c._);
  }
}

// Parses an opf file
export function opf2js(fileLoc, encoding = 'utf-8') {
  return fs.readFileAsync(fileLoc, encoding)
    .then(data => xml2js.parseStringAsync(data))
    .then(data => new OPF(data))
    .catch((err) => { console.log(err); });
}

// Writes an opf file from an OPF object
export function js2opf(fileLoc, obj) {
  console.log(`Writing OPFs is not implemented yet: ${obj}`);
}
