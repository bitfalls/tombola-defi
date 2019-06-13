let currentProvider = new ethers.providers.JsonRpcProvider('https://rpc-bitfalls1.lisinski.online', 385);
let abi = [
	{
		"constant": false,
		"inputs": [],
		"name": "join",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "pickOne",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "reRoll",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "creator",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getNumberOfParticipants",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "players",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "playing",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "startTime",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "winner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

let pk = getUrlParameter('pk');
let wallet;
if (pk) {
    wallet = new ethers.Wallet(pk);
} else {
    wallet = ethers.Wallet.createRandom();
    pk = wallet.privateKey;
}
wallet = wallet.connect(currentProvider);
let contractAddress = "0xbfe473d5f884e059b567f957cada223c884f7419";

let tombolaContract = new ethers.Contract(contractAddress, abi, wallet);

async function getBalance() {
    currentProvider.getBalance(wallet.address).then((balance) => {
        // balance is a BigNumber (in wei); format is as a string (in ether)
        let etherString = ethers.utils.formatEther(balance);

        console.log("Address: " + wallet.address);
        console.log("Balance: " + etherString);
        document.querySelector("#thisAddress").innerHTML = "<a href='https://preglednik.lisinski.online/account/"+wallet.address+"' target='_blank'>"+wallet.address+"</a>";
        document.querySelector("#stanje").innerText = etherString;
		document.querySelector(".osnove").style = "display: block";
		
		tombolaContract.getNumberOfParticipants().then(function(result){
			$("#numPlayers").text(result);
		});
    });
}

setInterval(function(){
    getBalance();
    getVotes();
}, 5000);

async function getVotes() {

	tombolaContract.playing(wallet.address).then(function(result) {
		console.log(result);
		if (!result) {
			$("#ubikButton").attr("disabled", false);
			document.getElementById("ubikButton").innerText = "Igraj";
		} else {
			$("#ubikButton").attr("disabled", "disabled");
			document.getElementById("ubikButton").innerText = "Igrao - čekaj izvlačenje";
		}
	});

	tombolaContract.winner().then(function(result){
		if (result == "0x0000000000000000000000000000000000000000") {
			$("#winnerinfo").text("Nitko");
			$("#drawButton").attr("disabled", false).text("Izvuci pobjednika");
		} else {
			if (result == wallet.address) {
				$("#winnerinfo").text(result + " - ČESTITAMO! Javite se na contact@bitfalls.com čim prije!!");
			} else {
				$("#winnerinfo").text(result);
			}
			$("#drawButton").attr("disabled", "disabled").text("Pobjednik izvučen");
		}
	});
}

document.querySelector("#ubikButton").addEventListener("click", igraj);
document.querySelector("#drawButton").addEventListener("click", draw);

function draw(e) {
	let tx = tombolaContract.join();
	$(e.currentTarget).parent().find("button").attr("disabled", "disabled").text("Šaljem...");
}

function igraj(e) {
	localStorage.setItem("played", true);
	let tx = tombolaContract.join();
	$(e.currentTarget).parent().find("button").attr("disabled", "disabled").text("Šaljem...");
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function slugify(someString) {
    return ethers.utils.id(someString).slice(0, 7);
}