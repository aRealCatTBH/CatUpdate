window.mdc.autoInit();

const themer = document.getElementById('themer');

themer.onclick = () => {
    if (document.body.classList.contains('dark')) {
        document.body.classList.remove('dark');
    } else {
        document.body.classList.add('dark');
    }
};

const step1Card = document.getElementById('step-1-card');
const step3Card = document.getElementById('step-3-card');
const step4Card = document.getElementById('step-4-card');
const step5Card = document.getElementById('step-5-card');

const assistButton = document.getElementById('assist-button');
const assistModal = document.getElementById('assist-modal');



assistButton.onclick = () => {
    assistModal.classList.add('show');
    step1Card.classList.add('show');
};

document.onclick = (e) => {
    if (e.target.id === 'assist-modal') {
        assistModal.classList.remove('show');
        [step1Card, step3Card, step4Card].forEach((x) => x.classList.remove('show'));
    }
};

const step1Button = document.getElementById('step-1-button');
const step3Button = document.getElementById('step-3-button');
const step4Button = document.getElementById('step-4-button');

step1Button.onclick = () => {
    step1Card.classList.remove('show');
    step3Card.classList.add('show');
};

const fileSelectEl = document.getElementById('fileSelect');

const getFileUpload = async () => {
    fileSelectEl.value = null; // Prevent not firing change for repeated files
    fileSelectEl.click();

    await new Promise((res) => {
        fileSelectEl.onchange = () => {
            res();
        };
    });

    fileSelectEl.onchange = undefined;

    const file = fileSelectEl.files[0];

    if (file === undefined) {
        return undefined;
    }

    return file;
};

const downloadToFile = (content, filename, contentType) => { // https://robkendal.co.uk/blog/2020-04-17-saving-text-to-client-side-file-using-vanilla-js
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });

    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
};

let finalResult = '';

step3Button.onclick = async () => {
    const file = await getFileUpload();

    const reader = new FileReader();

    reader.readAsText(file, "UTF-8");

    const result = await new Promise((res) => {
        reader.onload = (e) => {
            res(e.target.result);
        };
    });

    let json = JSON.parse(result);

    console.log(json);

    const selected = [...document.getElementById('channels').children].filter((e) => e.classList.contains('mdc-form-field')).filter((x) => x.children[0].children[0].checked).map((x) => x.children[1].childNodes[0].textContent.trim().toLowerCase()).join('+').replace('none+', '');

    json['UPDATE_ENDPOINT'] = `${location.origin}/${selected}`;
    json['NEW_UPDATE_ENDPOINT'] = `${location.origin}/${selected}/`;
    json['DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING'] = true;

    console.log(json);

    finalResult = JSON.stringify(json, null, 2);

    step3Card.classList.remove('show');
    step4Card.classList.add('show');
};

step4Button.onclick = async () => {
    downloadToFile(finalResult, 'settings.json', 'text/plain');

    step4Card.classList.remove('show');
    step5Card.classList.add('show');
};

if (location.href.includes('#install')) {
    assistButton.onclick();
}