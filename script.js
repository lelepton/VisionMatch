const form = document.getElementById('form');
const input = document.getElementById('input');
const result = document.getElementById('result');

let model;
let selectedFile = null;

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/YJT-wZvGz/";

async function init() {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
}
init();

input.addEventListener('change', () => {
    selectedFile = input.files[0];

    if (selectedFile) {
        const imageUrl = URL.createObjectURL(selectedFile);
        result.innerHTML = `<img src="${imageUrl}" alt="Personagem de Genshin Impact">`;
    } else {
        result.innerHTML = `<p>Nenhuma imagem selecionada.</p>`;
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    result.innerHTML = '';

    if (!selectedFile) {
        alert("Escolha uma imagem primeiro!");
        return;
    }

    const imageUrl = URL.createObjectURL(selectedFile);
    const img = new Image();
    img.src = imageUrl;

    img.onload = async () => {
        const predictions = await model.predict(img);

        let topPrediction = predictions[0];
        for (let i = 1; i < predictions.length; i++) {
            if (predictions[i].probability > topPrediction.probability) {
                topPrediction = predictions[i];
            }
        }

        const percentage = (topPrediction.probability * 100).toFixed(2);

        result.innerHTML = `<img src="${imageUrl}" alt="Personagem de Genshin Impact">
                            <p>A personagem tem ${percentage}% de chance de ser ${topPrediction.className}</p>`;
    };
});
