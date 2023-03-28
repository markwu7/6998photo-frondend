var apigClient = apigClientFactory.newClient({ apiKey: "bDIGszy43q1tj2xYi0WTZ5lEq6s5SdbY7DhKDAC0" });

function search() {
  var searchTerm = document.getElementById("searchbar").value;
  
  var params = {
    "q": searchTerm
  };

  apigClient.searchGet(params, {}, {})
    .then(function (result) {
      showImages(result.data);
    }).catch(function (result) {
      console.log(result);
    });
}

function showImages(data) {
  var imagesDiv = document.getElementById("images")
  var urls = data["results"]

  var complete = ""
  var row = "<div class=\"row\">"
  for (let i = 0; i < urls.length; i++) {
    row += `<img src=${urls[i]} height="500">`
    if (i % 5 == 0) {
      row += "</div>"
      complete += row
      row = "<div class=\"row\">"
    }
  }

  if (row != "<div class=\"row\">") {
    complete += row
    complete += "</div>"
  }

  imagesDiv.innerHTML += complete
}

function upload() {
  let image_src = document.getElementById("image");
  let image = image_src.value;
	let labels = document.getElementById("labels").value;
  let imageName = image.split('\\').pop();

  const file = image_src.files[0];
  const reader = new FileReader();
  
  reader.onload = function (e) {
    let binary_val = e.target.result;
    let params = {
      "filename": imageName,
      "x-amz-meta-customLabels": labels,
      "Content-Type": "text/base64"
    }

    apigClient.uploadPut(params, btoa(binary_val), {})
      .then(function(result){
          //This is where you would put a success callback
          console.log(result);
          alert('Image uploaded successfully!')
      }).catch(function(result){
          //This is where you would put an error callback
          console.log(result)
      });
  }; 

  reader.readAsBinaryString(file);
}

function searchByVoice(){
  var SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
  var status = document.getElementById("status")

  if (SpeechRecognition != undefined) {
    var recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onstart = () => {
      status.innerHTML = "Start listening..."
    }

    recognition.onresult = (event) => {
      status.innerHTML = ""
      var speechToText = event.results[0][0].transcript;
      document.getElementById("searchbar").value = speechToText;
    }
  } else {
    alert("Voice accessibility is not supported on your browser")
  }
}