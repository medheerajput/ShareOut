const form = document.querySelector("form"),
fileInput = document.querySelector(".file-input"),
progressArea = document.querySelector(".progress-area"),
uploadedArea = document.querySelector(".uploaded-area");
form.addEventListener("click", () =>{
  fileInput.click();
});
fileInput.onchange = ({target})=>{
  let file = target.files[0];
  console.log("your file:",file)
  if(file){
    let fileName = file.name;
    if(fileName.length >= 12){
      let splitName = fileName.split('.');
      fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
    }
    const formData=new FormData();
    formData.append("file",file);
    const name='dheeraj'
    console.log('formData :',formData.get('file'))
    // main.js

// POST request using fetch()
fetch("/api/files", {
	
	// Adding method type
	method: "POST",
	
	// Adding body or contents to send
	body: formData.get('file'),
	
	// Adding headers to the request
	headers: {
		"Content-Type" : "image/jpeg"
	}
})

// Converting to JSON
.then(response => response.json())

// Displaying results to console
.then(json => console.log(json));

}
}
