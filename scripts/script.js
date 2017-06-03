$(function () {
	console.log("Helloe");
	$("#div-outer div").each(function() { 
		console.log("test");
		this.attr('id');		
	});
});