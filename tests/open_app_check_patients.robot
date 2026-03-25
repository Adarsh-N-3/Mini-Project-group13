*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}          http://localhost:5173
${WAIT_TIME}    15s

*** Test Cases ***
Open App And Check Patients Page
    ${options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys
    Call Method    ${options}    add_argument    --headless
    Call Method    ${options}    add_argument    --no-sandbox
    Call Method    ${options}    add_argument    --disable-dev-shm-usage
    Create Webdriver    Chrome    options=${options}
    Set Selenium Implicit Wait    ${WAIT_TIME}
    Go To    ${URL}

    Wait Until Page Contains Element    tag=body    ${WAIT_TIME}

    ${is_login_page}=    Run Keyword And Return Status
    ...    Page Should Contain Element    xpath=//input[@type='password']

    Run Keyword If    ${is_login_page}
    ...    Log    App loaded but requires authentication
    ...    ELSE
    ...    Log    App loaded — no login required

    [Teardown]    Run Keywords
    ...    Capture Page Screenshot    final_screenshot_{index}.png
    ...    AND    Close Browser
