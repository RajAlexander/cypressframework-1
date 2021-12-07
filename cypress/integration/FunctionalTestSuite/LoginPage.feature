Feature: Login

    Page where the users can login to their accounts.

    Background: Login Page
        Given A user enters to the login page.

    Scenario: Valid users.

        When A user provides below user credentials.
            | Username   | Password     |
            | naresh.raj | 8JB2z4#Wu2l! |
        Then "Complete Your Profile" should be displayed on the welcome page.
        And Logout button should be clicked on the Welcome Page.

    Scenario: Invalid users.

        When A user provides below user credentials.
            | Username   | Password     |
            | naresh.raj | undefined    |
            | undefined  | 8JB2z4#Wu2l! |
            | naresh.raj | null         |
            | null       | 8JB2z4#Wu2l! |
            | null       | undefined    |
        Then "Login failed" should be displayed on the login page.

