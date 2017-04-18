const fs = require('fs');
const _ = require('underscore');

exports.upload = function(req, res, next){

	var file = req.files.file;

	var savePath = __dirname + '/../upload/'+file.originalFilename;

	fs.readFile(file.path, 'utf8', function (err, data) { //read a file

		if(data){

			res.send(calculation(data));

		}else{

			res.status(500).send({ error: 'Internal Server Error ! Cannot read a file.' });

		}

	});

};

var calculation = function(file){
	/**
	* Calculate statistics in a file
	* @param {String} file
	* @return {Json} results
	*/
	var lineArray = file.toString().split('\n'); //split lines into array

	var lineNoEmpty = []; //keep lines with no empty line

	//keep line with no empty space
	_.each(lineArray, function(line){

		if(line.toString() !== ''){
			lineNoEmpty.push(line);
		}

	});

	var lineCount = lineNoEmpty.length; //keep line count

	var statisticsArray = []; //keep statistics number 

	var wordCount = 0; //keep word count

	var letterObj = {}; //keep object of letter count

	var results = {};
	
	_.map(lineArray, function(line){ //iterate lines
		
		var tmp = line.toString().split(' '); //sprint word into array

		_.map(tmp, function(word){ //iterate word
			
			if(word !== ''){

				wordCount += 1; //count a word

				//remove special char
				var wordNoSpecial = word.toString().replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''); 

				statisticsArray.push(wordNoSpecial.length); //push the statistics number into array

				_.map(wordNoSpecial, function(char){ //iterate chars in words

					var lowerChar = char.toLowerCase();

					//add letter count to letter object
					if(letterObj[lowerChar]){
						letterObj[lowerChar] += 1;
					}else{
						letterObj[lowerChar] = 1;
					}

				});

			}

		})
		
	});	

	results = {
		'wordCount': wordCount,
		'lineCount': lineCount,
		'mean': calculateMean(statisticsArray),
		'mode': calculateMode(statisticsArray),
		'median': calculateMedian(statisticsArray),
		'mostCommonLetter': calculateMostCommonLetter(letterObj)
	};

	return results
};

var calculateMostCommonLetter = function(letterObj){
	/**
	* find maximum letter count
	* @param {Json} letter Object
	* @return {Json} maximumObj
	*/
	var arrayObj = []; //keep array object of letter object

	//assign value to arrayObj
	_.map(letterObj, function(val, key){

		arrayObj.push({
			'letter' : key,
			'count' : val
		});

	});

	var maximumObj = [arrayObj[0]]; //keep maximum letter count array obj

	//find maximum letter count (support if it's > 2 values)
	_.each(arrayObj, function(obj, idx){

		if(idx > 0){

			if(obj.count > maximumObj[0].count){

				maximumObj = [];
				maximumObj.push(obj);

			}else if(obj.count == maximumObj[0].count){

				maximumObj.push(obj);

			}
			
		}

	});

	return maximumObj;

};

var calculateMean = function(statistics){
	/**
	* calculate mean
	* @param {Array} statistics
	* @return {Float} mean
	*/	
	var mean = 0;
	var count = 0;

	_.each(statistics, function(val){
		count += val;
	});

	mean = count / statistics.length;

	return mean.toFixed(2);
}

var calculateMode = function(statistics){
	/**
	* calculate mode
	* @param {Array} statistics
	* @return {Float} mode
	*/	
	var modeObj = {};

	var modeArrObj = [];//keep array object of mode

	//assign value to mode Object
	_.each(statistics, function(val){

		if(modeObj[val]){

			modeObj[val] += 1;

		}else{

			modeObj[val] = 1;

		}		

	});

	//assign value to array object
	_.map(modeObj, function(val, key){

		modeArrObj.push({
			'wordCount': key,
			'count': val
		});

	});

	mode = [modeArrObj[0]]; //keep mode array obj

		//find mode (support if it's > 2 values)
	_.each(modeArrObj, function(obj, idx){

		if(idx > 0){

			if(obj.count > mode[0].count){

				mode = [];
				mode.push(obj);

			}else if(obj.count == mode[0].count){

				mode.push(obj);

			}

		}

	});

	return mode;
};

var calculateMedian = function(statistics){
	/**
	* calculate median
	* @param {Array} statistics
	* @return {Float} median
	*/	
	var median = 0; //keep median

	var index = 0; //keep index of median

	//keep reordering data
	var sortArr = statistics.sort(function(a, b){
		return a - b;
	}); 

	//calculate median
	if( sortArr.length % 2 == 0 ){

		index = ( sortArr.length / 2 ) - 1;
		median = sortArr[index];

	}else{

		index = ( (sortArr.length+1) / 2 ) - 1;
		median = sortArr[index];

	}

	return median;
};

