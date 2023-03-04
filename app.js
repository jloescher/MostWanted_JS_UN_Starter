/*
    Author: devCodeCamp
    Description: Most Wanted Starter Code
*/
//////////////////////////////////////////* Beginning Of Starter Code *//////////////////////////////////////////

"use strict";
//? Utilize the hotkey to hide block level comment documentation
////* Mac: Press "CMD"+"K" and then "CMD"+"/"
////* PC: Press "CTRL"+"K" and then "CTRL"+"/"

/**
 * This is the main logic function being called in index.html.
 * It operates as the entry point for our entire application and allows
 * our user to decide whether to search by name or by traits.
 * @param {Array} people        A collection of person objects.
 */
function app(people) {
    // promptFor() is a custom function defined below that helps us prompt and validate input more easily
    // Note that we are chaining the .toLowerCase() immediately after the promptFor returns its value
    let searchType = promptFor(
        "Do you know the name of the person you are looking for? Enter 'yes' or 'no'",
        yesNo
    ).toLowerCase();
    let searchResults;
    // Routes our application based on the user's input
    switch (searchType) {
        case "yes":
            searchResults = searchByName(people);
            break;
        case "no":
            //! TODO #4: Declare a searchByTraits (multiple traits) function //////////////////////////////////////////
            //! TODO #4a: Provide option to search for single or multiple //////////////////////////////////////////
            searchResults = searchByTraits(people);
            break;
        default:
            // Re-initializes the app() if neither case was hit above. This is an instance of recursion.
            app(people);
            break;
    }
    // Calls the mainMenu() only AFTER we find the SINGLE PERSON
    mainMenu(searchResults, people);
}
// End of app()

/**
 * After finding a single person, we pass in the entire person-object that we found,
 * as well as the entire original dataset of people. We need people in order to find
 * descendants and other information that the user may want.
 * @param {Object[]} person     A singular object inside of an array.
 * @param {Array} people        A collection of person objects.
 * @returns {String}            The valid string input retrieved from the user.
 */
function mainMenu(person, people) {
    // A check to verify a person was found via searchByName() or searchByTrait()
    if (!person[0]) {
        alert("Could not find that individual.");
        // Restarts app() from the very beginning
        return app(people);
    }
    let displayOption = prompt(
        `Found ${person[0].firstName} ${person[0].lastName}. Do you want to know their 'info', 'family', or 'descendants'?\nType the option you want or type 'restart' or 'quit'.`
    );
    // Routes our application based on the user's input
    switch (displayOption) {
        case "info":
            let personInfo = displayPerson(person[0], people);
            alert(personInfo);
            break;
        case "family":
            // HINT: Look for a people-collection stringifier utility function to help
            let personFamily = findPersonFamily(person[0], people);
            alert(personFamily);
            break;
        case "descendants":
            // HINT: Review recursion lecture + demo for bonus user story
            let personDescendants = findPersonDescendants(person[0], people);
            alert(personDescendants);
            break;
        case "restart":
            // Restart app() from the very beginning
            app(people);
            break;
        case "quit":
            // Stop application execution
            return;
        default:
            // Prompt user again. Another instance of recursion
            return mainMenu(person, people);
    }
}
// End of mainMenu()

/**
 * This function is used when searching the people collection by
 * a person-object's firstName and lastName properties.
 * @param {Array} people        A collection of person objects.
 * @returns {Array}             An array containing the person-object (or empty array if no match)
 */
function searchByName(people) {
    let firstName = promptFor("What is the person's first name?", chars);
    let lastName = promptFor("What is the person's last name?", chars);

    // The foundPerson value will be of type Array. Recall that .filter() ALWAYS returns an array.
    let foundPerson = people.filter(function (person) {
        if (person.firstName === firstName && person.lastName === lastName) {
            return true;
        }
    });
    return foundPerson;
}
// End of searchByName()

/**
 * This function will be useful for STRINGIFYING a collection of person-objects
 * first and last name properties in order to easily send the information
 * to the user in the form of an alert().
 * @param {Array} people        A collection of person objects.
 */
function displayPeople(people) {
    alert(
        people
            .map(function (person) {
                return `${person.firstName} ${person.lastName}`;
            })
            .join("\n")
    );
}
// End of displayPeople()

/**
 * This function will be useful for STRINGIFYING a person-object's properties
 * in order to easily send the information to the user in the form of an alert().
 * @param {Object} person       A singular object.
 */
function displayPerson(person, people) {
    let personInfo = `First Name: ${person.firstName}\n`;
    personInfo += `Last Name: ${person.lastName}\n`;
    personInfo += `Gender: ${person.gender}\n`
    personInfo += `Date of Birth: ${person.dob}\n`
    personInfo += `Height: ${person.height}\n`
    personInfo += `Weight: ${person.weight}\n`
    personInfo += `Eye Color: ${person.eyeColor}\n`
    personInfo += `Occupation: ${person.occupation}\n`
    const parents = getParents(person, people);
    personInfo += `Parents: ${parents}\n`
    const spouseInfo = getSpouse(person, people);
    personInfo += `Spouse: ${spouseInfo}`
    alert(personInfo);
}
// End of displayPerson()

/**
 * This function's purpose is twofold:
 * First, to generate a prompt with the value passed in to the question parameter.
 * Second, to ensure the user input response has been validated.
 * @param {String} question     A string that will be passed into prompt().
 * @param {Function} valid      A callback function used to validate basic user input.
 * @returns {String}            The valid string input retrieved from the user.
 */
function promptFor(question, valid) {
    do {
        var response = prompt(question).trim();
    } while (!response || !valid(response));
    return response;
}
// End of promptFor()

