// PDF-related functions
async function chatWithPDF(pdfurl, ques, newresp) {
  const { sourceId, response } = await sendMessageAndGetResponse(pdfurl, ques);
  newresp.children[0].innerText = response;
  generateSpeech(response);
}

async function sendMessageAndGetResponse(pdfUrl, question) {
  const headers = getHeaders();
  const sourceId = await addPDFViaURL(pdfUrl, headers);
  const response = await sendMessageToPDF(sourceId, question, headers);
  return { sourceId, response };
}

async function addPDFViaURL(pdfUrl, headers) {
  const data = { url: pdfUrl };
  const response = await axios.post(
    "https://api.chatpdf.com/v1/sources/add-url",
    data,
    { headers }
  );
  return response.data.sourceId;
}

async function sendMessageToPDF(sourceId, question, headers) {
  const data = {
    sourceId: sourceId,
    messages: [{ role: "user", content: question }],
  };
  const response = await axios.post(
    "https://api.chatpdf.com/v1/chats/message",
    data,
    { headers }
  );
  return response.data.content;
}

function getHeaders() {
  const apiKey = apikeys[0]; // Replace with your actual API key
  return {
    "x-api-key": apiKey,
    "Content-Type": "application/json",
  };
}
let API_KEY;

let lastRequestTime = 0;
const requestInterval = 2000; // Set the minimum interval between requests (in milliseconds)

async function generateSpeech(userres) {
  const currentTime = Date.now();

  // Check if enough time has passed since the last request
  if (currentTime - lastRequestTime < requestInterval) {
    // Delay the request if it's made too soon after the previous one
    await delay(requestInterval - (currentTime - lastRequestTime));
  }

  try {
    lastRequestTime = Date.now(); // Update last request time

    const inputText = userres;

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "tts-1",
        input: inputText,
        voice: "echo",
        response_format: "mp3",
        speed: 1.0,
      }),
    });

    if (response.ok) {
      const audioData = await response.blob();
      const audioUrl = URL.createObjectURL(audioData);

      const audioElement = document.querySelectorAll(".generatedAudio");
      audioElement[audio1].src = audioUrl;
      if (currentAudio) {
        currentAudio.pause();
      }
      audioElement[audio1].play();
      audioplay = document.querySelectorAll(".audioplay");
      console.log("Audio generated successfully and playing.");
    } else {
      console.error("Error generating audio:", response.statusText);
    }
  } catch (error) {
    console.error("Error generating audio:", error);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let currentAudio = null;
function toggleAudio(id) {
  const audio = document.querySelectorAll(".generatedAudio");
  if (currentAudio !== null && currentAudio !== audio[id]) {
    currentAudio.pause(); // Pause the currently playing audio
  }
  if (audio[id].paused) {
    audio[id].currentTime = 0;
    audio[id].play();
    currentAudio = audio[id];
  } else {
    audio[id].pause();
    currentAudio = null;
  }
}

// DOM elements and event listeners
let audio1 = -1;
const suggestionBox = document.querySelector("#suggestionBox");
const addBtn = document.querySelector("#addPDF");
const usrInp = document.querySelector("#userInput");
const snd = document.querySelector("#send");
const cht = document.querySelector("#chat");
const botresp =
  '<div class="botResponse"> </div><div class="audio1"><i class="fi fi-rr-user-robot"></i><audio class="generatedAudio" controls style="display:none;"></audio><div class="audioplay" onClick = "handleclick(this)" ><i style="font-size: 16px;" class="fi fi-rr-play-pause"></i></div></div>';
const userrep =
  '<i class="fi fi-rr-circle-user"></i><div class="userIn"></div>';
const loading = 'Loading  <div class="loader"></div>';
const suggestion1 = document.querySelectorAll(".suggestion1");
const menu = document.querySelector("#sidebtn");
const home = document.querySelector("#homebtn");
const side = document.querySelector("#sidepanel");
const chatpdfbtn = document.querySelector("#name2");
const exporttopdf = document.querySelector("#title");
const title = document.querySelector("#title");
const opt1 = document.querySelector("#opt1");
const opt0 = document.querySelector("#opt0");
const opt2 = document.querySelector("#opt2");
const opt3 = document.querySelector("#opt3");
const addbtn1 = document.querySelector("#add-btn");
const addbtn2 = document.querySelector("#addbtns");
const Apibtn = document.querySelector("#Apibtn");
const apiMain = document.querySelector("#apiMain");
const main = document.querySelector("#main");
const chatMain = document.querySelector("#chatMain");
const cross = document.querySelector("#cross");
var pdfUr, usrInput;
const apikeys = [null, null];

addBtn.addEventListener("click", () => {
  if (usrInp.placeholder == "Message") {
    usrInp.setAttribute("placeholder", "Enter URL");
  } else {
    usrInp.setAttribute("placeholder", "Message");
  }
});
// addbtn1.addEventListener('click', ()=>{
//     addbtn1.classList.add('dispnone')
//     addbtn2.classList.remove('dispnone')
// })
// addbtn2.addEventListener('click', ()=>{
//     addbtn1.classList.remove('dispnone')
//     addbtn2.classList.add('dispnone')
// })

snd.addEventListener("click", sndfun);

home.addEventListener("click", () => {
  side.classList.add("dispnone1");
});

menu.addEventListener("click", () => {
  console.log("click");
  if (side.classList == "dispnone1") {
    side.classList.remove("dispnone1");
  } else {
    side.classList.add("dispnone1");
  }
});

chatMain.addEventListener("click", () => {
  if (!(side.classList == "dispnone1")) {
    side.classList.add("dispnone1");
  }
});

usrInp.addEventListener("focus", () => {
  // console.log("Hell");
  addbtn2.classList.add("dispnone");
});

usrInp.addEventListener("input", () => {
  // console.log("Hell");
  addbtn2.classList.add("dispnone");
});

chatpdfbtn.addEventListener("click", () => {
  location.reload();
});

usrInp.addEventListener("blur", () => {
  if (!usrInp.value) {
    // console.log("Hell");
    addbtn2.classList.remove("dispnone");
  }
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sndfun();
  }
});

