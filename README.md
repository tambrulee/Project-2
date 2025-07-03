Hello and welcome to my README for Project 2 - Sort'd

# What is Sort'd?

Sort'd is a simple web application which allows the user to create a list which saves to their cache using local storage.

It is limited to being used on one device on a time as it relies on the cache for local storage. 

I have chosen to have no navigation on the website as I felt it wasn't necessary for functionality. The landing page welcomes the user and gives a brief intro to the web app and guides them on how to use it.  

Main features include:

## Landing Page
* How to instructions
* Call-to-action 

## List Page
* Ability to change window tab name
* Drag and drop
* Add new task
* Hide checked items
* Change background

## User Stories

As a user, I want to add tasks to my to-do list, so that I can keep track of what I need to do.

As a user, I want to tick off completed tasks, so that I can visually see what I’ve finished.

As a user, I want to drag and drop tasks, so that I can prioritise or reorder them easily.

As a user, I want to remove tasks from my list, so that I can keep my to-do list clean and relevant.

As a user, I want to be able change the page background, so that I can customise or add a theme to my list.

### UX Testing

### Usability & Preferences
As a user, I want to hide or unhide completed tasks, so that I can focus on what still needs doing.

As a user, I want to change the theme colour, so that the interface feels more personal or fun to use.

As a user, I want my tasks to stay saved even after I close the tab, so that I don’t lose progress (via localStorage).

### UX Testing

### Time/Date Feature

Tested whilst abroad in Malta - automatically adjusts to time/zone. Will do further testing to ensure it works in multiple time zones. 

### Accessibility & Feedback
As a user, I want to see a message or indicator when a task is added or removed, so that I know my actions have worked.

As a user, I want to navigate the to-do list easily on desktop and mobile, so I can use it wherever I am.

### UX Testing

## Core Features
- Add tasks — basic input + button to add to list.
- Drag-and-drop tasks — reorder tasks visually.
- Checkboxes for completion — toggle task done/undone styles.
- Hide/unhide tasks — toggle visibility of the entire task list.
- Theme color changer — button to cycle or pick from predefined colors.


## Wireframes

I intend to use Bootstrap for the main layout.


## Other Testing

### 404 Testing

### HTML

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

# Jest or JS Testing

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