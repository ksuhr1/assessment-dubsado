import {TreeNode, Employee} from './manageEmployees';


export function findEmployee(employee: TreeNode, name: string): TreeNode {
    let stack = [employee]
    while (stack){
        let currentEmployee = stack.pop()
        if (currentEmployee.value.name === name){
            return currentEmployee
        }
        currentEmployee.descendants.forEach(emp => {
            stack.push(emp)
        })
    }
}

/**
 * Given an employee, will find the node above (if any).
 * 
 * @param {TreeNode} tree
 * @param {string} employeeName
 * @returns {TreeNode}
 */
export function getBoss(tree: TreeNode, employeeName: string): TreeNode {
    let employee = findEmployee(tree, employeeName);
    // not great since we are going through the stack twice
    let boss = findEmployee(tree, employee.value.boss);
    return boss;
}

/**
 * Given an employee, will find the nodes directly below (if any).
 * Notice how it returns possibly several subordinates.
 * 
 * @param {TreeNode} tree
 * @param {string} employeeName
 * @returns {TreeNode[]}
 */
export function getSubordinates(tree: TreeNode, employeeName:string): TreeNode[] {
    let employee = findEmployee(tree, employeeName);
    return employee.descendants;
}

/***
 * EXTRA CREDIT:
 * Helper function to find the depth
 * Performs BFS with a queue
 * @param {TreeNode} tree
 * @param {string} employeeName
 * @returns {number, TreeNode} depth, employee
 */

 export function findDepth(tree: TreeNode, employeeName: string): {depth:number, employee:TreeNode} {
    let queue = [tree]
    let count = [0]
    let visited = [tree]

    while(queue) {
        let curr = queue.shift();
        let dist = count.shift();
        if (curr.value.name === employeeName) {
            return {depth:dist, employee:curr}
        }

        curr.descendants.forEach((child) => {
            if(!visited.includes(child)) {
                visited.push(child);
                queue.push(child);
                count.push(dist+1);
            }
        })
    }
    return {depth:0, employee:null};
}

/**
 * EXTRA CREDIT:
 * Finds and returns the lowest-ranking employee and the tree node's depth index.
 * 
 * @param {TreeNode} tree
 * @param {string} employeeName
 * @returns {TreeNode}
 */
export function findLowestEmployee(tree: TreeNode, employeeName: string): TreeNode {
    let data = findDepth(tree,employeeName);
    console.log('[findLowestEmployee]: The lowest employee', employeeName, " has a depth of ", data.depth);
    return data.employee;
}