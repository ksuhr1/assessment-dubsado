// Main code goes here
import employees from './employees.json';
import {demoteEmployee, generateCompanyStructure, hireEmployee, fireEmployee, promoteEmployee} from './manageEmployees';
import {findLowestEmployee, getBoss, getSubordinates} from './getEmployees';

function main() {
    const tree = generateCompanyStructure(employees.employees)
    const newEmployee = 
    {
        "name": "Jeb",
        "jobTitle": "Marketing",
        "boss": "Sarah",
        "salary": "100000"
    };

    hireEmployee(tree, newEmployee, "Sarah");
    fireEmployee(tree, "Alicia");
    promoteEmployee(tree, "Jared");
    demoteEmployee(tree, "Xavier", "Maria");
    
    const employeeName1 = "Bill";
    const boss = getBoss(tree, employeeName1);
    console.log("[getBoss]:",employeeName1, "'s boss is",boss.value.name);
    const employeeName2 = "Maria"
    const subordinates = getSubordinates(tree, employeeName2);
    var subordinateNames: string[] = []
    subordinates.forEach(subordinate => {
        subordinateNames.push(subordinate.value.name);
    });
    console.log("[getSubordinate]:",employeeName2, "'s subordinates are",subordinateNames.join());
    findLowestEmployee(tree, "Nick");
}

main()
