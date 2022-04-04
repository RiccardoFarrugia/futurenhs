Feature: Member Profile
    User journeys around users accessing and modifying their own personal information within FNHS

Background:
    Given I have navigated to '/'


Scenario: FNHS78 - View my profile page
	And I have logged in as an 'group admin' and accept the cookies
	Then the 'My Groups' header is displayed
    When I open the 'Atuo GroupAdmin' accordion
    And I click the 'My profile' link
    Then the 'My profile' header is displayed
    And the 'AG' textual value is displayed
    And the profile values are displayed
    | First name | Auto                 |
    | Last name  | GroupAdmin           |
    | Email      | autoAdmin@test.co.uk |
    And the 'Edit my profile' link is displayed


Scenario: FNHS79 - Edit my profile avatar upload
	And I have logged in as an 'edituser' and accept the cookies
	Then the 'My Groups' header is displayed
    When I open the 'Menu' accordion
    And I click the 'My profile' link
    Then the 'My profile' header is displayed
    When I click the 'Edit my profile' link
    Then the 'Edit my profile' header is displayed
    And the 'Upload an image' textual value is displayed
    And I upload the '/media/test.png' file
    And I select the 'Please confirm that all changes are in line with the platform' checkbox
    And I click the 'Save Changes' button
    Then the 'My profile' header is displayed

# FORMATTING ERROR WITH TEXT AND BOUNDARIES MEANS UNABLE TO INTERACT WITH ELEMENTS
@Pending
Scenario Outline: FNHS80 - Edit my profile
	And I have logged in as an 'edituser' and accept the cookies
  
    Then the 'My Groups' header is displayed
    When I open the 'menu' accordion
    And I click the 'My profile' link
    Then the 'My profile' header is displayed
    When I click the 'Edit my profile' link
    Then the 'Edit my profile' header is displayed    
    When I enter '<input>' into the '<label>' field
    And the profile values are displayed
    | Email | autoEditUser@test.co.uk |
    And I select the 'Please confirm that all changes are in line with the platform' checkbox
    And I click the 'Save Changes' button
    Then the 'My profile' header is displayed
    And the profile values are displayed
    | <label> | <input> |
Examples:
    | input                                                                                                                                                                                                                                                           | label              |
    | him                                                                                                                                                                                                                                                             | Preferred pronouns |
    | j13mQJ8nNZp0EDhELJXtBD3j1mwxRMzcMtK9MOWDteeyq2l8SJlwHQxzI9bpyu43gcvqfQKJUL0AGsY1WaNPKVSkaUBDnLlfM9Y24GowcMwtJO0hP3ct6E6PIe4BzaF8KquF9TedIHFNWKpC7Xv7EJqdUfkttTjpYfTIwiUOjTkneJzRJvLQKaSFWQr2vGTTsuldO8HZn33GcaJNexqYBOUjbkoysw62zBPVK2Zec3H4AmyLsisY1rm2sr6h3DW | Last name          |
    | Name                                                                                                                                                                                                                                                            | Last name          |
    | j13mQJ8nNZp0EDhELJXtBD3j1mwxRMzcMtK9MOWDteeyq2l8SJlwHQxzI9bpyu43gcvqfQKJUL0AGsY1WaNPKVSkaUBDnLlfM9Y24GowcMwtJO0hP3ct6E6PIe4BzaF8KquF9TedIHFNWKpC7Xv7EJqdUfkttTjpYfTIwiUOjTkneJzRJvLQKaSFWQr2vGTTsuldO8HZn33GcaJNexqYBOUjbkoysw62zBPVK2Zec3H4AmyLsisY1rm2sr6h3DW | Preferred pronouns |
    | j13mQJ8nNZp0EDhELJXtBD3j1mwxRMzcMtK9MOWDteeyq2l8SJlwHQxzI9bpyu43gcvqfQKJUL0AGsY1WaNPKVSkaUBDnLlfM9Y24GowcMwtJO0hP3ct6E6PIe4BzaF8KquF9TedIHFNWKpC7Xv7EJqdUfkttTjpYfTIwiUOjTkneJzRJvLQKaSFWQr2vGTTsuldO8HZn33GcaJNexqYBOUjbkoysw62zBPVK2Zec3H4AmyLsisY1rm2sr6h3DW | First name         |
    | New                                                                                                                                                                                                                                                             | First name         |


