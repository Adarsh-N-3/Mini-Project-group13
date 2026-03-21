*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}    http://localhost:5173
${WAIT_TIME}    15s
${TEST_USERNAME}    testuser
${TEST_PASSWORD}    testpassword

*** Test Cases ***
Login And Check Patients Page
    ${options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys

    Call Method    ${options}    add_argument    --headless
    Call Method    ${options}    add_argument    --no-sandbox
    Call Method    ${options}    add_argument    --disable-dev-shm-usage

    Create Webdriver    Chrome    options=${options}
    Set Selenium Implicit Wait    ${WAIT_TIME}

    Go To    ${URL}
    
    # Login
    Wait Until Page Contains Element    xpath=//input[@type='password']    ${WAIT_TIME}
    Input Text    xpath=//input[@type='text']    ${TEST_USERNAME}
    Input Text    xpath=//input[@type='password']    ${TEST_PASSWORD}
    Click Button    xpath=//button[contains(text(), 'Login')]
    
    # After login, should see patients page
    Wait Until Page Contains    No patients found    ${WAIT_TIME}
    
    Close Browser
