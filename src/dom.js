let main = () => {
    document.body.style.border = "1px solid red";

    let h1 = document.getElementById("the-heading");

    h1.innerText = "Foobar";
    h1.style.border = "1px solid magenta";

    let firstItem = document.querySelector(".first-item");
    firstItem.style.border = "1px solid red";

    let lis = document.querySelectorAll("li");
    console.log(lis);

    let fourthNode = document.createElement("li");
    fourthNode.innerText = "fourth";

    firstItem.parentElement.appendChild(fourthNode);
}

window.addEventListener("load", main);

let countNodes = (aNode) => {
    if(aNode.childNodes.length === 0){
        return 1;
    } else{
        let nodeCount = 1;
        for(let i = 0; i < aNode.childNodes.length; i++){
            nodeCount +=countNodes(aNode.childNodes[i]);
        }
        return nodeCount;
    }  

};

console.log(countNodes(document.body));