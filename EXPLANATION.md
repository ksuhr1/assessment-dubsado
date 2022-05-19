## Running the App
-   Use `yarn start` to run the program. This builds the Typescript files to Javascript and runs the build files
## Style Decisions
- Any noteworthy logic/style decisions you made? If so, what is your reasoning?
- I made an interface called Employee to describe the properties of the TreeNode value. I have added a few helper functions, checkIfEmail(regex found online), cleanData where I clean the data when reading it in the generateCompanyStructure function. Right now, generateCompanyStructure does not handle if there are two bosses and if the boss is provided later in the json data. I created a hashmap of all the employees to help create the tree structure. I also have a findEmployee helper function that returns the TreeNode of the employee we are looking for which is used in a few functions. In a few places, I replace Object for Employee that way I can use that interface. For the extra credit, I chose a BFS(breadth-first search) to find the employee and count the depth by level instead of something like DFS which would return count of all the nodes. For fireEmployee, I am randomly replacing the firedEmployee from one of the descendants so the output may not always be Sal.

## Future Improvements
- If you had more time, what improvements would you implement?
- I would want to make sure that generate tree structure works with any kind of JSON data, whether the boss be provided later in the data, if there are two bosses, etc. I would also call promoteEmployee in demoteEmployee, I didn't do that because then the output would call promote employee when calling demote employee and I wanted my output to be the same as the expected output. 

## BONUS
- What is the time complexity of each function in your code?
    -   `findEmployee`: O(n)
    -   `checkIfEmail`: O(n)
    -   `cleanData`: O(n)
    -   `generateCompanyStructure`:O(n):
    -   `hireEmployee`: O(n)
    -   `fireEmployee`: O(n)
    -   `promoteEmployee`: O(n)
    -   `demoteEmployee`:O(n)
    -   `getBoss`: O(2n):
    -   `getSubordinates`:O(n)
    -   `findDepth`:O(n)
    -   `findLowestEmployee`:O(n)

- There are two functions that have very similar logic and could be merged into one. Which functions do you think can be merged and why?
    - I would merge promoteEmployee and demoteEmployee. You can just call promoteEmployee() in demoteEmployee by passing the subordinate name because it would be promoting the subordinate and demoting the boss of the subordinate.