opt1.addEventListener("click", () => {
  openNewTab("about.html");
});

opt2.addEventListener("click", () => {
  openNewTab("Setting.html");
});

opt3.addEventListener("click", () => {
  openNewTab("license.html");
});

opt0.addEventListener("click", () => {
  apiMain.classList.replace("z-ind", "z-ind1");
  apiMain.classList.remove("dispnone");
  main.classList.add("blur");
});

function openNewTab(url) {
  window.open(url, "_blank");
}

const fun1 = () => {
  title.classList.remove("dispnone");
};
// Other functions
function sndfun() {
  addbtn2.classList.remove("dispnone");
  if (
    usrInp.value &&
    (document.getElementById("pdfFile").files[0] || usrInp.value)
  ) {
    if (usrInp.placeholder == "Enter URL") {
      var urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
      if (!urlPattern.test(usrInp.value)) {
        alert("Enter a valid URL");
      } else {
        pdfUr = usrInp.value;
        usrInp.value = "";
        usrInp.setAttribute("placeholder", "Message");
        title.classList.remove("dispnone");
        // title.innerText = pdfUr.substring(pdfUr.lastIndexOf('/') + 1).slice(0,-4);
      }
    } else {
      usrInput = usrInp.value;
      suggestionBox.setAttribute("hidden", "hidden");
      appendUserInput(usrInput);
      appendBotResponse(loading);
      if (pdfUr) {
        chatWithPDF(
          pdfUr,
          usrInput,
          document.querySelector(".botres:last-child")
        );
      } else {
        sendQuestion(usrInput, document.querySelector(".botres:last-child"));
      }
      usrInp.value = "";
    }
  } else {
    alert("Add Something in text box");
  }
}

