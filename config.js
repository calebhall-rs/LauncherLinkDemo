var ccLauncherConfig = {
    studentId: '',
    studentName: '',
    postStudentData: false,
    postUrl: ''
};

function ccShowInviteForm(appPrefix, packageToken) {
    var style = document.createElement('style');
    style.textContent = [
        '#ccInviteOverlay { position: fixed; inset: 0; z-index: 9999; background: #ffffff;',
        '  display: flex; align-items: center; justify-content: center; overflow: auto; padding: 40px 20px;',
        '  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }',
        '#ccInviteCard { max-width: 480px; width: 100%; }',
        '#ccInviteCard img { display: block; margin-bottom: 20px; max-height: 48px; }',
        '#ccInviteCard h1 { font-size: 24px; line-height: 1.25; margin: 0 0 12px; }',
        '#ccInviteCard p { font-size: 16px; font-weight: 500; line-height: 1.3; margin: 0 0 24px; color: #333; }',
        '.ccFieldRow { margin-bottom: 16px; }',
        '.ccFieldRow-split { display: flex; gap: 16px; }',
        '.ccFieldRow-split .ccField { flex: 1; }',
        '#ccInviteForm label { display: block; font-size: 13px; font-weight: bold; margin-bottom: 4px; }',
        '#ccInviteForm input { width: 100%; box-sizing: border-box; padding: 8px 10px; font-size: 15px;',
        '  border: 1px solid #ccc; border-radius: 4px; }',
        '#ccInviteForm input[aria-invalid="true"] { border-color: #c02f2f; }',
        '.ccFieldError { color: #c02f2f; font-size: 13px; margin-top: 4px; min-height: 16px; }',
        '#ccInviteNote { font-size: 13px; color: #666; margin: 8px 0 24px; text-align: center; }',
        '.ccSrOnly { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }',
        '#ccLaunchButton { display: block; width: 100%; padding: 12px; font-size: 16px; font-weight: bold;',
        '  color: #fff; background-color: #326728; border: 1px solid #2D5B24; border-radius: 5px; cursor: pointer; }',
        '#ccLaunchButton:hover, #ccLaunchButton:focus { background-color: #2D5B24; border-color: #28511F; }',
        '#ccLaunchButton:focus-visible { outline: 2px solid #000; outline-offset: 2px; }',
        '#ccLaunchButton:disabled { background-color: #9c9c9c; border-color: #919896; cursor: default; }'
    ].join('\n');
    document.head.appendChild(style);

    var overlay = document.createElement('div');
    overlay.id = 'ccInviteOverlay';
    overlay.innerHTML = [
        '<div id="ccInviteCard">',
        '  <img src="images/fake-learning-logo.png" alt="" />',
        '  <h1>Please enter your info and we will move you right along.</h1>',
        '  <p>Your correct email will ensure you receive proper credit for your training.</p>',
        '  <form id="ccInviteForm" novalidate>',
        '    <div class="ccFieldRow">',
        '      <label for="ccInviteEmail">Email</label>',
        '      <input type="email" id="ccInviteEmail" autocomplete="email" aria-invalid="false" />',
        '      <div class="ccFieldError" id="ccInviteEmailError"></div>',
        '    </div>',
        '    <div class="ccFieldRow ccFieldRow-split">',
        '      <div class="ccField">',
        '        <label for="ccInviteFirstName">First Name</label>',
        '        <input type="text" id="ccInviteFirstName" autocomplete="given-name" aria-invalid="false" />',
        '        <div class="ccFieldError" id="ccInviteFirstNameError"></div>',
        '      </div>',
        '      <div class="ccField">',
        '        <label for="ccInviteLastName">Last Name</label>',
        '        <input type="text" id="ccInviteLastName" autocomplete="family-name" aria-invalid="false" />',
        '        <div class="ccFieldError" id="ccInviteLastNameError"></div>',
        '      </div>',
        '    </div>',
        '    <div id="ccInviteNote">* Your email address is your identification for this training. Please take a moment to make sure it is correct.</div>',
        '    <div id="ccInviteStatus" class="ccSrOnly" role="status" aria-live="polite"></div>',
        '    <button type="submit" id="ccLaunchButton">Ok. Now take me to my training</button>',
        '  </form>',
        '</div>'
    ].join('\n');
    document.body.appendChild(overlay);

    var emailField = document.getElementById('ccInviteEmail');
    var firstNameField = document.getElementById('ccInviteFirstName');
    var lastNameField = document.getElementById('ccInviteLastName');
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setFieldError(field, errorEl, message) {
        field.setAttribute('aria-invalid', message ? 'true' : 'false');
        errorEl.textContent = message || '';
    }

    document.getElementById('ccInviteForm').addEventListener('submit', function (e) {
        e.preventDefault();

        var email = emailField.value.trim();
        var firstName = firstNameField.value.trim();
        var lastName = lastNameField.value.trim();
        var firstInvalidField = null;

        setFieldError(emailField, document.getElementById('ccInviteEmailError'), null);
        setFieldError(firstNameField, document.getElementById('ccInviteFirstNameError'), null);
        setFieldError(lastNameField, document.getElementById('ccInviteLastNameError'), null);

        if (!email.length) {
            setFieldError(emailField, document.getElementById('ccInviteEmailError'), 'You must provide an e-mail address to continue');
            firstInvalidField = firstInvalidField || emailField;
        } else if (email.length > 128) {
            setFieldError(emailField, document.getElementById('ccInviteEmailError'), 'The email address provided exceeds the 128 character limit');
            firstInvalidField = firstInvalidField || emailField;
        } else if (!emailRegex.test(email)) {
            setFieldError(emailField, document.getElementById('ccInviteEmailError'), 'Please enter a valid e-mail address');
            firstInvalidField = firstInvalidField || emailField;
        }

        if (firstName.length > 100) {
            setFieldError(firstNameField, document.getElementById('ccInviteFirstNameError'), 'The first name provided exceeds the 100 character limit');
            firstInvalidField = firstInvalidField || firstNameField;
        }

        if (lastName.length > 100) {
            setFieldError(lastNameField, document.getElementById('ccInviteLastNameError'), 'The last name provided exceeds the 100 character limit');
            firstInvalidField = firstInvalidField || lastNameField;
        }

        if (firstInvalidField) {
            firstInvalidField.focus();
            return;
        }

        ccLauncherConfig.studentId = email;
        ccLauncherConfig.studentName = (firstName + ' ' + lastName).trim() || email;

        var button = document.getElementById('ccLaunchButton');
        button.disabled = true;
        button.textContent = 'Launching your training...';
        document.getElementById('ccInviteStatus').textContent = 'Launching your training, please wait...';

        overlay.remove();
        ccLoadLauncherScripts(appPrefix, packageToken);
    });
}

function ccLoadScript(src, onload) {
    var script = document.createElement('script');
    script.src = src;
    script.onload = onload;
    document.head.appendChild(script);
}

function ccLoadLauncherScripts(appPrefix, packageToken) {
    // ccLauncherConfig must be fully populated before these load: the Content
    // Controller launcher scripts read it as soon as they execute, not lazily
    // when prepareLaunch() is called.
    ccLoadScript('https://rustici.contentcontroller.com/launcherlink/3rd.js?v=3.2', function () {
        ccLoadScript('https://rustici.contentcontroller.com/launcherlink/launcherinit.js?v=3.2', function () {
            ccLoadScript('https://rustici.contentcontroller.com/launcherlink/ssla.min.js?v=3.2', function () {
                prepareLaunch(appPrefix, packageToken);
            });
        });
    });
}
