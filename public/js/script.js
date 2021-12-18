let form = document.querySelector("form");
let fileInput = document.querySelector(".file-input");
let progressArea = document.querySelector(".progress-area");
let uploadedArea = document.querySelector(".uploaded-area");
let send = document.querySelector(".send");

form.addEventListener("click", () =>{
  fileInput.click();
});
fileInput.onchange = ()=>{
  send.click();
  uploadedArea.innerHTML=`
  <li class="row">
  <div class="content upload">
    <i class="fas fa-file-alt"></i>
    <div class="details">
      <span class="name"> Uploading...</span>
      <span class="size"></span>
    </div>
  </div>
  <i class="fas fa-check"></i>
</li>
  `
}


let text = document.querySelector(".copy-text");

const copyText=()=>{
  let input = text.querySelector("input.text");
  input.select();
  document.execCommand("copy");
  text.classList.add("active");
  window.getSelection().removeAllRanges();
  setTimeout(function(){
    text.classList.remove("active");
  },2500);
}