Scenario Outline: FNHS81 - Edit my profile error validation
	And I have logged in as an 'user' and accept the cookies
	Then the 'My Groups' header is displayed
    When I open the 'Menu' accordion
    And I click the 'My profile' link
    Then the 'My profile' header is displayed
    When I click the 'Edit my profile' link
    Then the 'Edit my profile' header is displayed
    And I enter '<firstname>' into the 'First name' field
    And I enter '<lastname>' into the 'Last name' field
    And I enter '<pronoun>' into the 'Preferred pronouns' field
    And I select the 'Please confirm that all changes are in line with the platform' checkbox
    And I click the 'Save Changes' button
    Then the '<error message>' textual value is displayed
Examples:
    | firstname                                                                                                                                                                                                                                                        | lastname                                                                                                                                                                                                                                                         | pronoun                                                                                                                                                                                                                                                          | error message                                           |
    |                                                                                                                                                                                                                                                                  | lastname                                                                                                                                                                                                                                                         | him                                                                                                                                                                                                                                                              | Please provide a first name                             |
    | j13mQJ8nNZp0EDhELJXtBD3j1mwxRMzcMtK9MOWDteeyq2l8SJlwHQxzI9bpyu43gcvqfQKJUL0AGsY1WaNPKVSkaUBDnLlfM9Y24GowcMwtJO0hP3ct6E6PIe4BzaF8KquF9TedIHFNWKpC7Xv7EJqdUfkttTjpYfTIwiUOjTkneJzRJvLQKaSFWQr2vGTTsuldO8HZn33GcaJNexqYBOUjbkoysw62zBPVK2Zec3H4AmyLsisY1rm2sr6h3DWa | lastname                                                                                                                                                                                                                                                         | him                                                                                                                                                                                                                                                              | The first name must not be greater than 255 characters. |
    | firstname                                                                                                                                                                                                                                                        | j13mQJ8nNZp0EDhELJXtBD3j1mwxRMzcMtK9MOWDteeyq2l8SJlwHQxzI9bpyu43gcvqfQKJUL0AGsY1WaNPKVSkaUBDnLlfM9Y24GowcMwtJO0hP3ct6E6PIe4BzaF8KquF9TedIHFNWKpC7Xv7EJqdUfkttTjpYfTIwiUOjTkneJzRJvLQKaSFWQr2vGTTsuldO8HZn33GcaJNexqYBOUjbkoysw62zBPVK2Zec3H4AmyLsisY1rm2sr6h3DWa | him                                                                                                                                                                                                                                                              | The last name must not be greater than 255 characters.  |
    | firstname                                                                                                                                                                                                                                                        | lastname                                                                                                                                                                                                                                                         | j13mQJ8nNZp0EDhELJXtBD3j1mwxRMzcMtK9MOWDteeyq2l8SJlwHQxzI9bpyu43gcvqfQKJUL0AGsY1WaNPKVSkaUBDnLlfM9Y24GowcMwtJO0hP3ct6E6PIe4BzaF8KquF9TedIHFNWKpC7Xv7EJqdUfkttTjpYfTIwiUOjTkneJzRJvLQKaSFWQr2vGTTsuldO8HZn33GcaJNexqYBOUjbkoysw62zBPVK2Zec3H4AmyLsisY1rm2sr6h3DWa | The Pronouns must not be greater than 255 characters.   |


Scenario: FNHS82 - Edit my profile w/o accepting T&Cs
	And I have logged in as an 'user' and accept the cookies
	Then the 'My Groups' header is displayed
    When I open the 'Menu' accordion
    And I click the 'My profile' link
    Then the 'My profile' header is displayed
    When I click the 'Edit my profile' link
    Then the 'Edit my profile' header is displayed
    When I click the 'Save Changes' button
    Then the 'Please confirm that all changes are in line with the platform terms and conditions.' error summary is displayed
    And the 'Please confirm that all changes are in line with the platform terms and conditions.' textual value is displayed