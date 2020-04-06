var QR = "";
var tempQR = "";
var levelReq = 3;
var levelPerm = false;
var alreadyScanned = false;
var level = 0;
var permitted = "no";
var testDate = "";
var duration = 0;
var currentValidity = false;

function decode(qr) {

  var result =   $.base64.decode(qr);

  level = result[2];
  if (level >= levelReq) {

    levelPerm = true;

  }
  testDate = QR.slice(4,14);
  duration = parseInt(QR.slice(15,18));

}


document.addEventListener("DOMContentLoaded", event => {
  let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
  Instascan.Camera.getCameras().then(cameras => {
    scanner.camera = cameras[cameras.length - 1];
    scanner.start();
  }).catch(e => console.error(e));

  scanner.addListener('scan', content => {
    tempQR = content;

    if (alreadyScanned == false) {

      Qr = tempQR;
      alreadyScanned = true;
      decode(QR);
      if (levelPerm) { permitted = "yes"   } else {   permitted = "no"     }
      $("#div1").html("<p>Permitted : " + permitted + " </p> <p>Level: "+ level +" </p> tested: "+ testDate +" <p>immunity duraition: "+ duration +" days  <p>")

    };

  });

});





$("#button").click(function(){



if (QR != "") {
// server is not up yet look at git : https://github.com/raember/versusviruspassapi to build blockchain server
  $.ajax({url: "http://server.io/cert/" + encodeURIComponent(QR) + "/" + $("#passport").val() , statusCode:{

    200:function(){
    $("#div1").append("<p>Verified</p>");
    QR = "";
    alreadyScanned = false;
    levelPerm = false;
    $("#passport").val("");
    level = 0;
  },

  406:function(){
  $("#div1").append("<p>Invalid, could not be verified</p> <p>please make sure passport code is correct<p>");
  QR = "";
  levelPerm = false;
  alreadyScanned = false;
  level = 0;


},
  404:function(){
  $("#div1").append("<p>Invalid test, entry not found</p> <p>please make sure passport code is correct<p>");
  QR = "";
  levelPerm = false;
  alreadyScanned = false;
  level = 0;

},


}});

}else {
  $("#div1").append("<p>Invalid</p> <p>please Scan Qr code<p>");
}

});
