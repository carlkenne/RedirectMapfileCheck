var fs = require('fs');
var commander = require('commander');

commander
  .version('0.0.1')
  .option('-f, --filename [name]', 'name of mapfile')
  .parse(process.argv);

console.log('%s',commander.filename)

fs.readFile(commander.filename, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  analyze(data);
});

function flatten(arrayOfArrays){
	var flattened = arrayOfArrays.reduce(function(a, b) {
	  return a.concat(b);
	});
}

function analyze(str) {
	var lines = str.split('\n').map(function(line, index){
		return { 
			from: line.split(' ')[0],
			to: line.split(' ')[1],
			source: index + 1
		 }
	});

	var errors = lines.map(function(firstLine){
		return lines.filter(function(compareLine){
			return firstLine.to == compareLine.from 
		}).map(function(compareLine){
			return "Unneccessary reroute chain detected: " + firstLine.from + "(#" + firstLine.source + ") => " + firstLine.to + " => " + compareLine.to +"(#" + compareLine.source + ")";
		})
	}).filter(function(result){
		return result.length > 0;
	}).reduce(function(a,b){
		return a.concat(b);
	});

	fs.writeFile("error.log", errors.join("\r\n"), { flags: "w" });
}