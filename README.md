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

[Control Panel](assets/images/README/ctrl_panel.png)
[Checkboxes -  Before Toggled](assets/images/README/checked_list.png)
[Checkboxes -  After Toggled](assets/images/README/unchecked_list.png)
[Reordered list](assets/images/README/reordered_list.png)
[Change Background](assets/images/README/change_bg.png)
[Change Tab Name](assets/images/README/change_tab_name.png)

### Time/Date Feature

Tested whilst abroad in Malta - automatically adjusts to time/zone. Will do further testing to ensure it works in multiple time zones. 


## Wireframes

I intend to use Bootstrap for the main layout.

## Github Deployment

[Installed Codespaces](assets/images/README/codespaces-git-vs.png)
[Live code in Github](assets/images/README/github-code.png)
[Github delpoyment via pages](assets/images/README/github-deploy-pgs.png)
[VS Code - Github panel](assets/images/README/vs-gitcontrols.png)
[Project deployed via Github](assets/images/README/git-deploy-final.png)

## Other Testing

### 404 Testing
[404 Testing](assets/images/README/404-testing.png)
### HTML
[Trailing Slash](assets/images/README/html-trailing-slash.png)
### CSS

### JS

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

### Drag and Drop API
* <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API"> You can read the Drag and Drop API Docs here<a>

To implement this I had to create a drop zone so I duplicated one of the text box elements.

### W3

* On-click event
https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_onclick_dom

* Duplicating task box
https://www.w3schools.com/jsref/met_node_clonenode.asp

## Known Bugs

* Text that does not fix in the box does not show unless the user selects edit to