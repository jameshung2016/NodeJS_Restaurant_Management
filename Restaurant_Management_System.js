var fs = require("fs");
var http = require("http");
var child_process = require("child_process");

// Create class restaurant
function Restaurant(){
	this.tax = "";
	this.name = "";
	this.address = "";
	this.fund = 0;
}

// Create object restaurant
var res = new Restaurant();

var count = 0;
var status = "";		// Select status	
var resArr = [];		// Array restaurant
var resArr2 = []; 	    // Array of restaurant after sort
var indexUpdate = -1;	// position update restaurant
						// indexUpdate = -1 : first initial value
						// indexUpdate >= 0 : position update

process.stdin.on("data",function(data){
	if(status === ""){					// Status: select menu 1 -> 6
		var choose = data.toString();
		handleMenu(choose);				// Call function handle menu
	}else if(status === "return_menu"){	// Status: press any key to return menu
		showMenu();						
		status = "";
	}else if(status === "add"){			// Status: input restaurant
		switch(count){
		case 0:
			res.tax = data.toString();
			process.stdin.pause();
			console.log("Input restaurant's name: ");
			count++;
			process.stdin.resume();
			break;
		case 1:
			res.name = data.toString();
			process.stdin.pause();
			console.log("Input restaurant's Address: ");
			count++;
			process.stdin.resume();
			break;
		case 2:
			res.address = data.toString();
			process.stdin.pause();
			console.log("Input restaurant's Fund: ");
			count++;
			process.stdin.resume();
			break;
		case 3:
			res.fund = data.toString();
			process.stdin.pause();
			count = 0;
			// Push restaurant into array
			resArr.push({"tax": res.tax, "name": res.name, "address": res.address, "fund": res.fund});
			console.log("Restaurant added successfull.");
			console.log("\nPress any key to return menu...");
			status = "return_menu";
			process.stdin.resume();
		}
	}else if(status === "find"){	// Status: find restaurant
		var tax = data.toString();
		findData(tax);				// Call method find restaurant
	}else if(status === "update"){	// Status: update restaurant
		if(indexUpdate == -1){
			var tax = data.toString();
			updateData(tax);		// Call method update restaurant
		}else{
			switch(count){
			case 0:
				res.tax = data.toString();
				process.stdin.pause();
				console.log("Input restaurant's name: ");
				count++;
				process.stdin.resume();
				break;
			case 1:
				res.name = data.toString();
				process.stdin.pause();
				console.log("Input restaurant's Address: ");
				count++;
				process.stdin.resume();
				break;
			case 2:
				res.address = data.toString();
				process.stdin.pause();
				console.log("Input restaurant's Fund: ");
				count++;
				process.stdin.resume();
				break;
			case 3:
				res.fund = data.toString();
				process.stdin.pause();
				count = 0;
				// update restaurant at specific position
				resArr[indexUpdate] = {"tax": res.tax, "name": res.name, "address": res.address, "fund": res.fund};
				console.log("Restaurant updated successfull.");
				console.log("\nPress any key to return menu...");
				status = "return_menu";
				process.stdin.resume();
			}
		}
	}else if(status === "delete"){
		var tax = data.toString();
		deleteData(tax);		// Call method delete restaurant
	}
});


// Menu Console
function showMenu(){
	console.log("\n\n" +
			" .-. \n"+                                                          
			"  (_) )-.               /                                   /   \n" +   
			"     /   \\   .-. .  ---/---.-.  .  .-.  ).--..-.  .  .-.---/---\n" + 
			"    /     )./.-'_/ \\  /   (  |   )/   )/    (  |   )/   ) /    \n" +     
			" .-/  `--' (__.'/ ._)/     `-'-''/   (/      `-'-''/   ( /      \n" +      
			"(_/     `-._)  /                      `-                `-      \n" +
			".--------------------------------------------------------------.\n" +
			"                                    (Develop by Tong Phuoc Hung)\n\n" +
			"	[1] Add new restaurant. 								     \n" +
			"	[2] View all restaurants.                                    \n" +
			"	[3] Find restaurant. 								         \n" +
			"	[4] Update restaurant. 									     \n" +
			"	[5] Delete restaurant. 									     \n" +
			"	[6] Load all restaurant on browser(*) 					     \n" +
			"	[7] Save & Exit. 										     \n\n" +
			"Choose your option: 											 \n");
	process.stdin.resume();
}