function appendUserInput(inputText) {
  const newUserInput = document.createElement("div");
  newUserInput.classList.add("userip");
  newUserInput.innerHTML = userrep;
  newUserInput.children[1].innerText = inputText;
  cht.appendChild(newUserInput);
}

function appendBotResponse(responseText) {
  audio1 = audio1 + 1;
  const newResponse = document.createElement("div");
  newResponse.classList.add("botres");
  newResponse.innerHTML = botresp;
  newResponse.children[0].innerHTML = responseText;
  newResponse.children[1].children[2].id = audio1;
  // newResponse.children[2].id = audio1;
  cht.appendChild(newResponse);
}

for (const suggest of suggestion1) {
  suggest.addEventListener("click", () => {
    usrInp.value = suggest.innerText;
    suggestionBox.setAttribute("hidden", "hidden");
  });
}

// let audioplay = {};
// // Check if audioplay elements exist

//   // Your code here

//       audioplay.forEach((element, index) => {
//           element.addEventListener('click', () => {
//               console.log(element.id);
//               toggleAudio(index);
//           });
//       });

let audioplay = {}; // Assuming audioplay is an empty object

const handleclick = (element) => {
  toggleAudio(element.id);
};

//check point
//undo until

function exportToPDF() {
  var element = document.getElementById("chat"); // Choose the element you want to export to PDF

  // Specify custom options for PDF generation
  var options = {
    filename: "webpage.pdf",
    html2canvas: { scale: 8 }, // Scale factor for better quality (optional)
    jsPDF: { format: "a4", orientation: "portrait" }, // Set orientation to landscape
  };

  html2pdf()
    .from(element)
    .set(options) // Apply custom options
    .save();
}

async function sendQuestion(question, newresp) {
  const pdfFile = document.getElementById("pdfFile").files[0];

  // Check if PDF file is selected
  if (!pdfFile) {
    alert("Please select a PDF file.");
    return;
  }

  // Check if question is entered
  // if (!question.trim()) {
  //     alert('Please enter your question.');
  //     return;
  // }

  // Call functions to add file and send question
  try {
    const sourceId = await addFile(pdfFile);
    const chatResponse = await sendMessage(sourceId, question);
    // document.getElementById('response').innerText = chatResponse.content;
    newresp.children[0].innerText = chatResponse.content;
    generateSpeech(chatResponse.content);
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
  }
}

// Function to add file
async function addFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const addFileResponse = await fetch(
    "https://api.chatpdf.com/v1/sources/add-file",
    {
      method: "POST",
      headers: {
        "x-api-key": apikeys[0], //Replace with you Api KEY also add this same key below
      },
      body: formData,
    }
  );

  const addFileData = await addFileResponse.json();
  return addFileData.sourceId;
}

// Function to send message
async function sendMessage(sourceId, message) {
  const questionData = {
    sourceId: sourceId,
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
  };

  const chatResponse = await fetch("https://api.chatpdf.com/v1/chats/message", {
    method: "POST",
    headers: {
      "x-api-key": apikeys[0], // Replace with your API
      "Content-Type": "application/json",
    },
    body: JSON.stringify(questionData),
  });

  return chatResponse.json();
}

Apibtn.addEventListener("click", () => {
  const Apiinp = document.querySelectorAll(".Apiinp");
  if (Apiinp[0].value && Apiinp[1].value) {
    apiMain.classList.replace("z-ind1", "z-ind");
    apiMain.classList.add("dispnone");
    main.classList.remove("blur");

    apikeys[0] = Apiinp[0].value;
    apikeys[1] = Apiinp[1].value;
    API_KEY = Apiinp[1].value;
  } else {
    alert("Enter API keys");
  }
});

cross.addEventListener("click", () => {
  const Apiinp = document.querySelectorAll(".Apiinp");
  if (Apiinp[0].value && Apiinp[1].value) {
  apiMain.classList.replace("z-ind1", "z-ind");
  apiMain.classList.add("dispnone");
  main.classList.remove("blur");}
  else{
   alert("You have not entered the API key.")
  }
});
