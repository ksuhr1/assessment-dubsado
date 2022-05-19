import {findEmployee, getBoss, getSubordinates} from './getEmployees';

export class TreeNode {
    value: Employee
    descendants: TreeNode[] | null
    constructor(value: Employee) {
        this.value = value
        this.descendants = []
    }
}

export interface Employee {
    name: string,
    jobTitle: string,
    boss: string | null,
    salary: string
}

/**
 * Checks if the incoming string is an email
 * @param {string} email 
 * @returns {boolean}
 */
 const checkIfEmail = (email: string) => { 
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

/**
 * Helper function to clean the data
 * 
 * @param {Employee} employee 
 * @returns {Employee}
 */
function cleanData(employee: Employee): Employee {
    if (checkIfEmail(employee.name)){
        const cleanedName = employee.name.split("@")[0];
        employee.name = cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1);
    }
    return employee
}

/**
 * Normalizes the provided JSON file and generates a tree of employees.
 *
 * @param {Object[]} employees array of employees
 * @returns {TreeNode}
 */
export function generateCompanyStructure(employees: Employee[]): TreeNode {
    let treeNode = new TreeNode(null);
    // hashmap to map boss to employee object 
    // employee object contains it's descendants
    let allEmployees = new Map<string, TreeNode>();
    let firstTreeNode = new TreeNode(null);

    console.log("Normalizing JSON file...");
    for(var em of employees) {
        em = cleanData(em);
        treeNode = new TreeNode(em);
        if(em.boss == null) { // if it has no boss then it is the first node
            allEmployees.set(em.name, treeNode);
            // if there are two null bosses it will return incorrect tree
            firstTreeNode = treeNode;
        }
        else {
            // To Do: if the boss is later on in the file need to loop through or 
            // push to the end of the array
            if(allEmployees.get(em.boss)) {
                let boss = allEmployees.get(em.boss); // get new employee's boss
                boss.descendants.push(treeNode); // push new employee to their boss's descendants
                allEmployees.set(em.name, treeNode); // add new employee to hashmap
            }
        }
    }
    console.log("Generating employee tree...\n");
    return firstTreeNode;
}

/**
 * Adds a new employee to the team and places them under a specified boss.
 *
 * @param {TreeNode} tree
 * @param {Object} newEmployee
 * @param {string} bossName
 * @returns {void}
 */
export function hireEmployee(tree: TreeNode, newEmployee:Employee, bossName: string): void {
    const boss = findEmployee(tree, bossName); // gather boss's data
    let treeNode = new TreeNode(newEmployee);
    boss.descendants.push(treeNode); // add to boss's descendants
    console.log("[hiredEmployee]: Added new employee (",newEmployee.name,") with ",bossName,"as their boss");
}

/**
 * Removes an employee from the team by name.
 * If the employee has other employees below them, randomly selects one to take their place.
 *
 * @param {TreeNode} tree
 * @param {string} name employee's name
 * @returns {void}
 */
export function fireEmployee(tree: TreeNode, name: string): void {
    let firedEmployee = findEmployee(tree,name);
    let boss = findEmployee(tree, firedEmployee.value.boss);
    let subordinates = getSubordinates(tree, name) // subordinates of fired employee

    // assumption: new boss keeps their data besides renaming their boss
    var randomBoss = subordinates[Math.floor(Math.random()*subordinates.length)]; // selects random subordinate

    // add descendants to new boss
    // need to handle case if subordinates is empty
    subordinates.forEach(subordinate => {
        if(subordinate != randomBoss) {
            subordinate.value.name = randomBoss.value.name // change subordinate's boss to new boss
            randomBoss.descendants.push(subordinate);
        }
    });

    boss.descendants.push(randomBoss);

    // remove firedEmployee from their boss
    for(let i = 0; i < boss.descendants.length; i++) {
        let treeNode = boss.descendants[i];
        if(treeNode.value.name == name) {
            boss.descendants.splice(i, 1);
        }
    }
    console.log("[fireEmployee]: Fired ", name, " and replaced with ",randomBoss.value.name);
}

/**
 * Promotes an employee one level above their current ranking.
 * The promoted employee and their boss should swap places in the hierarchy.
 *
 * @param {TreeNode} tree
 * @param {string} employeeName
 * @returns {void}
 */