/**
 * This helper function checks to see if the value passed into input is a "yes" or "no."
 * @param {String} input        A string that will be normalized via .toLowerCase().
 * @returns {Boolean}           The result of our condition evaluation.
 */
function yesNo(input) {
    return input.toLowerCase() === "yes" || input.toLowerCase() === "no";
}
// End of yesNo()

/**
 * This helper function operates as a default callback for promptFor's validation.
 * Feel free to modify this to suit your needs.
 * @param {String} input        A string.
 * @returns {Boolean}           Default validation -- no logic yet.
 */
function chars(input) {
    return true; // Default validation only
}
// End of chars()

//////////////////////////////////////////* End Of Starter Code *//////////////////////////////////////////
// Any additional functions can be written below this line 👇. Happy Coding! 😁

/**

This function returns the names of the parents of a given person as a formatted string.
If the parents are not found in the data set, "Unknown" is returned for their name.
@param {Object} person A singular object.
@param {Array} people An array of person objects.
@returns {String} A string containing the formatted names of the person's parents.
*/
function getParents(person, people) {
    let parents = [];
    if (person.parents.length === 0) {
        parents.push("Unknown");
        parents.push("Unknown");
    } else {
        for (let i = 0; i < person.parents.length; i++) {
            let parent = people.find(p => p.id === person.parents[i]);
            parents.push(`${parent.firstName} ${parent.lastName}`);
        }
    }
    return parents.join(" & ");
}

/**

This function returns the name of the spouse of a given person as a formatted string.
If the spouse is not found in the data set, "Unknown" is returned for their name.
@param {Object} person A singular object.
@param {Array} people An array of person objects.
@returns {String} A string containing the formatted name of the person's spouse.
*/
function getSpouse(person, people) {
    if (person.currentSpouse === null) {
        return "Unknown";
    } else {
        let spouse = people.find(p => p.id === person.currentSpouse);
        return `${spouse.firstName} ${spouse.lastName}`;
    }
}

/**
This function returns an array of family members names.

@param { Object } person A singular object.
@param { Array } people An array of person objects.
@returns { String } A string containing the formatted name of the person's spouse.
*/
function findPersonFamily(person, people) {
    let targetPerson = people.find(p => p.id === person.id)
    if (!targetPerson) {
        return null
    }

    const lastName = person.lastName

    const familyMembers = people.filter(p => p.lastName === lastName)

    let familyMemberNames = familyMembers.map((el) => {
        return `${el.firstName} ${el.lastName}`
    })

    return familyMemberNames

}

/**
 * Finds all descendants of a given person in a people.
 * @param {Object} person - The person object to find descendants for.
 * @param {Object[]} people - The array of person objects representing the people.
 * @returns {Object[]} An array of person objects representing the descendants of the given person.
 */
function findPersonDescendants(person, people) {
    // Initialize an empty array to hold the descendants.
    const descendants = [];

    // Loop through each person in the people.
    for (let i = 0; i < people.length; i++) {
        const currentPerson = people[i];

        // If the current person is a child of the given person, add them to the descendants array and
        // recursively call this function to find their descendants.
        if (currentPerson.parents.includes(person.id)) {
            descendants.push(`${currentPerson.firstName} ${currentPerson.lastName}\n`);
            descendants.push(...findPersonDescendants(currentPerson, people));
        }
    }

    // Return the array of descendants.
    return descendants;
}


function searchByTraits(people) {
    let mode = promptFor(`Do you want to search to a 'single' trait or 'multiple' traits? Enter your choice below.`, chars);
    mode = mode.trim()
    switch (mode) {
        case "single":
            return searchByTrait(people)
        case "multiple":
            return searchByMultipleTraits(people)
        case "restart":
            // Restart app() from the very beginning
            app(people);
            break;
        case "quit":
            // Stop application execution
            return;
        default:
            // Prompt user again. Another instance of recursion
            return searchByTraits(people);
    }
}

function searchByTrait(people) {
    let trait = prompt(`Please enter one of the traits you can choose to search by are 'gender', 'dob', 'height', 'weight', 'eyecolor', and 'occupation'.`)
    let traitValue = prompt(`Please enter the ${trait}.`)

    if (trait === "height" || trait === "weight") {
        traitValue = Number(traitValue)
    }

    if (trait === "eyecolor") {
        trait = "eyeColor"
    }
    let results = people.filter(person => {
        if (person[trait] === traitValue) {
            return true
        } else {
            return false
        }
    })

    return results
}

function searchByMultipleTraits(people) {
    let getTraits = true
    let traits = []
    while (getTraits) {
        let trait = prompt(`Please enter one of the traits you can choose to search by are 'gender', 'dob', 'height', 'weight', 'eyecolor', and 'occupation'.`)

        let traitValue = prompt(`Please enter the ${trait}`)

        if (trait === "height" || trait === "weight") {
            traitValue = Number(traitValue)
        }

        if (trait === "eyecolor") {
            trait = "eyeColor"
        }

        let traitPair = {
            [trait]: traitValue
        }

        traits.push(traitPair)

        let getTraitsInput = prompt(`Do you want to enter more traits? 'yes' / 'no'`)
        getTraitsInput.trim().toLowerCase()
        if (getTraitsInput === "no") {
            getTraits = false
        }

    }

    let results = people.filter(person => {
        // the objects are not getting parsed and the trait and traitValue are undefined so everything matches.
        for (let i = 0; i < traits.length; i++) {
            let { trait, traitValue } = traits[i]
            if (person[trait] === traitValue) {
                return true
            } else {
                return false
            }
        }

    })
    return results

}
