Hello and welcome to my README for Project 2 - Sort'd

# What is Sort'd?

Sort'd is a simple web application which allows the user to create a list which saves to their cache using local storage.

It is limited to being used on one device on a time as it relies on the cache for local storage. 

I have chosen to have no navigation on the website as I felt it wasn't necessary for functionality. The landing page welcomes the user and gives a brief intro to the web app and guides them on how to use it.  

Main features include:

## List Page
* How to instructions
* Ability to change window tab name
* Drag and drop
* Add new task
* Hide checked items
* Change background
* Current time

## User Stories

As a user, I want to add tasks to my to-do list, so that I can keep track of what I need to do.

As a user, I want to tick off completed tasks, so that I can visually see what I’ve finished.

As a user, I want to drag and drop tasks, so that I can prioritise or reorder them easily.

As a user, I want to remove tasks from my list, so that I can keep my to-do list clean and relevant.

As a user, I want to be able change the page background, so that I can customise or add a theme to my list.

As a user, I want my tasks to stay saved even after I close the tab, so that I don’t lose progress (via localStorage).

As a user, I want to navigate the to-do list easily on desktop and mobile, so I can use it wherever I am.

### UX Testing

* [Pop up shows to first time users only](assets/images/README/pop-up.png)

* [Control Panel](assets/images/README/ctrl_panel.png) allows user to add, hide and change background.


* [Tasks](assets/images/README/add_task.png) can be added from the panel.


* Buttons can be used to toggle between [edit](assets/images/README/readonly.png) & [save](assets/images/README/edit.png)


* [Checkboxes can be selected](assets/images/README/checked_list.png) by user and  [hidden by user](assets/images/README/unchecked_list.png) via one button toggle feature


*  [Tasks can be dragged and dropped](assets/images/README/reordered_list.png) into custom order


* [Background can be changed](assets/images/README/change_bg.png) with images from local documents.


* [The list name can be changed](assets/images/README/change_tab_name.png) and automatically updates the window tab to reflect the user input to make finding the list easier when multiple tabs are open.

#### Tests Run
| Test     | Expected Outcome |Outcome Achieved? (Y/N)|
| ----------- | ----------- |----------- |
| 1st Time User - Pop Up    | Pop up greeting user and explaining how the app works pops up when a first time user arrives on the website      |Y|
| Returning User - No Pop Up    | Pop up does not appear when a returning user arrives on the website      |Y|
| Time and Date     | Time and date updates to current time on desktop      |Y|
| Add Task     | Add button creates a new task to the bottom of the list       |Y|
| Edit/Save Buttons - List | Toggles input so that text can be input and then saved to list container       |Y|
| Edit/Save Buttons - Tasks | Toggles input so that text can be input and then saved to task container        |Y|
| Hide/Unhide Button | Toggles hide/unhide button and simultaneously hides any tasks which have a checkbox selected        |N|
| Delete Button | When clicked deletes the task        |Y|
| Change background Button | Prompts a local documents window to open and allows user to select image to upload as a background       |N|
| Change background - Image validation | Ensures the user can only select        |N|
| Learn More button | When clicked, opens up a popover which gives the user some instructions on using the app        |Y|

## Wireframes

[Wireframe - 1](assets/images/README/wireframes-1.png)
[Wireframe - 2](assets/images/README/wireframes-2.png)

I focused my wireframes on functionality. My intention from the outset was to use Bootstrap and SCSS for the overall design. Note: I choose to use SCSS over CSS as I prefer having the ability to create variables in my work. 

I had some rough ideas on how I wanted the website to look which was modern and user-friendly. The decision not to include a navigation was made from the start as it was intended to be one page. I knew that I wanted the user to be able to add, move and list items. The changing background feature was also a priority in terms of functionality and design to make the app customisable. I considered other features including the toggle between editing and saving input, also the save on keying 'Enter' which made their way into the final project. The idea to have the list name also update the document title on the HTML came later - an app called Notion has a similar feature and I thought it was a good UX design idea to help the user easily identify their open tab in the browser.

Designing the web app as one page presented some challenges. Since I wasn't going to have any other pages, I needed a way to communicate what the app does to the user without overwhelming the layout. This led to the later additions of the pop-up which is designed only to show to first-time users. Initially, I thought about having a landing page and creating conditions to redirect returning users to the main list, but this proved to be time-consuming and I found the pop-up easier to set-up and control with JS. I also added a popover from the Bootstrap toolkit so that the user can refer back to the same information that appears on the first-time user pop-up.

## Github Deployment

My preferred method of deploying projects to GitHub is via Codespaces in VSCode.

1. I already had Codespaces installed in GitHub, so I went ahead and opened up a new folder in my local documents.
2. I started a new Codespace for my projects and wrote up my first files.
3. I committed my first few files and pushed them to GitHub.
[Installed Codespaces](assets/images/README/codespaces-git-vs.png)
4. From VS Code I am now able to commit, push and pull from the Git Hub panel tool.
[VS Code - Github panel](assets/images/README/vs-gitcontrols.png)
5. I checked in GitHub and confirmed the project had been correctly set up and my first push was in GitHub.
[Live code in Github](assets/images/README/github-code.png)
6. Next, I went to Pages for the project in GitHub. I checked the page was made public, then deployed from the main / root folder.
[Github delpoyment via pages](assets/images/README/github-deploy-pgs.png)
7. Final check was to follow the live link produced by GitHub and check web app is displaying as expected which I confirmed.
[Project deployed via Github](assets/images/README/git-deploy-final.png)

## Other Testing

### 404 Testing
[404 Testing](assets/images/README/404-testing.png)
### HTML
1. Error message about trailing slash
* Solution: removed all forward slashes from end tags
[Trailing Slash](assets/images/README/html-trailing-slash.png)
2. Too many descendants within label tag
*  Solution: 
[Labels](assets/images/README/html-labels.png)
[Unclosed div](assets/images/README/html-unclosed-div.png)
[HTML Test - No Errors](assets/images/READ/html-unclosed-div.png)
### CSS
[CSS Test - No Errors](assets/images/README/css-no-errors.png)
### JS
[JS Quotes](assets/images/README/js-quotes.png)

* Tested on mobile phone with touch screen functionality - add a list of tests here:

* Tests:
    1. Will the user's input save when they navigate to another website, leave or refresh the web page?
    
    2. Add new task 
        - do new tasks generate a duplicate of the standard task template?
        - do new tasks allow you to edit & save text?
        - does the add new task button move down the page accordingly as expected as the user adds task?
        - does the page respond in a way which is accessible and promotes userbility when the added tasks reach the confines of the task container?

    3. Change theme
        - what happens if the user tries to upload a non-compliant or unrecognised file type?
        - what happens if the user tries to upload an image which is too large for upload?



## Dependencies

### Bootstrap
* Popovers
* Navigation & Footer
* Flexible/responsive containers

### Font Awesome
* Trash, Edit, Save, Hide, Unhide, Change Theme buttons

### Drag and Drop API
* <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API"> 

### W3

* On-click event
https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_onclick_dom

* Duplicating task box
https://www.w3schools.com/jsref/met_node_clonenode.asp

## Known Bugs

* Text that does not fix in the box does not show unless the user selects edit to