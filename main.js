const URL = "./model/";

let model, labelContainer;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
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
  return {
    text: predictionText,
    percentage: predictionPercentage,
  };
}

window.onload = async function () {
  await init();

  const imageSelector = document.getElementById("image-selector");
  const list = document.querySelector("ul");

  imageSelector.addEventListener("change", (event) => {
    const templateClone = document
      .querySelector("template")
      .content.cloneNode(true);

    const text = templateClone.querySelector(".reading-info-text");
    const numberText = templateClone.querySelector(".reading-info-number");
    const image = templateClone.querySelector("img");

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      image.onload = async () => {
        let prediction = await predict(image);
        text.textContent = prediction.text;
        text.classList.add(prediction.percentage < 50 ? "healthy" : "sick");
        numberText.textContent =
          "Chance de estar saudável: " + (100 - prediction.percentage) + "%";
      };
      image.src = e.target.result;
      image.style.display = "block";

      text.textContent = "Analisando...";
      numberText.textContent = "";

      list.appendChild(templateClone);
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  });
};