export function promoteEmployee(tree: TreeNode, employeeName: string): void {
    var promotedEmployee = findEmployee(tree, employeeName);
    var boss = getBoss(tree, promotedEmployee.value.name);
    var copyEmployee = JSON.parse(JSON.stringify(promotedEmployee));

    let bossDescendants = [];
    // delete promotedEmployee from boss's descendants
    for(let i = 0; i < boss.descendants.length; i ++) { 
        let treeNode = boss.descendants[i];
        treeNode.value.boss = employeeName; // change their boss name
        if(treeNode.value.name !== employeeName) {
            bossDescendants.push(treeNode);
        }
    }

    // get boss's information
    let bossJobTitle = boss.value.jobTitle;
    let bossSalary = boss.value.salary;
    let bossBoss = boss.value.boss; // get boss's boss

    // change promoted employee information to boss
    promotedEmployee.descendants = bossDescendants;
    promotedEmployee.value.salary= bossSalary;
    promotedEmployee.value.boss = bossBoss;
    promotedEmployee.value.jobTitle = bossJobTitle;
    promotedEmployee.descendants.push(boss); // push boss as a descendant now

    // swaping boss for promoted employee data 
    boss.descendants = copyEmployee.descendants;
    boss.value.salary = copyEmployee.value.salary;
    boss.value.jobTitle = copyEmployee.value.jobTitle;
    boss.value.boss = employeeName;

    // remove the demoted boss from their boss
    // adding promoted employee under boss's boss
    if(bossBoss !== null) {
        let bossBossEmployee = findEmployee(tree, bossBoss); // get boss's boss
        for(let i = 0; i < bossBossEmployee.descendants.length; i ++) { // when you remove, does it remove all the ancestors too?
            let treeNode = bossBossEmployee.descendants[i];
            if(treeNode.value.name == boss.value.name) { // remove demoted boss
                bossBossEmployee.descendants.splice(i, 1);
            }
        }
        bossBossEmployee.descendants.push(promotedEmployee); // add new employee as descendant to demoted boss's boss
    }
    console.log("[promoteEmployee]: Promoted ",employeeName, "and made ",boss.value.name, " his subordinate");
}

/**
 * Demotes an employee one level below their current ranking.
 * Picks a subordinat and swaps places in the hierarchy.
 *
 * @param {TreeNode} tree
 * @param {string} employeeName the employee getting demoted
 * @param {string} subordinateName the new boss
 * @returns {void}
 */
export function demoteEmployee(tree: TreeNode, employeeName: string, subordinateName: string): void {
    let promotedEmployee = findEmployee(tree, subordinateName);
    let boss = getBoss(tree, promotedEmployee.value.name);
    let copyEmployee = JSON.parse(JSON.stringify(promotedEmployee));

    let bossDescendants = [];
    // delete promotedEmployee from boss's descendants
    for(let i = 0; i < boss.descendants.length; i ++) { 
        let treeNode = boss.descendants[i];
        treeNode.value.boss = subordinateName; // change their boss name
        if(treeNode.value.name !== subordinateName) {
            bossDescendants.push(treeNode);
        }
    }

    // get boss's information
    let bossJobTitle = boss.value.jobTitle;
    let bossSalary = boss.value.salary;
    let bossBoss = boss.value.boss; // get boss's boss

    // change promoted employee information to boss
    promotedEmployee.descendants = bossDescendants;
    promotedEmployee.value.salary= bossSalary;
    promotedEmployee.value.boss = bossBoss;
    promotedEmployee.value.jobTitle = bossJobTitle;
    promotedEmployee.descendants.push(boss); // push boss as a descendant now

    // swaping boss for promoted employee data 
    boss.descendants = copyEmployee.descendants;
    boss.value.salary = copyEmployee.value.salary;
    boss.value.jobTitle = copyEmployee.value.jobTitle;
    boss.value.boss = subordinateName;

    // remove the demoted boss from their boss
    // adding promoted employee under boss's boss
    if(bossBoss !== null) {
        let bossBossEmployee = findEmployee(tree, bossBoss); // get boss's boss
        for(let i = 0; i < bossBossEmployee.descendants.length; i ++) {
            let treeNode = bossBossEmployee.descendants[i];
            if(treeNode.value.name == boss.value.name) { // remove demoted boss
                bossBossEmployee.descendants.splice(i, 1);
            }
        }
        bossBossEmployee.descendants.push(promotedEmployee); // add new employee as descendant to demoted boss's boss
    }
    console.log("[demoteEmployee]: Demoted employee (demoted ",employeeName, "and replaced with ",subordinateName, ")\n");
}