// Method handle Menu
function handleMenu(choose){
	switch(parseInt(choose)){
	case 1:
		status = "add";
		console.log("Input restaurant's tax: ");
		break;
	case 2:
		resArr.forEach(function(elt, i) {
			console.log(resArr[i].tax.trim()+ "\t" +resArr[i].name.trim()+ "\t" +resArr[i].address.trim()+ "\t" +resArr[i].fund.trim());
		});
		console.log("-----------------------------");
		console.log("Total restaurant: " +resArr.length);
		console.log("\nPress any key to return menu...");
		status = "return_menu";
		break;
	case 3:
		status = "find";
		console.log("Input restaurant's tax you want to find: ");
		break;
	case 4:
		status = "update";
		console.log("Input restaurant's tax you want to update: ");
		break;
	case 5:
		status = "delete";
		console.log("Input restaurant's tax you want to delete: ");
		break;
	case 6:
		initChild_process();
		break;
	case 7:
		writeFile(resArr);
		setTimeout(function() {
			process.exit(0);
		}, 1000);
		break;
	}
}


// Method write to file
function writeFile(data){
	var str = JSON.stringify(data);		// convert JSON to string
	fs.writeFile("restaurantList.txt", str, "utf8", function(err) {
		if(err){
			console.log(err.message);
		}else{
			console.log("Database has saved successful.");
		}
	});
}


// Method read from file & assign to array Restaurant
function readFile(){
	var data = fs.readFileSync("restaurantList.txt");
	resArr = JSON.parse(data.toString());
}


// Method find restaurant
function findData(tax){
	var check = false;
	for(var i=0; i<resArr.length; i++){
		if(resArr[i].tax === tax){
			console.log(resArr[i].tax.trim()+ "\t" +resArr[i].name.trim()+ "\t" +resArr[i].address.trim()+ "\t" +resArr[i].fund.trim());
			check = true;
			break;
		}
	}
	if(!check){
		console.log("Cannot find restaurant.");
	}

	console.log("\nPress any key to return menu...");
	status = "return_menu";
}


// Method update restaurant
function updateData(tax){
	var check = false;
	for(var i=0; i<resArr.length; i++){
		if(resArr[i].tax === tax){
			console.log(resArr[i].tax.trim()+ "\t" +resArr[i].name.trim()+ "\t" +resArr[i].address.trim()+ "\t" +resArr[i].fund.trim());
			check = true;
			indexUpdate = i;
			break;
		}
	}
	if(!check){
		console.log("Taxcode is invalid.");
		console.log("\nPress any key to return menu...");
		status = "return_menu";
	}else{
		console.log("Input restaurant's tax: ");
	}
}


// Method delete restaurant
function deleteData(tax){
	var index = -1;
	for(var i=0; i<resArr.length; i++){
		if(resArr[i].tax === tax){
			console.log(resArr[i].tax.trim()+ "\t" +resArr[i].name.trim()+ "\t" +resArr[i].address.trim()+ "\t" +resArr[i].fund.trim());
			index = i;
			break;
		}
	}
	if(index == -1){
		console.log("Taxcode is invalid.");
		console.log("\nPress any key to return menu...");
		status = "return_menu";
	}else{
		resArr.splice(index, 1);
		console.log("Restaurant deleted successfull.");
		console.log("\nPress any key to return menu...");
		status = "return_menu";
	}
}

function createServer(){
	http.createServer(function(req, res){
		res.writeHead(200,{"Content-Type" : "text/html"});
		res.write("<h2>THE LIST RESTAURANTS</h2>")
		res.write("<table border='1' style='width: 70%'>" +
				"<tr><th>Tax</th><th>Name</th><th>Address</th><th>Fund</th></tr>");
		for(var i=0; i<resArr2.length; i++){
			res.write("<tr><td>" +resArr2[i].tax.trim()+ "</td><td>" +resArr2[i].name.trim()+ "</td><td>" +resArr2[i].address.trim()+ "</td><td>" +resArr2[i].fund.trim()+ "</td></tr>");
		}
		res.write("</table>");
		res.end();
	}).listen(8888);
}

function initChild_process(){
	child_process.exec("firefox -new-window http://localhost:8888", {cwd: "C:\\Program Files (x86)\\Mozilla Firefox\\"}, function(err, stdout, stderr){
		if(err){
			console.log(err.toString());
		}else if(stderr !== null){
			console.log(stderr);
		}else{
			console.log(stdout);
		}
	});
	console.log("\nPress any key to return menu...");
	status = "return_menu";
}

// Method sort restaurant and return to resArr2[]
function sortRestaurant(){
	var fundArr = [];
	// Get array of restaurant's fund
	resArr.forEach(function(elt, i) {
		fundArr[i] = resArr[i].fund;
	});
	fundArr.sort(function(a, b) {return a-b});		// sort array of fund by ascending
	
	for(var i=0; i<fundArr.length; i++){
		for(var j=0; j<resArr.length; j++){
			if(parseInt(fundArr[i]) == parseInt(resArr[j].fund.trim())){
				resArr2.push(resArr[j]);
			}
		}
	}
}

showMenu();
readFile();
createServer();
sortRestaurant();

