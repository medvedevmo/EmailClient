const internalizated = window.languagesAPI.internalization('authorize.html');
document.addEventListener("DOMContentLoaded", function() {
for (const selector in internalizated['innerHTML']) {
    const value = internalizated['innerHTML'][selector];
    let element = document.querySelector(selector);
    let font = getFont(element);
    if (document.fonts.check(`12px ${font}`, value) == true) {
        element.innerHTML = value;
    } 
    else if (document.fonts.check(`12px Inter`, value) == true) {
        element.innerHTML = value;
        element.style.fontFamily = 'Inter';
    }
    else if (document.fonts.check(`12px Poppins`, value) == true) {
        element.innerHTML = value;
        element.style.fontFamily = 'Poppins';
    }
}
}, false );

function getFont(element) {
    return window.getComputedStyle(element, null).fontFamily;
}

document.querySelector('#next_button').addEventListener('click', () => {
    languageButtonClicked();
})

function languageButtonClicked() {
    const email = document.getElementById('input_email').value;
    const password = document.getElementById('input_password').value;
    const smtpName = document.getElementById('input_smtpServerName').value;
    const smtpPort = document.getElementById('input_smtpServerPort').value;
    const imapName = document.getElementById('input_imapServerName').value;
    const imapPort = document.getElementById('input_imapServerPort').value;
    window.authorizeAPI.saveLoginData(email, password, smtpName, smtpPort, imapName, imapPort);
    window.location.href = "index.html";
}