let model, labelContainer;
import './public/style.css'

async function init() {
  const modelURL = "./model/model.json";
  const metadataURL = "./model/metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
}

async function sendData(dado) {
  await fetch("/dados", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dado)
})
}

async function predict(image) {

  const predictionData = await model.predict(image);
  const predictionPercentage = Math.round(predictionData[0].probability * 100);
  let predictionText;
  switch (true) {
    case predictionPercentage === 100:
      predictionText = "Definitivamente doente";
      break;
    case predictionPercentage >= 75:
      predictionText = "Muito provavelmente doente";
      break;
    case predictionPercentage > 50:
      predictionText = "Provavelmente doente";
      break;
    case predictionPercentage == 50:
      predictionText = "Inconclusivo, tente outra imagem";
      break;
    case predictionPercentage > 25:
      predictionText = "Provavelmente saudável";
      break;
    case predictionPercentage > 0:
      predictionText = "Muito provavelmente saudável";
      break;
    case predictionPercentage === 0:
      predictionText = "Definitivamente saudável";
      break;
    default:
      predictionText = "Ocorreu um erro";
      throw new Error("Ocorreu um erro");
  }

  const dado = {
    text: predictionText,
    percentage: predictionPercentage,
  }

  await sendData(dado)
  return dado;
}

const data = [];

window.onload = async function () {
  await init();

  const imageSelector = document.querySelector("input");
  const list = document.querySelector("ul");

  imageSelector.addEventListener("change", (event) => {
    event.preventDefault()
    const templateClone = document
      .querySelector("template")
      .content.cloneNode(true);

    const text = templateClone.querySelector(".reading-info-text");
    const numberText = templateClone.querySelector(".reading-info-number");
    const image = templateClone.querySelector("img");

    const file = event.target.files[0];
    if (!file) return;

    const newData = {};
    newData.image = file.name;

    const reader = new FileReader();
    reader.onload = function (e) {
    

      image.onload = async () => {
        try {

          let prediction = await predict(image);
    
          
          text.textContent = prediction.text;
          text.classList.add(prediction.percentage < 50 ? "healthy" : "sick");
          numberText.textContent =
          "Chance de estar saudável: " + (100 - prediction.percentage) + "%";
          newData.text = prediction.text;
          newData.percentage = prediction.percentage;
        } catch (e) {
          console.error("Erro no image.onload:", e);

        }
      };
      image.src = e.target.result;
        console.log("src atribuído:", image.src.slice(0, 30));

      text.textContent = "Analisando...";
      numberText.textContent = "";

      list.appendChild(templateClone);
      data.push(newData);
      toggleDownload();
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  });
};

const downloadWrapper = document.querySelector("code");
function toggleDownload() {
  const button = document.querySelector(".download");
  button.addEventListener("click", () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const blobUrl = URL.createObjectURL(blob);
    downloadWrapper.innerHTML = `
      <a class="hidden" id="anchor" href="${blobUrl}" download="agrosmart-${Date.now()}"></a>
      `;
    const anchor = downloadWrapper.querySelector("#anchor");
    anchor.dispatchEvent(new MouseEvent("click"));
    setTimeout(() => URL.revokeObjectURL(blobUrl));
  });
  button.classList.remove("hidden");
}
