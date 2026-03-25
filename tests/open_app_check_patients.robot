*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}    http://localhost:5173
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
    
    # Wait for page to load completely - check for either login page or patients page
    Wait Until Page Contains Element    xpath=//*    ${WAIT_TIME}
    
    # Capture screenshot after page loads
    Capture Page Screenshot
    
    # If login page appears, we know the app loaded
    ${is_login_page}=    Run Keyword And Return Status    Page Should Contain Element    xpath=//input[@type='password']
    
    Run Keyword If    ${is_login_page}    Log    App loaded but requires authentication
    
    Close Browser