window.onload = function () {
    const useNodeJS = false;
    const defaultLiffId = "1655326860-LG4Jmvrx";

    // DO NOT CHANGE THIS
    let myLiffId = "";

    if (useNodeJS) {
        fetch('/send-id')
            .then(function (reqResponse) {
                return reqResponse.json();
            })
            .then(function (jsonResponse) {
                myLiffId = jsonResponse.id;
                initializeLiffOrDie(myLiffId);
            })
            .catch(function (error) {
                document.getElementById("liffAppContent").classList.add('hidden');
            });
    } else {
        myLiffId = defaultLiffId;
        initializeLiffOrDie(myLiffId);
    }
};

function initializeLiffOrDie(myLiffId) {
    if (!myLiffId) {
        document.getElementById("liffAppContent").classList.add('hidden');
    } else {
        initializeLiff(myLiffId);
    }
}
/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            // start to use LIFF's api
            initializeApp();
        })
        .catch((err) => {
            document.getElementById("liffAppContent").classList.add('hidden');
        });
}

function initializeApp() {
    registerButtonHandlers();

    if (liff.isLoggedIn()) {
        $('#beforeLogin').css('display', 'none')
        $('#afterLogin').show()
        document.getElementById('liffLoginButton').disabled = true;
        liff.getProfile()
            .then(profile => {
                const name = profile.displayName;
                const picture = profile.pictureUrl;
                document.querySelector('#nameUser').innerHTML = name
                document.querySelector('#pictureUser').setAttribute('src', picture);
            })
            .catch((err) => {
                console.log('error', err);
            })
    } else {
        $('#beforeLogin').show()
        $('#afterLogin').hide()
        document.getElementById('liffLogoutButton').disabled = true;
    }
}

function registerButtonHandlers() {
    document.getElementById('openWindowButton').addEventListener('click', function () {
        liff.openWindow({
            url: 'https://kantenen-aja.herokuapp.com/',
            external: true
        });
    });

    document.getElementById('closeWindowButton').addEventListener('click', function () {
        if (!liff.isInClient()) {
            sendAlertIfNotInClient();
        } else {
            liff.closeWindow();
        }
    });

    document.getElementById('liffLoginButton').addEventListener('click', function () {
        if (!liff.isLoggedIn()) {
            liff.login();
        }
    });

    document.getElementById('liffLogoutButton').addEventListener('click', function () {
        if (liff.isLoggedIn()) {
            liff.logout();
            window.location.reload();
        }
    });
}

function sendAlertIfNotInClient() {
    alert('Sayangnya tidak bisa dilakukan pada eksternal browser :( yuk beralih ke line :)');
}